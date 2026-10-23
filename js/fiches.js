// Documents à imprimer : le CV mis en page (étape 4, PDF ou Word) et la fiche entretien d'une page (étape 3 ou suivi, PDF).
// Rien n'est inventé : on range seulement les lignes du CV (avec les ajouts de l'étape 4) et ce que l'analyse a trouvé.

/* ---------- CV mis en page : une colonne, des titres clairs, sans tableau ni image ---------- */
const isContact = t => /@|https?:\/\/|www\.|linkedin|(\d[\s.-]?){9,}|\b\d{4,5}\s+\p{Lu}/iu.test(t);
const prettyHead = h => { h = h.replace(/[\s:]+$/, "").trim(); return h === h.toUpperCase() ? h.charAt(0) + h.slice(1).toLowerCase() : h; };
// Rubrique du CV → titre du modèle : Expérience, Compétences, Formation ; les autres gardent leur titre (Langues, Loisirs…)
function headOf(l){
  if (l.kind === "exp") return tr("Expérience", "Experience");
  if (l.kind === "edu") return tr("Formation", "Education");
  if (l.kind === "skills") return l.auto || !/langu|sprach|idiom|lingu|informati|outils|logiciel|tools|software|werkzeug|strument|herramient/.test(fold(l.sec)) ? tr("Compétences", "Skills") : prettyHead(l.sec);
  return prettyHead(l.sec);
}
// [{name}, {sub}, {contact}, {h, kind, items: [{t, b, li}]}]
function cvLayout(){
  const lines = cvLines(false), jobs = jobsOf(), heads = new Set();
  // Intitulé du poste : les lignes jusqu'à celle des dates (« Vendeuse | Kiabi » puis « 2019 - 2024 »)
  jobs.forEach(j => { if (!j.multi) return; const k = j.lines.findIndex(l => YEAR.test(l.t)); j.lines.slice(0, k + 1 || 1).forEach(l => heads.add(l.id)); });
  let name = "", sub = "", sec = null, body = false;
  const contact = [], secs = [], other = {h: tr("Autres", "Other"), kind: "other", items: []};
  const bucket = (h, kind) => { let s = secs.find(x => x.h === h); if (!s) secs.push(s = {h, kind, items: []}); return s; };
  lines.forEach(l => {
    if (l.name) { const [n, r] = splitName(l.t); name = n; if (r) contact.push(r); return; }
    if (l.sec) { sec = l; return; }
    const t = (l.raw ?? l.t ?? "").trim(); if (!t) return;
    // Haut du CV, avant toute rubrique : coordonnées, puis l'intitulé du métier s'il est court
    if (!sec && !l.exp && !body) {
      if (isContact(t)) return contact.push(t);
      if (!sub && t.split(/\s+/).length <= 8 && !YEAR.test(t)) { sub = t; return; }
    }
    body = true;
    // Titre de rubrique mal écrit (« Expériences professionelles »), pas reconnu par l'analyse : il ne reste pas comme une ligne
    if (!l.exp && t.split(/\s+/).length <= 3 && !/\d/.test(t) && /^(experi|erfahrung|berufserfahrung|esperien|experien)/.test(fold(t)) && lines[lines.indexOf(l) + 1]?.exp) return;
    const s = l.exp ? bucket(tr("Expérience", "Experience"), "exp") : sec ? bucket(headOf(sec), sec.kind) : other;
    const multi = jobs.some(j => j.multi && j.ids.includes(l.id)), head = l.exp && heads.has(l.id), task = l.exp && !head && (l.added || multi);
    // Poste sur une ligne (« Vendeuse, Kiabi (2019 - 2024) : accueil… ») : l'intitulé en gras, les tâches en dessous
    const c = l.exp && !multi && !l.added ? t.search(/\s?:\s/) : -1;
    if (c > 0 && YEAR.test(t.slice(0, c))) s.items.push({t: t.slice(0, c).trim(), b: true}, ...[t.slice(t.indexOf(":", c) + 1).trim()].filter(Boolean).map(t => ({t: t.charAt(0).toUpperCase() + t.slice(1)})));
    else if (head && s.items.at(-1)?.job === jobs.find(j => j.ids.includes(l.id))) s.items.at(-1).t += " · " + t; // intitulé puis dates : une seule ligne
    else s.items.push({t, b: head, li: task, job: head ? jobs.find(j => j.ids.includes(l.id)) : null});
  });
  // Profil ou résumé en premier, puis Expérience, Compétences, Formation, les autres rubriques dans l'ordre du CV
  const rank = s => s.kind === "misc" && /^(profil|resume|a propos|objectif|summary|profile|about|personal statement|perfil|profilo|sobre mi|chi sono|kurzprofil|uber mich)/.test(fold(s.h)) ? -1 : {exp: 0, skills: 1, edu: 2}[s.kind] ?? 3;
  secs.sort((a, b) => rank(a) - rank(b));
  if (other.items.length) secs.push(other);
  return {name, sub, contact: contact.join(" · "), secs};
}
function cvPageHTML(){
  const c = cvLayout();
  return `${c.name ? `<div class="name">${esc(c.name)}</div>` : ""}${c.sub ? `<p class="sub">${esc(c.sub)}</p>` : ""}${c.contact ? `<p class="contact">${esc(c.contact)}</p>` : ""}`
    + c.secs.map(s => `<div class="sec">${esc(s.h)}</div>${s.items.map(i => `<p class="${i.li ? "li" : ""}${i.b ? " jobh" : ""}">${i.li ? "• " : ""}${i.b ? `<b>${esc(i.t)}</b>` : esc(i.t)}</p>`).join("")}`).join("");
}
function cvPageDocx(){
  const c = cvLayout();
  return [...(c.name ? [{text: c.name, style: "title"}] : []), ...(c.sub ? [{text: c.sub, bold: true}] : []), ...(c.contact ? [{text: c.contact}] : []),
    ...c.secs.flatMap(s => [{text: s.h.toUpperCase(), style: "head"}, ...s.items.map(i => ({text: (i.li ? "• " : "") + i.t, bold: i.b}))])];
}
function renderCvPage(){ const b = document.getElementById("cvpage"); if (b && b.closest("details")?.open) b.innerHTML = cvPageHTML(); }

