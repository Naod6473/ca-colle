// Brut → net, dans le navigateur. Français : taux moyens de cotisations par statut (estimation, comme les
// simulateurs courants). Anglais : salaire britannique, impôt sur le revenu + National Insurance (barème 2025/26,
// Angleterre, pays de Galles et Irlande du Nord). On remplit n'importe quelle case, les autres suivent.
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const fold = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const nf = new Intl.NumberFormat(tr("fr-FR", "en-GB"), {maximumFractionDigits: 2, minimumFractionDigits: 0});
const num = v => { const n = parseFloat(String(v).replace(/[\s  ]/g, "").replace(/[£€$]/g, "").replace(/,(?=\d{3}\b)/g, EN ? "" : ",").replace(",", ".")); return isFinite(n) ? n : 0; };
const show = n => { if (!n) return ""; const r = Math.round(n * 100) / 100; return new Intl.NumberFormat(tr("fr-FR", "en-GB"), {minimumFractionDigits: r % 1 ? 2 : 0, maximumFractionDigits: 2}).format(r); };

// Lit un salaire tel qu'il est écrit dans une annonce : « 45 000 € brut par an », « 48 k€ », « £11.50 per hour »
function parseSalary(t){
  const f = fold(t), m = f.match(/(\d[\d\s.,]*)\s?(k)?/); if (!m) return null;
  let v = parseFloat(m[1].replace(/\s/g, "").replace(EN ? /,/g : /\./g, "").replace(",", "."));
  if (m[2] || /\dk\b/.test(f)) v *= 1000;
  const u = /heure|hour|\/ ?h\b|\bh\b/.test(f) ? "h" : /mois|month/.test(f) ? "m" : /semaine|week/.test(f) ? "w" : /an\b|annuel|year|annum/.test(f) || v > 10000 ? "a" : v < 100 ? "h" : "m";
  return {v, u};
}

