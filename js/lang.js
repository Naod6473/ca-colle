// Langue de l'app : français (index.html) ou anglais (index-en.html). tr("texte fr", "english text").
const EN = (typeof CACOLLE_LANG !== "undefined" ? CACOLLE_LANG : typeof document !== "undefined" ? document.documentElement.lang : "fr") === "en";
const tr = (fr, en) => EN ? en : fr;
// Skin et mode confort appliqués tout de suite, avant l'affichage (réglage d'affichage gardé sur l'appareil)
if (typeof document !== "undefined") try {
  const c = JSON.parse(localStorage.getItem("cacolle-confort")) || {}, h = document.documentElement;
  if (c.skin === "fiche") h.dataset.skin = "fiche";
  ["big", "contrast", "calm"].forEach(k => c[k] && h.classList.add("c-" + k));
} catch {}
// Statistiques anonymes (Umami, sans cookie) : seulement des noms d'actions, jamais le contenu du CV ou de l'offre
const stat = (name, data) => { try { if (typeof window !== "undefined" && window.umami) window.umami.track(name, Object.assign({lang: EN ? "en" : "fr"}, data)); } catch {} };
