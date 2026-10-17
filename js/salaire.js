// Brut → net, dans le navigateur. Français : France par défaut, taux moyens de cotisations par statut (estimation,
// comme les simulateurs courants) ; aussi Belgique, Suisse et Québec (règles 2025, personne seule, ?pays=be|ch|qc). Anglais : salaire britannique, impôt sur le revenu + National Insurance (barème 2025/26,
// Angleterre, pays de Galles et Irlande du Nord). On remplit n'importe quelle case, les autres suivent.
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const fold = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const nf = new Intl.NumberFormat(tr("fr-FR", "en-GB"), {maximumFractionDigits: 2, minimumFractionDigits: 0});
const num = v => { const n = parseFloat(String(v).replace(/[\s  ]/g, "").replace(/[£€$]/g, "").replace(/,(?=\d{3}\b)/g, EN ? "" : ",").replace(LANG === "fr" || EN ? /$^/ : /\.(?=\d{3}\b)/g, "").replace(",", ".")); return isFinite(n) ? n : 0; };
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
if (LANG !== "fr" && LANG !== "en" && L10N?.salary) {
  // Autre pays : le calcul est dans js/i18n/<langue>.js (mêmes outils : $, $$, num, show, fill, parseSalary)
  L10N.salary({$, $$, num, show, nf, fill, parseSalary, fold});
} else if (!EN) {
  /* ---------- Pays : France (par défaut), Belgique, Suisse, Québec ---------- */
  // Choix gardé dans l'adresse (?pays=be, pour partager le lien) et sur l'appareil (cacolle-pays)
  const PAYS = ["fr", "be", "ch", "qc"];
  const urlPays = () => { const u = new URLSearchParams(location.search).get("pays") || (location.hash.match(/pays=(\w+)/) || [])[1]; return PAYS.includes(u) ? u : null; };
  let pays = urlPays();
  if (!pays) try { const s = localStorage.getItem("cacolle-pays"); if (PAYS.includes(s)) pays = s; } catch {}
  pays = pays || "fr";
  let base = {k: "ma", v: 0};
  const clearBtns = $$("[data-clear]");

  /* ---------- France ---------- */
  const RATE = {nc: .22, c: .25, fp: .15, pl: .45, ps: .51}, HOURS = 151.67;
  let st = "nc", time = 100, months = 12, pas = 0, pasAuto = true;
  // Taux neutre du prélèvement à la source (grille 2025, métropole) : estimation tant qu'on n'a pas bougé le curseur
  const NEUTRE = [[1620, 0], [1683, .5], [1791, 1.3], [1911, 2.1], [2042, 2.9], [2151, 3.5], [2294, 4.1], [2714, 5.3], [3107, 7.5], [3539, 9.9], [3983, 11.9], [4648, 13.8], [5574, 15.8], [6974, 17.9], [8711, 20], [12091, 24], [16376, 28], [25706, 33], [55062, 38], [Infinity, 43]];
  const neutre = m => NEUTRE.find(([max]) => m < max)[1];
  function calcFR(){
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

  /* ---------- Belgique, Suisse, Québec (règles 2025, personne seule sans enfant, estimation) ---------- */
  // Barème progressif : [[plafond, taux], …] appliqué tranche par tranche
  const bareme = (x, T) => { let t = 0, lo = 0; for (const [hi, r] of T) { if (x > lo) t += (Math.min(x, hi) - lo) * r; lo = hi; } return t; };
  const BE_IPP = [[16320, .25], [28800, .40], [49840, .45], [Infinity, .50]];
  const QC_FED = [[57375, .145], [114750, .205], [177882, .26], [253414, .29], [Infinity, .33]];
  const QC_PROV = [[53255, .14], [106495, .19], [129590, .24], [Infinity, .2575]];
  let hours = {be: 38, ch: 42, qc: 40}, pay = {be: 13.92, ch: 12, qc: 12}, lpp = 7, imp = 10;
  // Pour un brut annuel : ce qui part en cotisations sociales (soc) et en impôt (tax), ligne par ligne (montants annuels)
  const MODEL = {
    be(ga){
      const onss = ga * .1307, imposable = ga - onss;
      const frais = Math.min(imposable * .30, 5930), net = Math.max(0, imposable - frais);
      const ipp = Math.max(0, bareme(net, BE_IPP) - bareme(10910, BE_IPP)), comm = ipp * .07;
      const csss = imposable <= 18592.02 ? 0 : imposable <= 21070.96 ? (imposable - 18592.02) * .09 : Math.min(731.28, 223.10 + (imposable - 21070.96) * .013);
      return {soc: onss, tax: ipp + comm + csss, lines: [["ONSS (13,07 %)", onss], ["Précompte professionnel (estimé, avec taxe communale 7 %)", ipp + comm], ["Cotisation spéciale de sécurité sociale", csss]]};
    },
    ch(ga){
      const avs = ga * .053, ac = Math.min(ga, 148200) * .011, l = ga * lpp / 100, aanp = Math.min(ga, 148200) * .013, impot = ga * imp / 100;
      return {soc: avs + ac + l + aanp, tax: impot, lines: [["AVS / AI / APG (5,3 %)", avs], ["Assurance chômage AC (1,1 %)", ac], [`2e pilier LPP (${nf.format(lpp)} %)`, l], ["Accidents non professionnels AANP (1,3 %)", aanp], [`Impôt (${nf.format(imp)} % du brut)`, impot]]};
    },
    qc(ga){
      // RRQ : 6,4 % entre 3 500 $ et 71 300 $ (dont 1 % « supplémentaire », déductible), RRQ2 : 4 % entre 71 300 $ et 81 200 $
      const rrq = Math.max(0, Math.min(ga, 71300) - 3500) * .064, rrqSup = rrq / 6.4, rrq2 = Math.max(0, Math.min(ga, 81200) - 71300) * .04;
      const ae = Math.min(ga, 65700) * .0131, rqap = Math.min(ga, 98000) * .00494;
      const ded = rrqSup + rrq2;
      // Fédéral : taux de 15 % ramené à 14 % au 1er juillet 2025, donc 14,5 % sur l'année ; crédits à 14,5 % ; abattement du Québec de 16,5 %
      const fedInc = Math.max(0, ga - ded), mpb = 16129 - Math.min(1, Math.max(0, (fedInc - 177882) / (253414 - 177882))) * (16129 - 14538);
      const fedCred = (mpb + Math.min(1471, ga) + (rrq - rrqSup) + ae + rqap) * .145;
      const fed = Math.max(0, bareme(fedInc, QC_FED) - fedCred) * (1 - .165);
      // Québec : déduction pour travailleur (6 % du salaire, au plus 1 420 $), montant personnel de base 18 571 $ à 14 %
      const qcInc = Math.max(0, ga - ded - Math.min(ga * .06, 1420)), prov = Math.max(0, bareme(qcInc, QC_PROV) - 18571 * .14);
      return {soc: rrq + rrq2 + ae + rqap, tax: fed + prov, lines: [["RRQ (régime de rentes du Québec)", rrq + rrq2], ["Assurance-emploi (1,31 %)", ae], ["RQAP (0,494 %)", rqap], ["Impôt fédéral (après abattement)", fed], ["Impôt du Québec", prov]]};
    }
  };
  const CUR = {fr: "€", be: "€", ch: "CHF", qc: "$"};
  // Libellés qui changent selon le pays (le texte français d'origine est gardé pour revenir à la France)
  const LAB = {
    be: {ln: "Net imposable (après ONSS)", hn: "Horaire imposable", mn: "Mensuel imposable", an: "Annuel imposable", lp: "Net en poche", hp: "Horaire en poche", mp: "Mensuel en poche", ap: "Annuel en poche", head: "Ton net en poche", unit: "€ net", per: "Par mois (en moyenne)"},
    ch: {ln: "Net après cotisations", lp: "Net après impôt", head: "Après l'impôt", unit: "CHF net"},
    qc: {ln: "Net avant impôts", hn: "Horaire avant impôts", mn: "Mensuel avant impôts", an: "Annuel avant impôts", lp: "Net après impôts", hp: "Horaire après impôts", mp: "Mensuel après impôts", ap: "Annuel après impôts", head: "Après les impôts", unit: "$ net"}
  };
  $$("[data-l]").forEach(el => el.dataset.fr = el.textContent);
  const money = x => (show(x) || "0") + " " + CUR[pays];
  function calcX(){
    const P = pay[pays], hm = hours[pays] * 52 / 12, m = MODEL[pays];
    const res = ga => { const r = m(ga); return {an: ga - r.soc, ap: ga - r.soc - r.tax}; };
    // Une case nette remplie : on cherche le brut qui donne ce net (dichotomie)
    const {k, v} = base, toMonth = {h: hm, m: 1, a: 1 / P}[k[0]] || 0, target = v * toMonth * P;
    let ga = 0;
    if (k[1] === "b") ga = target;
    else if (k[1] === "n" || k[1] === "p") { let a = 0, b = 1e8; for (let i = 0; i < 80; i++) { const g = (a + b) / 2; if (res(g)[k[1] === "n" ? "an" : "ap"] < target) a = g; else b = g; } ga = target ? (a + b) / 2 : 0; }
    const r = m(ga), an = ga - r.soc, ap = an - r.tax, mb = ga / P, mn = an / P, mp = ap / P;
    const out = {hb: mb / hm, mb, ab: ga, hn: mn / hm, mn, an, hp: mp / hm, mp, ap};
    Object.entries(out).forEach(([id, x]) => { if (id !== k || document.activeElement !== $("#" + id)) $("#" + id).value = ga ? show(x) : ""; });
    $("#pmn").textContent = show(mp) || "0"; $("#pan").textContent = show(ap) || "0";
    $("#rate").textContent = ga ? `−${Math.round(r.soc / ga * 100)} %` : "";
    $("#hoursv").textContent = nf.format(hours[pays]) + " h"; $("#lppv").textContent = nf.format(lpp) + " %"; $("#impv").textContent = nf.format(imp) + " %";
    $("#lines").innerHTML = r.lines.map(([l, x]) => `<p class="sal-line"><span>${l}</span><b>${money(ga ? x / P : 0)}</b></p>`).join("") + `<p class="sal-line"><span><b>En tout</b></span><b>${money(ga ? (ga - ap) / P : 0)}</b></p>`;
    $("#linesh").textContent = P === 12 ? "Ce qui part, par mois" : `Ce qui part, par mois (moyenne sur ${nf.format(P)} paiements)`;
    const each = P === 12 ? "par mois" : `par mois (${nf.format(P)} paiements par an)`;
    $("#sum").textContent = !ga ? "Remplis une case : les autres se calculent toutes seules." :
      pays === "be" ? `${show(mb)} € brut ${each}, c'est environ ${show(mn)} € net imposable après l'ONSS, et ${show(mp)} € net en poche après le précompte (en moyenne).` :
      pays === "ch" ? `${show(mb)} CHF brut ${each}, c'est environ ${show(mn)} CHF net après les cotisations, et ${show(mp)} CHF après l'impôt.` :
      `${show(ga)} $ brut par an (${show(mb)} $ par mois), c'est environ ${show(mn)} $ par mois après les cotisations, et ${show(mp)} $ après les impôts.`;
  }
  const calc = () => pays === "fr" ? calcFR() : calcX();

  function setPays(p, user){
    pays = p;
    $$("[data-pays]").forEach(el => el.hidden = !el.dataset.pays.split(" ").includes(p));
    $$("[data-pays-set]").forEach(x => x.setAttribute("aria-pressed", x.dataset.paysSet === p));
    $$("[data-l]").forEach(el => el.textContent = (LAB[p] || {})[el.dataset.l] ?? el.dataset.fr);
    if (p !== "fr") {
      $("#hours").value = hours[p];
      $$(`[data-pays="${p}"] [data-pay]`).forEach(x => x.setAttribute("aria-pressed", +x.dataset.pay === pay[p]));
    }
    fill();
    if (user) {
      const u = new URL(location.href);
      if (p === "fr") u.searchParams.delete("pays"); else u.searchParams.set("pays", p);
      if (/pays=/.test(u.hash)) u.hash = "";
      try { history.replaceState(null, "", u); } catch {}
      try { localStorage.setItem("cacolle-pays", p); } catch {}
      stat("salaire-pays", {pays: p});
    }
    calc();
  }

  document.addEventListener("input", e => {
    const t = e.target;
    if (t.matches(".money")) { base = {k: t.id, v: num(t.value)}; return calc(); }
    if (t.id === "time") { time = +t.value; return calc(); }
    if (t.id === "pas") { pas = +t.value; pasAuto = false; $("#pasauto").hidden = true; return calc(); }
    if (t.id === "hours") { hours[pays] = +t.value; return calc(); }
    if (t.id === "lpp") { lpp = +t.value; return calc(); }
    if (t.id === "imp") { imp = +t.value; return calc(); }
  });
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-st], [data-mo], [data-pay], [data-pays-set]"); if (!b) return;
    if (b.dataset.paysSet) return b.dataset.paysSet !== pays && setPays(b.dataset.paysSet, true);
    if (b.dataset.st) { st = b.dataset.st; $$("[data-st]").forEach(x => x.setAttribute("aria-pressed", x === b)); stat("salaire-statut", {st}); }
    if (b.dataset.mo) { months = +b.dataset.mo; $$("[data-mo]").forEach(x => x.setAttribute("aria-pressed", x === b)); }
    if (b.dataset.pay) { pay[pays] = +b.dataset.pay; $$(`[data-pays="${pays}"] [data-pay]`).forEach(x => x.setAttribute("aria-pressed", x === b)); }
    calc();
  });
  clearBtns.forEach(c => c.addEventListener("click", () => { base = {k: "mb", v: 0}; pasAuto = true; $("#pasauto").hidden = false; $$(".money").forEach(i => i.value = ""); calc(); }));
  const q = new URLSearchParams(location.search).get("s"), p = q && parseSalary(q);
  if (p) base = {k: p.u === "h" ? "hb" : p.u === "a" ? "ab" : "mb", v: /net/.test(fold(q)) ? 0 : p.v};
  if (p && /net/.test(fold(q))) base = {k: p.u === "h" ? "hn" : p.u === "a" ? "an" : "mn", v: p.v};
  if (q) $("#from").hidden = false, $("#fromv").textContent = q;
  setPays(pays, false);
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
