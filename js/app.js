// Interface de Ça colle ? : 5 étapes (offre, CV, résultat, améliorer, lettre), plusieurs offres, session gardée
// sur l'appareil si on le choisit. Le calcul est dans js/moteur.js, la lecture des fichiers dans js/lecteur.js,
// les exports Word / PDF dans js/export.js.
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const MIN_WORDS = 25, STORE = LANG === "fr" ? "cacolle-v1" : `cacolle-${LANG}-v1`;
let step = 1, filter = "all", results = [], cvReady = false;
let cvFile = {name: "", info: "", conf: 0};
let me = {name: "", contact: ""};          // pour la lettre, commun à toutes les offres
let offers = [], cur = null;               // offres comparées au même CV

const words = t => t.trim() ? t.trim().split(/\s+/).length : 0;
const isLink = t => /^\s*(https?:\/\/|www\.)\S+\s*$/i.test(t);
const offerOk = () => words($("#offer").value) >= MIN_WORDS && !isLink($("#offer").value);
const canReach = n => n === 1 || (n === 2 && offerOk()) || (n >= 3 && offerOk() && cvReady);
// Autre langue : le mot français est traduit (L10N.w) puis mis au pluriel (L10N.pl), avant de passer dans tr()
// Objet {fr, en} : texte dans la langue de la page (autres langues : traduit par tr depuis le français)
const LL = o => o[LANG] ?? tr(o.fr, o.en);
const plural = (n, w) => { if (L10N && !EN) { const b = L10N.w?.[w] ?? w; return `${n} ${n > 1 ? L10N.pl?.[b] ?? b : b}`; } return `${n} ${w}${n > 1 ? "s" : ""}`; };

function toast(t, ms = 2200){ const el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => el.hidden = true, ms); }

/* ---------- Offres ---------- */
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const titleOf = t => { const l = (t.split("\n").find(x => x.trim()) || tr("Offre", "Offer")).trim().replace(/\s*\((exemple fictif|sample offer)\)/i, "").replace(L10N?.re?.sample ? new RegExp(L10N.re.sample, "i") : /$^/, ""); return l.length > 60 ? l.slice(0, 57) + "…" : l; };
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
    <button type="button" data-offer="${esc(o.id)}"><b>${esc(o.title || titleOf(o.text))}</b>${o.score != null ? `<span class="score">${esc(o.score)} %</span>` : ""}</button>
    <button type="button" class="del" data-deloffer="${esc(o.id)}" aria-label="${tr("Retirer cette offre", "Remove this offer")}">✕</button></li>`).join("");
}

/* ---------- Onglets et navigation : on n'avance que quand l'étape d'avant est remplie ---------- */
function gates(){
  const v = $("#offer").value, w = words(v);
  $("#next1").disabled = !offerOk();
  $("#linkhelp").hidden = !isLink(v);
  $("#hint1").textContent = isLink(v) ? tr("Colle le texte de l'annonce, pas son lien.", "Paste the text of the ad, not its link.") : w === 0 ? tr("Colle au moins quelques lignes de l'annonce.", "Paste at least a few lines of the ad.") : offerOk() ? tr(`${w} mots, c'est bon.`, `${w} words, that's fine.`) : tr(`${w} mots : colle l'annonce en entier, il en faut au moins ${MIN_WORDS}.`, `${w} words: paste the whole ad, at least ${MIN_WORDS} are needed.`);
  $("#next2").disabled = !cvReady;
  $$(".tab[data-step]").forEach(t => {
    const n = +t.dataset.step;
    t.disabled = !canReach(n);
    t.title = t.disabled ? (n === 2 ? tr("Colle d'abord l'offre", "Paste the offer first") : tr("Ajoute d'abord l'offre et ton CV", "Add the offer and your CV first")) : "";
    t.classList.toggle("done", (n === 1 && offerOk()) || (n === 2 && cvReady));
  });
  checkLang();
}
// Une entrée d'historique par étape (#etape-2…5, l'étape 1 sans #) et pour le suivi (#suivi) : le bouton Retour du
// téléphone revient à l'étape d'avant au lieu de quitter l'app. navOn reste faux au démarrage (le lien direct est lu par suivi.js),
// navReplace remplace l'entrée au lieu d'en ajouter une (lien direct, retour arrière).
let navOn = false, navReplace = false;
function navTo(h){
  if (!navOn || location.hash === h) return;
  history[navReplace ? "replaceState" : "pushState"](null, "", location.pathname + location.search + h);
}
function go(n){
  if (!canReach(n)) return;
  const moved = step !== n || !$("#track").hidden;
  if (typeof hideTrack === "function") hideTrack();
  if (step !== n) stat("etape-" + n);
  step = n; navTo(n === 1 ? "" : "#etape-" + n);
  if (n >= 2) syncOffer();
  results = analyse($("#offer").value);
  $$(".tab[data-step]").forEach(t => +t.dataset.step === n ? t.setAttribute("aria-current", "step") : t.removeAttribute("aria-current"));
  $$("[data-p]").forEach(p => p.hidden = +p.dataset.p !== n);
  $$("[data-for]").forEach(p => p.hidden = +p.dataset.for !== n || (n === 2 && !cvReady));
  if (n === 1) renderOffers();
  if (n === 3) renderResult();
  if (n === 4) renderRewrite();
  if (n === 5) renderLetterForm();
  gates(); save();
  if (window.scrollY > 120) $(".top").scrollIntoView({behavior: "smooth"});
  if (go.ready && moved) focusTitle($(`[data-p="${n}"] h1`)); go.ready = true;
}
// Changement d'étape : le focus va sur le titre de la nouvelle étape (clavier, lecteur d'écran)
function focusTitle(h){ if (!h) return; h.tabIndex = -1; h.focus({preventScroll: true}); }

