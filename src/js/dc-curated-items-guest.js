// DC guest items render — merges regional arrays, filters by region prefix.
// Usage: renderDCGuestItems([TC_GUEST_ITEMS, SOFLO_GUEST_ITEMS, ...], '.dc-guest-items');

function renderDCGuestItems(regionArrays, containerSelector) {
  if (!document.getElementById('dc-ci-styles')) {
    const s = document.createElement('style');
    s.id = 'dc-ci-styles';
    s.textContent = `
      .dc-region-filter { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:28px; }
      .dc-filter-btn { background:var(--sky-light); border:1px solid var(--sky-mid); color:var(--navy);
        padding:6px 18px; border-radius:20px; font-size:0.85rem; cursor:pointer; font-family:inherit;
        transition:background 0.2s, color 0.2s; }
      .dc-filter-btn.active, .dc-filter-btn:hover { background:var(--navy); color:var(--white); }
      .dc-ci-badge { position:absolute; top:6px; right:6px; background:rgba(0,0,0,0.55); color:#fff;
        font-size:0.65rem; font-family:monospace; padding:2px 6px; border-radius:4px;
        opacity:0; transition:opacity 0.2s; pointer-events:none; z-index:10; }
      .dc-guest-items .product-card { position:relative; }
      .dc-guest-items .product-card:hover .dc-ci-badge { opacity:1; }
      .dc-guest-items .ci-gallery { display:flex; width:100%; overflow-x:auto; scroll-snap-type:x mandatory;
        margin-bottom:10px; border-radius:6px; scrollbar-width:none; -ms-overflow-style:none; }
      .dc-guest-items .ci-gallery::-webkit-scrollbar { display:none; }
      .dc-guest-items .ci-photo { flex:0 0 100%; width:100%; aspect-ratio:4/3; object-fit:cover;
        border-radius:6px; scroll-snap-align:start; }
    `;
    document.head.appendChild(s);
  }

  const REGION_LABELS = {
    tc: 'Toccoa Currents',
    sf: 'SoFlo Currents',
    gi: 'Golden Currents'
  };

  // Merge sections by ID across all regions
  const sectionMap = {};
  const sectionOrder = [];
  for (const sections of regionArrays) {
    for (const section of sections) {
      if (!sectionMap[section.id]) {
        sectionMap[section.id] = { id: section.id, title: section.title, cards: [] };
        sectionOrder.push(section.id);
      }
      sectionMap[section.id].cards.push(...section.cards);
    }
  }
  const merged = sectionOrder.map(id => sectionMap[id]);

  // Detect unique region prefixes from card IDs
  const prefixes = [...new Set(
    merged.flatMap(s => s.cards.map(c => c.id.split('_')[0]))
  )];

  document.querySelectorAll(containerSelector).forEach(container => {
    const filterHtml = prefixes.length > 1
      ? `<div class="dc-region-filter">
          <button class="dc-filter-btn active" data-region="all">All</button>
          ${prefixes.map(p => `<button class="dc-filter-btn" data-region="${p}">${REGION_LABELS[p] || p}</button>`).join('')}
        </div>`
      : '';

    container.innerHTML = filterHtml + merged.map(section => `
      <h2 id="${section.id}">${section.title}</h2>
      <div class="product-grid">
        ${section.cards.map(card => `
          <div class="product-card" data-id="${card.id}">
            <span class="dc-ci-badge">${card.id}</span>
            ${card.imgs && card.imgs.length ? `<div class="ci-gallery">${card.imgs.map(img => `<img class="ci-photo" src="${img}" alt="${card.id}" loading="lazy">`).join('')}</div>` : ''}
            <div class="product-name">${card.name}</div>
            <div class="product-note">${card.note}</div>
            <a href="${card.href}" class="product-link" target="_blank" rel="noopener">View on Amazon</a>
          </div>`).join('')}
      </div>`).join('');

    // Region filter interaction
    if (prefixes.length > 1) {
      container.querySelectorAll('.dc-filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          container.querySelectorAll('.dc-filter-btn').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          const region = this.dataset.region;
          container.querySelectorAll('.product-card').forEach(card => {
            card.style.display = (region === 'all' || card.dataset.id.startsWith(region + '_')) ? '' : 'none';
          });
          container.querySelectorAll('h2').forEach(h2 => {
            const grid = h2.nextElementSibling;
            if (!grid) return;
            const anyVisible = [...grid.querySelectorAll('.product-card')].some(c => c.style.display !== 'none');
            h2.style.display = anyVisible ? '' : 'none';
            grid.style.display = anyVisible ? '' : 'none';
          });
        });
      });
    }
  });
}

renderDCGuestItems([TC_GUEST_ITEMS], '.dc-guest-items');
