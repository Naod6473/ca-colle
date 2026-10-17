// node tests/run.js [en] : lance le banc de test sans navigateur
const fs = require("fs"), vm = require("vm"), path = require("path");
const ctx = {CACOLLE_LANG: process.argv[2] || "fr", console};
vm.createContext(ctx);
const src = f => fs.readFileSync(path.join(__dirname, f), "utf8");
vm.runInContext(src("../js/lang.js") + "\n" + src("../js/moteur.js") + "\n" + src("cas.js") + "\n" + src("bench.js") + "\nthis.out = runCases(CASES);", ctx);
let bad = 0;
for (const r of ctx.out) {
  console.log(`${r.fails.length ? "✕" : "✓"} ${r.name} · ${r.points} points · ${r.score} %`);
  r.fails.forEach(f => console.log("    " + f));
  if (process.env.V) r.rs.forEach(x => console.log(`      ${x.st.padEnd(3)} ${x.type} ${x.k}`));
  bad += r.fails.length > 0;
}
console.log(bad ? `${bad} cas en échec` : "Tout est bon");
process.exit(bad ? 1 : 0);