/* ---------- Étape 3 : le résultat ---------- */
const HELP = L10N?.help || (EN ? {
  mid: "It is in your CV, but with no example. Add a real fact: a number, a place, a length of time.",
  no: "The offer asks for it. If you have done it, even in a summer job, internship or volunteering, add it.",
  s: "The offer asks for it. Show it with a fact in one of your jobs, not just a word."
} : {
  mid: "C'est dans ton CV, mais sans exemple. Ajoute un fait concret : un chiffre, un lieu, une durée.",
  no: "L'offre le demande. Si tu l'as déjà fait, même en job d'été, en stage ou en bénévolat, ajoute-le.",
  s: "L'offre le demande. Montre-le par un fait dans une expérience, pas seulement par un mot."
});
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
  $("#sum").textContent = !t ? tr("Je n'ai reconnu aucun point dans cette offre.", "I did not recognise any point in this offer.")
    : tr(`L'offre demande ${plural(t, "chose")}. Ton CV en prouve ${c.ok}, en cite ${c.mid} sans exemple et n'en parle pas pour ${c.no}.`, `The offer asks for ${plural(t, "thing")}. Your CV proves ${c.ok}, mentions ${c.mid} without an example and says nothing about ${c.no}.`)
      + (!must ? "" : must > 1 ? tr(` Attention : ${must} points indispensables manquent.`, ` Careful: ${must} essential points are missing.`) : tr(" Attention : un point indispensable manque.", " Careful: one essential point is missing."));
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
  const ad = adCheck($("#offer").value);
  if (ad.flags.some(f => f.level === "red") && cur && !cur.flagged) { cur.flagged = true; stat("annonce-suspecte"); }
  $("#groups").innerHTML = adHTML(ad) + notice + groups.map(s => {
    const list = results.filter(r => r.st === s).sort((a, b) => urgency(a) - urgency(b)); if (!list.length) return "";
    return `<section class="group"><h2 class="section-title" style="--k: ${s === "ok" ? "var(--green)" : s === "mid" ? "var(--yellow)" : "var(--pink)"}">${LABEL[s]} (${list.length})</h2><div class="points">${list.map(r => `
      <article class="point${PHONE.matches && s !== "ok" ? " fold" : ""}">
        <div class="point-h"><i class="stamp ${s}">${LABEL[s]}</i>${tagOf(r)}${r.manual ? `<i class="tag hand">${tr("Corrigé par toi", "Corrected by you")}</i>` : ""}</div>
        <h3>${PHONE.matches && s !== "ok" ? `<button type="button" class="point-t" aria-expanded="false">${esc(r.k)}</button>` : esc(r.k)}</h3>
        <p>${explain(r, s)}</p>
        ${r.vocab ? `<p class="vocab">${tr(`Ton CV dit « ${esc(r.vocab.cv)} », l'offre dit « ${esc(r.vocab.offer)} ».`, `Your CV says "${esc(r.vocab.cv)}", the offer says "${esc(r.vocab.offer)}".`)}</p>` : ""}
        ${s !== "ok" && r.fix ? `<button class="btn small" data-fix="${esc(r.k)}">${tr("Corriger ce point", "Fix this point")}</button>` : ""}
        <details class="why"><summary>${tr("Pourquoi ce tampon ?", "Why this stamp?")}</summary>${whyHTML(r)}
          <div class="over"><span>${tr("Ce tampon est faux ?", "Is this stamp wrong?")}</span>${["ok", "mid", "no"].filter(v => v !== s).map(v => `<button type="button" class="btn light small" data-over="${esc(r.k)}" data-v="${v}">${LABEL[v]}</button>`).join("")}<button type="button" class="btn light small" data-over="${esc(r.k)}" data-v="skip">${tr("Pas une vraie demande", "Not a real requirement")}</button>${r.manual ? `<button type="button" class="btn ghost small" data-over="${esc(r.k)}" data-v="">${tr("Revenir au calcul", "Back to the analysis")}</button>` : ""}</div>
          <p class="hint">${tr("Si c'est dans ton CV avec d'autres mots, corrige le tampon. Si ce n'est pas dans ton CV, ajoute-le plutôt à l'étape 4.", "If it is in your CV in other words, correct the stamp. If it is not in your CV, add it in step 4 instead.")}</p>
        </details>
      </article>`).join("")}</div></section>`;
  }).join("")
  + (skipped.length ? `<section class="group"><h2 class="section-title" style="--k: var(--card)">${tr("Points retirés", "Removed points")} (${skipped.length})</h2>
      <ul class="skipped">${skipped.map(r => `<li><span>${esc(r.k)}</span><button type="button" class="btn light small" data-over="${esc(r.k)}" data-v="">${tr("Remettre", "Put back")}</button></li>`).join("")}</ul></section>` : "")
  + (vocab.length ? `<section class="group"><h2 class="section-title" style="--k: var(--blue)">${tr("Les mots de l'annonce", "The ad's own words")}</h2>
      <p class="hint">${tr("Les recruteurs et leurs logiciels cherchent les mots exacts de l'offre. Reprends-les dans ton CV quand c'est vrai.", "Recruiters and their software look for the exact words of the offer. Use them in your CV when they are true.")}</p>
      <ul class="words">${vocab.map(r => `<li><span class="w-cv">${esc(r.vocab.cv)}</span><span aria-hidden="true">→</span><span class="w-offer">${esc(r.vocab.offer)}</span></li>`).join("")}</ul></section>` : "")
  + `<section class="group"><h2 class="section-title" style="--k: var(--orange)">${tr("Test robot recruteur", "Recruiter robot test")} · ${atsOk} ${tr("sur", "of")} ${ats.length}</h2>
      <p class="hint">${tr("Beaucoup d'entreprises trient les CV avec un logiciel avant qu'une personne les lise. Voici ce qui peut le gêner.", "Many employers sort CVs with software before a person reads them. Here is what can trip it up.")}</p>
      <ul class="ats">${ats.map(a => `<li class="${a.ok ? "ok" : "ko"}"><b><span aria-hidden="true">${a.ok ? "✓" : "✕"}</span> ${esc(a.label)}</b>${a.ok ? "" : `<span>${esc(a.help)}</span>`}<span class="sr-only">${a.ok ? tr(" : bon", ": good") : tr(" : à corriger", ": to fix")}</span></li>`).join("")}</ul></section>`;
}

// Téléphone : cartes « Pas dans ton CV » et « À préciser » repliées (titre + Corriger), ouvertes d'un appui sur le titre
const PHONE = matchMedia("(max-width: 560px)");
PHONE.addEventListener?.("change", () => { if (step === 3 && !$("[data-p='3']").hidden) renderResult(); });
document.addEventListener("click", e => {
  const b = e.target.closest(".point-t"); if (!b) return;
  const open = b.getAttribute("aria-expanded") !== "true";
  b.setAttribute("aria-expanded", open); b.closest(".point").classList.toggle("fold", !open);
});
// L'annonce en bref : infos clés, infos absentes, signaux d'arnaque
function adHTML(ad){
  const red = ad.flags.filter(f => f.level === "red");
  return `<section class="group adcheck"><h2 class="section-title" style="--k: ${red.length ? "var(--pink)" : "var(--blue)"}">${tr("L'annonce en bref", "The ad at a glance")}</h2>
    ${ad.flags.length ? `<div class="alert ${red.length ? "red" : "amber"}" role="note"><b>${red.length ? tr("Attention, cette annonce ressemble à une arnaque.", "Careful, this ad looks like a scam.") : tr("Quelques points à vérifier avant de postuler.", "A few things to check before applying.")}</b>
      <ul>${ad.flags.map(f => `<li class="${f.level}"><b>${esc(f.label)}</b> <q>${esc(f.v)}</q><span>${esc(f.why)}</span></li>`).join("")}</ul>
      ${red.length ? `<p>${tr("Ne paie jamais pour postuler et ne donne pas tes papiers avant un contrat signé. En cas de doute, signale l'annonce au site qui la publie.", "Never pay to apply and do not hand over your papers before a signed contract. If in doubt, report the ad to the site that posted it.")}</p>` : ""}</div>` : ""}
    <ul class="facts">${ad.facts.map(f => `<li><small>${esc(f.label)}</small><b>${esc(f.v)}</b>${f.id === "salary" && /\d/.test(f.v) ? `<a class="linkbtn" href="${tr("salaire.html", "salary-en.html")}?s=${encodeURIComponent(f.v)}">${tr("Brut → net", "Take-home pay")}</a>` : ""}</li>`).join("")}${ad.missing.map(f => `<li class="miss"><small>${esc(f.label)}</small><b>${tr("pas indiqué", "not given")}</b></li>`).join("")}</ul>
    ${ad.missing.length ? `<p class="hint">${tr("Ce qui n'est pas écrit, demande-le avant ou pendant l'entretien : c'est normal de poser la question.", "Whatever is not written, ask about it before or during the interview: it is normal to ask.")}</p>` : ""}</section>`;
}

