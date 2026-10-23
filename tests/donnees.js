// node tests/donnees.js : relecture des données gardées ou importées (cleanSave, js/app.js), dates locales, nombres du brut → net (js/salaire.js)
const fs = require("fs"), vm = require("vm"), path = require("path"), assert = require("assert");
const src = f => fs.readFileSync(path.join(__dirname, "..", f), "utf8");
const app = src("js/app.js"), sal = src("js/salaire.js"), mescv = src("js/mescv.js");
const part = (s, a, b) => s.slice(s.indexOf(a), s.indexOf(b, s.indexOf(a)));
const ctx = {CACOLLE_LANG: "fr", console};
vm.createContext(ctx);
vm.runInContext(src("js/lang.js") + "\n" + part(app, "const ymd =", "function restore(") + part(sal, "const toNum =", "const show =") + "\nconst cap = s => s.charAt(0).toUpperCase() + s.slice(1);\n" + part(mescv, "const trimT =", "function renderBuild(") + "\nthis.cleanSave = cleanSave; this.ymd = ymd; this.num = num; this.buildText = buildText;", ctx);
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
ok("ajouts de l'étape 4 : poste choisi gardé, poste piégé retiré", () => {
  const d = ctx.cleanSave(JSON.parse('{"v":1,"offers":[{"id":"c","text":"t","fixes":{"~trou:l3-l1":{"state":"accepted","vals":{"0":"2016 - 2019","1":"x"},"fix":{"line":"gap","tpl":"{a} : {b}","why":"enfants"},"to":"l3"},"~mot:a>b":{"state":"accepted","vals":{},"fix":{"line":"word","find":"a","tpl":"b"},"to":"<img src=x>"}}}]}'));
  assert.strictEqual(d.offers[0].fixes["~trou:l3-l1"].to, "l3"); assert.strictEqual(d.offers[0].fixes["~trou:l3-l1"].fix.line, "gap");
  assert.strictEqual(d.offers[0].fixes["~mot:a>b"].to, undefined);
});
ok("pas une sauvegarde", () => { assert.strictEqual(ctx.cleanSave([1]), null); assert.strictEqual(ctx.cleanSave({v: 2}), null); assert.strictEqual(ctx.cleanSave("x"), null); });
ok("suivi seul (case décochée)", () => assert.strictEqual(ctx.cleanSave({v: 1, keep: false, offers: []}).keep, false));
ok("carnet de contacts : champs connus, bons types, date vérifiée", () => {
  const d = ctx.cleanSave({v: 1, offers: [], contacts: [
    {id: "c1", name: "Mme Exemple", where: "Salon", company: 5, phone: "02 00 00 00 00", email: "x@exemple.fr", note: "n", next: "2026-10-30", evil: "<img>"},
    {id: 'c2"><img src=x>', name: "piège"}, {id: "c1", name: "doublon"}, "x", {id: "c3", next: "demain", note: {a: 1}}
  ]});
  assert.strictEqual(d.contacts.length, 2);
  assert.deepStrictEqual(JSON.parse(JSON.stringify(d.contacts[0])), {id: "c1", name: "Mme Exemple", where: "Salon", company: "", phone: "02 00 00 00 00", email: "x@exemple.fr", note: "n", next: "2026-10-30"});
  assert.strictEqual(d.contacts[1].next, ""); assert.strictEqual(d.contacts[1].note, "");
  assert.strictEqual(ctx.cleanSave({v: 1, offers: []}).contacts.length, 0);
  assert.strictEqual(ctx.cleanSave({v: 1, offers: [], contacts: "x"}).contacts.length, 0);
});
ok("date locale", () => assert.strictEqual(ctx.ymd(new Date(2026, 0, 5, 0, 30)), "2026-01-05"));
ok("nombres écrits à la main", () => {
  const t = {"1.850": 1850, "1 850": 1850, "1,850": 1850, "1'850": 1850, "1.850,50": 1850.5, "1,850.50": 1850.5, "12.50": 12.5, "12,50": 12.5, "0.850": 0.85, "11.88": 11.88, "45 000 €": 45000, "1.234.567": 1234567, "": 0};
  for (const [s, v] of Object.entries(t)) assert.strictEqual(ctx.num(s), v, s);
});
ok("CV gardés : 5 au plus, ids sûrs, textes seulement, CV en cours relié", () => {
  const many = Array.from({length: 7}, (_, i) => ({id: "c" + i, name: "CV " + i, text: "Texte " + i, date: "2026-10-0" + (i + 1)}));
  const d = ctx.cleanSave({v: 1, cv: {text: "x", lib: "c1", built: "oui"}, cvs: [{id: '"><b>', text: "x"}, {id: "vide", text: "  "}, {id: "c0", text: "a", name: {x: 1}, date: "hier", evil: 1}, ...many], offers: []});
  assert.strictEqual(d.cvs.length, 5);
  assert.deepStrictEqual(JSON.parse(JSON.stringify(d.cvs[0])), {id: "c0", name: "CV", text: "a", date: ""});
  assert.strictEqual(d.cv.lib, "c1"); assert.strictEqual(d.cv.built, undefined);
  assert.strictEqual(ctx.cleanSave({v: 1, cv: {text: "x", lib: "zz"}, offers: []}).cv.lib, undefined);
  assert.strictEqual(ctx.cleanSave({v: 1, offers: []}).cvs.length, 0);
});
ok("formulaire « Je n'ai pas de CV » : champs connus, textes seulement", () => {
  const d = ctx.cleanSave({v: 1, offers: [], cvForm: {name: "Léa", city: 5, evil: "x", jobs: [{role: "Vendeuse", t1: ["x"], z: 1}, "x", ...Array(10).fill({role: "r"})]}});
  assert.strictEqual(d.cvForm.name, "Léa"); assert.strictEqual(d.cvForm.city, undefined); assert.strictEqual(d.cvForm.evil, undefined);
  assert.strictEqual(d.cvForm.jobs.length, 8); assert.deepStrictEqual(JSON.parse(JSON.stringify(d.cvForm.jobs[0])), {role: "Vendeuse"});
  assert.strictEqual(ctx.cleanSave({v: 1, offers: [], cvForm: "x"}).cvForm, null);
});
ok("CV fait avec les questions : seulement ce qui est tapé, titres reconnus", () => {
  const t = ctx.buildText({name: " Léa  Exemple ", city: "Caen", phone: "", mail: "lea@exemple.fr", jobs: [{role: "vendeuse", company: "Boulangerie du centre", dates: "2021 - 2024", t1: "accueil des clients", t2: ""}, {}], edu: "CAP Employé de commerce (2020)\n\n", skills: "caisse\nmise en rayon", langs: "", hobbies: ""});
  assert.strictEqual(t, "Léa Exemple · Caen · lea@exemple.fr\n\nExpériences\nVendeuse, Boulangerie du centre (2021 - 2024)\n- Accueil des clients\n\nFormation\nCAP Employé de commerce (2020)\n\nCompétences\nCaisse, mise en rayon");
  assert.strictEqual(ctx.buildText({jobs: [{}]}), "");
});
console.log(process.exitCode ? "Échec" : `Tout est bon (${n} vérifications)`);
