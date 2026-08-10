// ===== DRIFT CURRENTS — SHARED DESTINATION CARDS =====
// Update card content here and it renders on every page that includes this script.

const DC_DESTINATIONS = [
  {
    type: 'link',
    href: 'https://toccoacurrents.com',
    topClass: 'toccoa',
    topContent: `<div class="toccoa-five-t">
        <span>\uD83D\uDC15 Tails</span>
        <span>\uD83E\uDD7E Trails</span>
        <span>\uD83C\uDFA3 Trout</span>
        <span>\uD83C\uDF77 Tastings</span>
        <span>\uD83C\uDF04 Tranquility</span>
      </div>`,
    name: 'Toccoa Currents',
    description: 'Curated cabins from River to Ridge in the North Georgia Mountains \uD83C\uDFD4\uFE0F',
    location: '\uD83D\uDCCD North Georgia Mountains \u00B7 Blue Ridge to Dahlonega',
    teaserIcon: '\uD83D\uDC15\uD83E\uDD7E\uD83C\uDFA3\uD83C\uDF77\uD83C\uDF04',
    linkText: 'Visit ToccoaCurrents.com \u2192',
    linkClass: 'dest-link'
  },
  {
    type: 'div',
    topClass: 'soflo',
    topContent: '<span class="dest-icon">\uD83C\uDF34\uD83C\uDFD6\uD83C\uDF0A</span>',
    teaserIcon: '\uD83C\uDF34\uD83C\uDFD6\uD83C\uDF0A',
    name: 'SoFlo Currents',
    description: 'Southeast Florida coastal getaways \u2014 sun, surf, and the warmth of the Sunshine State.',
    location: '\uD83D\uDCCD Palm Beach County &amp; Broward County, FL',
    linkText: 'Coming Soon',
    linkClass: 'dest-link coming'
  },
  {
    type: 'div',
    topClass: 'golden',
    topContent: '<span class="dest-icon">\uD83C\uDF3E\uD83C\uDFD6\uD83C\uDF0A</span>',
    teaserIcon: '\uD83C\uDF3E\uD83C\uDFD6\uD83C\uDF0A',
    name: 'Golden Currents',
    description: 'Georgia\u2019s Golden Isles \u2014 coastal escapes with Southern charm and Atlantic breezes.',
    location: '\uD83D\uDCCD Jekyll Island &amp; St. Simons Island, GA',
    linkText: 'Coming Soon',
    linkClass: 'dest-link coming'
  }
];

function renderDestinationCard(d) {
  if (d.type === 'link') {
    return `<a href="${d.href}" class="dest-card">
      <div class="dest-card-top ${d.topClass}">${d.topContent}</div>
      <div class="dest-card-body">
        <h3>${d.name}</h3>
        <p>${d.description}</p>
        <span class="dest-location">${d.location}</span>
        <span class="${d.linkClass}">${d.linkText}</span>
      </div>
    </a>`;
  }
  return `<div class="dest-card coming-soon">
    <div class="dest-card-top ${d.topClass}">${d.topContent}</div>
    <div class="dest-card-body">
      <h3>${d.name}</h3>
      <p>${d.description}</p>
      <span class="dest-location">${d.location}</span>
      <span class="${d.linkClass}">${d.linkText}</span>
    </div>
  </div>`;
}

document.querySelectorAll('.destination-cards').forEach(container => {
  container.innerHTML = DC_DESTINATIONS.map(renderDestinationCard).join('');
});

// ===== COMPACT DESTINATION TEASER =====
// Drop <div class="dc-dest-teaser"></div> anywhere in content to render a compact inline strip.

(function injectTeaserStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .dc-dest-teaser { border: 1px solid #c2d9ee; border-radius: 8px; background: #f0f7fd; padding: 24px; margin: 40px 0; }
    .dc-dest-teaser-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.13em; color: #5580a0; margin-bottom: 16px; }
    .dc-dest-teaser-cards { display: flex; gap: 16px; flex-wrap: wrap; }
    .dc-teaser-card { flex: 1; min-width: 160px; border-radius: 6px; overflow: hidden; background: #fff; border: 1px solid #c2d9ee; text-decoration: none; color: inherit; transition: box-shadow 0.2s; }
    .dc-teaser-card:hover { box-shadow: 0 4px 14px rgba(13,59,94,0.1); }
    .dc-teaser-card.muted { opacity: 0.7; }
    .dc-teaser-top { height: 56px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-family: 'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif; letter-spacing: 0.05em; }
    .dc-teaser-top.toccoa { background: linear-gradient(135deg, #1a6b8a, #0d3b5e); }
    .dc-teaser-top.soflo  { background: linear-gradient(135deg, #1E88E5, #0D47A1); }
    .dc-teaser-top.golden { background: linear-gradient(135deg, #D4BC94, #B09060); }
    .dc-teaser-body { padding: 12px 14px; }
    .dc-teaser-body h4 { font-size: 0.9rem; font-weight: 700; margin-bottom: 3px; color: var(--navy, #0d3b5e); }
    .dc-teaser-body .dc-teaser-loc { font-size: 0.75rem; color: #5580a0; display: block; margin-bottom: 8px; line-height: 1.4; }
    .dc-teaser-body .dc-teaser-link { font-size: 0.78rem; font-weight: bold; color: #1a6b8a; text-decoration: none; }
    .dc-teaser-body .dc-teaser-link.muted { color: #8aabb0; font-weight: normal; font-style: italic; }
    @media (max-width: 600px) { .dc-dest-teaser-cards { flex-direction: column; } }
  `;
  document.head.appendChild(style);
})();

function renderTeaserCard(d) {
  const isActive = d.type === 'link';
  const tag = isActive ? `a href="${d.href}"` : 'div';
  const closeTag = isActive ? 'a' : 'div';
  return `<${tag} class="dc-teaser-card${isActive ? '' : ' muted'}">
    <div class="dc-teaser-top ${d.topClass}">${d.teaserIcon || ''}</div>
    <div class="dc-teaser-body">
      <h4>${d.name}</h4>
      <span class="dc-teaser-loc">${d.location}</span>
      <span class="dc-teaser-link${isActive ? '' : ' muted'}">${isActive ? d.linkText : 'Coming Soon'}</span>
    </div>
  </${closeTag}>`;
}

document.querySelectorAll('.dc-dest-teaser').forEach(container => {
  container.innerHTML = `<div class="dc-dest-teaser-label">Our Destinations</div>
    <div class="dc-dest-teaser-cards">${DC_DESTINATIONS.map(renderTeaserCard).join('')}</div>`;
});
