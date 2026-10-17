// Interface de Ça colle ? : 5 étapes (offre, CV, résultat, améliorer, lettre), plusieurs offres, session gardée
// sur l'appareil si on le choisit. Le calcul est dans js/moteur.js, la lecture des fichiers dans js/lecteur.js,
// les exports Word / PDF dans js/export.js.
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const MIN_WORDS = 25, STORE = typeof EN !== "undefined" && EN ? "cacolle-en-v1" : "cacolle-v1";
let step = 1, filter = "all", results = [], cvReady = false;
let cvFile = {name: "", info: "", conf: 0};
let me = {name: "", contact: ""};          // pour la lettre, commun à toutes les offres
let offers = [], cur = null;               // offres comparées au même CV

const words = t => t.trim() ? t.trim().split(/\s+/).length : 0;
const isLink = t => /^\s*(https?:\/\/|www\.)\S+\s*$/i.test(t);
const offerOk = () => words($("#offer").value) >= MIN_WORDS && !isLink($("#offer").value);
const canReach = n => n === 1 || (n === 2 && offerOk()) || (n >= 3 && offerOk() && cvReady);
const plural = (n, w) => `${n} ${w}${n > 1 ? "s" : ""}`;
const LANG = tr("fr", "en");

function toast(t){ const el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => el.hidden = true, 2200); }

/* ---------- Offres ---------- */
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const titleOf = t => { const l = (t.split("\n").find(x => x.trim()) || tr("Offre", "Offer")).trim().replace(/\s*\((exemple fictif|sample offer)\)/i, ""); return l.length > 60 ? l.slice(0, 57) + "…" : l; };
function newOffer(text = ""){ cur = {id: newId(), text, fixes: {}, over: {}, letter: {}}; fixes = cur.fixes; over = cur.over; offers.push(cur); }
function syncOffer(){
  if (!cur) newOffer();
  cur.text = $("#offer").value; cur.title = titleOf(cur.text); cur.fixes = fixes;
  if (cvReady && offerOk()) cur.score = scoreOf(analyse(cur.text));
}
function loadOffer(id){
  syncOffer();
  const o = offers.find(x => x.id === id); if (!o) return;
  cur = o; fixes = o.fixes; over = o.over = o.over || {}; $("#offer").value = o.text; gates();
  go(canReach(3) ? 3 : 1);
}
function renderOffers(){
  const list = offers.filter(o => o.text && o.text.trim());
  $("#offersbox").hidden = list.length < 1 || !cvReady;
  $("#offers").innerHTML = list.map(o => `<li class="${o === cur ? "on" : ""}">
    <button type="button" data-offer="${o.id}"><b>${esc(o.title || titleOf(o.text))}</b>${o.score != null ? `<span class="score">${o.score} %</span>` : ""}</button>
    <button type="button" class="del" data-deloffer="${o.id}" aria-label="${tr("Retirer cette offre", "Remove this offer")}">✕</button></li>`).join("");
}

/* ---------- Onglets et navigation : on n'avance que quand l'étape d'avant est remplie ---------- */
function gates(){
  const v = $("#offer").value, w = words(v);
  $("#next1").disabled = !offerOk();
  $("#linkhelp").hidden = !isLink(v);
  $("#hint1").textContent = isLink(v) ? tr("Colle le texte de l'annonce, pas son lien.", "Paste the text of the ad, not its link.") : w === 0 ? tr("Colle au moins quelques lignes de l'annonce.", "Paste at least a few lines of the ad.") : offerOk() ? tr(`${w} mots, c'est bon.`, `${w} words, that's fine.`) : tr(`${w} mots : colle l'annonce en entier, il en faut au moins ${MIN_WORDS}.`, `${w} words: paste the whole ad, at least ${MIN_WORDS} are needed.`);
  $("#next2").disabled = !cvReady;
  $$(".tab").forEach(t => {
    const n = +t.dataset.step;
    t.disabled = !canReach(n);
    t.title = t.disabled ? (n === 2 ? tr("Colle d'abord l'offre", "Paste the offer first") : tr("Ajoute d'abord l'offre et ton CV", "Add the offer and your CV first")) : "";
    t.classList.toggle("done", (n === 1 && offerOk()) || (n === 2 && cvReady));
  });
}
function go(n){
  if (!canReach(n)) return;
  if (typeof hideTrack === "function") hideTrack();
  step = n;
  if (n >= 2) syncOffer();
  results = analyse($("#offer").value);
  $$(".tab").forEach(t => t.setAttribute("aria-selected", +t.dataset.step === n));
  $$("[data-p]").forEach(p => p.hidden = +p.dataset.p !== n);
  $$("[data-for]").forEach(p => p.hidden = +p.dataset.for !== n || (n === 2 && !cvReady));
  if (n === 1) renderOffers();
  if (n === 3) renderResult();
  if (n === 4) renderRewrite();
  if (n === 5) renderLetterForm();
  gates(); save();
  if (window.scrollY > 120) $(".top").scrollIntoView({behavior: "smooth"});
}

