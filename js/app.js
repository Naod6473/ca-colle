const OFFER = `Employé(e) logistique polyvalent(e) – CDI – Caen (exemple fictif)

Au sein de notre entrepôt, vous préparez les commandes et participez à la réception des marchandises.

Vos missions :
- Préparation de commandes et contrôle qualité
- Réception et rangement des livraisons
- Gestion des stocks et inventaires
- Conduite de chariot élévateur (CACES 1 et 3)
- Saisie informatique sur Excel

Profil recherché :
- Permis B indispensable
- Travail en équipe, ponctualité, rigueur
- Anglais de base apprécié
- Horaires en 2x8`;

/* CV fictif de démonstration, remplacé par le texte lu dans le vrai CV */
const SAMPLE_CV = `Camille Martin · Caen · 06 00 00 00 00
Expériences
Préparatrice de commandes, Drive Super U (2022-2025) : 120 commandes par jour, contrôle qualité des produits frais, travail en équipe de 6.
Vendeuse, boulangerie du centre (2020-2022) : ouverture à 6h, caisse, rangement des livraisons chaque matin.
Compétences
Excel, gestion des stocks, rigueur, ponctualité
Divers
Permis B, véhicule personnel`;

/* Découpage du CV : titres de rubrique reconnus, le reste devient des lignes rattachées à la rubrique */
const SECS = [
  ["exp", /^(exp[ée]riences?( professionnelles?)?|parcours( professionnel)?|emplois?|postes? occup[ée]s|work experience|experience)$/i],
  ["skills", /^(comp[ée]tences( cl[ée]s| techniques)?|savoir[- ]faire|savoir[- ][êe]tre|qualit[ée]s|outils|informatique|langues|skills|atouts)$/i],
  ["edu", /^(formations?|dipl[ôo]mes?|[ée]tudes|scolarit[ée]|education|formation et dipl[ôo]mes)$/i],
  ["misc", /^(divers|loisirs|centres? d'int[ée]r[êe]ts?|informations?( compl[ée]mentaires)?|autres|int[ée]r[êe]ts|hobbies)$/i]
];
function parseCV(text){
  const out = []; let kind = null, n = 0, named = false;
  text.split("\n").map(l => l.replace(/^[\s•●▪◦‣\-–—*·«»"'.,]+/, "").trim()).filter(Boolean).forEach(l => {
    // Ligne coupée par la mise en page (PDF, photo) : elle commence en minuscule, on la recolle à la précédente
    const prev = out[out.length - 1];
    if (/^[a-zà-ÿ(]/.test(l) && prev && prev.t && !prev.name) { prev.t += " " + l; return; }
    const bare = l.replace(/[\s:]+$/, "");
    const h = bare.split(/\s+/).length <= 4 && SECS.find(([, re]) => re.test(bare));
    if (h) { kind = h[0]; out.push({id:"s" + n++, sec:bare, kind}); return; }
    if (!named && !kind) { named = true; out.push({id:"nom", t:l, name:true}); return; }
    out.push({id:"l" + n++, t:l, exp: kind === "exp", kind: kind || "misc"});
  });
  // Pas de rubrique Expériences repérée : une ligne avec une année compte comme expérience
  if (!out.some(l => l.exp)) out.forEach(l => { if (l.t && !l.name && l.kind !== "edu" && /\b(19|20)\d\d\b/.test(l.t)) l.exp = true; });
  if (!out.some(l => l.kind === "skills" && l.t)) out.push({id:"sAuto", sec:"Compétences", kind:"skills", auto:true}, {id:"kAuto", t:"", kind:"skills", auto:true});
  return out;
}
let CV = parseCV(SAMPLE_CV);

/* Points de l'offre. fix = réécriture proposée : ligne visée, texte avec {trous}, question si c'est absent du CV */
const DICT = [
  {k:"Préparation de commandes", o:/pr[ée]paration de commandes?/i, c:/pr[ée]par\w* de commandes?/i, ok:"Tu donnes un chiffre (<em>120 par jour</em>), c'est parfait."},
  {k:"Contrôle qualité", o:/contr[ôo]le qualit[ée]/i, c:/contr[ôo]le qualit[ée]/i, ok:"Ton exemple des <em>produits frais</em> parle tout seul."},
  {k:"Réception des livraisons", o:/r[ée]ception/i, c:/livraisons?|r[ée]ception/i, ok:"Tu en parles pour la boulangerie."},
  {k:"Gestion des stocks", o:/gestion des stocks?/i, c:/gestion des stocks?|suivi des stocks/i,
    mid:"Le mot est dans ta liste, mais aucune expérience ne le montre.",
    fix:{line:"exp", why:"Montre où tu as géré du stock.", tpl:" Suivi des stocks de {quoi ? ex : farine et emballages} et commande {à quelle fréquence ? ex : chaque semaine}."}},
  {k:"Inventaires", o:/inventaires?/i, c:/inventaires?/i,
    no:"L'annonce le demande, ton CV n'en parle pas.",
    fix:{line:"exp", ask:"As-tu déjà participé à un inventaire ?", tpl:" Participation à l'inventaire annuel ({combien ? ex : 3 000} références).", nope:"Pas grave. Dis en entretien que tu sais compter et vérifier, avec l'exemple du contrôle qualité."}},
  {k:"CACES (chariot élévateur)", o:/caces|chariot/i, c:/caces|chariot|transpalette/i,
    no:"Souvent demandé en entrepôt.",
    fix:{line:"skills", ask:"As-tu le CACES ?", tpl:", CACES R489 catégories {lesquelles ? ex : 1 et 3} ({année})", nope:"Beaucoup d'entreprises le financent. Tu peux écrire dans ta lettre que tu es prête à le passer."}},
  {k:"Excel", o:/excel/i, c:/excel/i,
    mid:"Cité dans ta liste, sans dire à quoi il te sert.",
    fix:{line:"skills", find:"Excel", tpl:"Excel ({pour quoi faire ? ex : tableau de suivi des commandes})"}},
  {k:"Permis B", o:/permis b/i, c:/permis b/i, plain:true, ok:"Bien visible, et le véhicule est un plus."},
  {k:"Travail en équipe", o:/travail en [ée]quipe/i, c:/travail en [ée]quipe|[ée]quipe de/i, ok:"Tu donnes la taille de l'équipe."},
  {k:"Ponctualité", o:/ponctualit[ée]/i, c:/ponctualit[ée]|ouverture [àa] \d|6h/i, ok:"L'ouverture à 6h le prouve mieux qu'un mot."},
  {k:"Rigueur", o:/rigueur/i, c:/rigueur/i,
    mid:"Juste un mot dans ta liste. Il faut un exemple.",
    fix:{line:"exp", why:"Un fait concret prouve ta rigueur.", tpl:" {un exemple ? ex : aucune erreur de commande signalée en 2024}."}},
  {k:"Anglais", o:/anglais/i, c:/anglais|english/i,
    no:"« Apprécié » : pas bloquant, mais ça peut départager.",
    fix:{line:"skills", ask:"Tu parles un peu anglais ?", tpl:", anglais {ton niveau ? ex : scolaire}", nope:"Aucun souci, l'annonce dit seulement « apprécié »."}},
  {k:"Horaires en 2x8", o:/2x8|horaires d[ée]cal[ée]s/i, c:/2x8|ouverture [àa] \d|6h|horaires d[ée]cal[ée]s/i, ok:"Tes horaires à 6h montrent que tu sais te lever tôt."}
];

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = t => String(t).replace(/[&<>"]/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const LABEL = {ok:"Ça colle", mid:"À préciser", no:"Pas dans ton CV"};
let step = 3, filter = "all", active = null, results = [];
const fixes = {}; // k -> {vals:{}, state:"open"|"yes"|"accepted"|"skipped"}

$("#offer").value = OFFER;

const blanksOf = tpl => [...tpl.matchAll(/\{([^}]+)\}/g)].map(m => m[1]);
const filled = (k) => { const f = fixes[k], d = DICT.find(x => x.k === k); return blanksOf(d.fix.tpl).every((b,i) => (f.vals[i]||"").trim()); };
const fillTpl = (d, f) => { let i = 0; return d.fix.tpl.replace(/\{[^}]+\}/g, () => f.vals[i++] || ""); };

/* Ligne du CV où va une réécriture : celle qui contient le mot à remplacer, sinon la première expérience ou la ligne de compétences */
function targetId(d){
  const body = CV.filter(l => l.t !== undefined && !l.name && !l.sec);
  if (d.fix.find) { const l = body.find(l => l.t.toLowerCase().includes(d.fix.find.toLowerCase())); if (l) return l.id; }
  const skills = body.find(l => l.kind === "skills" && l.t) || CV.find(l => l.id === "kAuto");
  if (d.fix.line === "exp") return (body.find(l => l.exp) || skills).id;
  return skills.id;
}
const put = (s, a) => !s ? a.replace(/^[,.\s]+/, "").replace(/^./, c => c.toUpperCase()) : s.endsWith(".") && a.startsWith(",") ? s.slice(0, -1) + a + "." : s + a;

function cvLines(withIns){
  const lines = CV.map(l => {
    if (l.sec || l.name) return {...l};
    let t = esc(l.t), raw = l.t;
    DICT.filter(d => d.fix && fixes[d.k]?.state === "accepted" && targetId(d) === l.id).forEach(d => {
      const add = fillTpl(d, fixes[d.k]), wrap = x => withIns ? `<ins>${esc(x)}</ins>` : esc(x);
      const i = d.fix.find ? raw.toLowerCase().indexOf(d.fix.find.toLowerCase()) : -1;
      if (i >= 0) { const word = raw.substr(i, d.fix.find.length); t = t.replace(esc(word), wrap(add)); raw = raw.replace(word, add); }
      else {
        const a2 = d.fix.find ? ", " + add : add, before = raw.endsWith(".") && a2.startsWith(",");
        t = !raw ? wrap(put("", a2)) : before ? t.slice(0, -1) + wrap(a2) + "." : t + wrap(a2);
        raw = put(raw, a2);
      }
    });
    return {...l, html:t, raw};
  });
  const autoEmpty = !lines.find(l => l.id === "kAuto")?.raw;
  return lines.filter(l => !(l.auto && autoEmpty));
}

function analyse(){
  const offer = $("#offer").value, lines = cvLines(false);
  const exp = lines.filter(l => l.exp).map(l => l.raw).join("\n"), other = lines.filter(l => l.raw && !l.exp).map(l => l.raw).join("\n");
  results = DICT.filter(d => d.o.test(offer)).map(d => {
    let st = "no";
    if (fixes[d.k]?.state === "accepted") st = "ok";
    else if (d.c.test(exp)) st = "ok";
    else if (d.c.test(other)) st = d.plain ? "ok" : "mid";
    return {...d, st, fixedNow: fixes[d.k]?.state === "accepted"};
  });
  const words = offer.trim().split(/\s+/).filter(Boolean).length;
  $("#offer-meta").textContent = `${words} mots · ${results.length} points repérés dans l'annonce`;
}

const counts = () => ({ok:results.filter(r=>r.st==="ok").length, mid:results.filter(r=>r.st==="mid").length, no:results.filter(r=>r.st==="no").length});
const score = () => { const c = counts(), t = results.length || 1; return Math.round((c.ok + c.mid*.5)/t*100); };

function renderResult(){
  const c = counts(), p = score(), t = results.length;
  $("#pct").textContent = p + "%";
  $("#stamp").classList.toggle("good", p >= 80);
  $("#stamp-txt").textContent = p >= 80 ? "Ça colle" : p >= 50 ? "Ça colle presque" : "À retravailler";
  $("#sum").innerHTML = t ? `L'annonce demande <b>${t} choses</b>. Ton CV en prouve <b>${c.ok}</b>, en cite <b>${c.mid}</b> sans exemple, et oublie <b>${c.no}</b>.` : "Aucun point reconnu. Colle le texte complet de l'annonce à l'étape 1.";
  ["ok","mid","no"].forEach(s => { $("#m-"+s).style.flexGrow = c[s]; $("#n-"+s).textContent = c[s]; });
  const todo = results.filter(r => r.st !== "ok").sort((a,b) => (a.st==="no"?0:1)-(b.st==="no"?0:1)).slice(0,3);
  $("#prio").innerHTML = todo.length
    ? `<h3>À faire en premier</h3><ol>${todo.map(r => `<li><b>${esc(r.k)}</b> : ${r.st==="no"?"absent de ton CV":"à prouver avec un exemple"} <button class="btn small" data-fix="${esc(r.k)}">Réécrire</button></li>`).join("")}</ol>`
    : `<h3>✓ Rien d'urgent</h3><p class="tip">Ton CV couvre toute l'annonce. Tu peux l'envoyer.</p>`;
  const groups = ["no","mid","ok"].filter(s => filter === "all" || filter === s);
  $("#groups").innerHTML = groups.map(s => {
    const list = results.filter(r => r.st === s); if (!list.length) return "";
    return `<div class="group"><h3>${LABEL[s]} <span class="meta">(${list.length})</span></h3>${list.map(r => `
      <div class="row ${active===r.k?"on":""}" tabindex="0" role="button" data-k="${esc(r.k)}" aria-label="${esc(r.k)} : ${LABEL[s]}">
        <span class="stamp ${s}">${LABEL[s]}</span>
        <div class="kw"><b>${esc(r.k)}</b><p>${r.fixedNow ? "Ajouté à ton CV à l'étape 4." : (r[s] || r.ok || "")}</p></div>
        ${s !== "ok" && r.fix ? `<button class="btn small" data-fix="${esc(r.k)}">Réécrire</button>` : r.fixedNow ? `<span class="fixed">Corrigé</span>` : "<span></span>"}
      </div>`).join("")}</div>`;
  }).join("") || `<p class="tip">Rien dans cette catégorie.</p>`;
  paintCV("#cv3", false);
}

function paintCV(sel, withIns){
  const hit = active ? DICT.find(d => d.k === active) : null;
  $(sel).innerHTML = cvLines(withIns).map(l => l.name ? `<div class="name">${esc(l.t)}</div>` : l.sec ? `<div class="sec">${esc(l.sec)}</div>` :
    `<p>${hit && !withIns ? l.html.replace(new RegExp(hit.c.source,"gi"), m => `<mark>${m}</mark>`) : l.html}</p>`).join("");
}

function renderRewrite(){
  const list = results.filter(r => r.fix && (r.st !== "ok" || r.fixedNow));
  DICT.forEach(d => { if (d.fix && !fixes[d.k]) fixes[d.k] = {vals:{}, state: d.fix.ask ? "open" : "yes"}; });
  $("#sugs").innerHTML = list.map(r => {
    const f = fixes[r.k], b = blanksOf(r.fix.tpl); let i = 0;
    const line = CV.find(l => l.id === targetId(r));
    const after = esc(r.fix.tpl).replace(/\{([^}]+)\}/g, (m, ph) => { const j = i++; return `<input class="blank" data-k="${esc(r.k)}" data-i="${j}" placeholder="${esc(ph)}" value="${esc(f.vals[j]||"")}" size="${Math.max(6, ph.length - 2)}" aria-label="${esc(ph)}">`; });
    let body;
    if (f.state === "open") body = `<div class="ask">${esc(r.fix.ask)} <button class="btn small" data-yes="${esc(r.k)}">Oui</button><button class="btn small ghost" data-no="${esc(r.k)}">Non</button></div>`;
    else if (f.state === "skipped") body = `<p class="tip">${esc(r.fix.nope || "Ignoré.")} <button class="btn small ghost" data-undo="${esc(r.k)}">Revenir</button></p>`;
    else body = `<div class="ba">
        <div><span class="lab">Où</span><span class="meta">${line.exp ? "Expérience : " + esc(line.t.split(/[,:(]/)[0].slice(0, 60)) : "Compétences"}</span></div>
        <div><span class="lab">Ajout</span><span class="after">${r.fix.find ? `<span class="before">${esc(r.fix.find)}</span> → ` : "… "}${after}</span></div>
      </div>
      <div class="sug-a">${f.state === "accepted"
        ? `<span class="stamp ok">Ajouté</span><button class="btn small ghost" data-undo="${esc(r.k)}">Retirer</button>`
        : `<button class="btn small" data-add="${esc(r.k)}" ${filled(r.k) ? "" : "disabled"}>Ajouter à mon CV</button><small>${filled(r.k) ? "Prêt." : "Complète les trous d'abord."}</small>`}</div>`;
    return `<div class="sug ${f.state === "accepted" ? "accepted" : f.state === "skipped" ? "skipped" : ""}">
      <div class="sug-h"><b>${esc(r.k)}</b><span class="stamp ${r.fixedNow ? "ok" : r.st}">${r.fixedNow ? "Ça colle" : LABEL[r.st]}</span></div>
      ${r.fix.why && f.state !== "skipped" ? `<p class="tip">${esc(r.fix.why)}</p>` : ""}${body}</div>`;
  }).join("") || `<p class="tip">Rien à réécrire pour cette offre.</p>`;
  $("#score4").textContent = `· ${score()}% de l'annonce couverte`;
  paintCV("#cv4", true);
}

function go(n){
  step = n; analyse();
  $$(".step").forEach(s => s.setAttribute("aria-selected", s.dataset.to == n));
  $$("[data-p]").forEach(p => p.classList.toggle("show", p.dataset.p == n));
  $$(".step").forEach(s => s.classList.toggle("done", +s.dataset.to < n || (+s.dataset.to <= 2)));
  if (n === 3) renderResult(); if (n === 4) renderRewrite();
}
function toast(t){ const el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => el.hidden = true, 1800); }

document.addEventListener("click", e => {
  const t = e.target.closest("button,[data-k].row"); if (!t) return;
  if (t.dataset.to) { go(+t.dataset.to); $(".steps").scrollIntoView({block:"nearest"}); return; }
  if (t.dataset.fix) { e.stopPropagation(); go(4); return; }
  if (t.dataset.f) { filter = t.dataset.f; $$(".chip").forEach(c => c.setAttribute("aria-pressed", c === t)); renderResult(); return; }
  if (t.classList.contains("row")) { active = active === t.dataset.k ? null : t.dataset.k; renderResult(); return; }
  if (t.dataset.yes) { fixes[t.dataset.yes].state = "yes"; renderRewrite(); return; }
  if (t.dataset.no) { fixes[t.dataset.no].state = "skipped"; renderRewrite(); return; }
  if (t.dataset.undo) { fixes[t.dataset.undo].state = DICT.find(d=>d.k===t.dataset.undo).fix.ask ? "open" : "yes"; analyse(); renderRewrite(); return; }
  if (t.dataset.add) { fixes[t.dataset.add].state = "accepted"; analyse(); renderRewrite(); toast("Ajouté à ton CV"); return; }
  if (t.id === "sample") { setCV(SAMPLE_CV); $("#fname").textContent = "Exemple : CV de Camille Martin"; $("#finfo").textContent = "CV fictif pour essayer"; t.hidden = true; return; }
  if (t.id === "copy") {
    const txt = cvLines(false).map(l => l.name ? l.t : l.sec ? "\n" + l.sec.toUpperCase() : l.raw).join("\n");
    const done = () => toast("Texte copié");
    try { navigator.clipboard.writeText(txt).then(done, () => toast("Sélectionne le texte pour le copier")); } catch { toast("Sélectionne le texte pour le copier"); }
  }
});
document.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.classList?.contains("row")) { e.preventDefault(); e.target.click(); } });
document.addEventListener("input", e => {
  if (e.target.id === "offer") { analyse(); return; }
  if (e.target.id === "cvraw") { clearTimeout(cvTimer); cvTimer = setTimeout(() => setCV(e.target.value, true), 300); return; }
  if (e.target.classList.contains("blank")) {
    const k = e.target.dataset.k; fixes[k].vals[e.target.dataset.i] = e.target.value;
    const card = e.target.closest(".sug"), btn = card.querySelector("[data-add]"), sm = card.querySelector(".sug-a small");
    if (btn) { btn.disabled = !filled(k); sm.textContent = filled(k) ? "Prêt." : "Complète les trous d'abord."; }
  }
});
/* Lecture du vrai CV (js/lecteur.js) */
let cvTimer;
function setCV(text, typed){
  CV = parseCV(text);
  if (!typed) $("#cvraw").value = text;
  const exp = CV.filter(l => l.exp).length, secs = CV.filter(l => l.sec && !l.auto).length;
  $("#cvsum").textContent = `${CV.filter(l => l.t).length} lignes lues · ${exp} expérience${exp > 1 ? "s" : ""} repérée${exp > 1 ? "s" : ""}` +
    (secs ? "" : " · aucun titre de rubrique trouvé (Expériences, Compétences…), ajoute-les dans le texte pour un meilleur résultat");
  analyse();
}
async function useFile(f){
  if (!f) return;
  const job = $("#job"), card = $("#filecard");
  $("#ferr").hidden = true; job.hidden = false; card.classList.add("busy");
  $("#fname").textContent = f.name; $("#finfo").textContent = "Lecture en cours…";
  try {
    const r = await readCV(f, (p, m) => { $("#jbar").style.width = Math.round(p * 100) + "%"; $("#jobtxt").textContent = m; });
    setCV(r.text);
    $("#finfo").textContent = r.info + (r.conf && r.conf < 75 ? " · relis bien le texte ci-dessous" : "");
    $("#sample").hidden = false;
    toast("CV lu");
  } catch (e) {
    $("#ferr").textContent = e.message || "Je n'ai pas réussi à lire ce fichier. Essaie un PDF.";
    $("#ferr").hidden = false; $("#finfo").textContent = "Pas lu"; $("#sample").hidden = false;
  } finally { job.hidden = true; card.classList.remove("busy"); $("#file").value = ""; }
}
$("#file").addEventListener("change", e => useFile(e.target.files[0]));
const drop = $("#drop");
["dragenter","dragover"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("over"); }));
["dragleave","drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("over"); }));
drop.addEventListener("drop", e => { e.stopPropagation(); useFile(e.dataTransfer.files[0]); });
window.addEventListener("dragover", e => e.preventDefault());
window.addEventListener("drop", e => { e.preventDefault(); if (step !== 2) go(2); useFile(e.dataTransfer.files[0]); });

setCV(SAMPLE_CV);
go(3);
