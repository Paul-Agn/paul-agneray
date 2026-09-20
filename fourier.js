/* Signal carré = somme de sinusoïdes impaires (série de Fourier) */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const NMAX = 9, W = 1000, CY = 130, SY = 88, PTS = 480, X_MAX = 4 * Math.PI;
  const groupe = document.getElementById("f-harm");
  const somme = document.getElementById("f-somme");
  const slider = document.getElementById("f-n");
  const sortie = document.getElementById("f-nout");
  const bouton = document.getElementById("f-play");
  const formule = document.getElementById("f-termes");
  if (!groupe || !somme || !formule) return;

  /* une courbe par harmonique */
  const courbes = [];
  for (let k = 0; k < NMAX; k++) {
    const p = document.createElementNS(NS, "path");
    p.style.stroke = "var(--c" + (k + 1) + ")";
    groupe.appendChild(p);
    courbes.push(p);
  }

  /* la même somme, écrite terme par terme dans les mêmes couleurs */
  let h = '<mrow><mi>s</mi><mo>(</mo><mi>t</mi><mo>)</mo><mo>≈</mo><mfrac><mn>4</mn><mi>π</mi></mfrac><mo>[</mo>';
  for (let k = 0; k < NMAX; k++) {
    const m = 2 * k + 1;
    h += '<mrow class="ft" style="color: var(--c' + (k + 1) + ')">' + (k ? "<mo>+</mo>" : "") +
         (m > 1 ? "<mfrac><mn>1</mn><mn>" + m + "</mn></mfrac>" : "") +
         "<mi>sin</mi><mo>(</mo>" + (m > 1 ? "<mn>" + m + "</mn>" : "") + "<mi>ω</mi><mi>t</mi><mo>)</mo></mrow>";
  }
  h += "<mo>+</mo><mo>⋯</mo><mo>]</mo></mrow>";
  formule.innerHTML = h;
  const termes = Array.from(formule.querySelectorAll(".ft"));

  /* nf = nombre (fractionnaire) d'harmoniques : la dernière apparaît en fondu */
  function dessiner(nf) {
    const poids = [];
    for (let k = 0; k < NMAX; k++) poids.push(Math.max(0, Math.min(1, nf - k)));
    const pts = courbes.map(function () { return []; });
    const total = [];
    for (let i = 0; i <= PTS; i++) {
      const x = X_MAX * i / PTS, px = (W * i / PTS).toFixed(1);
      let s = 0;
      for (let k = 0; k < NMAX; k++) {
        const m = 2 * k + 1;
        const v = poids[k] * (4 / Math.PI) * Math.sin(m * x) / m;
        s += v;
        pts[k].push(px + "," + (CY - SY * v).toFixed(1));
      }
      total.push(px + "," + (CY - SY * s).toFixed(1));
    }
    courbes.forEach(function (p, k) {
      p.setAttribute("d", "M" + pts[k].join("L"));
      p.style.display = poids[k] > 0 ? "" : "none";
    });
    somme.setAttribute("d", "M" + total.join("L"));
    termes.forEach(function (t, k) {
      t.setAttribute("style", "color: var(--c" + (k + 1) + "); " +
        (poids[k] > 0 ? "opacity: " + (0.35 + 0.65 * poids[k]).toFixed(2) : "display: none"));
    });
    const n = Math.min(NMAX, Math.floor(nf + 1e-6));
    slider.value = n;
    sortie.textContent = n;
  }

  /* animation : on ajoute les harmoniques une à une, puis on recommence */
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let nf = reduit ? 7 : 1, lecture = !reduit, dernier = 0, attente = 0, fini = false, raf = 0;

  function boucle(t) {
    if (!lecture) { raf = 0; return; }
    const dt = dernier ? Math.min(0.1, (t - dernier) / 1000) : 0;
    dernier = t;
    if (!attente) attente = t + 1200;          // on laisse voir la sinusoïde seule
    if (t < attente) {
      /* pause */
    } else if (nf >= NMAX) {
      if (!fini) { fini = true; attente = t + 3200; }   // on admire le résultat
      else { nf = 1; fini = false; attente = t + 1200; }
    } else {
      nf = Math.min(NMAX, nf + dt * 0.6);
    }
    dessiner(nf);
    raf = requestAnimationFrame(boucle);
  }
  function demarrer() {
    lecture = true; dernier = 0; attente = 0;
    if (nf >= NMAX) { nf = 1; fini = false; }
    bouton.textContent = "Pause";
    if (!raf) raf = requestAnimationFrame(boucle);
  }
  function arreter() {
    lecture = false;
    bouton.textContent = "Lecture";
  }

  bouton.addEventListener("click", function () { lecture ? arreter() : demarrer(); });
  slider.addEventListener("input", function () {
    arreter();
    nf = +slider.value;
    dessiner(nf);
  });

  bouton.textContent = lecture ? "Pause" : "Lecture";
  dessiner(nf);
  if (lecture) raf = requestAnimationFrame(boucle);
})();
