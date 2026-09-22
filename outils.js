/* Petits outils d'affichage (visionneuse PDF, carte). Pas besoin de modifier. */

/* Visionneuse PDF dans la page */
function pdfViewer(url, titre) {
  return '<iframe class="pdf" src="' + url + '" title="' + titre + '"></iframe>' +
         '<p class="empty">Le PDF ne s\'affiche pas ? Ouvrez-le avec le premier bouton ci-dessous.</p>';
}

/* Petite carte Google Maps d'un lieu (sans clé d'API) */
function carteHtml(lieu, coords) {
  const q = encodeURIComponent(coords || lieu);
  const nom = lieu;
  return '<div class="carte">' +
    '<iframe src="https://www.google.com/maps?q=' + q + '&amp;output=embed&amp;hl=fr" title="Carte : ' + nom + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' +
    '<p class="lieu">' + nom + ' · <a href="https://www.google.com/maps/search/?api=1&amp;query=' + q + '" target="_blank" rel="noopener">Ouvrir dans Google Maps</a></p>' +
    '</div>';
}