let edit = "a";
// Position du curseur pour la partie remplie de la barre (0 = tout à gauche, max = tout à droite)
const fill = () => $$('input[type="range"]').forEach(r => r.style.setProperty("--r", (r.value - r.min) / (r.max - r.min)));
document.addEventListener("input", e => { if (e.target.type === "range") fill(); });
addEventListener("DOMContentLoaded", fill); fill();
if (!EN) {
  /* ---------- France ---------- */
  const RATE = {nc: .22, c: .25, fp: .15, pl: .45, ps: .51}, HOURS = 151.67;
  let st = "nc", time = 100, months = 12, pas = 0, pasAuto = true, base = {k: "ma", v: 0};
  // Taux neutre du prélèvement à la source (grille 2025, métropole) : estimation tant qu'on n'a pas bougé le curseur
  const NEUTRE = [[1620, 0], [1683, .5], [1791, 1.3], [1911, 2.1], [2042, 2.9], [2151, 3.5], [2294, 4.1], [2714, 5.3], [3107, 7.5], [3539, 9.9], [3983, 11.9], [4648, 13.8], [5574, 15.8], [6974, 17.9], [8711, 20], [12091, 24], [16376, 28], [25706, 33], [55062, 38], [Infinity, 43]];
  const neutre = m => NEUTRE.find(([max]) => m < max)[1];
  function calc(){
    const r = RATE[st], t = time / 100, h = HOURS * t; let q = 1 - pas / 100;
    let mb;
    switch (base.k) {
      case "hb": mb = base.v * h; break;
      case "mb": mb = base.v; break;
      case "ab": mb = base.v / months; break;
      case "hn": mb = base.v * h / (1 - r); break;
      case "mn": mb = base.v / (1 - r); break;
      case "an": mb = base.v / months / (1 - r); break;
      case "hp": mb = base.v * h / q / (1 - r); break;
      case "mp": mb = base.v / q / (1 - r); break;
      case "ap": mb = base.v / months / q / (1 - r); break;
      default: mb = 0;
    }
    let mn = mb * (1 - r);
    if (pasAuto && base.k[1] !== "p") { pas = neutre(mn); q = 1 - pas / 100; $("#pas").value = pas; fill(); }
    const mp = mn * q, out = {hb: h ? mb / h : 0, mb, ab: mb * months, hn: h ? mn / h : 0, mn, an: mn * months, hp: h ? mp / h : 0, mp, ap: mp * months};
    Object.entries(out).forEach(([k, v]) => { if (k !== base.k || document.activeElement !== $("#" + k)) $("#" + k).value = show(v); });
    $("#pmn").textContent = show(mp) || "0"; $("#pan").textContent = show(mp * months) || "0";
    $("#rate").textContent = `−${Math.round(r * 100)} %`; $("#timev").textContent = time + " %"; $("#pasv").textContent = nf.format(pas) + " %";
    $("#sum").textContent = mb ? `${show(mb)} € brut par mois, c'est environ ${show(mn)} € net avant impôt, et ${show(mp)} € après le prélèvement à la source.` : "Remplis une case : les autres se calculent toutes seules.";
  }
  document.addEventListener("input", e => {
    const t = e.target;
    if (t.matches(".money")) { base = {k: t.id, v: num(t.value)}; return calc(); }
    if (t.id === "time") { time = +t.value; return calc(); }
    if (t.id === "pas") { pas = +t.value; pasAuto = false; $("#pasauto").hidden = true; return calc(); }
  });
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-st], [data-mo]"); if (!b) return;
    if (b.dataset.st) { st = b.dataset.st; $$("[data-st]").forEach(x => x.setAttribute("aria-pressed", x === b)); stat("salaire-statut", {st}); }
    if (b.dataset.mo) { months = +b.dataset.mo; $$("[data-mo]").forEach(x => x.setAttribute("aria-pressed", x === b)); }
    calc();
  });
  $("#clear").addEventListener("click", () => { base = {k: "mb", v: 0}; pasAuto = true; $("#pasauto").hidden = false; $$(".money").forEach(i => i.value = ""); calc(); });
  const q = new URLSearchParams(location.search).get("s"), p = q && parseSalary(q);
  if (p) base = {k: p.u === "h" ? "hb" : p.u === "a" ? "ab" : "mb", v: /net/.test(fold(q)) ? 0 : p.v};
  if (p && /net/.test(fold(q))) base = {k: p.u === "h" ? "hn" : p.u === "a" ? "an" : "mn", v: p.v};
  if (q) $("#from").hidden = false, $("#fromv").textContent = q;
  calc();
} else {
  /* ---------- United Kingdom ---------- */
  const PA = 12570, BASIC = 50270, ADD = 125140;
  let hours = 37.5, pension = 5, base = {k: "ya", v: 0};
  function tax(gross){
    const pa = Math.max(0, PA - Math.max(0, gross - 100000) / 2), taxable = Math.max(0, gross - pa);
    const b1 = Math.max(0, BASIC - PA), b2 = ADD - BASIC + (PA - pa);
    const t = Math.min(taxable, b1) * .2 + Math.min(Math.max(0, taxable - b1), b2) * .4 + Math.max(0, taxable - b1 - b2) * .45;
    const ni = Math.max(0, Math.min(gross, BASIC) - PA) * .08 + Math.max(0, gross - BASIC) * .02;
    return {t, ni};
  }
  function calc(){
    const k = base.k, v = base.v, perYear = {ya: 1, ma: 12, wa: 52, ha: 52 * hours}[k] || 1, ga = v * perYear;
    const pen = ga * pension / 100, {t, ni} = tax(ga - pen), net = ga - pen - t - ni;
    const out = {ya: ga, ma: ga / 12, wa: ga / 52, ha: hours ? ga / 52 / hours : 0};
    Object.entries(out).forEach(([id, x]) => { if (id !== k || document.activeElement !== $("#" + id)) $("#" + id).value = show(x); });
    $("#tax").textContent = "£" + show(t || 0); $("#ni").textContent = "£" + show(ni || 0); $("#pen").textContent = "£" + show(pen || 0);
    $("#pmn").textContent = "£" + (show(net / 12) || "0"); $("#pan").textContent = "£" + (show(net) || "0");
    $("#hoursv").textContent = hours + " h"; $("#penv").textContent = pension + " %";
    $("#sum").textContent = ga ? `£${show(ga)} a year before tax is about £${show(net / 12)} a month take-home.` : "Fill in any box: the others work themselves out.";
  }
  document.addEventListener("input", e => {
    const t = e.target;
    if (t.matches(".money")) { base = {k: t.id, v: num(t.value)}; return calc(); }
    if (t.id === "hours") { hours = +t.value; return calc(); }
    if (t.id === "pension") { pension = +t.value; return calc(); }
  });
  $("#clear").addEventListener("click", () => { base = {k: "ya", v: 0}; $$(".money").forEach(i => i.value = ""); calc(); });
  const q = new URLSearchParams(location.search).get("s"), p = q && parseSalary(q);
  if (p) base = {k: {h: "ha", m: "ma", w: "wa", a: "ya"}[p.u], v: p.v};
  if (q) $("#from").hidden = false, $("#fromv").textContent = q;
  calc();
}
