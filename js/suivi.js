// Suivi des candidatures (fiche par offre ou tableau) et préparation d'entretien.
// Chaque candidature est une offre de la liste « offers » (js/app.js) avec un objet « app » :
// {job, company, offerDate, appliedDate, status, next, contact, link, notes, history: [{d, s}]}.
// Rien ne part sur un serveur : c'est gardé sur l'appareil seulement si la case « Garder ma session » est cochée.

const STATUSES = [
  {id: "todo",      fr: "À postuler",                en: "To apply",               g: "active", c: "var(--card)"},
  {id: "sent",      fr: "Candidature envoyée",       en: "Application sent",       g: "active", c: "var(--blue)"},
  {id: "followup",  fr: "Relancée",                  en: "Followed up",            g: "active", c: "var(--blue)"},
  {id: "call",      fr: "Appel de prise de contact", en: "First call",             g: "talk",   c: "var(--violet)"},
  {id: "interview", fr: "Entretien prévu",           en: "Interview booked",       g: "talk",   c: "var(--violet)"},
  {id: "met",       fr: "Entretien passé",           en: "Interview done",         g: "talk",   c: "var(--violet)"},
  {id: "test",      fr: "Test ou mise en situation", en: "Test or trial",          g: "talk",   c: "var(--violet)"},
  {id: "offer",     fr: "Proposition reçue",         en: "Offer received",         g: "talk",   c: "var(--green)"},
  {id: "accepted",  fr: "Acceptée",                  en: "Accepted",               g: "done",   c: "var(--green)"},
  {id: "refused",   fr: "Refusée",                   en: "Rejected",               g: "done",   c: "var(--pink)"},
  {id: "silent",    fr: "Sans réponse",              en: "No reply",               g: "done",   c: "var(--grey)"},
  {id: "dropped",   fr: "Abandonnée",                en: "Dropped",                g: "done",   c: "var(--grey)"}
];
const ST = Object.fromEntries(STATUSES.map(s => [s.id, s]));
const stLabel = id => (LL(ST[id] || ST.todo));
const today = () => new Date().toISOString().slice(0, 10);
const addDays = (d, n) => { const x = new Date(d + "T12:00:00"); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
const daysFrom = d => Math.round((new Date(today() + "T12:00:00") - new Date(d + "T12:00:00")) / 864e5);
const fmtDate = d => d ? new Date(d + "T12:00:00").toLocaleDateString(tr("fr-FR", "en-GB"), {day: "numeric", month: "short", year: "numeric"}) : "";
let trackView = "cards", trackFilter = "all", trackSort = {k: "appliedDate", dir: -1}, openApp = null, prepFor = null;

const apps = () => offers.filter(o => o.app);
function ensureApp(o, status){
  if (!o.app) {
    const job = (o.letter && o.letter.job) || (o.text.trim() ? titleOf(o.text).split(/\s+[–-]\s+/)[0].replace(/\s*\(h\s*\/\s*f\)|\s*h\s*\/\s*f\b/ig, "").trim() : "");
    o.app = {job, company: (o.letter && o.letter.company) || "", offerDate: "", appliedDate: "", status: "todo", next: "", contact: "", link: "", notes: "", history: [{d: today(), s: "todo"}]};
  }
  if (status && o.app.status !== status) setStatus(o, status);
  return o.app;
}
function setStatus(o, s){
  const a = o.app; if (a.status === s) return;
  a.status = s; a.history.push({d: today(), s});
  if (s === "sent" && !a.appliedDate) a.appliedDate = today();
  if (s === "sent" && !a.next) a.next = addDays(a.appliedDate || today(), 7);
  if (ST[s].g === "done") a.next = "";
}
// Ce qui demande une action : relance après 7 jours sans nouvelles, rendez-vous proches, offres à postuler
function todosOf(o){
  const a = o.app, out = [];
  if (!a) return out;
  if (a.next && ST[a.status].g !== "done") {
    const d = daysFrom(a.next), what = ST[a.status].g === "talk" ? tr("Rendez-vous", "Appointment") : (a.status === "sent" || a.status === "followup") ? tr("Relance", "Follow-up") : tr("À faire", "To do");
    if (d >= 0) out.push({o, urgent: true, t: d === 0 ? tr(`${what} aujourd'hui`, `${what} today`) : tr(`${what} prévue il y a ${plural(d, "jour")}`, `${what} was due ${plural(d, "day")} ago`)});
    else if (d >= -2) out.push({o, t: d === -1 ? tr(`${what} demain`, `${what} tomorrow`) : tr(`${what} dans 2 jours`, `${what} in 2 days`)});
  } else if ((a.status === "sent" || a.status === "followup") && a.appliedDate && daysFrom(a.appliedDate) >= 7) {
    out.push({o, urgent: true, t: tr(`Sans nouvelles depuis ${plural(daysFrom(a.appliedDate), "jour")} : relance`, `No news for ${plural(daysFrom(a.appliedDate), "day")}: follow up`)});
  }
  if (a.status === "todo") out.push({o, t: tr("Pas encore postulé", "Not applied yet")});
  return out;
}
const appTitle = o => o.app.job || o.title || titleOf(o.text || "") || tr("Candidature", "Application");

/* ---------- Affichage ---------- */
function showTrack(focusId){
  syncOffer();
  $$("[data-p]").forEach(p => p.hidden = true); $$("[data-for]").forEach(p => p.hidden = true);
  $$(".tab").forEach(t => t.setAttribute("aria-selected", "false"));
  $("#track").hidden = false; $("#trackbelow").hidden = false; $("#trackbtn").setAttribute("aria-selected", "true");
  prepFor = null; mailFor = null;
  if (focusId) { openApp = focusId; trackView = "cards"; trackFilter = "all"; }
  renderTrack();
  if (focusId) setTimeout(() => document.getElementById("app-" + focusId)?.scrollIntoView({block: "start", behavior: "smooth"}), 60);
  else if (window.scrollY > 120) $(".top").scrollIntoView({behavior: "smooth"});
}
function hideTrack(){ $("#track").hidden = true; $("#trackbelow").hidden = true; $("#trackbtn").setAttribute("aria-selected", "false"); }
// Lien direct vers le suivi (onglet « Mes candidatures » des pages outils)
// et vers une étape (onglets des pages outils) : on va à l'étape demandée, ou à la dernière qu'on peut atteindre
{
  const h = location.hash, n = +(h.match(/^#etape-([1-5])$/) || [])[1];
  if (h === "#suivi" || n) setTimeout(() => {
    if (n) { for (let k = n; k >= 1; k--) if (canReach(k)) { go(k); break; } } else showTrack();
    history.replaceState(null, "", location.pathname + location.search);
  }, 0);
}
function renderBadge(){
  const n = apps().reduce((s, o) => s + todosOf(o).filter(t => t.urgent).length, 0);
  $("#trackn").hidden = !n; $("#trackn").textContent = n;
}
function renderTrack(){
  renderBadge();
  $("#tracknokeep").hidden = keep() || !apps().length;
  $$("[data-view]").forEach(b => b.setAttribute("aria-pressed", b.dataset.view === trackView));
  $$("[data-tf]").forEach(b => b.setAttribute("aria-pressed", b.dataset.tf === trackFilter));
  const all = apps(), grp = o => ST[o.app.status].g;
  ["all", "active", "talk", "done"].forEach(f => $("#tf-" + f).textContent = f === "all" ? all.length : all.filter(o => grp(o) === f).length);
  const todos = all.flatMap(todosOf).sort((a, b) => b.urgent - !!a.urgent);
  $("#tracktodo").innerHTML = todos.length
    ? `<ul class="todo">${todos.slice(0, 6).map(t => `<li class="${t.urgent ? "urgent" : ""}"><span><button type="button" class="linkbtn" data-openapp="${t.o.id}">${esc(appTitle(t.o))}</button>${t.o.app.company ? ` · ${esc(t.o.app.company)}` : ""}</span><small>${esc(t.t)}</small></li>`).join("")}</ul>`
    : `<p>${all.length ? tr("Rien d'urgent. Pense à noter chaque réponse.", "Nothing urgent. Remember to note every reply.") : tr("Aucune candidature pour l'instant. Ajoute-en une, ou clique sur « Suivre cette candidature » après une analyse.", "No applications yet. Add one, or click \"Track this application\" after an analysis.")}</p>`;
  const list = all.filter(o => trackFilter === "all" || grp(o) === trackFilter);
  $("#trackfilters").hidden = !!prepFor || !!mailFor || !all.length;
  if (prepFor) return renderPrep(offers.find(o => o.id === prepFor));
  if (mailFor) return renderMail(offers.find(o => o.id === mailFor));
  if (trackView === "compare") { $("#trackout").innerHTML = compareHTML(list); return; }
  if (trackView === "stats") { $("#trackout").innerHTML = statsHTML(); return; }
  if (!list.length) { $("#trackout").innerHTML = all.length ? `<p class="notice">${tr("Aucune candidature dans ce filtre.", "No application in this filter.")}</p>` : ""; return; }
  $("#trackout").innerHTML = gapsHTML() + (trackView === "table" ? tableHTML(list) : `<div class="apps">${list.sort((a, b) => (b.app.appliedDate || b.app.history[0].d).localeCompare(a.app.appliedDate || a.app.history[0].d)).map(cardHTML).join("")}</div>`);
}
const statusSelect = o => `<select class="stsel" data-app="${o.id}" data-fld="status" aria-label="${tr("État", "Status")}" style="--k: ${ST[o.app.status].c}">${STATUSES.map(s => `<option value="${s.id}" ${s.id === o.app.status ? "selected" : ""}>${LL(s)}</option>`).join("")}</select>`;
const field = (o, k, label, type = "text", ph = "") => `<label class="afield"><span>${label}</span>${type === "area"
  ? `<textarea data-app="${o.id}" data-fld="${k}" rows="3" placeholder="${esc(ph)}">${esc(o.app[k] || "")}</textarea>`
  : `<input type="${type}" data-app="${o.id}" data-fld="${k}" value="${esc(o.app[k] || "")}" placeholder="${esc(ph)}">`}</label>`;
function cardHTML(o){
  const a = o.app, td = todosOf(o).filter(t => t.urgent), open = openApp === o.id;
  return `<article class="app-card" id="app-${o.id}" style="--k: ${ST[a.status].c}">
    <div class="app-h">
      <div><h3>${esc(appTitle(o))}</h3><p>${esc(a.company || tr("Entreprise à préciser", "Company not set"))}</p></div>
      ${o.score != null && o.text.trim() ? `<span class="app-score" title="${tr("Score de l'analyse", "Analysis score")}">${o.score} %</span>` : ""}
    </div>
    <div class="app-row">${statusSelect(o)}${td.map(t => `<i class="tag must">${esc(t.t)}</i>`).join("")}</div>
    <dl class="app-dates">
      <div><dt>${tr("Offre du", "Offer date")}</dt><dd>${fmtDate(a.offerDate) || "–"}</dd></div>
      <div><dt>${tr("Candidature", "Applied")}</dt><dd>${fmtDate(a.appliedDate) || "–"}</dd></div>
      <div><dt>${tr("Prochaine étape", "Next step")}</dt><dd>${fmtDate(a.next) || "–"}</dd></div>
    </dl>
    <details class="app-more" ${open ? "open" : ""} data-more="${o.id}"><summary>${tr("Détails et suivi", "Details and history")}</summary>
      <div class="app-form">
        ${field(o, "job", tr("Poste", "Job"))}${field(o, "company", tr("Entreprise", "Company"))}
        ${field(o, "offerDate", tr("Date de l'offre", "Offer date"), "date")}${field(o, "appliedDate", tr("Date de candidature", "Application date"), "date")}
        ${field(o, "next", tr("Prochaine étape (relance, entretien…)", "Next step (follow-up, interview…)"), "date")}
        ${field(o, "contact", tr("Contact", "Contact"), "text", tr("ex : Mme Dupont, RH, 02 31 00 00 00", "e.g. Ms Smith, HR, 0161 000 0000"))}
        ${field(o, "link", tr("Lien de l'annonce", "Link to the ad"), "url", "https://…")}
        ${field(o, "notes", tr("Notes", "Notes"), "area", tr("ex : entretien avec le chef d'équipe, questions sur les horaires", "e.g. interview with the team leader, questions about hours"))}
      </div>
      <ol class="history">${a.history.slice().reverse().map(h => `<li><b>${fmtDate(h.d)}</b> ${esc(stLabel(h.s))}</li>`).join("")}</ol>
    </details>
    <div class="app-actions">
      ${o.text.trim() ? `<button type="button" class="btn light small" data-openoffer="${o.id}">${tr("Voir l'analyse", "See the analysis")}</button>` : ""}
      <button type="button" class="btn small" data-prep="${o.id}">${tr("Préparer l'entretien", "Prepare the interview")}</button>
      <button type="button" class="btn light small" data-mail="${o.id}">${tr("Écrire un mail", "Write an email")}</button>
      ${a.next ? `<button type="button" class="btn light small" data-ics="${o.id}">${tr("Ajouter à l'agenda", "Add to calendar")}</button>` : ""}
      ${a.link && /^https?:\/\//i.test(a.link) ? `<a class="btn light small" href="${esc(a.link)}" target="_blank" rel="noopener noreferrer">${tr("Ouvrir l'annonce", "Open the ad")}</a>` : ""}
      <button type="button" class="btn ghost small" data-delapp="${o.id}">${tr("Supprimer", "Delete")}</button>
    </div>
  </article>`;
}
function tableHTML(list){
  const cols = [["job", tr("Poste", "Job")], ["company", tr("Entreprise", "Company")], ["offerDate", tr("Offre du", "Offer date")], ["appliedDate", tr("Candidature", "Applied")], ["status", tr("État", "Status")], ["next", tr("Prochaine étape", "Next step")], ["score", tr("Score", "Score")]];
  const val = (o, k) => k === "score" ? (o.text.trim() && o.score != null ? o.score : -1) : k === "status" ? STATUSES.findIndex(s => s.id === o.app.status) : k === "job" ? appTitle(o).toLowerCase() : (o.app[k] || "").toLowerCase();
  const {k, dir} = trackSort;
  list = list.slice().sort((a, b) => { const x = val(a, k), y = val(b, k); return (x > y ? 1 : x < y ? -1 : 0) * dir; });
  return `<div class="tablewrap"><table class="apps-table">
    <thead><tr>${cols.map(([c, l]) => `<th scope="col" aria-sort="${k === c ? (dir > 0 ? "ascending" : "descending") : "none"}"><button type="button" data-sort="${c}">${l}${k === c ? (dir > 0 ? " ↑" : " ↓") : ""}</button></th>`).join("")}<th scope="col"><span class="sr-only">${tr("Actions", "Actions")}</span></th></tr></thead>
    <tbody>${list.map(o => { const a = o.app, late = todosOf(o).some(t => t.urgent); return `<tr>
      <td><b>${esc(appTitle(o))}</b></td><td>${esc(a.company || "–")}</td><td>${fmtDate(a.offerDate) || "–"}</td><td>${fmtDate(a.appliedDate) || "–"}</td>
      <td>${statusSelect(o)}</td><td class="${late ? "late" : ""}">${fmtDate(a.next) || "–"}${late ? ` <span class="sr-only">${tr("(en retard)", "(overdue)")}</span>` : ""}</td>
      <td>${o.text.trim() && o.score != null ? o.score + " %" : "–"}</td>
      <td><button type="button" class="btn light small" data-openapp="${o.id}">${tr("Ouvrir", "Open")}</button></td></tr>`; }).join("")}</tbody>
  </table></div>`;
}
function csvExport(){
  const head = [tr("Poste", "Job"), tr("Entreprise", "Company"), tr("Date de l'offre", "Offer date"), tr("Date de candidature", "Application date"), tr("État", "Status"), tr("Prochaine étape", "Next step"), tr("Contact", "Contact"), tr("Lien", "Link"), tr("Score", "Score"), tr("Notes", "Notes")];
  const q = v => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`, sep = EN ? "," : ";"; // Excel en anglais attend des virgules, ailleurs des points-virgules
  const rows = apps().map(o => { const a = o.app; return [appTitle(o), a.company, a.offerDate, a.appliedDate, stLabel(a.status), a.next, a.contact, a.link, o.text.trim() && o.score != null ? o.score : "", a.notes]; });
  Export.download(new Blob(["﻿" + [head, ...rows].map(r => r.map(q).join(sep)).join("\r\n")], {type: "text/csv;charset=utf-8"}), tr("mes_candidatures.csv", "my_applications.csv"));
  toast(tr("Fichier téléchargé : il s'ouvre dans Excel ou LibreOffice", "File downloaded: it opens in Excel or LibreOffice"));
}

/* ---------- Préparation d'entretien : questions probables et trame Situation, Action, Résultat ---------- */
function resultsFor(o){
  if (!o.text.trim() || !cvReady) return [];
  const F = fixes, V = over; fixes = o.fixes || {}; over = o.over || {};
  const r = analyse(o.text); fixes = F; over = V;
  return r;
}
function interviewQs(o){
  const qs = [
    {id: "g1", q: tr("Présentez-vous en quelques minutes.", "Tell me about yourself."), tip: tr("Ton parcours en 3 étapes, puis pourquoi ce poste. Une minute ou deux suffisent.", "Your path in 3 steps, then why this job. One or two minutes is enough."), one: true},
    {id: "g2", q: tr("Pourquoi ce poste et pourquoi notre entreprise ?", "Why this job and why our company?"), tip: tr("Reprends ce que tu as écrit dans ta lettre.", "Reuse what you wrote in your letter."), one: true}
  ];
  const rs = resultsFor(o).filter(r => r.type !== "x" || r.st !== "ok");
  const rank = r => (r.prio === "must" ? 0 : r.prio === "nice" ? 2 : 1) + (r.st === "no" ? 0 : r.st === "mid" ? .3 : .6);
  rs.sort((a, b) => rank(a) - rank(b)).slice(0, 7).forEach(r => {
    const k = r.k, kl = r.type !== "o" && /^.[a-zà-ÿ]/.test(k) ? k.charAt(0).toLowerCase() + k.slice(1) : k, proof = r.st === "ok" ? excerpt(r, false) : "";
    let q, tip, one = false;
    if (r.type === "h") { q = tr(`Ces horaires vous conviennent-ils (${kl}) ?`, `Are these hours OK for you (${kl})?`); tip = tr("Réponds franchement, avec tes contraintes s'il y en a.", "Answer honestly, with any constraints you have."); one = true; }
    else if (r.type === "l" || r.type === "d") { q = r.st === "ok" ? tr(`${k} : depuis quand l'avez-vous ?`, `${k}: since when?`) : tr(`Avez-vous : ${kl} ? Sinon, êtes-vous prêt(e) à le passer ?`, `Do you have: ${kl}? If not, are you ready to get it?`); tip = tr("Une date, ou ton plan pour l'obtenir.", "A date, or your plan to get it."); one = true; }
    else if (r.type === "y") { q = tr("Parlez-moi de votre parcours et de votre expérience.", "Tell me about your career and experience."); tip = tr("Commence par le poste le plus proche de cette offre.", "Start with the job closest to this offer."); one = true; }
    else if (r.type === "s") { q = tr(`Donnez un exemple qui montre votre ${kl}.`, `Give an example that shows your ${kl}.`); tip = tr("Un vrai moment, pas un adjectif.", "A real moment, not an adjective."); }
    else if (r.st === "ok") { q = tr(`Parlez-moi de votre expérience en ${kl}.`, `Tell me about your experience with ${kl}.`); tip = proof ? tr(`Appuie-toi sur ton CV : « ${proof} »`, `Use your CV: "${proof}"`) : ""; }
    else if (r.st === "mid") { q = tr(`Pouvez-vous donner un exemple concret : ${kl} ?`, `Can you give a real example: ${kl}?`); tip = tr("Ton CV le cite sans exemple : prépare un fait avec un chiffre.", "Your CV mentions it without an example: prepare a fact with a number."); }
    else { q = tr(`L'offre demande : ${kl}. Comment feriez-vous ?`, `The offer asks for: ${kl}. How would you handle it?`); tip = tr("N'invente pas d'expérience : dis ce qui s'en rapproche et que tu es prêt(e) à apprendre.", "Do not make up experience: say what comes closest and that you are ready to learn."); }
    qs.push({id: "r:" + k, q, tip, one, must: r.prio === "must"});
  });
  qs.push(
    {id: "g3", q: tr("Racontez une situation difficile au travail et ce que vous avez fait.", "Tell me about a difficult situation at work and what you did."), tip: tr("Choisis une histoire qui finit bien, et ce que tu en as appris.", "Pick a story that ends well, and what you learnt.")},
    {id: "g4", q: tr("Quelles sont vos qualités, et un point que vous travaillez ?", "What are your strengths, and one thing you are working on?"), tip: tr("Une qualité utile pour ce poste, avec un exemple. Un vrai point à améliorer, et ce que tu fais pour.", "A strength useful for this job, with an example. A real weak point, and what you do about it."), one: true},
    {id: "g5", q: tr("Quand êtes-vous disponible, et quelles sont vos attentes de salaire ?", "When are you available, and what salary do you expect?"), tip: tr("Regarde les salaires du métier avant. Donne une fourchette.", "Check salaries for this job first. Give a range."), one: true},
    {id: "g6", q: tr("Avez-vous des questions ?", "Do you have any questions?"), tip: tr("Prépare 2 questions : une sur le poste au quotidien, une sur l'équipe.", "Prepare 2 questions: one about the day-to-day job, one about the team."), one: true}
  );
  return qs;
}
function renderPrep(o){
  if (!o) { prepFor = null; return renderTrack(); }
  o.prep = o.prep || {};
  const qs = interviewQs(o), P = o.prep;
  const box = (q, f, label, ph) => `<label class="afield"><span>${label}</span><textarea rows="${q.id === "g1" ? 5 : 2}" data-prepq="${esc(q.id)}" data-pf="${f}" data-prepo="${o.id}" placeholder="${esc(ph)}">${esc((P[q.id] || {})[f] || "")}</textarea></label>`;
  $("#trackout").innerHTML = `<div class="prep">
    <div class="prep-h"><button type="button" class="btn ghost small" id="prepback">${tr("← Retour au suivi", "← Back to my applications")}</button>
      <h2 class="section-title" style="--k: var(--violet)">${tr("Préparer l'entretien", "Prepare the interview")} · ${esc(appTitle(o))}${o.app.company ? " · " + esc(o.app.company) : ""}</h2></div>
    <p class="promise"><b>${tr("Méthode simple :", "Simple method:")}</b> ${tr("la situation (où, quand), ce que tu as fait toi, et le résultat (avec un chiffre si possible). Écris seulement des choses vraies : c'est toi qui réponds le jour J.", "the situation (where, when), what you did yourself, and the result (with a number if you can). Only write true things: you are the one answering on the day.")}</p>
    ${!o.text.trim() || !cvReady ? `<p class="notice">${tr("Pour avoir des questions sur cette offre, ajoute le texte de l'annonce et ton CV. En attendant, voici les questions classiques.", "To get questions about this offer, add the ad's text and your CV. Meanwhile, here are the classic questions.")}</p>` : ""}
    <ol class="qs">${qs.map(q => `<li class="q"><h3>${esc(q.q)}${q.must ? ` <i class="tag must">${tr("Indispensable", "Essential")}</i>` : ""}</h3>${q.tip ? `<p class="hint">${esc(q.tip)}</p>` : ""}
      ${q.id === "g1" ? `<button type="button" class="btn light small pitchbtn" data-pitch="${o.id}">${tr("Préparer mon pitch d'une minute", "Build my one-minute pitch")}</button>` : ""}
      ${q.one ? box(q, "t", tr("Ma réponse", "My answer"), "") : box(q, "s", tr("Situation", "Situation"), tr("ex : au Drive Super U, un samedi de rush", "e.g. at FreshMart, on a busy Saturday")) + box(q, "a", tr("Ce que j'ai fait", "What I did"), "") + box(q, "r", tr("Résultat", "Result"), tr("ex : 120 commandes prêtes à l'heure", "e.g. 120 orders ready on time"))}</li>`).join("")}</ol>
    ${askHTML(o)}
    <div class="export"><button class="btn small" type="button" data-prepdl="docx" data-prepo="${o.id}">${tr("Télécharger en Word", "Download as Word")}</button><button class="btn light small" type="button" data-prepdl="pdf" data-prepo="${o.id}">${tr("En PDF", "As PDF")}</button><button class="btn light small" type="button" data-prepdl="copy" data-prepo="${o.id}">${tr("Copier", "Copy")}</button></div>
  </div>`;
}
function prepText(o){
  const qs = interviewQs(o), P = o.prep || {};
  return [tr("Préparation d'entretien", "Interview preparation") + " : " + appTitle(o) + (o.app.company ? " · " + o.app.company : ""), "",
    ...qs.flatMap(q => { const a = P[q.id] || {}; return [q.q, ...(q.one ? [a.t || "…"] : [tr("Situation : ", "Situation: ") + (a.s || "…"), tr("Ce que j'ai fait : ", "What I did: ") + (a.a || "…"), tr("Résultat : ", "Result: ") + (a.r || "…")]), ""]; }),
    tr("Questions à poser au recruteur", "Questions to ask the recruiter"), ...askQs(o).map(q => "- " + q)].join("\n");
}

/* ---------- Événements ---------- */
document.addEventListener("click", e => {
  const t = e.target.closest("button, a"); if (!t) return;
  if (t.id === "trackbtn") { stat("suivi-ouvrir"); return showTrack(); }
  if (t.dataset.trackthis !== undefined) {
    syncOffer(); stat("suivi-ajout", {from: t.dataset.trackthis || "resultat"}); ensureApp(cur, t.dataset.trackthis || null); save();
    toast(t.dataset.trackthis === "sent" ? tr("Candidature notée comme envoyée", "Application marked as sent") : tr("Ajoutée à ton suivi", "Added to your applications"));
    return showTrack(cur.id);
  }
  if (t.dataset.view) { trackView = t.dataset.view; return renderTrack(); }
  if (t.dataset.tf) { trackFilter = t.dataset.tf; return renderTrack(); }
  if (t.dataset.sort) { trackSort = {k: t.dataset.sort, dir: trackSort.k === t.dataset.sort ? -trackSort.dir : 1}; return renderTrack(); }
  if (t.dataset.openapp) { openApp = t.dataset.openapp; trackView = "cards"; trackFilter = "all"; renderTrack(); return document.getElementById("app-" + openApp)?.scrollIntoView({block: "start", behavior: "smooth"}); }
  if (t.dataset.openoffer) return loadOffer(t.dataset.openoffer);
  if (t.dataset.prep) { stat("entretien-prep"); prepFor = t.dataset.prep; mailFor = null; renderTrack(); return $("#trackbelow").scrollIntoView({behavior: "smooth"}); }
  if (t.id === "prepback") { prepFor = null; return renderTrack(); }
  if (t.dataset.prepdl) {
    const o = offers.find(x => x.id === t.dataset.prepo), txt = prepText(o), how = t.dataset.prepdl;
    if (how === "docx") { Export.download(Export.docx(txt.split("\n").map((text, i) => ({text, style: i === 0 ? "title" : "", bold: interviewQs(o).some(q => q.q === text)}))), tr("Preparation_entretien_", "Interview_prep_") + fileBase(o.app.company || appTitle(o)) + ".docx"); return toast(tr("Fichier Word téléchargé", "Word file downloaded")); }
    if (how === "pdf") { toast(tr("Choisis « Enregistrer en PDF »", "Choose \"Save as PDF\"")); return setTimeout(() => Export.printHTML(`<div class="p-letter">${txt.split("\n").map(l => `<p>${esc(l) || "&nbsp;"}</p>`).join("")}</div>`), 300); }
    return Export.copy(txt).then(ok => toast(ok ? tr("Texte copié", "Text copied") : tr("Copie impossible", "Copy failed")));
  }
  if (t.dataset.delapp) {
    const o = offers.find(x => x.id === t.dataset.delapp);
    if (!o || !confirm(tr(`Supprimer « ${appTitle(o)} » de ton suivi ?`, `Remove "${appTitle(o)}" from your applications?`))) return;
    delete o.app; if (!o.text.trim() && o !== cur) offers = offers.filter(x => x !== o);
    save(); return renderTrack();
  }
  if (t.id === "addapp") {
    stat("suivi-ajout", {from: "manuel"});
    const o = {id: newId(), text: "", fixes: {}, over: {}, letter: {}}; offers.push(o); ensureApp(o);
    openApp = o.id; trackView = "cards"; trackFilter = "all"; save(); renderTrack();
    const el = document.querySelector(`#app-${o.id} [data-fld="job"]`); el?.scrollIntoView({block: "center", behavior: "smooth"}); el?.focus({preventScroll: true});
    return;
  }
  if (t.id === "csv") { stat("suivi-csv"); return csvExport(); }
  if (t.id === "keepon") { $("#keep").checked = true; $("#keep").dispatchEvent(new Event("change", {bubbles: true})); return renderTrack(); }
});
document.addEventListener("change", e => {
  const t = e.target;
  if (t.dataset.app && t.dataset.fld === "status") { const o = offers.find(x => x.id === t.dataset.app); setStatus(o, t.value); stat("suivi-etat", {s: t.value}); save(); return renderTrack(); }
  if (t.dataset.app && /Date$|^next$/.test(t.dataset.fld)) renderTrack();
});
document.addEventListener("input", e => {
  const t = e.target;
  if (t.dataset.app && t.dataset.fld !== "status") { const o = offers.find(x => x.id === t.dataset.app); o.app[t.dataset.fld] = t.value; if (t.dataset.fld === "job") o.app.job = t.value; renderBadge(); return save(); }
  if (t.dataset.prepq) { const o = offers.find(x => x.id === t.dataset.prepo); o.prep = o.prep || {}; (o.prep[t.dataset.prepq] = o.prep[t.dataset.prepq] || {})[t.dataset.pf] = t.value; return save(); }
});
document.addEventListener("toggle", e => { if (e.target.dataset && e.target.dataset.more) openApp = e.target.open ? e.target.dataset.more : openApp === e.target.dataset.more ? null : openApp; }, true);
renderBadge();
