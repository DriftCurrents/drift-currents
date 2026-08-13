// DC vendor directory render + filter.
// Usage: renderDCVendors([TC_VENDORS], '#dc-vendor-dir', { paid: false })
// paid: true — shows paid vendors and adds placeholder cards for uncovered regions

var DC_VENDOR_CATEGORIES = [
  { id: 'real-estate',  icon: '&#x1F3E1;', title: 'Real Estate' },
  { id: 'home-design',  icon: '&#x1F3E0;', title: 'Home Design' },
  { id: 'photography',  icon: '&#x1F4F7;', title: 'Photography' },
  { id: 'electrician',  icon: '&#x26A1;',  title: 'Electrician' },
  { id: 'plumber',      icon: '&#x1F6B0;', title: 'Plumber' },
  { id: 'hvac',         icon: '&#x2744;&#xFE0F;', title: 'HVAC' },
  { id: 'handyman',     icon: '&#x1F527;', title: 'Handyman' },
  { id: 'landscaping',  icon: '&#x1F33F;', title: 'Landscaping' },
  { id: 'pest-control', icon: '&#x1F41C;', title: 'Pest Control' },
  { id: 'septic',       icon: '&#x1F4A7;', title: 'Septic' },
  { id: 'cleaning',     icon: '&#x1F9F9;', title: 'Cleaning' }
];

var DC_VENDOR_REGION_LABELS = {
  network: 'Network',
  tc: 'Toccoa Currents',
  sf: 'SoFlo Currents',
  gi: 'Golden Isles'
};

var DC_VENDOR_PAID_REGIONS = ['tc', 'sf', 'gi'];

function renderDCVendors(vendorArrays, containerSelector, options) {
  var paid = (options && options.paid) || false;
  var allVendors = [].concat.apply([], vendorArrays.filter(function(a) { return Array.isArray(a); }));
  if (!paid) allVendors = allVendors.filter(function(v) { return !v.paid; });

  var byCategory = {};
  allVendors.forEach(function(v) {
    if (!byCategory[v.category]) byCategory[v.category] = [];
    byCategory[v.category].push(v);
  });

  var container = document.querySelector(containerSelector);
  if (!container) return;

  DC_VENDOR_CATEGORIES.forEach(function(cat) {
    var vendors = byCategory[cat.id] || [];
    var coveredRegions = vendors.map(function(v) { return v.region; });
    var hasPlaceholders = paid && DC_VENDOR_PAID_REGIONS.some(function(r) { return !coveredRegions.includes(r); });

    var section = document.createElement('div');
    section.className = 'dir-category';
    section.id = cat.id;

    var html = '<div class="dir-category-header"><span class="dir-category-icon">' + cat.icon + '</span><span class="dir-category-title">' + cat.title + '</span></div>';

    if (vendors.length > 0 || hasPlaceholders) {
      html += '<div class="vendor-grid">';

      vendors.forEach(function(v) {
        html += '<div class="vendor-card" data-region="' + v.region + '">';
        if (v.img) html += '<img src="' + v.img + '" alt="' + v.name.replace(/&amp;/g, '&') + '" loading="lazy">';
        html += '<div class="vendor-card-body">';
        html += '<span class="region-badge ' + v.region + '">' + DC_VENDOR_REGION_LABELS[v.region] + '</span>';
        html += '<h3>' + v.name + '</h3>';
        if (v.description) html += '<p>' + v.description + '</p>';
        (v.details || []).forEach(function(d) {
          html += '<div class="vendor-detail"><strong>' + d.label + ':</strong> ' + d.value + '</div>';
        });
        if (v.link) html += '<a href="' + v.link.href + '" target="_blank" rel="noopener" class="vendor-link">' + v.link.text + ' &rarr;</a>';
        html += '</div></div>';
      });

      if (paid) {
        DC_VENDOR_PAID_REGIONS.forEach(function(r) {
          if (!coveredRegions.includes(r)) {
            var rl = DC_VENDOR_REGION_LABELS[r];
            html += '<div class="vendor-card placeholder" data-region="' + r + '">';
            html += '<div class="vendor-card-body">';
            html += '<span class="region-badge ' + r + '">' + rl + '</span>';
            html += '<h3>Vendor Spot Available</h3>';
            html += '<p>' + cat.title + ' specialists for the ' + rl + ' market.</p>';
            html += '<a href="mailto:driftcurrents@gmail.com?subject=Vendor Listing Inquiry \u2014 ' + rl + ' ' + cat.title + '" class="placeholder-cta">Refer a Vendor &rarr;</a>';
            html += '</div></div>';
          }
        });
      }

      html += '</div>';
    }

    section.innerHTML = html;
    container.appendChild(section);
  });

  // Wire filter bar if present
  var filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  var filterCount = document.getElementById('filterCount');
  var activeRegions = null;

  function applyFilter() {
    var cards = container.querySelectorAll('.vendor-card');
    var sections = container.querySelectorAll('.dir-category');
    var visibleCount = 0;

    cards.forEach(function(card) {
      var region = card.dataset.region;
      var show = activeRegions === null || region === 'network' || activeRegions.has(region);
      card.classList.toggle('hidden', !show);
      if (show) visibleCount++;
    });

    sections.forEach(function(sec) {
      var allCards = sec.querySelectorAll('.vendor-card');
      var hasVisible = Array.from(allCards).some(function(c) { return !c.classList.contains('hidden'); });
      sec.classList.toggle('hidden', allCards.length > 0 && !hasVisible);
    });

    if (filterCount) {
      filterCount.textContent = activeRegions === null
        ? ''
        : visibleCount + ' vendor' + (visibleCount !== 1 ? 's' : '') + ' shown';
    }
  }

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var region = btn.dataset.region;
      if (region === 'all') {
        activeRegions = null;
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
      } else {
        if (activeRegions === null) activeRegions = new Set();
        document.querySelector('.filter-btn[data-region="all"]').classList.remove('active');
        if (activeRegions.has(region)) { activeRegions.delete(region); btn.classList.remove('active'); }
        else { activeRegions.add(region); btn.classList.add('active'); }
        if (activeRegions.size === 0) {
          activeRegions = null;
          document.querySelector('.filter-btn[data-region="all"]').classList.add('active');
        }
      }
      applyFilter();
    });
  });

  applyFilter();
}
