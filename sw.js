// Ça colle ? hors connexion : l'app est gardée sur l'appareil après la première visite.
// - Pages, styles et scripts : réseau d'abord (sans cache HTTP, pour avoir la dernière version) ; si le réseau ne répond pas
//   en 3,5 s ou s'il n'y en a pas, la copie gardée.
// - Bibliothèques (vendor/) et polices (fonts/*.woff2) : cache à part (LIB), gardé d'une version à l'autre, cache d'abord.
//   Changer LIB seulement si une bibliothèque ou une police change.
//   Le lecteur PDF et la lecture d'image ne sont gardés qu'à leur premier usage (les données de langue de la lecture
//   d'image sont gardées par Tesseract lui-même).
// - À l'installation, seulement les pages de la langue utilisée (pas les 15 pages).
const VERSION = "cacolle-2026-10-23b", LIB = "cacolle-lib-1", WAIT = 3500;
const COMMON = [
  "css/app.css", "css/skins.css", "fonts/fonts.css",
  "js/lang.js", "js/lecteur.js", "js/moteur.js", "js/suivi.js", "js/outils.js", "js/fiches.js", "js/confort.js", "js/demo.js", "js/export.js", "js/app.js", "js/mescv.js", "js/salaire.js",
  "favicon.svg", "icons/icon-192.png", "icons/icon-512.png"
];
const FONTS = ["archivo-latin-700-normal", "archivo-latin-800-italic", "archivo-latin-900-italic", "archivo-latin-900-normal",
  "figtree-latin-400-normal", "figtree-latin-500-normal", "figtree-latin-600-normal", "figtree-latin-700-normal"].map(f => `fonts/${f}.woff2`);
const PAGES = l => l === "fr" ? ["./", "index.html", "salaire.html", "infos.html", "manifest.webmanifest"]
  : [`index-${l}.html`, `salary-${l}.html`, `infos-${l}.html`, `manifest-${l}.webmanifest`].concat(l === "en" ? [] : [`js/i18n/${l}.js`]);
const langOf = url => (new URL(url).pathname.match(/-(en|de|es|it)\.(?:html|webmanifest)$/) || [, "fr"])[1];
const fresh = u => new Request(u, {cache: "no-cache"});

self.addEventListener("install", e => e.waitUntil((async () => {
  const wins = await self.clients.matchAll({type: "window", includeUncontrolled: true});
  const langs = [...new Set(wins.map(w => langOf(w.url)))];
  const shell = COMMON.concat(...(langs.length ? langs : ["fr"]).map(PAGES));
  await (await caches.open(VERSION)).addAll(shell.map(fresh));
  const lib = await caches.open(LIB);
  await Promise.all(FONTS.map(async f => (await lib.match(f)) || lib.add(f).catch(() => {})));
  await self.skipWaiting();
})()));
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== LIB).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
// Une page ouverte dans une autre langue : on garde aussi ses pages (message envoyé par js/app.js)
self.addEventListener("message", e => {
  const l = e.data?.lang;
  if (!/^(fr|en|de|es|it)$/.test(l || "")) return;
  e.waitUntil(caches.open(VERSION).then(async c => Promise.all(PAGES(l).map(async u => (await c.match(u)) || c.add(fresh(u)).catch(() => {})))));
});

// Une réponse après redirection ne peut pas servir une navigation : on la recopie
const clean = res => res.redirected ? res.blob().then(b => new Response(b, {status: res.status, statusText: res.statusText, headers: res.headers})) : res;
const fallbackPage = url => (m => m ? `index-${m[1]}.html` : "index.html")(url.pathname.match(/-(en|de|es|it)\.html$/));

function networkFirst(req, url) {
  const nav = req.mode === "navigate", key = nav ? url.origin + url.pathname : req;
  const net = (nav ? fetch(url.href, {cache: "no-cache", credentials: "same-origin"}) : fetch(req, {cache: "no-cache"})).then(clean).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(key, copy)); }
    return res;
  });
  const local = () => caches.match(key, {ignoreSearch: true}).then(hit => hit || (nav ? caches.match(fallbackPage(url)) : undefined));
  return new Promise(resolve => {
    let done = false;
    const give = r => { if (!done && r) { done = true; resolve(r); } };
    net.then(give, () => local().then(r => give(r || Response.error())));
    setTimeout(() => local().then(give), WAIT); // réseau trop lent : la copie gardée, s'il y en a une
  });
}
function libFirst(req) {
  return caches.open(LIB).then(c => c.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok && res.status === 200) c.put(req, res.clone()); return res; })));
}

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin || req.headers.has("range")) return;
  if (url.pathname.includes("/vendor/lang/")) return; // données de langue : gardées par Tesseract (IndexedDB)
  if (url.pathname.includes("/vendor/") || /\/fonts\/[^/]+\.woff2$/.test(url.pathname)) { e.respondWith(libFirst(req)); return; }
  e.respondWith(networkFirst(req, url));
});