/* ---------- Étape 3 : le résultat ---------- */
const HELP = EN ? {
  mid: "It is in your CV, but with no example. Add a real fact: a number, a place, a length of time.",
  no: "The offer asks for it. If you have done it, even in a summer job, internship or volunteering, add it.",
  s: "The offer asks for it. Show it with a fact in one of your jobs, not just a word."
} : {
  mid: "C'est dans ton CV, mais sans exemple. Ajoute un fait concret : un chiffre, un lieu, une durée.",
  no: "L'offre le demande. Si tu l'as déjà fait, même en job d'été, en stage ou en bénévolat, ajoute-le.",
  s: "L'offre le demande. Montre-le par un fait dans une expérience, pas seulement par un mot."
};
const Y = n => tr(plural(n, "an"), plural(n, "year"));
// Extrait du CV où le point est trouvé (dans les expériences seulement si onlyExp)
function excerpt(r, onlyExp){
  const P = r.proof;
  if (P && (!onlyExp || P.exp)) {
    if (P.t.length <= 150) return P.t;
    let a = Math.max(0, P.i - 50), b = Math.min(P.t.length, P.i + P.n + 70);
    if (a > 0) { const sp = P.t.indexOf(" ", a); a = sp >= 0 && sp < P.i ? sp + 1 : a; }
    if (b < P.t.length) { const sp = P.t.lastIndexOf(" ", b); b = sp > P.i + P.n ? sp : b; }
    return (a ? "…" : "") + P.t.slice(a, b).trim() + (b < P.t.length ? "…" : "");
  }
  const lines = cvLines(false).filter(l => l.raw && (!onlyExp || l.exp));
  let l, m;
  if (r.re) { l = lines.find(l => r.re.test(fold(l.raw))); if (l) m = fold(l.raw).match(r.re); }
  else if (r.tk) { for (const w of r.tk) { l = lines.find(x => fold(x.raw).includes(w)); if (l) { const i = fold(l.raw).indexOf(w); m = {index: i, 0: w}; break; } } }
  if (!l || !m) return "";
  const a = Math.max(0, m.index - 45), b = Math.min(l.raw.length, m.index + m[0].length + 45);
  return (a ? "…" : "") + l.raw.slice(a, b).trim() + (b < l.raw.length ? "…" : "");
}
function explain(r, s){
  if (r.fixedNow) return tr("Ajouté à ton CV à l'étape 4.", "Added to your CV in step 4.");
  if (r.type === "y") return s === "ok" ? tr(`Ton CV montre environ ${Y(r.have)} d'expérience.`, `Your CV shows about ${Y(r.have)} of experience.`)
    : s === "mid" ? tr("Je ne trouve pas de dates dans ton CV. Ajoute les années de chaque poste (ex : 2022 - 2025) pour qu'on les compte.", "I can't find dates in your CV. Add the years of each job (e.g. 2022 - 2025) so they can be counted.")
    : tr(`Ton CV montre environ ${Y(r.have)}. Pense à ajouter tes stages, jobs d'été, intérim ou bénévolat.`, `Your CV shows about ${Y(r.have)}. Remember to add internships, summer jobs, temp work or volunteering.`);
  if (s === "no") return r.type === "s" ? HELP.s : HELP.no;
  const x = excerpt(r, s === "ok" && r.type !== "l" && r.type !== "h" && r.type !== "d");
  const q = x => tr(`« ${esc(x)} »`, `"${esc(x)}"`);
  if (s === "ok") return x ? tr("Prouvé dans ton CV : ", "Proven in your CV: ") + `<span class="proof">${q(x)}</span>` : tr("C'est dans ton CV.", "It is in your CV.");
  return HELP.mid + (x ? tr(" Trouvé ici : ", " Found here: ") + `<span class="proof">${q(x)}</span>` : "");
}
const tagOf = r => r.prio === "must" ? `<i class="tag must">${tr("Indispensable", "Essential")}</i>` : r.prio === "nice" ? `<i class="tag nice">${tr("Un plus", "A plus")}</i>` : "";
const urgency = r => (r.st === "no" ? 0 : 2) + (r.prio === "must" ? 0 : r.prio === "nice" ? 3 : 1);

