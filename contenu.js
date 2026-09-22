/* ==========================================================
   ✏️ TON CONTENU : c'est le fichier à modifier pour changer les textes.
   Chaque élément devient un bouton ; au clic, le détail s'affiche.
   - titre / resume : texte du bouton
   - meta           : ligne sous le titre du détail
   - html           : contenu du détail (paragraphes, listes, tableaux)
   - lieu           : (expériences) adresse affichée sur une petite carte
   - liens          : boutons en bas du détail
   ========================================================== */

/* Fichiers du site, à côté de index.html (pour en remplacer un, garde le même nom) */
const PDF_ECG = "compte-rendu-cardiofrequencemetre.pdf";
const PDF_ECG_NOM = "Compte_rendu_Agneray_cardiofrequencemetre.pdf";
const SCHEMA_ECG = "schema-fonctionnel-ecg.webp";
const PDF_SAE = "compte-rendu-sae.pdf";
const PDF_SAE_NOM = "Compte_rendu_SAe_Alarme_Ultra_Son.pdf";
const GRAPHE_URL = "graphe-etat-alarme.webp";
const PDF_RELEVE = "releve-de-notes-but1.pdf";
const PDF_RELEVE_NOM = "Releve_de_notes_BUT1_Agneray_Paul.pdf";
const RELEVE_LIENS = [
  { label: "Ouvrir dans un nouvel onglet", href: PDF_RELEVE, blank: true },
  { label: "Télécharger le PDF", href: PDF_RELEVE, alt: true, download: PDF_RELEVE_NOM }
];
/* Le code du jeu vient de code-jeu.js ; ce lien permet de le télécharger en .c */
const CODE_JEU_URL = typeof CODE_JEU === "string" ? URL.createObjectURL(new Blob([CODE_JEU], { type: "text/plain" })) : "#";