/* ---------- Étape 4 : améliorer le CV ---------- */
function ensureFix(r){
  const f = fixes[r.k];
  if (!f) fixes[r.k] = {vals: {}, state: r.fix.ask ? "open" : "yes", fix: r.fix};
  else if (f.state !== "accepted" && f.state !== "skipped") f.fix = r.fix;
  return fixes[r.k];
}
const whereOf = line => !line ? tr("tes compétences", "your skills") : line.exp ? tr("ton expérience : ", "your job: ") + ((jobOf(line.id)?.title || line.t.replace(RANGE, "").replace(/^[\s:–-]+/, "").split(/[,:(]/)[0]).slice(0, 60)) : line.kind === "edu" ? tr("ta formation", "your education") : tr("tes compétences", "your skills");
// Case à remplir : la question en étiquette visible au-dessus, l'exemple dans la case
const splitPh = ph => { const i = ph.indexOf("?"); return i > 0 ? [ph.slice(0, i + 1).trim(), ph.slice(i + 1).trim()] : [ph, ""]; };
const READY = () => tr("Prêt.", "Ready."), FILL = () => tr("Remplis les cases jaunes.", "Fill in the yellow boxes.");
function renderRewrite(){
  const list = results.filter(r => r.fix && (r.st !== "ok" || r.fixedNow)).sort((a, b) => urgency(a) - urgency(b));
  const jobs = jobsOf();
  $("#sugs").innerHTML = list.map((r, n) => {
    const f = ensureFix(r), fix = f.fix, line = CV.find(l => l.id === targetId(fix, f.to)); let i = 0;
    const labels = blanksOf(fix.tpl).map((ph, j) => `<label class="blank-l" for="b${n}-${j}">${esc(splitPh(ph)[0].replace(/^(¿?)(\p{L})/u, (m, a, b) => a + b.toUpperCase()))}</label>`).join("");
    const blanks = esc(fix.tpl).replace(/\{([^}]+)\}/g, (m, ph) => { const j = i++, [, hint] = splitPh(ph); return `<input class="blank" id="b${n}-${j}" data-k="${esc(r.k)}" data-i="${j}" placeholder="${esc(hint || "…")}" value="${esc(f.vals[j] || "")}" size="${Math.max(8, Math.min(40, (hint || ph).length))}">`; });
    // Ajout dans une expérience : la personne choisit le poste (le premier par défaut)
    const pick = fix.line === "exp" && !fix.find && jobs.length > 1 && f.state !== "accepted"
      ? `<span class="where"><label for="to${n}">${tr("Dans quel poste ?", "In which job?")}</label> <select class="stsel to-sel" id="to${n}" data-to="${esc(r.k)}">${jobs.map(j => `<option value="${j.id}" ${(jobs.find(x => x.id === f.to) || jobs[0]) === j ? "selected" : ""}>${esc(j.title.slice(0, 60))}</option>`).join("")}</select></span>`
      : `<span class="where">${tr("Dans", "In")} ${esc(whereOf(line))}</span>`;
    let body;
    if (f.state === "open") body = `<div class="ask">${esc(fix.ask)} <button class="btn small" data-yes="${esc(r.k)}">${tr("Oui", "Yes")}</button><button class="btn light small" data-no="${esc(r.k)}">${tr("Non", "No")}</button></div>`;
    else if (f.state === "skipped") body = `<p>${esc(fix.nope || tr("Point laissé de côté.", "Point set aside."))}</p><div class="sug-a"><button class="btn light small" data-undo="${esc(r.k)}">${tr("Revenir sur ce point", "Go back to this point")}</button></div>`;
    else body = `${fix.why ? `<p>${esc(fix.why)}</p>` : ""}
      ${pick}${labels}
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
const fileBase = s => (s || tr("Mon", "My")).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w]+/g, "_").replace(/^_|_$/g, "");

/* ---------- Étape 5 : la lettre ---------- */
function prefillLetter(){
  const head = CV.find(l => l.name)?.t || "", all = $("#cvraw").value;
  if (!me.name) me.name = personName();
  const top = all.slice(0, 300), tel = top.match(/(\+33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/) || top.match(/(\+\d{1,3}\s?)?\(?0?\d{3,5}\)?[\s.-]?\d{3}[\s.-]?\d{3,4}/);
  if (!me.contact) me.contact = [all.match(/[\w.+-]+@[\w-]+\.[a-z.]{2,}/i)?.[0], tel?.[0]].filter(Boolean).join(" · ");
  const L = cur.letter;
  if (L.job === undefined) L.job = titleOf($("#offer").value).split(/\s+[–-]\s+/)[0].replace(GENDER, "").trim();
  // Entreprise lue dans le titre de l'annonce (« Vendeur – Boulangerie Les Blés – Caen ») : modifiable dans le formulaire
  if (L.company === undefined) L.company = adCheck($("#offer").value).company || "";
  if (!L.strengths) L.strengths = results.filter(r => r.st === "ok" && r.type !== "y" && r.type !== "h").slice(0, 3).map(r => r.k);
  return head;
}
function renderLetterForm(){
  prefillLetter();
  const L = cur.letter;
  $("#l-name").value = me.name; $("#l-contact").value = me.contact;
  $$("[data-tone]").forEach(b => b.setAttribute("aria-pressed", b.dataset.tone === toneOf(L)));
  // Madame / Monsieur : accords de la lettre (« heureuse », « prêt »), seulement dans les langues qui en ont besoin
  $("#l-gender").hidden = !(LANG === "fr" || L10N?.letterGender);
  $$("[data-g]").forEach(b => b.setAttribute("aria-pressed", b.dataset.g === (L.g || "n")));
  $("#l-company").value = L.company || ""; $("#l-job").value = L.job || ""; $("#l-why").value = L.why || ""; $("#l-when").value = L.when || "";
  const oks = results.filter(r => r.st === "ok" && r.type !== "y");
  $("#l-strengths").innerHTML = oks.length ? oks.map(r => `<label class="str"><input type="checkbox" data-str="${esc(r.k)}" ${L.strengths.includes(r.k) ? "checked" : ""}> <span><b>${esc(r.k)}</b><small>${esc(clip(excerpt(r, false)))}</small></span></label>`).join("")
    : `<p class="hint">${tr("Aucun point fort trouvé pour l'instant : améliore d'abord ton CV à l'étape 4.", "No strengths found yet: improve your CV in step 4 first.")}</p>`;
  renderLetter();
}
const sentence = t => { t = t.trim(); t = t.charAt(0).toUpperCase() + t.slice(1); return /[.!?…]$/.test(t) ? t : t + "."; };
const clip = t => t.replace(/^…\s*|\s*…$/g, "").replace(/^\(?\d{4}\s*[-–]\s*\d{4}\)\s*:?\s*/, "").replace(/\s*:\s*$/, "").trim();
// Ce que montre le CV pour un point fort : la tâche sans les dates ni l'intitulé du poste, et le poste à part
function taskOf(r){
  const P = r.proof, job = P?.id && jobOf(P.id);
  if (!P || !job) return {x: clip(excerpt(r, false)).replace(RANGE, "").replace(/^[\s:–-]+|[\s,;:–-]+$/g, ""), job: null};
  // Ligne d'intitulé ou de dates : le poste suffit
  if (job.multi && (P.id === job.id || dateOnly(P.t))) return {x: "", job};
  let t = P.t;
  if (!job.multi) {
    const c = t.search(/\s:\s|:\s/);
    if (c >= 0) { if (c > P.i) return {x: "", job}; t = t.slice(t.indexOf(":", c) + 1); }
  }
  // Ligne longue : son début, coupé à un mot (le même extrait pour tous les points de la ligne)
  t = t.replace(RANGE, " ").replace(/\s+/g, " ").replace(/^[\s:–-]+|[\s.,;:–-]+$/g, "").trim();
  if (t.length > 150) t = t.slice(0, t.lastIndexOf(" ", 150)).replace(/[\s.,;:–-]+$/, "") + "…";
  return {x: t, job, id: P.id};
}
// « en tant qu'hôtesse de caisse chez Supermarché Marché Plus », « as an order picker at FreshMart »
const asRole = j => {
  const role = LANG === "de" || /^\p{Lu}{2}/u.test(j.role) ? j.role : j.role.charAt(0).toLowerCase() + j.role.slice(1);
  const as = LANG === "fr" ? (/^[aeiouyhàâéèêîïôûœ]/i.test(role) ? "en tant qu'" : "en tant que ") : EN ? (/^[aeiou]/i.test(role) ? "as an " : "as a ") : tr("en tant que", "as") + " ";
  return as + role + (j.company ? " " + tr("chez", "at") + " " + j.company : "");
};
function letterText(){
  const L = cur.letter, job = L.job || tr("[intitulé du poste]", "[job title]"), co = L.company || tr("[nom de l'entreprise]", "[company name]");
  // Les points forts prouvés par la même ligne du CV sont regroupés ; le poste n'est cité qu'une fois
  // « - Encaissement des clients, tenue de caisse, en tant qu'hôtesse de caisse chez … » ; pas de « Mise en rayon : Mise en rayon le matin »
  const groups = [], low = r => /^.[a-zà-ÿ]/.test(r.k) && LANG !== "de" && r.type !== "o" ? r.k.charAt(0).toLowerCase() + r.k.slice(1) : r.k;
  results.filter(r => L.strengths.includes(r.k) && r.st === "ok").forEach(r => {
    const {x, job: j, id} = taskOf(r), key = x ? id || x : j ? "@" + j.id : "", g = key && groups.find(g => g.key === key);
    if (g) g.k.push(low(r)); else groups.push({k: [r.k], x, j, key});
  });
  const said = new Set();
  const strong = groups.map(g => {
    const F = fold(g.x), w = fold(g.k[0]).split(/[\s'(]+/).find(w => w.length >= 4) || fold(g.k[0]);
    const head = g.x && g.k.length === 1 && (F.includes(fold(g.k[0])) || F.startsWith(w.slice(0, 6))) ? g.x : g.k.join(", ") + (g.x ? tr(" : ", ": ") + g.x : "");
    const role = g.j && !said.has(g.j.id) && g.j.role ? (said.add(g.j.id), ", " + asRole(g.j)) : "";
    return `- ${head}${role}`;
  });
  // Madame / Monsieur / sans préciser : « heureuse », « heureux », ou une tournure neutre
  const g = L.g || "n", glad = {f: "je serais heureuse de vous rencontrer", m: "je serais heureux de vous rencontrer", n: "ce serait un plaisir de vous rencontrer"}[g] || "ce serait un plaisir de vous rencontrer";
  const ready = {f: "Je suis prête à me former", m: "Je suis prêt à me former", n: "J'ai envie de me former"}[g] || "J'ai envie de me former";
  const tone = toneOf(L), at = L.company ? tr(" chez " + L.company, " at " + L.company) : "";
  const why = L.why ? " " + sentence(L.why) : tr(" [pourquoi ce poste ou cette entreprise]", " [why this job or company]");
  // Ce que l'offre demande et que le CV ne montre pas encore : seulement cité, jamais inventé
  const gaps = results.filter(r => r.st === "no" && !["y", "h", "x"].includes(r.type)).sort((a, b) => (a.prio === "must" ? 0 : 1) - (b.prio === "must" ? 0 : 1)).slice(0, 2).map(r => KEEPCASE ? r.k : r.k.charAt(0).toLowerCase() + r.k.slice(1));
  // Autre langue : L10N.letter({job, at, why, L, gaps}) rend le même objet que la version anglaise
  const T = L10N?.letter ? L10N.letter({job, at, why, L, gaps}) : EN ? {
    classic: {subj: `Application for the position of ${job}`, open: `I was very interested to see your offer for the position of ${job}${at}.${why}`, intro: "Here is what I can bring:", extra: "", close: `I am available ${L.when ? L.when.trim() : "soon"} and would be glad to meet you to talk about it.`, bye: "Yours sincerely,"},
    direct: {hello: "Hello,", subj: `Application: ${job}`, open: `I am writing about the ${job} position${at}.${why}`, intro: "What I already know how to do:", extra: "", close: `I am available ${L.when ? L.when.trim() : "[date]"} for an interview or a trial day.`, bye: "Kind regards,"},
    short: {mail: true, hello: "Hello,", subj: `Application for the position of ${job}`, open: `I am interested in your ${job} position${at}.${why}`, intro: "What I already know how to do:", extra: "", close: `My CV is attached. I am available ${L.when ? L.when.trim() : "[date]"} to talk about it.`, bye: "Have a good day,"},
    change: {subj: `Application for the position of ${job} (career change)`, open: `I am moving into a new line of work, and your offer for the position of ${job}${at} matches that plan exactly.${why}`, intro: "What my background has taught me and I can bring to this role:", extra: gaps.length ? `I am ready to train in what I do not know yet, such as ${gaps.join(" and ")}.` : "I am ready to train in whatever I do not know yet.", close: `I am available ${L.when ? L.when.trim() : "soon"} and would be glad to meet you to talk about it.`, bye: "Yours sincerely,"},
    study: {subj: `Application for an apprenticeship or internship: ${job}`, open: `I am looking for an apprenticeship or internship [say which, with the dates or the schedule and your school] as ${job}${at}.${why}`, intro: "What I can already bring:", extra: "I am keen to learn on the job and to grow with your team.", close: `I am available ${L.when ? L.when.trim() : "soon"} and would be glad to meet you to talk about it.`, bye: "Yours sincerely,"}
  } : {
    classic: {subj: `Objet : candidature au poste « ${job} »`, open: `Votre offre pour le poste « ${job} »${at} a retenu toute mon attention.${why}`, intro: "Voici ce que je peux vous apporter :", extra: "", close: `Je suis disponible ${L.when ? L.when.trim() : "rapidement"} et ${glad} pour en parler.`, bye: "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."},
    direct: {hello: "Bonjour,", subj: `Objet : candidature « ${job} »`, open: `Je vous écris pour le poste « ${job} »${at}.${why}`, intro: "Ce que je sais déjà faire :", extra: "", close: `Je suis disponible ${L.when ? L.when.trim() : "[date]"} pour un entretien ou un essai.`, bye: "Bien à vous,"},
    short: {mail: true, hello: "Bonjour,", subj: `Objet : candidature « ${job} »`, open: `Votre offre pour le poste « ${job} »${at} m'intéresse.${why}`, intro: "Ce que je sais déjà faire :", extra: "", close: `Mon CV est en pièce jointe. Je suis disponible ${L.when ? L.when.trim() : "[date]"} pour en parler.`, bye: "Bonne journée,"},
    change: {subj: `Objet : candidature au poste « ${job} » (reconversion)`, open: `Je souhaite mettre mon expérience au service d'un nouveau métier, et votre offre pour le poste « ${job} »${at} correspond exactement à ce projet.${why}`, intro: "Ce que mon parcours m'a appris et que je peux mettre à profit :", extra: gaps.length ? `${ready} sur ce que je ne connais pas encore, comme ${gaps.join(" et ")}.` : `${ready} sur ce que je ne connais pas encore.`, close: `Je suis disponible ${L.when ? L.when.trim() : "rapidement"} et ${glad} pour en parler.`, bye: "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."},
    study: {subj: `Objet : candidature en alternance ou en stage « ${job} »`, open: `Je recherche une alternance ou un stage [précise lequel, avec les dates ou le rythme et ton école] au poste « ${job} »${at}.${why}`, intro: "Ce que je peux déjà vous apporter :", extra: "J'ai envie d'apprendre sur le terrain et de progresser avec votre équipe.", close: `Je suis disponible ${L.when ? L.when.trim() : "rapidement"} et ${glad} pour en parler.`, bye: "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."}
  };
  const t = T[tone] || T.classic, sign = me.name || tr("[ton nom]", "[your name]");
  // Courte (mail) : pas d'adresse, les points forts sur une ligne, la signature avec le contact
  if (t.mail) {
    const keys = results.filter(r => L.strengths.includes(r.k) && r.st === "ok").map(low);
    return [t.subj, "", t.hello, "", t.open, "", ...(keys.length ? [t.intro + " " + keys.join(", ") + "."] : []), t.close, "", t.bye, sign + " · " + (me.contact || tr("[ton email et ton téléphone]", "[your email and phone]"))].join("\n");
  }
  return [
    me.name || tr("[ton nom]", "[your name]"), me.contact || tr("[ton email et ton téléphone]", "[your email and phone]"), "",
    co, tr("À l'attention du service recrutement", "Recruitment team"), "",
    t.subj, "",
    t.hello || tr("Madame, Monsieur,", "Dear Hiring Manager,"), "",
    t.open, "",
    ...(strong.length ? [t.intro, ...strong, ""] : []),
    ...(t.extra ? [t.extra, ""] : []),
    t.close, "",
    t.bye, "",
    me.name || tr("[ton nom]", "[your name]")
  ].join("\n");
}
// Ancien ton « Dynamique » (sessions et sauvegardes d'avant) : devenu « Directe »
const toneOf = L => L.tone === "dynamic" ? "direct" : L.tone || "classic";
const currentLetter = () => cur.letter.frozen ? cur.letter.text : letterText();
// Check-list avant d'envoyer : certains points se vérifient tout seuls, les autres se cochent
function renderChecklist(){
  const box = $("#checklist"); if (!box || !cur) return;
  const L = cur.letter, C = cur.check = cur.check || {}, name = personName() || tr("Prénom Nom", "First Last"), job = L.job || tr("poste", "job");
  const typos = cvCheck($("#cvraw").value).filter(c => c.type === "typo").length, mustNo = results.filter(r => r.prio === "must" && r.st === "no").length;
  const auto = [
    [!!(L.company && L.job), tr("Le nom de l'entreprise et le poste sont écrits dans ta lettre", "The company name and the job title are in your letter")],
    [/@/.test(me.contact || "") && /\d{6}/.test((me.contact || "").replace(/\D/g, "")), tr("Ton email et ton téléphone sont dans la lettre", "Your email and phone are in the letter")],
    [!typos, typos ? tr(`Ton CV a encore ${plural(typos, "faute courante")} (étape 4)`, `Your CV still has ${plural(typos, "common typo")} (step 4)`) : tr("Pas de faute courante dans ton CV", "No common typo in your CV")],
    [!mustNo, mustNo ? tr(`${mustNo > 1 ? mustNo + " points indispensables manquent" : "Un point indispensable manque"} dans ton CV (étape 4)`, `${plural(mustNo, "essential point")} still missing from your CV (step 4)`) : tr("Les points indispensables de l'offre sont dans ton CV", "The offer's essential points are in your CV")]
  ];
  const manual = [
    ["pdf", tr(`CV enregistré en PDF, avec un nom clair : ${fileBase(name)}_CV.pdf`, `CV saved as a PDF with a clear name: ${fileBase(name)}_CV.pdf`)],
    ["subject", tr(`Objet du mail clair : « Candidature ${job} · ${name} »`, `Clear email subject: "Application ${job} · ${name}"`)],
    ["attach", tr("CV et lettre joints au mail (ou collés dans le formulaire du site)", "CV and letter attached to the email (or pasted in the site's form)")],
    ["read", tr("Lettre relue une dernière fois, à voix haute", "Letter read one last time, out loud")],
    ["keep", tr("Annonce gardée : copie du texte ou lien noté dans ton suivi", "Ad kept: copy of the text or link saved in your tracker")]
  ];
  const done = auto.filter(a => a[0]).length + manual.filter(m => C[m[0]]).length, all = auto.length + manual.length;
  box.innerHTML = `<h2 class="section-title" style="--k: var(--green)">${tr("Avant d'envoyer", "Before you send")} · ${done} / ${all}</h2>
    <ul class="checklist">${auto.map(([ok, t]) => `<li class="${ok ? "ok" : "ko"}"><span aria-hidden="true">${ok ? "✓" : "!"}</span>${esc(t)}<span class="sr-only">${ok ? tr(" : fait", ": done") : tr(" : à faire", ": to do")}</span></li>`).join("")}
    ${manual.map(([id, t]) => `<li><label><input type="checkbox" data-check="${id}" ${C[id] ? "checked" : ""}> ${esc(t)}</label></li>`).join("")}</ul>
    <div class="next-row"><button class="btn" type="button" data-trackthis="sent">${tr("C'est envoyé : noter dans mon suivi", "Sent: note it in my tracker")}</button></div>`;
}
function renderLetter(){
  renderChecklist();
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
  out.push({title: tr("Bilan Ça colle ?", "Good fit? summary")});
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
  out.push({t: tr("Fait avec Ça colle ? (ca-colle.pissits.com) : l'analyse se fait sur l'appareil, rien n'est envoyé.", "Made with Good fit? (ca-colle.pissits.com): the analysis runs on the device, nothing is sent.")});
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
  syncPaste(); gates(); save();
}
// CV collé en texte (depuis un mail…) : même chemin que le texte lu dans un fichier
function usePasted(v){
  if (!cvFile.pasted) { me.name = ""; me.contact = ""; }
  cvFile = v.trim() ? {name: "", info: tr("Texte collé", "Pasted text"), conf: 0, pasted: true} : {name: "", info: "", conf: 0};
  $("#filecard").hidden = true; $("#ferr").hidden = true;
  setCV(v);
}
function syncPaste(){
  const pasted = !!cvFile.pasted && cvReady;
  $("#cvpastebox").hidden = cvReady && !pasted;
  if (!pasted && cvReady) $("#cvpaste").value = "";
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
    $("#oerr").textContent = (e.message || tr("Je n'ai pas réussi à lire ce fichier.", "I could not read this file.")).replace(/ton CV/g, "l'offre").replace(/your CV/g, "the offer").replace(L10N?.re?.cvWord ? new RegExp(L10N.re.cvWord, "g") : /$^/, L10N?.re?.offerWord || "");
    $("#oerr").hidden = false;
  } finally { $("#ojob").hidden = true; $("#offerfile").value = ""; }
}