// Détail d'un tampon : ce qui a été trouvé dans l'offre et dans le CV
const mark = (t, i, n) => n ? esc(t.slice(0, i)) + "<mark>" + esc(t.substr(i, n)) + "</mark>" + esc(t.slice(i + n)) : esc(t);
function whyHTML(r){
  const P = r.proof, out = [];
  if (r.offerCtx) {
    const j = r.offerWord ? fold(r.offerCtx).indexOf(fold(r.offerWord)) : -1;
    out.push(`<p><b>${tr("Dans l'offre :", "In the offer:")}</b> ${tr("« ", "\"")}${j >= 0 ? mark(r.offerCtx, j, r.offerWord.length) : esc(r.offerCtx)}${tr(" »", "\"")}</p>`);
  }
  if (r.type === "y") out.push(`<p><b>${tr("Dans ton CV :", "In your CV:")}</b> ${r.have === null ? tr("je n'ai pas trouvé de dates (ex : 2019 - 2023).", "I found no dates (e.g. 2019 - 2023).") : tr(`les dates de tes postes font environ ${Y(r.have)}.`, `the dates of your jobs add up to about ${Y(r.have)}.`)}</p>`);
  else {
    if (r.type === "x") out.push(tr(`<p><b>Mots cherchés :</b> les mots importants de cette ligne et des mots proches. ${r.found.length} sur ${r.tk.length} trouvés dans ton CV (il en faut 6 sur 10).</p>`, `<p><b>Words searched:</b> the key words of this line and similar words. ${r.found.length} of ${r.tk.length} found in your CV (6 out of 10 are needed).</p>`));
    if (P) {
      const a = Math.max(0, P.i - 60), b = Math.min(P.t.length, P.i + P.n + 80), t = P.t.slice(a, b);
      out.push(`<p><b>${tr("Dans ton CV :", "In your CV:")}</b> ${tr("« ", "\"")}${a ? "…" : ""}${mark(t, P.i - a, P.n)}${b < P.t.length ? "…" : ""}${tr(" »", "\"")}${P.exp ? "" : ` <small>${tr("(pas dans une expérience, donc pas encore prouvé)", "(not in a job, so not proven yet)")}</small>`}</p>`);
    } else out.push(`<p><b>${tr("Dans ton CV :", "In your CV:")}</b> ${tr("aucun mot proche trouvé.", "no similar word found.")}</p>`);
  }
  if (r.manual) out.push(tr(`<p><b>Tu as corrigé ce tampon.</b> Le calcul disait : ${LABEL[r.auto]}.</p>`, `<p><b>You corrected this stamp.</b> The analysis said: ${LABEL[r.auto]}.</p>`));
  return out.join("");
}
function renderResult(){
  const c = countOf(results), p = scoreOf(results), t = results.length;
  $("#pct").textContent = p;
  $("#verdict").textContent = !t ? tr("à vérifier", "to check") : p >= 80 ? tr("ça colle !", "it fits!") : p >= 50 ? tr("ça colle presque", "almost there") : tr("à retravailler", "needs work");
  const must = results.filter(r => r.prio === "must" && r.st === "no").length;
  $("#sum").textContent = !t ? tr("Je n'ai reconnu aucun point dans cette offre.", "I did not recognise any point in this offer.") : EN
    ? `The offer asks for ${plural(t, "thing")}. Your CV proves ${c.ok}, mentions ${c.mid} without an example and says nothing about ${c.no}.` + (must ? ` Careful: ${must > 1 ? `${must} essential points are missing` : "one essential point is missing"}.` : "")
    : `L'offre demande ${plural(t, "chose")}. Ton CV en prouve ${c.ok}, en cite ${c.mid} sans exemple et n'en parle pas pour ${c.no}.` + (must ? ` Attention : ${must > 1 ? `${must} points indispensables manquent` : "un point indispensable manque"}.` : "");
  $("#n-all").textContent = t; ["ok", "mid", "no"].forEach(s => $("#n-" + s).textContent = c[s]);

  const todo = results.filter(r => r.st !== "ok").sort((a, b) => urgency(a) - urgency(b)).slice(0, 3);
  $("#prio").innerHTML = !t ? `<p>${tr("Rien à corriger pour l'instant.", "Nothing to fix for now.")}</p>`
    : todo.length ? `<ul class="prio-list">${todo.map(r => `<li><b>${esc(r.k)}</b><small>${r.st === "no" ? tr("absent de ton CV", "missing from your CV") : tr("à prouver avec un exemple", "needs an example")}${r.prio === "must" ? tr(" · indispensable", " · essential") : ""}</small>${r.fix ? `<button class="btn small" data-fix="${esc(r.k)}">${tr("Corriger", "Fix")}</button>` : ""}</li>`).join("")}</ul>
      <button class="btn wide" data-go="4">${tr("Améliorer mon CV →", "Improve my CV →")}</button>`
    : `<p><b>${tr("Rien d'urgent.", "Nothing urgent.")}</b> ${tr("Ton CV couvre tout ce que demande l'offre.", "Your CV covers everything the offer asks for.")}</p><button class="btn wide" data-go="5">${tr("Préparer ma lettre →", "Write my letter →")}</button>`;

  const groups = ["no", "mid", "ok"].filter(s => filter === "all" || filter === s);
  const notice = t < 4 ? `<p class="notice">${tr(`Je n'ai repéré que ${plural(t, "point")} dans cette offre. Vérifie que tu as collé l'annonce en entier, avec les missions et le profil recherché.`, `I only found ${plural(t, "point")} in this offer. Check that you pasted the whole ad, with the tasks and the profile wanted.`)}</p>` : "";
  const vocab = results.filter(r => r.vocab);
  const ats = atsCheck($("#cvraw").value, cvFile.info), atsOk = ats.filter(a => a.ok).length;
  $("#groups").innerHTML = adHTML(adCheck($("#offer").value)) + notice + groups.map(s => {
    const list = results.filter(r => r.st === s).sort((a, b) => urgency(a) - urgency(b)); if (!list.length) return "";
    return `<section class="group"><h2 class="section-title" style="--k: ${s === "ok" ? "var(--green)" : s === "mid" ? "var(--yellow)" : "var(--pink)"}">${LABEL[s]} (${list.length})</h2><div class="points">${list.map(r => `
      <article class="point">
        <div class="point-h"><i class="stamp ${s}">${LABEL[s]}</i>${tagOf(r)}${r.manual ? `<i class="tag hand">${tr("Corrigé par toi", "Corrected by you")}</i>` : ""}</div>
        <h3>${esc(r.k)}</h3>
        <p>${explain(r, s)}</p>
        ${r.vocab ? `<p class="vocab">${tr(`Ton CV dit « ${esc(r.vocab.cv)} », l'offre dit « ${esc(r.vocab.offer)} ».`, `Your CV says "${esc(r.vocab.cv)}", the offer says "${esc(r.vocab.offer)}".`)}</p>` : ""}
        ${s !== "ok" && r.fix ? `<button class="btn small" data-fix="${esc(r.k)}">${tr("Corriger ce point", "Fix this point")}</button>` : ""}
        <details class="why"><summary>${tr("Pourquoi ce tampon ?", "Why this stamp?")}</summary>${whyHTML(r)}
          <div class="over"><span>${tr("Ce tampon est faux ?", "Is this stamp wrong?")}</span>${["ok", "mid", "no"].filter(v => v !== s).map(v => `<button type="button" class="btn light small" data-over="${esc(r.k)}" data-v="${v}">${LABEL[v]}</button>`).join("")}<button type="button" class="btn light small" data-over="${esc(r.k)}" data-v="skip">${tr("Pas une vraie demande", "Not a real requirement")}</button>${r.manual ? `<button type="button" class="btn ghost small" data-over="${esc(r.k)}" data-v="">${tr("Revenir au calcul", "Back to the analysis")}</button>` : ""}</div>
          <p class="hint">${tr("Si c'est dans ton CV avec d'autres mots, corrige le tampon. Si ce n'est pas dans ton CV, ajoute-le plutôt à l'étape 4.", "If it is in your CV in other words, correct the stamp. If it is not in your CV, add it in step 4 instead.")}</p>
        </details>
      </article>`).join("")}</div></section>`;
  }).join("")
  + (skipped.length ? `<section class="group"><h2 class="section-title" style="--k: #fff">${tr("Points retirés", "Removed points")} (${skipped.length})</h2>
      <ul class="skipped">${skipped.map(r => `<li><span>${esc(r.k)}</span><button type="button" class="btn light small" data-over="${esc(r.k)}" data-v="">${tr("Remettre", "Put back")}</button></li>`).join("")}</ul></section>` : "")
  + (vocab.length ? `<section class="group"><h2 class="section-title" style="--k: var(--blue)">${tr("Les mots de l'annonce", "The ad's own words")}</h2>
      <p class="hint">${tr("Les recruteurs et leurs logiciels cherchent les mots exacts de l'offre. Reprends-les dans ton CV quand c'est vrai.", "Recruiters and their software look for the exact words of the offer. Use them in your CV when they are true.")}</p>
      <ul class="words">${vocab.map(r => `<li><span class="w-cv">${esc(r.vocab.cv)}</span><span aria-hidden="true">→</span><span class="w-offer">${esc(r.vocab.offer)}</span></li>`).join("")}</ul></section>` : "")
  + `<section class="group"><h2 class="section-title" style="--k: var(--orange)">${tr("Test robot recruteur", "Recruiter robot test")} · ${atsOk} ${tr("sur", "of")} ${ats.length}</h2>
      <p class="hint">${tr("Beaucoup d'entreprises trient les CV avec un logiciel avant qu'une personne les lise. Voici ce qui peut le gêner.", "Many employers sort CVs with software before a person reads them. Here is what can trip it up.")}</p>
      <ul class="ats">${ats.map(a => `<li class="${a.ok ? "ok" : "ko"}"><b><span aria-hidden="true">${a.ok ? "✓" : "✕"}</span> ${esc(a.label)}</b>${a.ok ? "" : `<span>${esc(a.help)}</span>`}<span class="sr-only">${a.ok ? tr(" : bon", ": good") : tr(" : à corriger", ": to fix")}</span></li>`).join("")}</ul></section>`;
}

// L'annonce en bref : infos clés, infos absentes, signaux d'arnaque
function adHTML(ad){
  const red = ad.flags.filter(f => f.level === "red");
  return `<section class="group adcheck"><h2 class="section-title" style="--k: ${red.length ? "var(--pink)" : "var(--blue)"}">${tr("L'annonce en bref", "The ad at a glance")}</h2>
    ${ad.flags.length ? `<div class="alert ${red.length ? "red" : "amber"}" role="note"><b>${red.length ? tr("Attention, cette annonce ressemble à une arnaque.", "Careful, this ad looks like a scam.") : tr("Quelques points à vérifier avant de postuler.", "A few things to check before applying.")}</b>
      <ul>${ad.flags.map(f => `<li class="${f.level}"><b>${esc(f.label)}</b> <q>${esc(f.v)}</q><span>${esc(f.why)}</span></li>`).join("")}</ul>
      ${red.length ? `<p>${tr("Ne paie jamais pour postuler et ne donne pas tes papiers avant un contrat signé. En cas de doute, signale l'annonce au site qui la publie.", "Never pay to apply and do not hand over your papers before a signed contract. If in doubt, report the ad to the site that posted it.")}</p>` : ""}</div>` : ""}
    <ul class="facts">${ad.facts.map(f => `<li><small>${esc(f.label)}</small><b>${esc(f.v)}</b></li>`).join("")}${ad.missing.map(f => `<li class="miss"><small>${esc(f.label)}</small><b>${tr("pas indiqué", "not given")}</b></li>`).join("")}</ul>
    ${ad.missing.length ? `<p class="hint">${tr("Ce qui n'est pas écrit, demande-le avant ou pendant l'entretien : c'est normal de poser la question.", "Whatever is not written, ask about it before or during the interview: it is normal to ask.")}</p>` : ""}</section>`;
}

/* ---------- Étape 4 : améliorer le CV ---------- */
function ensureFix(r){
  const f = fixes[r.k];
  if (!f) fixes[r.k] = {vals: {}, state: r.fix.ask ? "open" : "yes", fix: r.fix};
  else if (f.state !== "accepted" && f.state !== "skipped") f.fix = r.fix;
  return fixes[r.k];
}
const whereOf = line => !line ? tr("tes compétences", "your skills") : line.exp ? tr("ton expérience : ", "your job: ") + line.t.split(/[,:(]/)[0].slice(0, 60) : line.kind === "edu" ? tr("ta formation", "your education") : tr("tes compétences", "your skills");
const READY = () => tr("Prêt.", "Ready."), FILL = () => tr("Remplis les cases jaunes.", "Fill in the yellow boxes.");
function renderRewrite(){
  const list = results.filter(r => r.fix && (r.st !== "ok" || r.fixedNow)).sort((a, b) => urgency(a) - urgency(b));
  $("#sugs").innerHTML = list.map(r => {
    const f = ensureFix(r), fix = f.fix, line = CV.find(l => l.id === targetId(fix)); let i = 0;
    const blanks = esc(fix.tpl).replace(/\{([^}]+)\}/g, (m, ph) => { const j = i++; return `<input class="blank" data-k="${esc(r.k)}" data-i="${j}" placeholder="${esc(ph)}" value="${esc(f.vals[j] || "")}" size="${Math.max(8, Math.min(40, ph.length - 4))}" aria-label="${esc(ph)}">`; });
    let body;
    if (f.state === "open") body = `<div class="ask">${esc(fix.ask)} <button class="btn small" data-yes="${esc(r.k)}">${tr("Oui", "Yes")}</button><button class="btn light small" data-no="${esc(r.k)}">${tr("Non", "No")}</button></div>`;
    else if (f.state === "skipped") body = `<p>${esc(fix.nope || tr("Point laissé de côté.", "Point set aside."))}</p><div class="sug-a"><button class="btn light small" data-undo="${esc(r.k)}">${tr("Revenir sur ce point", "Go back to this point")}</button></div>`;
    else body = `${fix.why ? `<p>${esc(fix.why)}</p>` : ""}
      <span class="where">${tr("Dans", "In")} ${esc(whereOf(line))}</span>
      <div class="sentence">${fix.find ? `<span class="old">${esc(fix.find)}</span> → ` : "… "}${blanks}</div>
      <div class="sug-a">${f.state === "accepted"
        ? `<i class="stamp ok">${tr("Ajouté", "Added")}</i><button class="btn light small" data-undo="${esc(r.k)}">${tr("Retirer", "Remove")}</button>`
        : `<button class="btn small" data-add="${esc(r.k)}" ${filled(r.k) ? "" : "disabled"}>${tr("Ajouter à mon CV", "Add to my CV")}</button><small>${filled(r.k) ? READY() : FILL()}</small>`}</div>`;
    return `<article class="sug ${f.state === "accepted" ? "accepted" : f.state === "skipped" ? "skipped" : ""}">
      <div class="sug-h"><h3>${esc(r.k)}</h3><span class="point-h">${tagOf(r)}<i class="stamp ${r.fixedNow ? "ok" : r.st}">${r.fixedNow ? LABEL.ok : LABEL[r.st]}</i></span></div>${body}</article>`;
  }).join("") || `<p class="notice">${tr("Rien à améliorer pour cette offre : ton CV couvre déjà tout ce qu'on sait repérer.", "Nothing to improve for this offer: your CV already covers everything we can detect.")}</p>`;
  const p = scoreOf(results), c = countOf(results);
  $("#score4").textContent = p + " %"; $("#meter4").style.width = p + "%";
  $("#score4txt").textContent = tr(`${c.ok} point${c.ok > 1 ? "s" : ""} sur ${results.length} prouvé${c.ok > 1 ? "s" : ""} dans ton CV.`, `${c.ok} of ${results.length} points proven in your CV.`);
  $("#cv4").innerHTML = cvHTML(true);
  renderReview();
}
// Relecture : fautes fréquentes (corrigeables en un clic), verbes faibles, phrases longues, chiffres
function renderReview(){
  const list = cvCheck($("#cvraw").value), box = $("#review");
  if (!box) return;
  box.innerHTML = `<h2 class="section-title" style="--k: var(--yellow)">${tr("Relecture du CV", "CV proofreading")}${list.length ? ` · ${list.length}` : ""}</h2>`
    + (list.length ? `<ul class="review">${list.map(c => `<li class="${c.type}"><i class="tag">${{typo: tr("Faute", "Typo"), weak: tr("Verbe faible", "Weak verb"), long: tr("Trop long", "Too long"), nonum: tr("Sans chiffre", "No number"), style: tr("Style", "Style")}[c.type]}</i>
        <span>${esc(c.msg)}${c.line && c.type !== "typo" ? `<small>${tr("« ", "\"")}${esc(c.line.length > 140 ? c.line.slice(0, 140) + "…" : c.line)}${tr(" »", "\"")}</small>` : ""}</span>
        ${c.type === "typo" ? `<button type="button" class="btn small" data-typo="${esc(c.word)}" data-to="${esc(c.to)}">${tr("Corriger", "Fix")}</button>` : ""}</li>`).join("")}</ul>
        <p class="hint">${tr("Seules les fautes sont corrigées en un clic. Pour le reste, modifie le texte de ton CV à l'étape 2 (« Vérifier le texte lu »).", "Only typos are fixed in one click. For the rest, edit your CV text in step 2 (\"Check the text read\").")}</p>`
      : `<p class="hint">${tr("Rien à signaler : pas de faute courante, de verbe faible ni de phrase trop longue.", "Nothing to report: no common typo, weak verb or overlong sentence.")}</p>`);
}
const splitName = t => { const i = t.indexOf(" · "); return i > 0 ? [t.slice(0, i), t.slice(i + 3)] : [t, ""]; };
const cvHTML = withIns => cvLines(withIns).map(l => l.name ? (([n, r]) => `<div class="name">${esc(n)}</div>${r ? `<p>${esc(r)}</p>` : ""}`)(splitName(l.t)) : l.sec ? `<div class="sec">${esc(l.sec)}</div>` : `<p>${l.html}</p>`).join("");
const cvText = () => cvLines(false).map(l => l.name ? l.t : l.sec ? "\n" + l.sec.toUpperCase() : l.raw).join("\n").trim();
const refresh = () => { results = analyse($("#offer").value); renderRewrite(); save(); };
const personName = () => (CV.find(l => l.name)?.t || "").split(/\s[·|–-]\s|,|·/)[0].trim();
const fileBase = s => (s || "Mon").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w]+/g, "_").replace(/^_|_$/g, "");

