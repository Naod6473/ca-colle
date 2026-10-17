// Ça colle ? hors connexion : l'app est gardée sur l'appareil après la première visite.
// Pages, styles et scripts : réseau d'abord (pour avoir la dernière version), cache si pas de réseau.
// Bibliothèques de lecture (vendor/) : cache d'abord, elles ne changent pas.
const VERSION = "cacolle-2026-10-17k";
const SHELL = [
  "./", "index.html", "index-en.html", "salaire.html", "salary-en.html", "js/salaire.js", "css/app.css", "css/skins.css", "fonts/fonts.css",
  "fonts/archivo-latin-700-normal.woff2", "fonts/archivo-latin-800-italic.woff2", "fonts/archivo-latin-900-italic.woff2", "fonts/archivo-latin-900-normal.woff2",
  "fonts/figtree-latin-400-normal.woff2", "fonts/figtree-latin-500-normal.woff2", "fonts/figtree-latin-600-normal.woff2", "fonts/figtree-latin-700-normal.woff2",
  "js/lang.js", "js/lecteur.js", "js/moteur.js", "js/suivi.js", "js/outils.js", "js/confort.js", "js/demo.js", "js/export.js", "js/app.js", "favicon.svg", "manifest.webmanifest", "manifest-en.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "vendor/pdf/pdf.min.js", "vendor/pdf/pdf.worker.min.js"
];
self.addEventListener("install", e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  const put = res => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return res; };
  if (url.pathname.includes("/vendor/")) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(put)));
    return;
  }
  e.respondWith(fetch(req).then(put).catch(() => caches.match(req, {ignoreSearch: true}).then(hit => hit || (req.mode === "navigate" ? caches.match(url.pathname.endsWith("-en.html") ? "index-en.html" : "index.html") : undefined))));
});
