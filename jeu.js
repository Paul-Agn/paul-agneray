/* Projet « Bandit Manchot » : coloration du code C et jeu jouable. Pas besoin de modifier. */

/* Coloration syntaxique simple pour le code C */
function surligneC(src) {
  const esc = src.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*")|(^[ \t]*#[a-z]+)|\b(int|void|char|string|return|if|else|for|while|do|switch|case|default|break)\b|\b(\d+)\b/gm;
  return esc.replace(re, function (m, com, str, pre, kw, num) {
    const cls = com ? "com" : str ? "str" : pre ? "pre" : kw ? "kw" : "num";
    return '<span class="' + cls + '">' + m + "</span>";
  });
}

/* Détail du projet « Bandit Manchot » : onglets, code et jeu jouable */
function initJeu(panel) {
  /* --- onglets --- */
  panel.querySelectorAll(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      panel.querySelectorAll(".tab").forEach(function (o) {
        o.classList.toggle("on", o === tab);
        o.setAttribute("aria-selected", o === tab);
      });
      panel.querySelectorAll(".tabpanel").forEach(function (p) {
        p.hidden = p.dataset.panel !== tab.dataset.tab;
      });
    });
  });
  panel.querySelector(".code code").innerHTML = surligneC(CODE_JEU);

  /* --- jeu : mêmes règles que le programme en C --- */
  const CITRON = "\u{1F34B}", SEPT = "7\uFE0F\u20E3", CERISE = "\u{1F352}", BAR = "\u{1F6A7}";
  const ROULEAUX = [
    [CITRON, SEPT, CERISE, BAR, CITRON, CERISE, CITRON, CITRON, CERISE, CITRON, BAR],
    [CITRON, CERISE, SEPT, CITRON, CERISE, CITRON, BAR, CERISE, CITRON, SEPT, CERISE],
    [CITRON, BAR, CITRON, CERISE, CITRON, SEPT, CERISE, CITRON, BAR, CERISE, CITRON]
  ];
  const DELAI = 900; // pause entre l'affichage de deux rouleaux (ms)

  const elCombos = panel.querySelector(".jeu-combos");
  const elCapital = panel.querySelector(".jeu-capital");
  const elMsg = panel.querySelector(".jeu-msg");
  const elActions = panel.querySelector(".jeu-actions");
  const elReels = panel.querySelector(".jeu-reels");

  elCombos.textContent =
    "Combinaisons Gagnantes :\n" +
    SEPT + "    " + SEPT + "    " + SEPT + "   =>  mise x 500 (0,15% chance de gain)\n" +
    BAR + "   " + BAR + "   " + BAR + "  =>  mise x 250 (0,3% chance de gain)\n" +
    CERISE + "   " + CERISE + "   " + CERISE + "  =>  mise x 25 (1,5% chance de gain)\n" +
    CITRON + "   " + CITRON + "   " + CITRON + "  =>  mise x 10 (7% chance de gain)\n" +
    CITRON + "   " + CITRON + "    Ø  =>  mise x 8 (9% chance de gain)\n" +
    CITRON + "    Ø    Ø  =>  mise x 4 (16% chance de gain)";

  elReels.innerHTML = [0, 1, 2].map(function () {
    return '<div class="reel"><span></span><span></span><span></span></div>';
  }).join("");
  const colonnes = Array.from(elReels.querySelectorAll(".reel"));

  let capital = 100, mise = 0, idx = [0, 0, 0], timers = [];

  const alea = function () { return Math.floor(Math.random() * 11); };
  const symbole = function (r, decalage) { return ROULEAUX[r][(idx[r] + decalage + 11) % 11]; };

  /* même barème que la fonction comptage() du programme C */
  function comptage() {
    const s = [symbole(0, 0), symbole(1, 0), symbole(2, 0)];
    const tous = function (x) { return s[0] === x && s[1] === x && s[2] === x; };
    if (tous(SEPT)) return 500;
    if (tous(BAR)) return 250;
    if (tous(CERISE)) return 10;
    if (tous(CITRON)) return 5;
    if (s[0] === CITRON && s[1] === CITRON) return 1;
    if (s[0] === CITRON) return 1;
    return 0;
  }

  /* affichage : symbole précédent, résultat (ligne du milieu) et symbole suivant */
  function remplir(r) {
    const cases = colonnes[r].children;
    cases[0].textContent = symbole(r, -1);
    cases[1].textContent = symbole(r, 0);
    cases[2].textContent = symbole(r, 1);
  }
  function vider() {
    colonnes.forEach(function (c) { Array.from(c.children).forEach(function (s) { s.textContent = ""; }); });
  }
  function montrer(avecDelai, suite) {
    if (!avecDelai) { [0, 1, 2].forEach(remplir); suite(); return; }
    vider();
    [0, 1, 2].forEach(function (r) {
      timers.push(setTimeout(function () { remplir(r); }, (r + 1) * DELAI));
    });
    timers.push(setTimeout(suite, 3 * DELAI + 150));
  }

  function majCapital() { elCapital.textContent = "Capital : " + capital; }
  function dire(t) { elMsg.textContent = t; }
  function effacer() { elActions.textContent = ""; }
  function bouton(texte, fn, opts) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn mini" + (opts && opts.alt ? " alt" : "");
    b.textContent = texte;
    b.disabled = !!(opts && opts.disabled);
    b.addEventListener("click", fn);
    elActions.appendChild(b);
    return b;
  }

  /* --- déroulement d'une partie --- */
  function debut() {
    timers.forEach(clearTimeout); timers = [];
    capital = 100; mise = 0;
    majCapital(); vider(); effacer();
    dire("Entrez votre mise :");
    const choix = [1, 2, 3].map(function (n) {
      return bouton(String(n), function () {
        mise = n;
        choix.forEach(function (c, i) { c.classList.toggle("on", i === n - 1); });
        lancer.disabled = false;
      }, { alt: true });
    });
    const lancer = bouton("Lancer le jeu", tour, { disabled: true });
  }

  function tour() {
    capital -= mise;
    majCapital(); effacer(); dire("");
    idx = [alea(), alea(), alea()];
    montrer(true, apresTirage);
  }

  function apresTirage() {
    const s = [symbole(0, 0), symbole(1, 0), symbole(2, 0)];
    if (s[0] === s[1] && s[1] === s[2]) { conclure(); return; }  // 3 identiques : pas de relance
    proposerRelance();
  }

  function proposerRelance() {
    dire("Relancer un ou plusieurs rouleaux ?\n-" + mise + " point(s) par rouleau");
    elActions.innerHTML = [1, 2, 3].map(function (n) {
      return '<label class="coche"><input type="checkbox" value="' + (n - 1) + '"> Rouleau ' + n + "</label>";
    }).join("");
    const cases = Array.from(elActions.querySelectorAll("input"));
    const relancer = bouton("Relancer", function () {
      const choisis = cases.filter(function (c) { return c.checked; }).map(function (c) { return +c.value; });
      choisis.forEach(function (r) { idx[r] = alea(); });
      capital -= mise * choisis.length;
      majCapital(); effacer(); dire("");
      montrer(true, conclure);
    }, { disabled: true });
    bouton("Garder mes rouleaux", conclure, { alt: true });
    cases.forEach(function (c) {
      c.addEventListener("change", function () {
        const n = cases.filter(function (x) { return x.checked; }).length;
        relancer.disabled = n === 0 || n === 3;  // comme dans le C : 1, 2, 3, 12, 13 ou 23
        relancer.textContent = n > 0 && n < 3 ? "Relancer (-" + n * mise + ")" : "Relancer";
      });
    });
  }

  function conclure() {
    const g = comptage(), gain = mise * g;
    capital += gain;
    majCapital(); effacer();
    dire("Gain : " + gain + (g !== 0 ? "\nNouveau Capital : " + capital : ""));
    bouton("Restart : oui (O)", tour);
    bouton("Non (N)", fin, { alt: true });
  }

  function fin() {
    effacer();
    dire("Fin de la partie. Capital final : " + capital);
    bouton("Nouvelle partie", debut);
  }

  debut();
}