/* ---------- Étape 5 : la lettre ---------- */
function prefillLetter(){
  const head = CV.find(l => l.name)?.t || "", all = $("#cvraw").value;
  if (!me.name) me.name = personName();
  const top = all.slice(0, 300), tel = top.match(/(\+33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/) || top.match(/(\+\d{1,3}\s?)?\(?0?\d{3,5}\)?[\s.-]?\d{3}[\s.-]?\d{3,4}/);
  if (!me.contact) me.contact = [all.match(/[\w.+-]+@[\w-]+\.[a-z.]{2,}/i)?.[0], tel?.[0]].filter(Boolean).join(" · ");
  const L = cur.letter;
  if (L.job === undefined) L.job = titleOf($("#offer").value).split(/\s+[–-]\s+/)[0].replace(/\s*\(h\s*\/\s*f\)|\s*h\s*\/\s*f\b/ig, "").trim();
  if (!L.strengths) L.strengths = results.filter(r => r.st === "ok" && r.type !== "y" && r.type !== "h").slice(0, 3).map(r => r.k);
  return head;
}
function renderLetterForm(){
  prefillLetter();
  const L = cur.letter;
  $("#l-name").value = me.name; $("#l-contact").value = me.contact;
  $("#l-company").value = L.company || ""; $("#l-job").value = L.job || ""; $("#l-why").value = L.why || ""; $("#l-when").value = L.when || "";
  const oks = results.filter(r => r.st === "ok" && r.type !== "y");
  $("#l-strengths").innerHTML = oks.length ? oks.map(r => `<label class="str"><input type="checkbox" data-str="${esc(r.k)}" ${L.strengths.includes(r.k) ? "checked" : ""}> <span><b>${esc(r.k)}</b><small>${esc(clip(excerpt(r, false)))}</small></span></label>`).join("")
    : `<p class="hint">${tr("Aucun point fort trouvé pour l'instant : améliore d'abord ton CV à l'étape 4.", "No strengths found yet: improve your CV in step 4 first.")}</p>`;
  renderLetter();
}
const sentence = t => { t = t.trim(); t = t.charAt(0).toUpperCase() + t.slice(1); return /[.!?…]$/.test(t) ? t : t + "."; };
const clip = t => t.replace(/^…\s*|\s*…$/g, "").replace(/^\(?\d{4}\s*[-–]\s*\d{4}\)\s*:?\s*/, "").replace(/\s*:\s*$/, "").trim();
function letterText(){
  const L = cur.letter, job = L.job || tr("[intitulé du poste]", "[job title]"), co = L.company || tr("[nom de l'entreprise]", "[company name]");
  // Les points forts prouvés par la même ligne du CV sont regroupés : « - Préparation de commandes, contrôle qualité : … »
  const groups = [];
  results.filter(r => L.strengths.includes(r.k) && r.st === "ok").forEach(r => {
    const x = clip(excerpt(r, false)), g = x && groups.find(g => g.x === x);
    if (g) g.k.push(/^.[a-zà-ÿ]/.test(r.k) ? r.k.charAt(0).toLowerCase() + r.k.slice(1) : r.k); else groups.push({k: [r.k], x});
  });
  const strong = groups.map(g => `- ${g.k.join(", ")}${g.x ? tr(" : ", ": ") + g.x : ""}`);
  if (EN) return [
    me.name || "[your name]", me.contact || "[your email and phone]", "",
    co, "Recruitment team", "",
    `Application for the position of ${job}`, "",
    "Dear Hiring Manager,", "",
    `I was very interested to see your offer for the position of ${job}${L.company ? " at " + L.company : ""}.${L.why ? " " + sentence(L.why) : " [why this job or company]"}`, "",
    ...(strong.length ? ["Here is what I can bring:", ...strong, ""] : []),
    `I am available ${L.when ? L.when.trim() : "soon"} and would be glad to meet you to talk about it.`, "",
    "Yours sincerely,", "",
    me.name || "[your name]"
  ].join("\n");
  return [
    me.name || "[ton nom]", me.contact || "[ton email et ton téléphone]", "",
    co, "À l'attention du service recrutement", "",
    `Objet : candidature au poste « ${job} »`, "",
    "Madame, Monsieur,", "",
    `Votre offre pour le poste « ${job} »${L.company ? " chez " + L.company : ""} a retenu toute mon attention.${L.why ? " " + sentence(L.why) : " [pourquoi ce poste ou cette entreprise]"}`, "",
    ...(strong.length ? ["Voici ce que je peux vous apporter :", ...strong, ""] : []),
    `Je suis disponible ${L.when ? L.when.trim() : "rapidement"} et je serais heureux·se de vous rencontrer pour en parler.`, "",
    "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.", "",
    me.name || "[ton nom]"
  ].join("\n");
}
const currentLetter = () => cur.letter.frozen ? cur.letter.text : letterText();
function renderLetter(){
  const L = cur.letter;
  $("#letter").hidden = !!L.frozen; $("#letteredit").hidden = !L.frozen;
  $("#l-edit").textContent = L.frozen ? tr("Revenir au modèle", "Back to the template") : tr("Modifier le texte", "Edit the text");
  if (L.frozen) { if ($("#letteredit").value !== L.text) $("#letteredit").value = L.text; return; }
  $("#letter").innerHTML = letterText().split("\n").map(l => l ? `<p>${esc(l).replace(/\[[^\]]+\]/g, m => `<mark class="miss">${m}</mark>`)}</p>` : `<p class="gap"></p>`).join("");
}

/* ---------- Exports ---------- */
function exportDocx(kind){
  if (kind === "cv") {
    const paras = cvLines(false).flatMap(l => l.name ? (([n, r]) => [{text: n, style: "title"}, ...(r ? [{text: r}] : [])])(splitName(l.t)) : l.sec ? {text: l.sec.toUpperCase(), style: "head"} : {text: l.raw});
    Export.download(Export.docx(paras), `CV_${fileBase(personName())}.docx`);
  } else {
    Export.download(Export.docx(currentLetter().split("\n").map(text => ({text}))), tr("Lettre_", "Cover_letter_") + `${fileBase(cur.letter.company || tr("motivation", "application"))}.docx`);
  }
  toast(tr("Fichier Word téléchargé", "Word file downloaded"));
}
function exportPdf(kind){
  const html = kind === "cv" ? `<div class="p-cv">${cvHTML(false)}</div>` : `<div class="p-letter">${currentLetter().split("\n").map(l => `<p>${esc(l) || "&nbsp;"}</p>`).join("")}</div>`;
  toast(tr("Choisis « Enregistrer en PDF »", "Choose \"Save as PDF\""));
  setTimeout(() => Export.printHTML(html), 300);
}
async function exportCopy(kind){
  toast(await Export.copy(kind === "cv" ? cvText() : currentLetter()) ? tr("Texte copié", "Text copied") : tr("Copie impossible : sélectionne le texte", "Copy failed: select the text"));
}

/* ---------- Bilan à partager (conseiller, proche, coach) ---------- */
// Structure commune : [{h: titre} | {t: texte, b: gras}] → Word, PDF ou texte
function summaryParts(){
  const c = countOf(results), p = scoreOf(results), ad = adCheck($("#offer").value), out = [];
  const list = s => results.filter(r => r.st === s).sort((a, b) => urgency(a) - urgency(b)).map(r => ({t: "- " + r.k + (r.prio === "must" ? tr(" (indispensable)", " (essential)") : "") + (s === "ok" && r.type !== "y" && excerpt(r, false) ? tr(" : ", ": ") + clip(excerpt(r, false)) : "")}));
  out.push({title: tr("Bilan Ça colle ?", "Ça colle? summary")});
  out.push({t: (personName() ? personName() + " · " : "") + titleOf($("#offer").value) + " · " + new Date().toLocaleDateString(tr("fr-FR", "en-GB"))});
  out.push({t: tr(`Score : ${p} % (${$("#verdict").textContent}). ${c.ok} point${c.ok > 1 ? "s" : ""} prouvé${c.ok > 1 ? "s" : ""}, ${c.mid} à préciser, ${c.no} absent${c.no > 1 ? "s" : ""} du CV, sur ${results.length}.`, `Score: ${p}% (${$("#verdict").textContent}). ${c.ok} proven, ${c.mid} to clarify, ${c.no} missing from the CV, out of ${results.length}.`), b: true});
  if (cur && cur.app) out.push({t: tr("Suivi : ", "Tracking: ") + stLabel(cur.app.status) + (cur.app.appliedDate ? tr(" · envoyée le ", " · sent on ") + fmtDate(cur.app.appliedDate) : "")});
  [["no", tr("Pas dans le CV", "Not in the CV")], ["mid", tr("À préciser avec un exemple", "Needs an example")], ["ok", tr("Ça colle", "It fits")]].forEach(([s, h]) => { const l = list(s); if (l.length) out.push({h: `${h} (${l.length})`}, ...l); });
  out.push({h: tr("L'annonce", "The ad")}, ...ad.facts.map(f => ({t: `- ${f.label}${tr(" : ", ": ")}${f.v}`})), ...ad.missing.map(f => ({t: `- ${f.label}${tr(" : pas indiqué", ": not given")}`})), ...ad.flags.map(f => ({t: `- ⚠ ${f.label} (« ${f.v} »)`})));
  const ats = atsCheck($("#cvraw").value, cvFile.info).filter(a => !a.ok);
  if (ats.length) out.push({h: tr("Test robot recruteur : à corriger", "Recruiter robot test: to fix")}, ...ats.map(a => ({t: `- ${a.label}${tr(" : ", ": ")}${a.help}`})));
  const added = Object.values(fixes).filter(f => f.state === "accepted").map(f => ({t: "- " + fillTpl(f.fix, f.vals)}));
  if (added.length) out.push({h: tr("Ajouté au CV avec l'app", "Added to the CV with the app")}, ...added);
  const rv = cvCheck($("#cvraw").value);
  if (rv.length) out.push({h: tr("Relecture du CV", "CV proofreading")}, ...rv.map(r => ({t: "- " + r.msg})));
  out.push({t: tr("Fait avec Ça colle ? (ca-colle.pissits.com) : l'analyse se fait sur l'appareil, rien n'est envoyé.", "Made with Ça colle? (ca-colle.pissits.com): the analysis runs on the device, nothing is sent.")});
  return out;
}
const summaryText = () => summaryParts().map(x => x.title ? x.title.toUpperCase() : x.h ? "\n" + x.h.toUpperCase() : x.t).join("\n");
async function exportSummary(how){
  const parts = summaryParts(), name = tr("Bilan_", "Summary_") + fileBase(titleOf($("#offer").value).split(/\s+[–-]\s+/)[0]);
  if (how === "docx") { Export.download(Export.docx(parts.map(x => x.title ? {text: x.title, style: "title"} : x.h ? {text: x.h, style: "head"} : {text: x.t, bold: x.b})), name + ".docx"); return toast(tr("Fichier Word téléchargé", "Word file downloaded")); }
  if (how === "pdf") { toast(tr("Choisis « Enregistrer en PDF »", "Choose \"Save as PDF\"")); return setTimeout(() => Export.printHTML(`<div class="p-cv">${parts.map(x => x.title ? `<div class="name">${esc(x.title)}</div>` : x.h ? `<div class="sec">${esc(x.h)}</div>` : `<p>${x.b ? `<b>${esc(x.t)}</b>` : esc(x.t)}</p>`).join("")}</div>`), 300); }
  if (how === "mail") { location.href = "mailto:?subject=" + encodeURIComponent(tr("Mon bilan de candidature", "My application summary")) + "&body=" + encodeURIComponent(summaryText().slice(0, 1800)); return; }
  toast(await Export.copy(summaryText()) ? tr("Bilan copié : colle-le dans un mail", "Summary copied: paste it into an email") : tr("Copie impossible", "Copy failed"));
}

/* ---------- Étape 2 : lecture du CV ---------- */
let cvTimer;
function setCV(text, typed){
  CV = parseCV(text); cvReady = text.trim().length > 0;
  if (!typed) $("#cvraw").value = text;
  const n = CV.filter(l => l.t).length, exp = CV.filter(l => l.exp).length, secs = CV.filter(l => l.sec && !l.auto).length;
  $("#cvsum").textContent = tr(`${n} lignes · ${exp} expérience${exp > 1 ? "s" : ""} repérée${exp > 1 ? "s" : ""}` + (secs ? "" : " · aucun titre de rubrique trouvé (Expériences, Compétences…)"), `${n} lines · ${plural(exp, "job line")} found` + (secs ? "" : " · no section heading found (Experience, Skills…)"));
  $$("[data-for='2']").forEach(p => p.hidden = step !== 2 || !cvReady);
  gates(); save();
}
function showFile(name, info){ $("#filecard").hidden = false; $("#fname").textContent = name; $("#finfo").textContent = info; }
async function useFile(f){
  if (!f) return;
  if (step !== 2 && canReach(2)) go(2);
  $("#ferr").hidden = true; $("#filecard").hidden = true; $("#job").hidden = false;
  try {
    const r = await readCV(f, (p, m) => { $("#jbar").style.width = Math.round(p * 100) + "%"; $("#jobtxt").textContent = m; });
    cvFile = {name: f.name, info: r.info, conf: r.conf || 0};
    me.name = ""; me.contact = "";
    setCV(r.text);
    showFile(f.name, r.info + (r.conf && r.conf < 75 ? tr(" · relis le texte lu, la photo n'était pas très nette", " · check the text, the photo was not very sharp") : ""));
    if (r.conf && r.conf < 75) $("#check").open = true;
    toast(tr("CV lu", "CV read"));
  } catch (e) {
    $("#ferr").textContent = e.message || tr("Je n'ai pas réussi à lire ce fichier. Essaie un PDF.", "I could not read this file. Try a PDF.");
    $("#ferr").hidden = false;
  } finally { $("#job").hidden = true; $("#file").value = ""; }
}

/* ---------- Étape 1 : offre jointe en fichier ---------- */
async function useOfferFile(f){
  if (!f) return;
  $("#oerr").hidden = true; $("#ojob").hidden = false;
  try {
    const r = await readCV(f, (p, m) => { $("#ojbar").style.width = Math.round(p * 100) + "%"; $("#ojobtxt").textContent = m; });
    $("#offer").value = r.text; tidyOffer(); gates(); save();
    toast(tr("Offre lue", "Offer read"));
    if (r.conf && r.conf < 75) { $("#oerr").textContent = tr("La capture n'était pas très nette : relis le texte de l'offre avant de continuer.", "The screenshot was not very sharp: check the offer text before going on."); $("#oerr").hidden = false; }
  } catch (e) {
    $("#oerr").textContent = (e.message || tr("Je n'ai pas réussi à lire ce fichier.", "I could not read this file.")).replace(/ton CV/g, "l'offre").replace(/your CV/g, "the offer");
    $("#oerr").hidden = false;
  } finally { $("#ojob").hidden = true; $("#offerfile").value = ""; }
}

/* ---------- Session gardée sur l'appareil (seulement si la case est cochée) ---------- */
const keep = () => $("#keep").checked;
let saveTimer;
function saveNow(){
  clearTimeout(saveTimer);
  if (!keep()) return;
  if (cur) { cur.text = $("#offer").value; cur.title = titleOf(cur.text); }
  const data = {v: 1, cv: {text: $("#cvraw").value, ...cvFile}, me, cur: cur?.id, offers: offers.filter(o => o.text.trim() || o.app).map(o => ({id: o.id, text: o.text, title: o.title, score: o.score, fixes: o.fixes, over: o.over, letter: o.letter, app: o.app, prep: o.prep}))};
  try { localStorage.setItem(STORE, JSON.stringify(data)); } catch {}
}
function save(){ clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 400); }
addEventListener("pagehide", saveNow);
function restore(){
  let d; try { d = JSON.parse(localStorage.getItem(STORE) || "null"); } catch {}
  if (!d || d.v !== 1) return false;
  $("#keep").checked = true;
  offers = (d.offers || []).map(o => ({...o, fixes: o.fixes || {}, over: o.over || {}, letter: o.letter || {}}));
  cur = offers.find(o => o.id === d.cur) || offers[offers.length - 1] || null;
  if (cur) { fixes = cur.fixes; over = cur.over; $("#offer").value = cur.text; }
  me = d.me || me;
  if (d.cv?.text) { cvFile = {name: d.cv.name, info: d.cv.info, conf: d.cv.conf}; setCV(d.cv.text); showFile(d.cv.name || "Ton CV", d.cv.info || ""); }
  $("#resume").hidden = false;
  $("#resumetxt").textContent = [cvReady && tr("Ton CV", "Your CV"), offers.length && plural(offers.length, tr("offre", "offer"))].filter(Boolean).join(tr(" et ", " and ")) + (cvReady || offers.length ? tr(" sont là.", " are here.") : "");
  return true;
}
function wipe(){
  $("#keep").checked = false; clearTimeout(saveTimer);
  try { localStorage.removeItem(STORE); } catch {}
  location.reload();
}