/* ---------- Fiche entretien : l'offre en bref, tes points forts, ce qu'il faut préparer, tes questions ---------- */
function sheetHTML(o, rs){
  const ad = o.text && o.text.trim() ? adCheck(o.text) : null, a = o.app || {};
  const job = a.job || o.letter?.job || titleOf(o.text || ""), co = a.company || ad?.company || "";
  const kl = r => LANG !== "de" && r.type !== "o" && /^.[a-zà-ÿ]/.test(r.k) ? r.k.charAt(0).toLowerCase() + r.k.slice(1) : r.k;
  // Points forts prouvés par la même ligne du CV : regroupés, avec la phrase du CV une seule fois
  const ok = [];
  rs.filter(r => r.st === "ok" && r.type !== "h").sort((x, y) => urgency(x) - urgency(y)).forEach(r => {
    const {x, job: j} = taskOf(r), ex = x || j?.title || "", g = ex && ok.find(g => g.ex === ex);
    if (g) g.k.push(kl(r)); else if (ok.length < 5) ok.push({k: [r.k], ex});
  });
  const todo = rs.filter(r => r.st !== "ok").sort((x, y) => urgency(x) - urgency(y)).slice(0, 5);
  const li = (b, t) => `<li><b>${esc(b)}</b>${t ? tr(" : ", ": ") + t : ""}</li>`;
  const sec = (h, inner) => `<div class="sec">${h}</div>${inner}`;
  return `<div class="p-cv p-sheet"><div class="name">${tr("Fiche entretien", "Interview sheet")}</div>
    <p><b>${esc(job)}</b>${co ? " · " + esc(co) : ""}${personName() ? " · " + esc(personName()) : ""}${a.next ? " · " + tr("Prochaine étape : ", "Next step: ") + esc(fmtDate(a.next)) : ""}</p>
    ${sec(tr("L'annonce en bref", "The ad at a glance"), ad ? `<ul>${ad.facts.map(f => li(f.label, esc(f.v))).join("")}${ad.missing.length ? li(tr("Pas indiqué", "Not given"), esc(ad.missing.map(f => f.label).join(", "))) : ""}</ul>`
      : `<p>${tr("Ajoute le texte de l'annonce pour avoir ce résumé.", "Add the ad's text to get this summary.")}</p>`)}
    ${sec(tr("Tes points forts", "Your strong points"), ok.length ? `<ul>${ok.map(g => li(g.k.join(", "), g.ex ? `${tr("« ", "\"")}${esc(g.ex)}${tr(" »", "\"")}` : "")).join("")}</ul>`
      : `<p>${tr("Rien de prouvé dans ton CV pour l'instant. Ajoute des exemples à l'étape 4.", "Nothing proven in your CV yet. Add examples in step 4.")}</p>`)}
    ${todo.length ? sec(tr("À préparer", "To prepare"), `<ul>${todo.map(r => li(r.k + (r.prio === "must" ? tr(" (indispensable)", " (essential)") : ""), r.st === "no"
      ? tr("pas dans ton CV. Dis ce qui s'en rapproche et que tu es prêt(e) à apprendre. N'invente rien.", "not in your CV. Say what comes closest and that you are ready to learn. Do not make anything up.")
      : tr("cité sans exemple. Prépare un exemple vrai : où, ce que tu as fait, le résultat.", "mentioned without an example. Prepare a true example: where, what you did, the result."))).join("")}</ul>`) : ""}
    ${sec(tr("Questions à poser au recruteur", "Questions to ask the recruiter"), `<ul>${askQs(o).slice(0, 5).map(q => `<li>${esc(q)}</li>`).join("")}</ul>`)}
    ${sec(tr("Mes notes", "My notes"), `<div class="notes"></div>`)}</div>`;
}
function printSheet(id){
  let o, rs;
  if (id) { o = offers.find(x => x.id === id); if (!o) return; rs = o === cur ? results : resultsFor(o); }
  else { syncOffer(); o = cur; rs = results; }
  stat("fiche-entretien");
  if (!rs.length) toast(tr("Sans le texte de l'annonce et ton CV, la fiche ne contient que les questions à poser.", "Without the ad's text and your CV, the sheet only has the questions to ask."), 4000);
  else toast(tr("Choisis « Enregistrer en PDF »", "Choose \"Save as PDF\""));
  setTimeout(() => Export.printHTML(sheetHTML(o, rs)), 300);
}

document.addEventListener("click", e => {
  const t = e.target.closest("button"); if (!t) return;
  if (t.dataset.sheet !== undefined) return printSheet(t.dataset.sheet);
  if (t.dataset.cvpage) {
    stat("cv-mis-en-page");
    if (t.dataset.cvpage === "docx") { Export.download(Export.docx(cvPageDocx()), `CV_${fileBase(personName())}.docx`); return toast(tr("Fichier Word téléchargé", "Word file downloaded")); }
    toast(tr("Choisis « Enregistrer en PDF »", "Choose \"Save as PDF\""));
    return setTimeout(() => Export.printHTML(`<div class="p-cv p-page">${cvPageHTML()}</div>`), 300);
  }
});
document.addEventListener("toggle", e => { if (e.target.id === "cvpagebox") renderCvPage(); }, true);
// L'aperçu suit le CV de l'étape 4 (ajouts, fautes corrigées)
if (document.getElementById("cv4")) new MutationObserver(renderCvPage).observe(document.getElementById("cv4"), {childList: true});
