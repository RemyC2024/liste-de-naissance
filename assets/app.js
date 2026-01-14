function el(tag, attrs={}, children=[]) {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v]) => {
    if (k === "class") n.className = v;
    else if (k === "html") n.innerHTML = v;
    else n.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c === null || c === undefined) return;
    if (typeof c === "string") n.appendChild(document.createTextNode(c));
    else n.appendChild(c);
  });
  return n;
}

function escapeXml(s){
  return s.replace(/[<>&'"]/g,c=>({
    '<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'
  }[c]));
}

// Image de fallback (si aucune image uploadée)
function svgFallback(label, emoji) {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="450">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#E7F4EF"/>
      <stop offset="0.42" stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="#FDE7EE"/>
    </linearGradient>
  </defs>
  <rect width="900" height="450" fill="url(#g)"/>
  <circle cx="170" cy="110" r="120" fill="#CFE7DE" opacity="0.55"/>
  <circle cx="770" cy="120" r="130" fill="#F3C8D3" opacity="0.55"/>
  <rect x="90" y="110" width="720" height="240" rx="26" fill="#FFFFFF" opacity="0.88"/>
  <text x="140" y="220" font-size="86" font-family="system-ui">${emoji}</text>
  <text x="240" y="208" font-size="34" font-weight="700" fill="#1F2A27" font-family="system-ui">
    ${escapeXml(label)}
  </text>
  <text x="240" y="250" font-size="20" fill="#556764" font-family="system-ui">
    Objet symbolique • seconde main
  </text>
</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

async function getJSON(path){
  const r = await fetch(path, {cache:"no-store"});
  if(!r.ok) throw new Error(`Impossible de charger ${path}`);
  return await r.json();
}

// Page index
async function initIndex(){
  const site = await getJSON("content/site.json");
  const produits = await getJSON("content/produits.json");

  document.querySelector("[data-site-title]").textContent = site.title;
  document.querySelector("[data-site-subtitle]").textContent = site.subtitle;

  const badges = document.querySelector("[data-site-badges]");
  badges.innerHTML = "";
  (site.badges || []).forEach(b =>
    badges.appendChild(el("span",{class:"badge"}, b))
  );

  const grid = document.querySelector("[data-products]");
  grid.innerHTML = "";

  const items = (produits.items || []).slice()
    .sort((a,b)=>(a.order||0)-(b.order||0));

  items.forEach(item => {
    const emoji = (item.title.match(/^\s*([^\s]+)/)?.[1]) || "🌿";
    const imgSrc = item.image && item.image.trim()
      ? item.image
      : svgFallback(item.title.replace(/^\s*[^\s]+\s*/,""), emoji);

    grid.appendChild(
      el("article",{class:"card"},[
        el("div",{class:"img"},
          el("img",{src:imgSrc, alt:item.title})
        ),
        el("div",{class:"body"},[
          el("h3",{class:"title"}, item.title),
          el("div",{class:"price"}, `Montant indicatif : ${item.price}`),
          el("p",{class:"desc"}, item.description),
          el("div",{class:"spacer"}),
          el("a",{class:"btn", href:"paiement.html"}, "Participer")
        ])
      ])
    );
  });
}

// Page paiement
async function initPaiement(){
  const p = await getJSON("content/paiement.json");

  document.querySelector("[data-pay-title]").textContent = p.title;
  document.querySelector("[data-pay-intro]").textContent = p.intro;

  document.querySelector("[data-form-title]").textContent = p.bloc_form.title;
  document.querySelector("[data-form-text]").textContent = p.bloc_form.text;
  const iframe = document.querySelector("[data-form-iframe]");
  iframe.src = p.bloc_form.google_forms_embed_url;
  iframe.height = String(p.bloc_form.iframe_height || 860);

  document.querySelector("[data-lydia-title]").textContent = p.bloc_lydia.title;
  document.querySelector("[data-lydia-text]").textContent = p.bloc_lydia.text;
  document.querySelector("[data-lydia-handle]").textContent = p.bloc_lydia.handle || "";

  const lydiaBtn = document.querySelector("[data-lydia-btn]");
  if (p.bloc_lydia.link && p.bloc_lydia.link.trim()) {
    lydiaBtn.href = p.bloc_lydia.link;
    lydiaBtn.style.display = "inline-block";
  } else {
    lydiaBtn.style.display = "none";
  }

  document.querySelector("[data-wero-title]").textContent = p.bloc_wero.title;
  document.querySelector("[data-wero-text]").textContent = p.bloc_wero.text;

  document.querySelector("[data-cb-title]").textContent = p.bloc_cb.title;
  document.querySelector("[data-cb-text]").textContent = p.bloc_cb.text;
  document.querySelector("[data-cb-note]").textContent = p.bloc_cb.note;

  const cbBtn = document.querySelector("[data-cb-btn]");
  cbBtn.href = p.bloc_cb.helloasso_link;
  cbBtn.textContent = p.bloc_cb.button_text || "Payer par carte via HelloAsso";
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.getAttribute("data-page");
  if (page === "index") initIndex().catch(console.error);
  if (page === "paiement") initPaiement().catch(console.error);
});
