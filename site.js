/* ==========================================================
   Fonctionnement (pas besoin de modifier)
   ========================================================== */
document.querySelectorAll(".choices").forEach(function (list) {
  const key = list.dataset.key;
  const panel = list.nextElementSibling;
  const items = DATA[key];

  items.forEach(function (item, i) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "choice";
    b.setAttribute("aria-expanded", "false");
    b.innerHTML = "<strong>" + item.titre + "</strong><span>" + item.resume + "</span>";
    b.addEventListener("click", function () { toggle(i); });
    list.appendChild(b);
  });

  function toggle(i) {
    const buttons = list.querySelectorAll(".choice");
    const wasOpen = buttons[i].getAttribute("aria-expanded") === "true";
    buttons.forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    if (wasOpen) { panel.hidden = true; return; }

    buttons[i].setAttribute("aria-expanded", "true");
    const it = items[i];
    const links = (it.liens || []).map(function (l) {
      return '<a class="btn' + (l.alt ? " alt" : "") + '" href="' + l.href + '"' +
        (l.blank ? ' target="_blank" rel="noopener"' : "") + (l.download ? ' download="' + l.download + '"' : "") + ">" + l.label + "</a>";
    }).join("");
    panel.innerHTML =
      "<h3>" + it.titre + "</h3>" +
      (it.meta ? '<p class="meta">' + it.meta + "</p>" : "") +
      it.html +
      (it.lieu ? carteHtml(it.lieu, it.coords) : "") +
      (links ? '<div class="links">' + links + "</div>" : "");
    panel.hidden = false;
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-label", it.titre);
    if (it.init) it.init(panel);
  }
});

document.getElementById("year").textContent = new Date().getFullYear();


/* « Me contacter » copie l'adresse e-mail */
(function () {
  const bouton = document.getElementById("copier-mail");
  if (!bouton) return;
  const mail = bouton.dataset.mail, libelle = bouton.textContent;
  function copier() {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(mail);
    return new Promise(function (ok, ko) {
      const t = document.createElement("textarea");
      t.value = mail; t.setAttribute("readonly", ""); t.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(t); t.select();
      const reussi = document.execCommand("copy");
      document.body.removeChild(t);
      reussi ? ok() : ko();
    });
  }
  bouton.addEventListener("click", function () {
    copier().then(
      function () { bouton.textContent = "Adresse copiée !"; },
      function () { bouton.textContent = mail; }   // copie impossible : on affiche l'adresse
    ).then(function () { setTimeout(function () { bouton.textContent = libelle; }, 2500); });
  });
})();
