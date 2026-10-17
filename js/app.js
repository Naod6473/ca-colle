// Interface de Ça colle ? : 5 étapes (offre, CV, résultat, améliorer, lettre), plusieurs offres, session gardée
// sur l'appareil si on le choisit. Le calcul est dans js/moteur.js, la lecture des fichiers dans js/lecteur.js,
// les exports Word / PDF dans js/export.js.
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const MIN_WORDS = 25, STORE = "cacolle-v1";
let step = 1, filter = "all", results = [], cvReady = false;
let cvFile = {name: "", info: "", conf: 0};
let me = {name: "", contact: ""};          // pour la lettre, commun à toutes les offres
let offers = [], cur = null;               // offres comparées au même CV

const words = t => t.trim() ? t.trim().split(/\s+/).length : 0;
const isLink = t => /^\s*(https?:\/\/|www\.)\S+\s*$/i.test(t);
const offerOk = () => words($("#offer").value) >= MIN_WORDS && !isLink($("#offer").value);
const canReach = n => n === 1 || (n === 2 && offerOk()) || (n >= 3 && offerOk() && cvReady);
const plural = (n, w) => `${n} ${w}${n > 1 ? "s" : ""}`;

function toast(t){ const el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => el.hidden = true, 2200); }

/* ---------- Offres ---------- */
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const titleOf = t => { const l = (t.split("\n").find(x => x.trim()) || "Offre").trim().replace(/\s*\(exemple fictif\)/i, ""); return l.length > 60 ? l.slice(0, 57) + "…" : l; };
function newOffer(text = ""){ cur = {id: newId(), text, fixes: {}, letter: {}}; fixes = cur.fixes; offers.push(cur); }
function syncOffer(){
  if (!cur) newOffer();
  cur.text = $("#offer").value; cur.title = titleOf(cur.text); cur.fixes = fixes;
  if (cvReady && offerOk()) cur.score = scoreOf(analyse(cur.text));
}
function loadOffer(id){
  syncOffer();
  const o = offers.find(x => x.id === id); if (!o) return;
  cur = o; fixes = o.fixes; $("#offer").value = o.text; gates();
  go(canReach(3) ? 3 : 1);
}
function renderOffers(){
  const list = offers.filter(o => o.text && o.text.trim());
  $("#offersbox").hidden = list.length < 1 || !cvReady;
  $("#offers").innerHTML = list.map(o => `<li class="${o === cur ? "on" : ""}">
    <button type="button" data-offer="${o.id}"><b>${esc(o.title || titleOf(o.text))}</b>${o.score != null ? `<span class="score">${o.score} %</span>` : ""}</button>
    <button type="button" class="del" data-deloffer="${o.id}" aria-label="Retirer cette offre">✕</button></li>`).join("");
}