/* ---------- Événements ---------- */
document.addEventListener("click", e => {
  const t = e.target.closest("button"); if (!t) return;
  if (t.dataset.step) return go(+t.dataset.step);
  if (t.dataset.go) return go(+t.dataset.go);
  if (t.dataset.fix) { go(4); const k = CSS.escape(t.dataset.fix), el = $(`.blank[data-k="${k}"], [data-yes="${k}"]`); if (el) setTimeout(() => { el.scrollIntoView({block: "center", behavior: "smooth"}); el.focus({preventScroll: true}); }, 50); return; }
  if (t.dataset.f) { filter = t.dataset.f; $$(".chip").forEach(c => c.setAttribute("aria-pressed", c === t)); return renderResult(); }
  if (t.dataset.yes) { fixes[t.dataset.yes].state = "yes"; renderRewrite(); $(`.blank[data-k="${CSS.escape(t.dataset.yes)}"]`)?.focus(); return save(); }
  if (t.dataset.no) { fixes[t.dataset.no].state = "skipped"; renderRewrite(); return save(); }
  if (t.dataset.undo) { const f = fixes[t.dataset.undo]; f.state = f.fix.ask ? "open" : "yes"; return refresh(); }
  if (t.dataset.add) { fixes[t.dataset.add].state = "accepted"; refresh(); return toast(tr("Ajouté à ton CV", "Added to your CV")); }
  if (t.dataset.over !== undefined) {
    const k = t.dataset.over, v = t.dataset.v;
    if (v) over[k] = v; else delete over[k];
    results = analyse($("#offer").value); syncOffer(); renderResult(); save();
    return toast(v === "skip" ? tr("Point retiré du score", "Point removed from the score") : v ? tr("Tampon corrigé", "Stamp corrected") : tr("Revenu au calcul", "Back to the analysis"));
  }
  if (t.dataset.offer) return loadOffer(t.dataset.offer);
  if (t.dataset.deloffer) {
    offers = offers.filter(o => o.id !== t.dataset.deloffer);
    if (cur && cur.id === t.dataset.deloffer) { cur = null; $("#offer").value = ""; newOffer(); gates(); }
    renderOffers(); return save();
  }
  if (t.dataset.share) return exportSummary(t.dataset.share);
  if (t.dataset.typo) {
    const re = new RegExp(`(^|[^\\p{L}])${t.dataset.typo}(?=[^\\p{L}]|$)`, "gu");
    setCV($("#cvraw").value.replace(re, `$1${t.dataset.to}`)); refresh();
    return toast(tr(`Corrigé : « ${t.dataset.to} »`, `Fixed: "${t.dataset.to}"`));
  }
  if (t.dataset.dl) {
    const [kind, how] = t.dataset.dl.split("-"), k = kind === "l" ? "letter" : "cv";
    return how === "docx" ? exportDocx(k) : how === "pdf" ? exportPdf(k) : exportCopy(k);
  }
  switch (t.id) {
    case "demo":
      syncOffer(); if (cur.text.trim() && cur.text !== OFFER) newOffer();
      $("#offer").value = OFFER; cvFile = {name: tr("Exemple : CV de Camille Martin", "Sample: Sam Taylor's CV"), info: tr("CV fictif pour essayer", "Made-up CV to try the app"), conf: 0}; me = {name: "", contact: ""};
      setCV(SAMPLE_CV); showFile(cvFile.name, cvFile.info);
      return go(3);
    case "newoffer": case "compare":
      syncOffer(); newOffer(); $("#offer").value = ""; go(1); $("#offer").focus(); return toast(tr("Colle la nouvelle offre : ton CV est gardé", "Paste the new offer: your CV is kept"));
    case "l-edit": {
      const L = cur.letter;
      if (L.frozen) { L.frozen = false; L.text = ""; } else { L.frozen = true; L.text = letterText(); }
      renderLetter(); if (L.frozen) $("#letteredit").focus(); return save();
    }
    case "wipe": case "wipe2": return wipe();
  }
});
document.addEventListener("input", e => {
  const t = e.target;
  if (t.id === "offer") { gates(); return save(); }
  if (t.id === "cvraw") { clearTimeout(cvTimer); cvTimer = setTimeout(() => setCV(t.value, true), 300); return; }
  if (t.classList.contains("blank")) {
    const k = t.dataset.k; fixes[k].vals[t.dataset.i] = t.value;
    const card = t.closest(".sug"), btn = card.querySelector("[data-add]"), sm = card.querySelector(".sug-a small");
    if (btn) { btn.disabled = !filled(k); sm.textContent = filled(k) ? READY() : FILL(); }
    return save();
  }
  if (t.closest("#lform")) {
    const L = cur.letter;
    if (t.id === "l-name") me.name = t.value; else if (t.id === "l-contact") me.contact = t.value;
    else if (t.id === "l-company") L.company = t.value; else if (t.id === "l-job") L.job = t.value;
    else if (t.id === "l-why") L.why = t.value; else if (t.id === "l-when") L.when = t.value;
    else if (t.dataset.str) L.strengths = $$("[data-str]:checked").map(x => x.dataset.str);
    renderLetter(); return save();
  }
  if (t.id === "letteredit") { cur.letter.text = t.value; return save(); }
});
document.addEventListener("change", e => {
  if (e.target.id === "keep") { if (keep()) { save(); toast(tr("Ta session restera sur cet appareil", "Your session will stay on this device")); } else { try { localStorage.removeItem(STORE); } catch {} toast(tr("Plus rien n'est gardé sur cet appareil", "Nothing is kept on this device any more")); } }
});
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.classList.contains("blank")) { const b = e.target.closest(".sug").querySelector("[data-add]"); if (b && !b.disabled) b.click(); }
});
// Annonce collée depuis un site : on enlève les boutons et menus, avec possibilité de revenir en arrière
let rawOffer = "";
function tidyOffer(){
  const v = $("#offer").value, c = cleanOffer(v);
  if (!c.removed.length) { $("#cleaned").hidden = true; return; }
  rawOffer = v; $("#offer").value = c.text;
  $("#cleanedtxt").textContent = tr(`J'ai retiré ${plural(c.removed.length, "ligne")} du site (boutons, menus, mentions).`, `I removed ${plural(c.removed.length, "line")} from the website (buttons, menus, notices).`);
  $("#cleaned").hidden = false; gates(); save();
}
$("#offer").addEventListener("paste", () => setTimeout(tidyOffer, 0));
$("#unclean").addEventListener("click", () => { $("#offer").value = rawOffer; $("#cleaned").hidden = true; gates(); save(); $("#offer").focus(); });
$("#lform").addEventListener("submit", e => e.preventDefault());
$("#offerfile").addEventListener("change", e => useOfferFile(e.target.files[0]));
const offerBox = $("#offer");
["dragenter", "dragover"].forEach(ev => offerBox.addEventListener(ev, e => { e.preventDefault(); offerBox.classList.add("over"); }));
["dragleave", "drop"].forEach(ev => offerBox.addEventListener(ev, e => { e.preventDefault(); offerBox.classList.remove("over"); }));
offerBox.addEventListener("drop", e => { e.stopPropagation(); if (e.dataTransfer.files[0]) useOfferFile(e.dataTransfer.files[0]); });
$("#file").addEventListener("change", e => useFile(e.target.files[0]));
const drop = $("#drop");
["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("over"); }));
["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("over"); }));
drop.addEventListener("drop", e => { e.stopPropagation(); useFile(e.dataTransfer.files[0]); });
window.addEventListener("dragover", e => e.preventDefault());
window.addEventListener("drop", e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (!f) return; if (step === 1) useOfferFile(f); else if (canReach(2)) useFile(f); });

/* ---------- App installable, utilisable sans réseau ---------- */
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) navigator.serviceWorker.register("sw.js").catch(() => {});
let installEvt = null;
addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; $("#install").hidden = false; });
$("#install").addEventListener("click", async () => { if (!installEvt) return; installEvt.prompt(); await installEvt.userChoice.catch(() => {}); installEvt = null; $("#install").hidden = true; });
addEventListener("appinstalled", () => { $("#install").hidden = true; toast(tr("App installée", "App installed")); });
$("#ioshint").hidden = !(/iphone|ipad/i.test(navigator.userAgent) && !navigator.standalone);

if (!restore()) newOffer();
gates();
go(1);
