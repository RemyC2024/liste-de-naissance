function el(tag, attrs = {}, children = []) {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
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

async function getJSON(path){
  const r = await fetch(path, {cache:"no-store"});
  if(!r.ok) throw new Error(`Impossible de charger ${path}`);
  return await r.json();
}

function normStatus(s){
  const v = String(s || "").toLowerCase().trim();
  if (v === "reserve" || v === "réservé" || v === "reserved") return "reserve";
  return "disponible";
}

function normMode(m){
  const v = String(m || "").toLowerCase().trim();
  return v === "reservation" ? "reservation" : "participation";
}

function openReserveModal(itemTitle){
  const overlay = el("div", { class: "modalOverlay" });
  const modal = el("div", { class: "modalCard panel" }, [
    el("h2", {}, "🎁 Réserver ce cadeau"),
    el("p", { class: "small" },
      "Merci 💛 Pour éviter les doublons, on confirme la réservation via le formulaire. " +
      "Après ça, on vous envoie l’adresse de livraison."
    ),
    el("div", { class: "note" }, [
      el("div", { class: "small" }, "Dans le formulaire, indiquez le cadeau :"),
      el("div", { style:"margin-top:6px;font-weight:800;color:var(--ink)" }, itemTitle)
    ]),
    el("div", { class:"btnRow", style:"margin-top:12px" }, [
      el("a", {
        class:"btn",
        href:"https://forms.gle/7KBqUQe1orpDFuiV7",
        target:"_blank",
        rel:"noopener noreferrer"
      }, "Ouvrir le formulaire"),
      el("a", { class:"ghost", href:"#"}, "Fermer")
    ])
  ]);

  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  modal.querySelector(".ghost").addEventListener("click", (e) => { e.preventDefault(); overlay.remove(); });

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// inject CSS modal (léger)
(function(){
  const css = `
  .modalOverlay{ position:fixed; inset:0; background:rgba(0,0,0,.28); display:flex; align-items:center; justify-content:center; padding:18px; z-index:9999; }
  .modalCard{ max-width:560px; width:100%; }
  a.btn.disabled{ opacity:.55; pointer-events:none; filter: grayscale(15%); }
  `;
  const s = document.createElement("style");
  s.textContent = css;
  document.head.appendChild(s);
})();

function renderItems(gridEl, items){
  gridEl.innerHTML = "";

  items.forEach(item => {
    const status = normStatus(item.status);
    const mode = normMode(item.mode);
    const reservedNote = String(item.reserved_note || "").trim();

    const statusLabel = status === "reserve" ? "Réservé" : "Disponible";
    const statusClass = status === "reserve" ? "statusBadge reserved" : "statusBadge";

    // Boutons
    let actions = [];

    if (mode === "participation") {
      // financer
      const btn = el("a", { class: status==="reserve" ? "btn disabled" : "btn", href: "paiement.html" },
        status==="reserve" ? "Déjà réservé 💛" : "Participer"
      );
      actions.push(btn);
    } else {

      const isReserved = status === "reserve";

      // 👉 Bouton ACHETER (noir)
      const buyBtn = el("a", {
        class: isReserved || !item.product_link ? "btn disabled" : "btn",
        href: isReserved || !item.product_link ? "#" : item.product_link,
        target: isReserved ? null : "_blank",
        rel: isReserved ? null : "noopener noreferrer"
      }, "Acheter");

      // 👉 Bouton DISPONIBLE / DÉJÀ RÉSERVÉ (blanc)
      const dispoBtn = el("a", {
        class: isReserved ? "ghost disabled" : "ghost",
        href: "#"
      }, isReserved ? "Déjà réservé 💛" : "Disponible");

      // 👉 Action seulement si dispo
      if (!isReserved) {
        dispoBtn.addEventListener("click", (e) => {
          e.preventDefault();
          openReserveModal(item.title);
        });
      }

      actions.push(buyBtn, dispoBtn);

    }

    const noteLine = (status === "reserve" && reservedNote)
      ? el("div", { class:"small", style:"margin-top:6px" }, `✍️ ${reservedNote}`)
      : null;

    const priceText = item.price && item.price.trim() ? item.price : "—";

    gridEl.appendChild(
      el("article", { class:"card" }, [
        el("div", { class:"img" }, el("img", { src:item.image, alt:item.title })),
        el("div", { class:"body" }, [
          el("div", { class:"statusRow" }, [
            el("h3", { class:"title" }, item.title),
            el("span", { class: statusClass }, [
              el("span", { class:"statusDot" }),
              statusLabel
            ])
          ]),
          el("div", { class:"price" }, `Montant indicatif : ${priceText}`),
          el("p", { class:"desc" }, item.description || ""),
          noteLine,
          el("div", { class:"spacer" }),
          el("div", { class:"btnRow" }, actions)
        ])
      ])
    );
  });
}

async function initIndex(){
  const produits = await getJSON("content/produits.json");

  const gridParticipation = document.querySelector("[data-products-participation]");
  const gridReservation = document.querySelector("[data-products-reservation]");

  const items = (produits.items || []).slice().sort((a,b)=>(a.order||0)-(b.order||0));
  const participation = items.filter(i => normMode(i.mode) === "participation");
  const reservation = items.filter(i => normMode(i.mode) === "reservation");

  if (gridParticipation) renderItems(gridParticipation, participation);
  if (gridReservation) renderItems(gridReservation, reservation);
}

document.addEventListener("DOMContentLoaded", () => {
  initIndex().catch(console.error);
});