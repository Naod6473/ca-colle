// Langue de l'app : fr (index.html), en (index-en.html), de, es, it (index-de.html…). tr("texte fr", "english text").
// Allemand, espagnol, italien : js/i18n/<langue>.js définit I18N (textes traduits, lexique, motifs de l'analyse).
// tr() y cherche le texte français ; un texte avec des valeurs (« 12 mots ») est retrouvé par son modèle (« {0} mots »).
// Sans traduction, on garde l'anglais.
const LANG = (() => { const l = typeof CACOLLE_LANG !== "undefined" ? CACOLLE_LANG : typeof document !== "undefined" ? document.documentElement.lang : "fr"; return ["fr", "en", "de", "es", "it"].includes(l) ? l : "fr"; })();
const EN = LANG === "en";
const L10N = typeof I18N !== "undefined" && I18N.lang === LANG ? I18N : null;
// Majuscule gardée en tête des noms de points dans une phrase (anglais, allemand) ; ailleurs on met en minuscule
const KEEPCASE = LANG === "en" || LANG === "de";
const trTpl = L10N ? Object.entries(L10N.s || {}).filter(([k]) => /\{\d\}/.test(k)).map(([k, v]) => {
  const parts = k.split(/\{(\d)\}/), idx = [];
  let src = "^";
  parts.forEach((p, i) => { if (i % 2) { idx.push(+p); src += "([\\s\\S]*?)"; } else src += p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
  return {re: new RegExp(src + "$"), idx, v};
}) : [];
const tr = (fr, en) => {
  if (LANG === "fr") return fr;
  if (EN || !L10N) return en;
  const s = L10N.s[fr];
  if (s !== undefined) return s;
  for (const t of trTpl) {
    const m = fr.match(t.re);
    if (m) { const vals = {}; t.idx.forEach((n, i) => vals[n] = m[i + 1]); return t.v.replace(/\{(\d)\}/g, (_, n) => vals[n] ?? ""); }
  }
  return en;
};
// Pages de l'app dans chaque langue (menu des langues)
const PAGES = {
  app:   {fr: "./", en: "index-en.html", de: "index-de.html", es: "index-es.html", it: "index-it.html"},
  sal:   {fr: "salaire.html", en: "salary-en.html", de: "salary-de.html", es: "salary-es.html", it: "salary-it.html"},
  infos: {fr: "infos.html", en: "infos-en.html", de: "infos-de.html", es: "infos-es.html", it: "infos-it.html"}
};
// Skin et mode confort appliqués tout de suite, avant l'affichage (réglage d'affichage gardé sur l'appareil)
if (typeof document !== "undefined") try {
  const c = JSON.parse(localStorage.getItem("cacolle-confort")) || {}, h = document.documentElement;
  if (c.skin === "fiche") h.dataset.skin = "fiche";
  ["big", "contrast", "calm"].forEach(k => c[k] && h.classList.add("c-" + k));
  if (c.dark ?? matchMedia("(prefers-color-scheme: dark)").matches) h.classList.add("c-dark");
} catch {}
// Statistiques anonymes (Umami, sans cookie) : seulement des noms d'actions, jamais le contenu du CV ou de l'offre
const stat = (name, data) => { try { if (typeof window !== "undefined" && window.umami) window.umami.track(name, Object.assign({lang: LANG}, data)); } catch {} };
