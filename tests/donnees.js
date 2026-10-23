// node tests/donnees.js : relecture des données gardées ou importées (cleanSave, js/app.js), dates locales, nombres du brut → net (js/salaire.js)
const fs = require("fs"), vm = require("vm"), path = require("path"), assert = require("assert");
const src = f => fs.readFileSync(path.join(__dirname, "..", f), "utf8");
const app = src("js/app.js"), sal = src("js/salaire.js");
const part = (s, a, b) => s.slice(s.indexOf(a), s.indexOf(b, s.indexOf(a)));
const ctx = {CACOLLE_LANG: "fr", console};
vm.createContext(ctx);
vm.runInContext(src("js/lang.js") + "\n" + part(app, "const ymd =", "function restore(") + part(sal, "const toNum =", "const show =") + "\nthis.cleanSave = cleanSave; this.ymd = ymd; this.num = num;", ctx);
let n = 0; const ok = (name, f) => { try { f(); n++; } catch (e) { console.log("✕ " + name + "\n    " + e.message); process.exitCode = 1; } };
const bk = o => ({v: 1, cv: {text: "Jean Test"}, me: {}, offers: [o]});

ok("fichier piégé : id avec du HTML retiré, score texte retiré", () => {
  const d = ctx.cleanSave(bk({id: 'a"><img src=x onerror="x()">', text: "x", score: "<img>"}));
  assert.strictEqual(d.offers.length, 0);
  const e = ctx.cleanSave(bk({id: "a", text: "x", score: "<img>"}));
  assert.strictEqual(e.offers[0].score, undefined);
});
ok("état inconnu, texte manquant, historique abîmé", () => {
  const d = ctx.cleanSave(bk({id: "a", app: {status: "Foo!", history: "x", job: 5}}));
  const a = d.offers[0].app;
  assert.strictEqual(d.offers[0].text, ""); assert.strictEqual(a.status, "todo"); assert.strictEqual(a.job, "");
  assert.strictEqual(a.history.length, 1);
});
ok("clés inconnues retirées, __proto__ ignoré", () => {
  const d = ctx.cleanSave(JSON.parse('{"v":1,"evil":1,"offers":[{"id":"b","text":"t","x":1,"over":{"__proto__":"ok","Excel":"ok","Word":"<b>"},"fixes":{"Excel":{"state":"accepted","vals":{"0":"a","y":"b"},"fix":{"tpl":"{x}","on":"y"}}}}]}'));
  assert.strictEqual(d.evil, undefined); assert.strictEqual(d.offers[0].x, undefined);
  assert.deepStrictEqual(Object.keys(d.offers[0].over), ["Excel"]);
  assert.deepStrictEqual(JSON.parse(JSON.stringify(d.offers[0].fixes.Excel)), {state: "accepted", vals: {0: "a"}, fix: {tpl: "{x}"}});
});
ok("pas une sauvegarde", () => { assert.strictEqual(ctx.cleanSave([1]), null); assert.strictEqual(ctx.cleanSave({v: 2}), null); assert.strictEqual(ctx.cleanSave("x"), null); });
ok("suivi seul (case décochée)", () => assert.strictEqual(ctx.cleanSave({v: 1, keep: false, offers: []}).keep, false));
ok("date locale", () => assert.strictEqual(ctx.ymd(new Date(2026, 0, 5, 0, 30)), "2026-01-05"));
ok("nombres écrits à la main", () => {
  const t = {"1.850": 1850, "1 850": 1850, "1,850": 1850, "1'850": 1850, "1.850,50": 1850.5, "1,850.50": 1850.5, "12.50": 12.5, "12,50": 12.5, "0.850": 0.85, "11.88": 11.88, "45 000 €": 45000, "1.234.567": 1234567, "": 0};
  for (const [s, v] of Object.entries(t)) assert.strictEqual(ctx.num(s), v, s);
});
console.log(process.exitCode ? "Échec" : `Tout est bon (${n} vérifications)`);