/* ---------- Ce qui reste sur l'appareil ----------
   Par défaut, seul le suivi des candidatures est gardé (poste, entreprise, dates, état, notes), sans le CV ni le texte des offres.
   Si la case « Garder ma session » est cochée, tout est gardé : CV, offres, réponses, lettre, préparation d'entretien. */
const keep = () => $("#keep").checked;
let saveTimer, noSave = false; // noSave : après « Effacer » ou à l'ouverture d'une sauvegarde, plus rien n'est écrit avant le rechargement
function saveNow(){
  clearTimeout(saveTimer);
  if (noSave) return;
  const d = snapshot();
  try {
    if (d.keep === false && !d.offers.length) localStorage.removeItem(STORE);
    else localStorage.setItem(STORE, JSON.stringify(d));
    saveNow.warned = 0; return true;
  } catch {
    if (Date.now() - (saveNow.warned || 0) > 60000) { saveNow.warned = Date.now(); toast(tr("Je n'arrive pas à enregistrer sur cet appareil (mémoire du navigateur pleine ?). Pour ne rien perdre, fais une sauvegarde : Mes candidatures, menu Import / Export.", "I can't save on this device (browser storage full?). To lose nothing, make a backup: My applications, Import / Export menu."), 7000); }
    return false;
  }
}
// full : tout (case cochée, ou fichier de sauvegarde) ; sinon le suivi seulement
function snapshot(full = keep()){
  if (cur) { cur.text = $("#offer").value; cur.title = titleOf(cur.text); }
  if (!full) return {v: 1, keep: false, me: me.goal ? {goal: me.goal} : {}, offers: offers.filter(o => o.app).map(o => ({id: o.id, title: o.title, app: o.app}))};
  return {v: 1, cv: {text: $("#cvraw").value, ...cvFile}, me, cur: cur?.id, offers: offers.filter(o => o.text.trim() || o.app).map(o => ({id: o.id, text: o.text, title: o.title, score: o.score, fixes: o.fixes, over: o.over, letter: o.letter, app: o.app, prep: o.prep, check: o.check}))};
}
function save(){ clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 400); }
addEventListener("pagehide", saveNow);
// Date du jour en heure locale (pas en UTC : entre minuit et 2 h, en France, l'UTC est encore la veille)
const ymd = x => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
// Données relues (session gardée ou fichier de sauvegarde ouvert) : on ne garde que les champs connus, avec le bon type.
// Un fichier piégé ou abîmé ne doit ni casser la page ni glisser du code dans l'affichage.
const isObj = v => !!v && typeof v === "object" && !Array.isArray(v);
const okKey = k => k !== "__proto__" && k !== "constructor" && k !== "prototype";
const str = (v, max = 100000) => typeof v === "string" ? v.slice(0, max) : "";
const strsOf = (v, keys, max) => { const o = {}; if (isObj(v)) for (const k of keys) if (typeof v[k] === "string") o[k] = v[k].slice(0, max); return o; };
const isDay = v => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
const okStatus = s => typeof s === "string" && (typeof ST === "undefined" ? /^[a-z]{1,20}$/.test(s) : !!ST[s]); // suivi.js revérifie au chargement
function cleanSave(d){
  if (!isObj(d) || d.v !== 1) return null;
  const seen = new Set(), list = [];
  for (const o of Array.isArray(d.offers) ? d.offers : []) {
    if (!isObj(o) || typeof o.id !== "string" || !/^[a-z0-9]{1,40}$/.test(o.id) || seen.has(o.id)) continue;
    seen.add(o.id);
    const x = {id: o.id, text: str(o.text), title: str(o.title, 300), fixes: {}, over: {}, letter: {}};
    if (typeof o.score === "number" && isFinite(o.score)) x.score = Math.max(0, Math.min(100, Math.round(o.score)));
    if (isObj(o.fixes)) for (const [k, f] of Object.entries(o.fixes)) {
      if (!okKey(k) || !isObj(f) || !isObj(f.fix) || typeof f.fix.tpl !== "string" || !["open", "yes", "accepted", "skipped"].includes(f.state)) continue;
      const vals = {}; if (isObj(f.vals)) for (const [i, v] of Object.entries(f.vals)) if (/^\d{1,2}$/.test(i) && typeof v === "string") vals[i] = v.slice(0, 2000);
      x.fixes[k] = {state: f.state, vals, fix: strsOf(f.fix, ["line", "why", "ask", "tpl", "nope", "find"], 2000)};
    }
    if (isObj(o.over)) for (const [k, v] of Object.entries(o.over)) if (okKey(k) && ["ok", "mid", "no", "skip"].includes(v)) x.over[k] = v;
    if (isObj(o.letter)) {
      x.letter = strsOf(o.letter, ["company", "job", "why", "when", "tone", "text"], 20000);
      if (Array.isArray(o.letter.strengths)) x.letter.strengths = o.letter.strengths.filter(v => typeof v === "string").slice(0, 50);
      if (o.letter.frozen === true) x.letter.frozen = true;
    }
    if (isObj(o.app)) {
      const a = o.app, status = okStatus(a.status) ? a.status : "todo";
      x.app = {...strsOf(a, ["job", "company", "contact", "link", "notes"], 5000), status};
      for (const k of ["job", "company", "contact", "link", "notes"]) x.app[k] = x.app[k] || "";
      for (const k of ["offerDate", "appliedDate", "next"]) x.app[k] = isDay(a[k]) ? a[k] : "";
      x.app.history = (Array.isArray(a.history) ? a.history : []).filter(h => isObj(h) && isDay(h.d) && okStatus(h.s)).slice(0, 200).map(h => ({d: h.d, s: h.s}));
      if (!x.app.history.length) x.app.history = [{d: x.app.appliedDate || ymd(new Date()), s: status}];
    }
    if (isObj(o.prep)) { x.prep = {}; for (const [k, v] of Object.entries(o.prep)) if (okKey(k) && isObj(v)) x.prep[k] = strsOf(v, ["t", "s", "a", "r"], 5000); }
    if (isObj(o.check)) { x.check = {}; for (const [k, v] of Object.entries(o.check)) if (okKey(k) && typeof v === "boolean") x.check[k] = v; }
    list.push(x);
  }
  const cv = isObj(d.cv) ? {text: str(d.cv.text), name: str(d.cv.name, 300), info: str(d.cv.info, 300), conf: typeof d.cv.conf === "number" && isFinite(d.cv.conf) ? d.cv.conf : 0} : {text: ""};
  const m = strsOf(d.me, ["name", "contact"], 500), g = isObj(d.me) ? +d.me.goal : 0;
  if (g >= 1 && g <= 50) m.goal = Math.round(g);
  return {v: 1, keep: d.keep !== false, cv, me: {name: m.name || "", contact: m.contact || "", ...(m.goal ? {goal: m.goal} : {})}, cur: seen.has(d.cur) ? d.cur : undefined, offers: list};
}
function restore(){
  let raw = null, d = null;
  try { raw = JSON.parse(localStorage.getItem(STORE) || "null"); d = cleanSave(raw); } catch {}
  if (!d) return false;
  $("#keep").checked = d.keep;
  offers = d.offers;
  // suivi seul : le CV et les offres n'ont pas été gardés, on repart sur une offre vide (sans toucher aux candidatures)
  cur = d.keep ? offers.find(o => o.id === d.cur) || offers[offers.length - 1] || null : null;
  if (cur) { fixes = cur.fixes; over = cur.over; $("#offer").value = cur.text; } else newOffer();
  me = d.me;
  if (d.keep && d.cv.text) { cvFile = {name: d.cv.name, info: d.cv.info, conf: d.cv.conf}; setCV(d.cv.text); showFile(d.cv.name || "Ton CV", d.cv.info || ""); }
  if (d.keep) {
    $("#resume").hidden = false;
    $("#resumetxt").textContent = [cvReady && tr("Ton CV", "Your CV"), offers.length && plural(offers.length, tr("offre", "offer"))].filter(Boolean).join(tr(" et ", " and ")) + (cvReady || offers.length ? tr(" sont là.", " are here.") : "");
  }
  if (raw.imported === true) setTimeout(() => toast(tr("Sauvegarde ouverte. Ta session est maintenant gardée sur cet appareil : tu peux décocher la case en bas de page.", "Backup opened. Your session is now kept on this device: you can untick the box at the bottom of the page."), 7000), 100);
  return true;
}
function wipe(){
  noSave = true; $("#keep").checked = false; clearTimeout(saveTimer);
  try { localStorage.removeItem(STORE); } catch {}
  history.replaceState(null, "", location.pathname + location.search);
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
  if (t.dataset.add) { stat("ajout-cv"); fixes[t.dataset.add].state = "accepted"; refresh(); return toast(tr("Ajouté à ton CV", "Added to your CV")); }
  if (t.dataset.over !== undefined) {
    const k = t.dataset.over, v = t.dataset.v;
    if (v) over[k] = v; else delete over[k];
    stat("tampon-corrige", {v: v || "auto"});
    results = analyse($("#offer").value); syncOffer(); renderResult(); save();
    return toast(v === "skip" ? tr("Point retiré du score", "Point removed from the score") : v ? tr("Tampon corrigé", "Stamp corrected") : tr("Revenu au calcul", "Back to the analysis"));
  }
  if (t.dataset.offer) return loadOffer(t.dataset.offer);
  if (t.dataset.deloffer) {
    offers = offers.filter(o => o.id !== t.dataset.deloffer);
    if (cur && cur.id === t.dataset.deloffer) { cur = null; $("#offer").value = ""; newOffer(); gates(); }
    renderOffers(); return save();
  }
  if (t.dataset.g) { cur.letter.g = t.dataset.g; $$("[data-g]").forEach(b => b.setAttribute("aria-pressed", b === t)); renderLetter(); return save(); }
  if (t.dataset.tone) { cur.letter.tone = t.dataset.tone; $$("[data-tone]").forEach(b => b.setAttribute("aria-pressed", b === t)); stat("lettre-ton", {t: t.dataset.tone}); renderLetter(); return save(); }
  if (t.dataset.share) { stat("bilan", {how: t.dataset.share}); return exportSummary(t.dataset.share); }
  if (t.dataset.typo) {
    const re = new RegExp(`(^|[^\\p{L}])${t.dataset.typo}(?=[^\\p{L}]|$)`, "gu");
    setCV($("#cvraw").value.replace(re, `$1${t.dataset.to}`)); refresh(); stat("relecture-faute");
    return toast(tr(`Corrigé : « ${t.dataset.to} »`, `Fixed: "${t.dataset.to}"`));
  }
  if (t.dataset.dl) {
    const [kind, how] = t.dataset.dl.split("-"), k = kind === "l" ? "letter" : "cv";
    stat("export", {what: k, how});
    return how === "docx" ? exportDocx(k) : how === "pdf" ? exportPdf(k) : exportCopy(k);
  }
  switch (t.id) {
    case "demo":
      stat("exemple");
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
  if (t.dataset.check) { (cur.check = cur.check || {})[t.dataset.check] = t.checked; renderChecklist(); return save(); }
});
document.addEventListener("change", e => {
  if (e.target.dataset.to !== undefined) { const k = e.target.dataset.to; fixes[k].to = e.target.value; renderRewrite(); save(); $$("[data-to]").find(x => x.dataset.to === k)?.focus(); return; }
  // décochée : le CV et les offres sont retirés de l'appareil, le suivi des candidatures reste (« Effacer mes données » enlève tout)
  if (e.target.id === "keep" && saveNow() !== false) { toast(keep() ? tr("Ta session restera sur cet appareil", "Your session will stay on this device") : offers.some(o => o.app) ? tr("Ton CV et tes offres ne sont plus gardés. Ton suivi reste sur cet appareil.", "Your CV and offers are no longer kept. Your tracker stays on this device.") : tr("Plus rien n'est gardé sur cet appareil", "Nothing is kept on this device any more"), 4000); }
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
// Annonce dans une autre langue de l'app que la page : on propose la bonne version (sans changer tout seul)
const LANGWORDS = {
  fr: "le la les des du et est pour avec vous nous une dans sur au aux vos votre notre qui que poste être nos ou par",
  en: "the and you for with our your are will to of is we this team be an as or have from",
  de: "und der die das mit für wir sie ist ein eine zu den von auf bei ihre unsere sich oder im",
  es: "el los las y con para por que una del es nuestro tu experiencia se al lo nuestra como",
  it: "il gli e con per che una del della di è nostro sei esperienza nel alla dei delle sono"
};
const STOPS = Object.fromEntries(Object.entries(LANGWORDS).map(([l, w]) => [l, new Set(w.split(" "))]));
function offerLang(t){
  const toks = t.toLowerCase().match(/[a-zàâäçéèêëîïôöùûüßñíóúì]+/g) || [];
  if (toks.length < MIN_WORDS) return null;
  const n = Object.fromEntries(Object.keys(STOPS).map(l => [l, toks.filter(w => STOPS[l].has(w)).length]));
  const best = Object.keys(n).sort((a, b) => n[b] - n[a])[0];
  return best !== LANG && n[best] >= 5 && n[best] >= 2 * n[LANG] ? best : null;
}
const LNAME = {fr: {fr: "français", en: "anglais", de: "allemand", es: "espagnol", it: "italien"}, en: {fr: "French", en: "English", de: "German", es: "Spanish", it: "Italian"},
  de: {fr: "Französisch", en: "Englisch", de: "Deutsch", es: "Spanisch", it: "Italienisch"}, es: {fr: "francés", en: "inglés", de: "alemán", es: "español", it: "italiano"}, it: {fr: "francese", en: "inglese", de: "tedesco", es: "spagnolo", it: "italiano"}};
const LSWITCH = {fr: "Passer à la version française", en: "Switch to the English version", de: "Zur deutschen Version wechseln", es: "Cambiar a la versión en español", it: "Passa alla versione italiana"};
let langSaid = null;
function checkLang(){
  const l = offerLang($("#offer").value);
  let el = $("#langhint");
  if (!l) { if (el) el.hidden = true; return; }
  if (!el) { el = document.createElement("p"); el.id = "langhint"; el.className = "notice langhint"; $("#cleaned").after(el); }
  el.innerHTML = `${esc(tr(`Cette annonce semble écrite en ${LNAME[LANG][l]}.`, `This ad seems to be written in ${LNAME.en[l]}.`))} ${esc(tr("L'analyse et la lettre marchent mieux dans la langue de l'annonce.", "The analysis and the letter work best in the language of the ad."))} <a href="${PAGES.app[l]}" hreflang="${l}" lang="${l}" data-handoff>${LSWITCH[l]}</a>`;
  el.hidden = false;
  if (langSaid !== l) { langSaid = l; stat("langue-annonce", {l}); }
}
// L'annonce suit dans la page de l'autre langue (gardée le temps de l'onglet, jamais envoyée)
document.addEventListener("click", e => {
  const a = e.target.closest("a[data-handoff]"); if (!a) return;
  try { sessionStorage.setItem("cacolle-handoff", $("#offer").value); localStorage.setItem("cacolle-lang", a.hreflang); } catch {}
});
$("#unclean").addEventListener("click", () => { $("#offer").value = rawOffer; $("#cleaned").hidden = true; gates(); save(); $("#offer").focus(); });
$("#lform").addEventListener("submit", e => e.preventDefault());
$("#offerfile").addEventListener("change", e => useOfferFile(e.target.files[0]));
const offerBox = $("#offer");
["dragenter", "dragover"].forEach(ev => offerBox.addEventListener(ev, e => { e.preventDefault(); offerBox.classList.add("over"); }));
["dragleave", "drop"].forEach(ev => offerBox.addEventListener(ev, e => { e.preventDefault(); offerBox.classList.remove("over"); }));
offerBox.addEventListener("drop", e => { e.stopPropagation(); if (e.dataTransfer.files[0]) useOfferFile(e.dataTransfer.files[0]); });
$("#file").addEventListener("change", e => useFile(e.target.files[0]));
let pasteTimer;
$("#cvpaste").addEventListener("input", e => { clearTimeout(pasteTimer); pasteTimer = setTimeout(() => usePasted(e.target.value), 400); });
$("#cvraw").addEventListener("input", e => { if (cvFile.pasted) $("#cvpaste").value = e.target.value; });
const drop = $("#drop");
["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("over"); }));
["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("over"); }));
drop.addEventListener("drop", e => { e.stopPropagation(); useFile(e.dataTransfer.files[0]); });
window.addEventListener("dragover", e => e.preventDefault());
window.addEventListener("drop", e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (!f) return; if (step === 1) useOfferFile(f); else if (canReach(2)) useFile(f); });

/* ---------- App installable, utilisable sans réseau ---------- */
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) navigator.serviceWorker.register("sw.js").then(() => navigator.serviceWorker.ready).then(r => r.active?.postMessage({lang: LANG})).catch(() => {});
let installEvt = null;
addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; $("#install").hidden = false; });
$("#install").addEventListener("click", async () => { if (!installEvt) return; installEvt.prompt(); const ch = await installEvt.userChoice.catch(() => ({})); if (ch.outcome === "accepted") stat("installation"); installEvt = null; $("#install").hidden = true; });
addEventListener("appinstalled", () => { $("#install").hidden = true; toast(tr("App installée", "App installed")); });
$("#ioshint").hidden = !(/iphone|ipad/i.test(navigator.userAgent) && !navigator.standalone);

