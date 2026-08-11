// DC host items render — merges host + guest regional arrays, shows hostTips.
// Usage: renderDCHostItems([{host: TC_HOST_ITEMS, guest: TC_GUEST_ITEMS}, ...], '.dc-host-items');

function renderDCHostItems(regionArrays, containerSelector) {
  if (!document.getElementById('dc-hi-styles')) {
    const s = document.createElement('style');
    s.id = 'dc-hi-styles';
    s.textContent = `
      .dc-region-filter { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:28px; }
      .dc-filter-btn { background:var(--sky-light); border:1px solid var(--sky-mid); color:var(--navy);
        padding:6px 18px; border-radius:20px; font-size:0.85rem; cursor:pointer; font-family:inherit;
        transition:background 0.2s, color 0.2s; }
      .dc-filter-btn.active, .dc-filter-btn:hover { background:var(--navy); color:var(--white); }
      .dc-host-items .product-card { position:relative; }
      .dc-ci-badge { position:absolute; top:6px; right:6px; background:rgba(0,0,0,0.55); color:#fff;
        font-size:0.65rem; font-family:monospace; padding:2px 6px; border-radius:4px;
        opacity:0; transition:opacity 0.2s; pointer-events:none; z-index:10; }
      .dc-host-items .product-card:hover .dc-ci-badge { opacity:1; }
      .dc-host-items .host-tip { background:#EBF5FB; border-left:3px solid var(--blue-accent);
        border-radius:0 4px 4px 0; padding:10px 14px; font-size:0.83rem; color:var(--navy); line-height:1.5; }
      .dc-host-items .host-tip strong { display:block; font-size:0.75rem; text-transform:uppercase;
        letter-spacing:0.08em; color:var(--blue-accent); margin-bottom:4px; }
      .dc-ci-group-header { max-width:1100px; margin:48px auto 0; padding:0 24px 16px;
        border-bottom:3px solid var(--navy); }
      .dc-ci-group-header h2 { font-size:1.7rem; color:var(--navy); margin:0; }
      .dc-ci-group-header p { font-size:0.9rem; color:var(--text-muted); margin:6px 0 0; }
      .dc-host-items .ci-gallery-wrap { position:relative; margin-bottom:10px; }
      .dc-host-items .ci-gallery { display:grid; grid-auto-flow:column; grid-auto-columns:100%;
        overflow-x:auto; scroll-snap-type:x mandatory; overscroll-behavior-x:contain;
        border-radius:6px; scrollbar-width:none; -ms-overflow-style:none; }
      .dc-host-items .ci-gallery::-webkit-scrollbar { display:none; }
      .dc-host-items .ci-photo { width:100%; aspect-ratio:4/3; object-fit:cover;
        border-radius:6px; scroll-snap-align:start; display:block; }
      .dc-host-items .ci-arrow { position:absolute; top:50%; transform:translateY(-50%);
        background:rgba(0,0,0,0.45); color:#fff; border:none; border-radius:50%;
        width:28px; height:28px; font-size:1rem; cursor:pointer; z-index:5;
        display:flex; align-items:center; justify-content:center; padding:0; }
      .dc-host-items .ci-arrow-prev { left:6px; }
      .dc-host-items .ci-arrow-next { right:6px; }
    `;
    document.head.appendChild(s);
  }

  const REGION_LABELS = {
    tc: 'Toccoa Currents',
    sf: 'SoFlo Currents',
    gi: 'Golden Currents'
  };

  function mergeSections(arrays) {
    const map = {}, order = [];
    for (const sections of arrays) {
      for (const section of sections) {
        if (!map[section.id]) {
          map[section.id] = { id: section.id, title: section.title, cards: [] };
          order.push(section.id);
        }
        map[section.id].cards.push(...section.cards);
      }
    }
    return order.map(id => map[id]);
  }

  function renderCard(card) {
    const gallery = card.imgs && card.imgs.length === 1
      ? `<img class="ci-photo" src="${card.imgs[0]}" alt="${card.id}" loading="lazy" style="margin-bottom:10px;">`
      : card.imgs && card.imgs.length > 1
      ? `<div class="ci-gallery-wrap"><div class="ci-gallery">${card.imgs.map(img => `<img class="ci-photo" src="${img}" alt="${card.id}" loading="lazy">`).join('')}</div><button class="ci-arrow ci-arrow-prev" onclick="this.parentElement.querySelector('.ci-gallery').scrollBy({left:-this.parentElement.querySelector('.ci-gallery').offsetWidth,behavior:'smooth'})">&#8249;</button><button class="ci-arrow ci-arrow-next" onclick="this.parentElement.querySelector('.ci-gallery').scrollBy({left:this.parentElement.querySelector('.ci-gallery').offsetWidth,behavior:'smooth'})">&#8250;</button></div>`
      : '';
    return `<div class="product-card" data-id="${card.id}">
      <span class="dc-ci-badge">${card.id}</span>
      ${gallery}
      <div class="product-name">${card.name}</div>
      <div class="product-note">${card.note}</div>
      ${card.hostTip ? `<div class="host-tip"><strong>Host Tip</strong>${card.hostTip}</div>` : ''}
      <a href="${card.href}" class="product-link" target="_blank" rel="noopener">View on Amazon</a>
    </div>`;
  }

  function renderSections(sections) {
    return sections.map(section => `
      <h2 id="${section.id}">${section.title}</h2>
      <div class="product-grid">${section.cards.map(renderCard).join('')}</div>`).join('');
  }

  const hostSections = mergeSections(regionArrays.map(r => r.host));
  const guestSections = mergeSections(regionArrays.map(r => r.guest));

  const prefixes = [...new Set(
    [...hostSections, ...guestSections].flatMap(s => s.cards.map(c => c.id.split('_')[0]))
  )];

  document.querySelectorAll(containerSelector).forEach(container => {
    const filterHtml = prefixes.length > 1
      ? `<div class="dc-region-filter">
          <button class="dc-filter-btn active" data-region="all">All</button>
          ${prefixes.map(p => `<button class="dc-filter-btn" data-region="${p}">${REGION_LABELS[p] || p}</button>`).join('')}
        </div>`
      : '';

    container.innerHTML = filterHtml
      + `<div class="dc-ci-group-header"><h2>Host Supplies</h2><p>Operational and setup items &mdash; everything behind the scenes that keeps the property running.</p></div>`
      + renderSections(hostSections)
      + `<div class="dc-ci-group-header"><h2>Guest Items</h2><p>Everything guests find in the cabin &mdash; with host tips included.</p></div>`
      + renderSections(guestSections);

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
            if (!grid || !grid.classList.contains('product-grid')) return;
            const anyVisible = [...grid.querySelectorAll('.product-card')].some(c => c.style.display !== 'none');
            h2.style.display = anyVisible ? '' : 'none';
            grid.style.display = anyVisible ? '' : 'none';
          });
        });
      });
    }
  });
}

renderDCHostItems([{ host: TC_HOST_ITEMS, guest: TC_GUEST_ITEMS }], '.dc-host-items');