/* ---------- Onglets et navigation : on n'avance que quand l'étape d'avant est remplie ---------- */
function gates(){
  const v = $("#offer").value, w = words(v);
  $("#next1").disabled = !offerOk();
  $("#linkhelp").hidden = !isLink(v);
  $("#hint1").textContent = isLink(v) ? "Colle le texte de l'annonce, pas son lien." : w === 0 ? "Colle au moins quelques lignes de l'annonce." : offerOk() ? `${w} mots, c'est bon.` : `${w} mots : colle l'annonce en entier, il en faut au moins ${MIN_WORDS}.`;
  $("#next2").disabled = !cvReady;
  $$(".tab").forEach(t => {
    const n = +t.dataset.step;
    t.disabled = !canReach(n);
    t.title = t.disabled ? (n === 2 ? "Colle d'abord l'offre" : "Ajoute d'abord l'offre et ton CV") : "";
    t.classList.toggle("done", (n === 1 && offerOk()) || (n === 2 && cvReady));
  });
}
function go(n){
  if (!canReach(n)) return;
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
const HELP = {
  mid: "C'est dans ton CV, mais sans exemple. Ajoute un fait concret : un chiffre, un lieu, une durée.",
  no: "L'offre le demande. Si tu l'as déjà fait, même en job d'été, en stage ou en bénévolat, ajoute-le.",
  s: "L'offre le demande. Montre-le par un fait dans une expérience, pas seulement par un mot."
};
// Extrait du CV où le point est trouvé (dans les expériences seulement si onlyExp)
function excerpt(r, onlyExp){
  const lines = cvLines(false).filter(l => l.raw && (!onlyExp || l.exp));
  let l, m;
  if (r.re) { l = lines.find(l => r.re.test(fold(l.raw))); if (l) m = fold(l.raw).match(r.re); }
  else if (r.tk) { for (const w of r.tk) { l = lines.find(x => fold(x.raw).includes(w)); if (l) { const i = fold(l.raw).indexOf(w); m = {index: i, 0: w}; break; } } }
  if (!l || !m) return "";
  const a = Math.max(0, m.index - 45), b = Math.min(l.raw.length, m.index + m[0].length + 45);
  return (a ? "…" : "") + l.raw.slice(a, b).trim() + (b < l.raw.length ? "…" : "");
}
function explain(r, s){
  if (r.fixedNow) return "Ajouté à ton CV à l'étape 4.";
  if (r.type === "y") return s === "ok" ? `Ton CV montre environ ${plural(r.have, "an")} d'expérience.`
    : s === "mid" ? "Je ne trouve pas de dates dans ton CV. Ajoute les années de chaque poste (ex : 2022 - 2025) pour qu'on les compte."
    : `Ton CV montre environ ${plural(r.have, "an")}. Pense à ajouter tes stages, jobs d'été, intérim ou bénévolat.`;
  if (s === "no") return r.type === "s" ? HELP.s : HELP.no;
  const x = excerpt(r, s === "ok" && r.type !== "l" && r.type !== "h" && r.type !== "d");
  if (s === "ok") return x ? `Prouvé dans ton CV : <span class="proof">« ${esc(x)} »</span>` : "C'est dans ton CV.";
  return HELP.mid + (x ? ` Trouvé ici : <span class="proof">« ${esc(x)} »</span>` : "");
}
const tagOf = r => r.prio === "must" ? `<i class="tag must">Indispensable</i>` : r.prio === "nice" ? `<i class="tag nice">Un plus</i>` : "";
const urgency = r => (r.st === "no" ? 0 : 2) + (r.prio === "must" ? 0 : r.prio === "nice" ? 3 : 1);

function renderResult(){
  const c = countOf(results), p = scoreOf(results), t = results.length;
  $("#pct").textContent = p;
  $("#verdict").textContent = !t ? "à vérifier" : p >= 80 ? "ça colle !" : p >= 50 ? "ça colle presque" : "à retravailler";
  const must = results.filter(r => r.prio === "must" && r.st === "no").length;
  $("#sum").textContent = t
    ? `L'offre demande ${plural(t, "chose")}. Ton CV en prouve ${c.ok}, en cite ${c.mid} sans exemple et n'en parle pas pour ${c.no}.` + (must ? ` Attention : ${must > 1 ? `${must} points indispensables manquent` : "un point indispensable manque"}.` : "")
    : "Je n'ai reconnu aucun point dans cette offre.";
  $("#n-all").textContent = t; ["ok", "mid", "no"].forEach(s => $("#n-" + s).textContent = c[s]);

  const todo = results.filter(r => r.st !== "ok").sort((a, b) => urgency(a) - urgency(b)).slice(0, 3);
  $("#prio").innerHTML = !t ? `<p>Rien à corriger pour l'instant.</p>`
    : todo.length ? `<ul class="prio-list">${todo.map(r => `<li><b>${esc(r.k)}</b><small>${r.st === "no" ? "absent de ton CV" : "à prouver avec un exemple"}${r.prio === "must" ? " · indispensable" : ""}</small>${r.fix ? `<button class="btn small" data-fix="${esc(r.k)}">Corriger</button>` : ""}</li>`).join("")}</ul>
      <button class="btn wide" data-go="4">Améliorer mon CV →</button>`
    : `<p><b>Rien d'urgent.</b> Ton CV couvre tout ce que demande l'offre.</p><button class="btn wide" data-go="5">Préparer ma lettre →</button>`;

  const groups = ["no", "mid", "ok"].filter(s => filter === "all" || filter === s);
  const notice = t < 4 ? `<p class="notice">Je n'ai repéré que ${plural(t, "point")} dans cette offre. Vérifie que tu as collé l'annonce en entier, avec les missions et le profil recherché.</p>` : "";
  const vocab = results.filter(r => r.vocab);
  const ats = atsCheck($("#cvraw").value, cvFile.info), atsOk = ats.filter(a => a.ok).length;
  $("#groups").innerHTML = notice + groups.map(s => {
    const list = results.filter(r => r.st === s).sort((a, b) => urgency(a) - urgency(b)); if (!list.length) return "";
    return `<section class="group"><h2 class="section-title" style="--k: ${s === "ok" ? "var(--green)" : s === "mid" ? "var(--yellow)" : "var(--pink)"}">${LABEL[s]} (${list.length})</h2><div class="points">${list.map(r => `
      <article class="point">
        <div class="point-h"><i class="stamp ${s}">${LABEL[s]}</i>${tagOf(r)}</div>
        <h3>${esc(r.k)}</h3>
        <p>${explain(r, s)}</p>
        ${r.vocab ? `<p class="vocab">Ton CV dit « ${esc(r.vocab.cv)} », l'offre dit « ${esc(r.vocab.offer)} ».</p>` : ""}
        ${s !== "ok" && r.fix ? `<button class="btn small" data-fix="${esc(r.k)}">Corriger ce point</button>` : ""}
      </article>`).join("")}</div></section>`;
  }).join("")
  + (vocab.length ? `<section class="group"><h2 class="section-title" style="--k: var(--blue)">Les mots de l'annonce</h2>
      <p class="hint">Les recruteurs et leurs logiciels cherchent les mots exacts de l'offre. Reprends-les dans ton CV quand c'est vrai.</p>
      <ul class="words">${vocab.map(r => `<li><span class="w-cv">${esc(r.vocab.cv)}</span><span aria-hidden="true">→</span><span class="w-offer">${esc(r.vocab.offer)}</span></li>`).join("")}</ul></section>` : "")
  + `<section class="group"><h2 class="section-title" style="--k: var(--orange)">Test robot recruteur · ${atsOk} sur ${ats.length}</h2>
      <p class="hint">Beaucoup d'entreprises trient les CV avec un logiciel avant qu'une personne les lise. Voici ce qui peut le gêner.</p>
      <ul class="ats">${ats.map(a => `<li class="${a.ok ? "ok" : "ko"}"><b><span aria-hidden="true">${a.ok ? "✓" : "✕"}</span> ${esc(a.label)}</b>${a.ok ? "" : `<span>${esc(a.help)}</span>`}<span class="sr-only">${a.ok ? " : bon" : " : à corriger"}</span></li>`).join("")}</ul></section>`;
}

/* ---------- Étape 4 : améliorer le CV ---------- */
function ensureFix(r){
  const f = fixes[r.k];
  if (!f) fixes[r.k] = {vals: {}, state: r.fix.ask ? "open" : "yes", fix: r.fix};
  else if (f.state !== "accepted" && f.state !== "skipped") f.fix = r.fix;
  return fixes[r.k];
}
const whereOf = line => !line ? "tes compétences" : line.exp ? "ton expérience : " + line.t.split(/[,:(]/)[0].slice(0, 60) : line.kind === "edu" ? "ta formation" : "tes compétences";
function renderRewrite(){
  const list = results.filter(r => r.fix && (r.st !== "ok" || r.fixedNow)).sort((a, b) => urgency(a) - urgency(b));
  $("#sugs").innerHTML = list.map(r => {
    const f = ensureFix(r), fix = f.fix, line = CV.find(l => l.id === targetId(fix)); let i = 0;
    const blanks = esc(fix.tpl).replace(/\{([^}]+)\}/g, (m, ph) => { const j = i++; return `<input class="blank" data-k="${esc(r.k)}" data-i="${j}" placeholder="${esc(ph)}" value="${esc(f.vals[j] || "")}" size="${Math.max(8, Math.min(40, ph.length - 4))}" aria-label="${esc(ph)}">`; });
    let body;
    if (f.state === "open") body = `<div class="ask">${esc(fix.ask)} <button class="btn small" data-yes="${esc(r.k)}">Oui</button><button class="btn light small" data-no="${esc(r.k)}">Non</button></div>`;
    else if (f.state === "skipped") body = `<p>${esc(fix.nope || "Point laissé de côté.")}</p><div class="sug-a"><button class="btn light small" data-undo="${esc(r.k)}">Revenir sur ce point</button></div>`;
    else body = `${fix.why ? `<p>${esc(fix.why)}</p>` : ""}
      <span class="where">Dans ${esc(whereOf(line))}</span>
      <div class="sentence">${fix.find ? `<span class="old">${esc(fix.find)}</span> → ` : "… "}${blanks}</div>
      <div class="sug-a">${f.state === "accepted"
        ? `<i class="stamp ok">Ajouté</i><button class="btn light small" data-undo="${esc(r.k)}">Retirer</button>`
        : `<button class="btn small" data-add="${esc(r.k)}" ${filled(r.k) ? "" : "disabled"}>Ajouter à mon CV</button><small>${filled(r.k) ? "Prêt." : "Remplis les cases jaunes."}</small>`}</div>`;
    return `<article class="sug ${f.state === "accepted" ? "accepted" : f.state === "skipped" ? "skipped" : ""}">
      <div class="sug-h"><h3>${esc(r.k)}</h3><span class="point-h">${tagOf(r)}<i class="stamp ${r.fixedNow ? "ok" : r.st}">${r.fixedNow ? "Ça colle" : LABEL[r.st]}</i></span></div>${body}</article>`;
  }).join("") || `<p class="notice">Rien à améliorer pour cette offre : ton CV couvre déjà tout ce qu'on sait repérer.</p>`;
  const p = scoreOf(results), c = countOf(results);
  $("#score4").textContent = p + " %"; $("#meter4").style.width = p + "%";
  $("#score4txt").textContent = `${c.ok} point${c.ok > 1 ? "s" : ""} sur ${results.length} prouvé${c.ok > 1 ? "s" : ""} dans ton CV.`;
  $("#cv4").innerHTML = cvHTML(true);
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
  if (!me.contact) me.contact = [all.match(/[\w.+-]+@[\w-]+\.[a-z.]{2,}/i)?.[0], all.match(/(\+33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/)?.[0]].filter(Boolean).join(" · ");
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
    : `<p class="hint">Aucun point fort trouvé pour l'instant : améliore d'abord ton CV à l'étape 4.</p>`;
  renderLetter();
}
const sentence = t => { t = t.trim(); t = t.charAt(0).toUpperCase() + t.slice(1); return /[.!?…]$/.test(t) ? t : t + "."; };
const clip = t => t.replace(/^…\s*|\s*…$/g, "").replace(/^\(?\d{4}\s*[-–]\s*\d{4}\)\s*:?\s*/, "").replace(/\s*:\s*$/, "").trim();
function letterText(){
  const L = cur.letter, job = L.job || "[intitulé du poste]", co = L.company || "[nom de l'entreprise]";
  const strong = results.filter(r => L.strengths.includes(r.k) && r.st === "ok").map(r => {
    const x = clip(excerpt(r, false));
    return `- ${r.k}${x ? " : " + x : ""}`;
  });
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
  $("#l-edit").textContent = L.frozen ? "Revenir au modèle" : "Modifier le texte";
  if (L.frozen) { if ($("#letteredit").value !== L.text) $("#letteredit").value = L.text; return; }
  $("#letter").innerHTML = letterText().split("\n").map(l => l ? `<p>${esc(l).replace(/\[[^\]]+\]/g, m => `<mark class="miss">${m}</mark>`)}</p>` : `<p class="gap"></p>`).join("");
}

/* ---------- Exports ---------- */
function exportDocx(kind){
  if (kind === "cv") {
    const paras = cvLines(false).flatMap(l => l.name ? (([n, r]) => [{text: n, style: "title"}, ...(r ? [{text: r}] : [])])(splitName(l.t)) : l.sec ? {text: l.sec.toUpperCase(), style: "head"} : {text: l.raw});
    Export.download(Export.docx(paras), `CV_${fileBase(personName())}.docx`);
  } else {
    Export.download(Export.docx(currentLetter().split("\n").map(text => ({text}))), `Lettre_${fileBase(cur.letter.company || "motivation")}.docx`);
  }
  toast("Fichier Word téléchargé");
}
function exportPdf(kind){
  const html = kind === "cv" ? `<div class="p-cv">${cvHTML(false)}</div>` : `<div class="p-letter">${currentLetter().split("\n").map(l => `<p>${esc(l) || "&nbsp;"}</p>`).join("")}</div>`;
  toast("Choisis « Enregistrer en PDF »");
  setTimeout(() => Export.printHTML(html), 300);
}
async function exportCopy(kind){
  toast(await Export.copy(kind === "cv" ? cvText() : currentLetter()) ? "Texte copié" : "Copie impossible : sélectionne le texte");
}

/* ---------- Étape 2 : lecture du CV ---------- */
let cvTimer;
function setCV(text, typed){
  CV = parseCV(text); cvReady = text.trim().length > 0;
  if (!typed) $("#cvraw").value = text;
  const n = CV.filter(l => l.t).length, exp = CV.filter(l => l.exp).length, secs = CV.filter(l => l.sec && !l.auto).length;
  $("#cvsum").textContent = `${n} lignes · ${exp} expérience${exp > 1 ? "s" : ""} repérée${exp > 1 ? "s" : ""}` + (secs ? "" : " · aucun titre de rubrique trouvé (Expériences, Compétences…)");
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
    showFile(f.name, r.info + (r.conf && r.conf < 75 ? " · relis le texte lu, la photo n'était pas très nette" : ""));
    if (r.conf && r.conf < 75) $("#check").open = true;
    toast("CV lu");
  } catch (e) {
    $("#ferr").textContent = e.message || "Je n'ai pas réussi à lire ce fichier. Essaie un PDF.";
    $("#ferr").hidden = false;
  } finally { $("#job").hidden = true; $("#file").value = ""; }
}

/* ---------- Étape 1 : offre jointe en fichier ---------- */
async function useOfferFile(f){
  if (!f) return;
  $("#oerr").hidden = true; $("#ojob").hidden = false;
  try {
    const r = await readCV(f, (p, m) => { $("#ojbar").style.width = Math.round(p * 100) + "%"; $("#ojobtxt").textContent = m; });
    $("#offer").value = r.text; gates(); save();
    toast("Offre lue");
    if (r.conf && r.conf < 75) { $("#oerr").textContent = "La capture n'était pas très nette : relis le texte de l'offre avant de continuer."; $("#oerr").hidden = false; }
  } catch (e) {
    $("#oerr").textContent = (e.message || "Je n'ai pas réussi à lire ce fichier.").replace(/ton CV/g, "l'offre");
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
  const data = {v: 1, cv: {text: $("#cvraw").value, ...cvFile}, me, cur: cur?.id, offers: offers.filter(o => o.text.trim()).map(o => ({id: o.id, text: o.text, title: o.title, score: o.score, fixes: o.fixes, letter: o.letter}))};
  try { localStorage.setItem(STORE, JSON.stringify(data)); } catch {}
}
function save(){ clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 400); }
addEventListener("pagehide", saveNow);
function restore(){
  let d; try { d = JSON.parse(localStorage.getItem(STORE) || "null"); } catch {}
  if (!d || d.v !== 1) return false;
  $("#keep").checked = true;
  offers = (d.offers || []).map(o => ({...o, fixes: o.fixes || {}, letter: o.letter || {}}));
  cur = offers.find(o => o.id === d.cur) || offers[offers.length - 1] || null;
  if (cur) { fixes = cur.fixes; $("#offer").value = cur.text; }
  me = d.me || me;
  if (d.cv?.text) { cvFile = {name: d.cv.name, info: d.cv.info, conf: d.cv.conf}; setCV(d.cv.text); showFile(d.cv.name || "Ton CV", d.cv.info || ""); }
  $("#resume").hidden = false;
  $("#resumetxt").textContent = [cvReady && "Ton CV", offers.length && plural(offers.length, "offre")].filter(Boolean).join(" et ") + (cvReady || offers.length ? " sont là." : "");
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
  if (t.dataset.add) { fixes[t.dataset.add].state = "accepted"; refresh(); return toast("Ajouté à ton CV"); }
  if (t.dataset.offer) return loadOffer(t.dataset.offer);
  if (t.dataset.deloffer) {
    offers = offers.filter(o => o.id !== t.dataset.deloffer);
    if (cur && cur.id === t.dataset.deloffer) { cur = null; fixes = {}; $("#offer").value = ""; newOffer(); gates(); }
    renderOffers(); return save();
  }
  if (t.dataset.dl) {
    const [kind, how] = t.dataset.dl.split("-"), k = kind === "l" ? "letter" : "cv";
    return how === "docx" ? exportDocx(k) : how === "pdf" ? exportPdf(k) : exportCopy(k);
  }
  switch (t.id) {
    case "demo":
      syncOffer(); if (cur.text.trim() && cur.text !== OFFER) newOffer();
      $("#offer").value = OFFER; cvFile = {name: "Exemple : CV de Camille Martin", info: "CV fictif pour essayer", conf: 0}; me = {name: "", contact: ""};
      setCV(SAMPLE_CV); showFile(cvFile.name, cvFile.info);
      return go(3);
    case "newoffer": case "compare":
      syncOffer(); newOffer(); $("#offer").value = ""; go(1); $("#offer").focus(); return toast("Colle la nouvelle offre : ton CV est gardé");
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
    if (btn) { btn.disabled = !filled(k); sm.textContent = filled(k) ? "Prêt." : "Remplis les cases jaunes."; }
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
  if (e.target.id === "keep") { if (keep()) { save(); toast("Ta session restera sur cet appareil"); } else { try { localStorage.removeItem(STORE); } catch {} toast("Plus rien n'est gardé sur cet appareil"); } }
});
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.classList.contains("blank")) { const b = e.target.closest(".sug").querySelector("[data-add]"); if (b && !b.disabled) b.click(); }
});
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

if (!restore()) newOffer();
gates();
go(1);