const DATA = {

  projets: [
    {
      titre: "Compte rendu – Cardiofréquencemètre",
      resume: "Capteur, filtres, mise au format TTL et buzzer",
      meta: "Projet d'électronique · juin 2026",
      html: `
        <figure class="schema">
          <img src="${SCHEMA_ECG}" alt="Schéma fonctionnel complet du cardiofréquencemètre">
        </figure>
        <iframe class="pdf" src="${PDF_ECG}" title="Compte rendu du cardiofréquencemètre (PDF)"></iframe>
        <p class="empty">Le PDF ne s'affiche pas ? Ouvre-le avec le premier bouton ci-dessous.</p>`,
      liens: [
        { label: "Ouvrir dans un nouvel onglet", href: PDF_ECG, blank: true },
        { label: "Télécharger le PDF", href: PDF_ECG, alt: true, download: PDF_ECG_NOM }
      ]
    },
    {
      titre: "Code du jeu Bandit Manchot",
      resume: "Jeu programmé en binôme en 1/2 journée",
      meta: "Programmation en C",
      html: `
        <p>Voici un exemple de code que moi et un camarade avons été capables de fournir en un temps court.</p>
        <ul>
          <li>Crédit de mon camarade : Dorian Millot</li>
        </ul>
        <div class="tabs" role="tablist">
          <button type="button" role="tab" class="tab on" data-tab="jeu" aria-selected="true">Essayer le jeu</button>
          <button type="button" role="tab" class="tab" data-tab="code" aria-selected="false">Lire le code C</button>
        </div>
        <div class="tabpanel" data-panel="jeu">
          <p class="note">Reproduction à l'aide d'une IA en JavaScript de notre programme C : mêmes rouleaux, mêmes règles. Le programme d'origine se lance dans un terminal avec la blibliothèque cs50.</p>
          <div class="jeu">
            <pre class="jeu-combos"></pre>
            <p class="jeu-capital"></p>
            <div class="jeu-reels" aria-label="Rouleaux"></div>
            <p class="jeu-msg" aria-live="polite"></p>
            <div class="jeu-actions"></div>
          </div>
        </div>
        <div class="tabpanel" data-panel="code" hidden>
          <pre class="code"><code></code></pre>
        </div>`,
      init: initJeu,
      liens: [{ label: "Télécharger le code (.c)", href: CODE_JEU_URL, download: "bandit_manchot.c" }]
    },
    {
      titre: "Compte Rendu - Alarme Ultra Son",
      resume: "Mode séquentielle, graphe d'état et compte rendu",
      meta: "Projet SAé · en binôme avec Dorian Millot · juin 2026",
      html: `
        <p>Projet SAé « Alarme ultra son » : graphe d'état, puis compte rendu</p>
        <figure class="schema">
          <a href="${GRAPHE_URL}" target="_blank" rel="noopener" title="Ouvrir en grand"><img src="${GRAPHE_URL}" alt="Graphe d'état de l'alarme ultra son"></a>
          <figcaption>Graphe d'état de l'alarme (clique pour l'ouvrir en grand).</figcaption>
        </figure>
        ${pdfViewer(PDF_SAE, "Compte Rendu SAé Alarme Ultra Son")}`,
      liens: [
        { label: "Ouvrir dans un nouvel onglet", href: PDF_SAE, blank: true },
        { label: "Télécharger le PDF", href: PDF_SAE, alt: true, download: PDF_SAE_NOM }
      ]
    }
  ],

  bulletin: [
    { titre: "Semestre 1 & 2", resume: "Classement : 9", meta: "Première année", html: releveHtml(), liens: RELEVE_LIENS },
    { titre: "Semestre 3 & 4", resume: "En cours…", meta: "Deuxième année", html: "<p>En cours…</p>", liens: [] }
  ],

  /* ✏️ Descriptions à compléter : écris ton texte dans html (ex. html: "<p>Mes missions…</p>") */
  experience: [
    {
      titre: "Caissier",
      resume: "Carrefour · Temps partiel",
      meta: "Nov. 2025 – août 2026 (10 mois) · Annecy, Auvergne-Rhône-Alpes, France · Sur site",
      lieu: "134 Av. de Genève, 74000 Annecy",
      coords: "45.92497561658167, 6.12456008437433",
      html: "",
      liens: []
    },
    {
      titre: "Poissonnier",
      resume: "E.Leclerc Crozon · CDD",
      meta: "Juil. 2024 – août 2024 (2 mois) · Crozon, Bretagne, France · Sur site",
      lieu: "7 route de Penandreff, 29160 Crozon",
      coords: "48.25195355501836, -4.472876254838086",
      html: "",
      liens: []
    },
    {
      titre: "Stagiaire",
      resume: "Dubler Toiture SA · Stage",
      meta: "Juil. 2024 – juil. 2024 (2 semaines) · Grens, Vaud, Suisse · Hybride",
      lieu: "Chem. du Chalet 10, 1274 Grens, Suisse",
      coords: "46.394261212049635, 6.192127721138221",
      html: "",
      liens: []
    },
    {
      titre: "Maraîcher/responsable de vente",
      resume: "EARL La Ferme des Bioux · Temps partiel",
      meta: "Avr. 2022 – juil. 2022 (4 mois) · Ferney-Voltaire, Auvergne-Rhône-Alpes, France · Sur site",
      lieu: "Av. Voltaire, 01210 Ferney-Voltaire",
      coords: "46.25584066414095, 6.108102032498037",
      html: "",
      liens: []
    }
  ],

passions: [
  {
    titre: "Golf",
    resume: "Sport",
    meta: "Index : 11,6",
    html: '<video src="golf.mp4" controls playsinline style="width:100%;border-radius:6px"></video>',
    liens: []
  },
  {
    titre: "JJB",
    resume: "Jiu-jitsu brésilien",
    meta: "Ceinture blanche, -93 kg",
    html: '<img src="jjb-podium.webp" alt="Podium de compétition JJB" style="width:100%;border-radius:6px;margin-bottom:.8rem">' +
          '<img src="jjb-groupe.webp" alt="Groupe du club de JJB" style="width:100%;border-radius:6px">',
    liens: []
  }
]

/* Contenu du détail « Semestre 1 & 2 » */
function releveHtml() {
  return '<p>Classement : <b>9</b></p>' +
    pdfViewer(PDF_RELEVE, "Relevé de notes de première année (PDF)");
}