if (!restore()) newOffer();
gates();
go(1);
(() => {
  let t = null; try { t = sessionStorage.getItem("cacolle-handoff"); sessionStorage.removeItem("cacolle-handoff"); } catch {}
  if (!t || !t.trim()) return;
  syncOffer(); if (cur.text.trim()) newOffer();
  $("#offer").value = t; gates(); go(1); save();
})();
navOn = true;
// « Partager vers Ça colle » depuis un site d'emploi (app installée sur téléphone) : ?title=…&text=…&url=…
(() => {
  const q = new URLSearchParams(location.search), title = q.get("title") || "", text = q.get("text") || "", url = q.get("url") || (text.match(/https?:\/\/\S+/) || [""])[0];
  if (!title && !text && !url) return;
  history.replaceState(null, "", location.pathname);
  const body = [title, text.replace(url, "").trim()].filter(Boolean).join("\n\n").trim();
  syncOffer(); if (cur.text.trim()) newOffer();
  $("#offer").value = words(body) >= MIN_WORDS ? body : url || body;
  if (words(body) >= MIN_WORDS) tidyOffer();
  gates(); go(1); save(); stat("partage-recu", {full: words(body) >= MIN_WORDS});
  toast(words(body) >= MIN_WORDS ? tr("Annonce reçue", "Ad received") : tr("Le site n'a envoyé que le lien : copie le texte de l'annonce", "The site only sent the link: copy the ad's text"));
})();
