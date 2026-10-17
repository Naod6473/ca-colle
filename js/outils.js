// Outils autour du suivi : modèles de mails, rappel dans l'agenda (.ics), ce qui manque le plus au CV,
// comparaison des offres, questions à poser au recruteur, sauvegarde dans un fichier.
// Tout est fabriqué dans le navigateur : rien n'est envoyé.

/* ---------- Modèles de mails ---------- */
let mailFor = null, mailKind = null;
const MAILS = [
  {id: "followup", fr: "Relance",               en: "Follow-up"},
  {id: "thanks",   fr: "Merci après l'entretien", en: "Thank you after the interview"},
  {id: "accept",   fr: "Accepter une proposition", en: "Accept an offer"},
  {id: "decline",  fr: "Refuser poliment",        en: "Decline politely"},
  {id: "feedback", fr: "Demander un retour après un refus", en: "Ask for feedback after a rejection"}
];
const mailDefault = s => ({sent: "followup", followup: "followup", silent: "followup", call: "thanks", interview: "thanks", met: "thanks", test: "thanks", offer: "accept", accepted: "accept", refused: "feedback"})[s] || "followup";
function contactOf(a){
  const c = a.contact || "", email = (c.match(/[\w.+-]+@[\w-]+\.[a-z.]{2,}/i) || [""])[0];
  const name = c.replace(email, "").split(/[,·|]|\s[-–]\s/)[0].replace(/(\+?\d[\d\s.]{7,})/g, "").replace(/\b(rh|hr|drh)\b/ig, "").trim();
  return {email, name: /\p{L}{2,}/u.test(name) ? name : ""};
}
function mailText(o, kind){
  const a = o.app, job = appTitle(o), co = a.company, {name} = contactOf(a), who = me.name || tr("[ton nom]", "[your name]");
  const hello = name ? tr(`Bonjour ${name},`, `Dear ${name},`) : tr("Bonjour,", "Dear Hiring Manager,");
  const sign = [tr("Bien cordialement,", "Kind regards,"), who, me.contact || ""].filter(Boolean).join("\n");
  const at = co ? tr(` chez ${co}`, ` at ${co}`) : "", sentOn = a.appliedDate ? tr(` envoyée le ${fmtDate(a.appliedDate)}`, ` sent on ${fmtDate(a.appliedDate)}`) : "";
  const M = EN ? {
    followup: [`Following up on my application: ${job}`, `I am writing to follow up on my application for the ${job} position${at}${sentOn}. I am still very interested in the role and would be happy to talk whenever suits you.`],
    thanks: [`Thank you for the interview: ${job}`, `Thank you for taking the time to meet me. Our conversation confirmed my interest in the ${job} position${at}. [What you liked during the interview]\n\nPlease let me know if you need any further information.`],
    accept: [`Accepting your offer: ${job}`, `Thank you for your offer for the ${job} position${at}. I am delighted to accept it. Could you let me know the next steps (contract, start date, documents to provide)?`],
    decline: [`Your offer: ${job}`, `Thank you very much for your offer for the ${job} position${at}. After careful thought, I have decided not to take it further. I really enjoyed our conversations and hope our paths cross again.`],
    feedback: [`Feedback on my application: ${job}`, `Thank you for letting me know your decision about the ${job} position${at}. To help me improve, could you spare a few minutes to tell me what my application was missing?`]
  } : {
    followup: [`Suivi de ma candidature : ${job}`, `Je me permets de revenir vers vous au sujet de ma candidature au poste « ${job} »${at}${sentOn}. Ce poste m'intéresse toujours beaucoup et je reste disponible pour un échange quand vous le souhaitez.`],
    thanks: [`Merci pour notre entretien : ${job}`, `Merci pour le temps que vous m'avez accordé. Notre échange a confirmé mon intérêt pour le poste « ${job} »${at}. [Ce qui t'a plu pendant l'entretien]\n\nJe reste à votre disposition pour toute information complémentaire.`],
    accept: [`Acceptation de votre proposition : ${job}`, `Je vous remercie pour votre proposition pour le poste « ${job} »${at} et j'ai le plaisir de l'accepter. Pouvez-vous m'indiquer les prochaines étapes (contrat, date d'arrivée, documents à fournir) ?`],
    decline: [`Votre proposition : ${job}`, `Je vous remercie sincèrement pour votre proposition pour le poste « ${job} »${at}. Après réflexion, j'ai décidé de ne pas y donner suite. J'ai beaucoup apprécié nos échanges et j'espère que nos chemins se recroiseront.`],
    feedback: [`Votre retour sur ma candidature : ${job}`, `Merci de m'avoir informé(e) de votre décision pour le poste « ${job} »${at}. Pour progresser, auriez-vous quelques minutes pour me dire ce qui a manqué à ma candidature ?`]
  };
  const [subject, body] = M[kind];
  return {subject, body: `${hello}\n\n${body}\n\n${sign}`};
}
function renderMail(o){
  if (!o) { mailFor = null; return renderTrack(); }
  const kind = mailKind || mailDefault(o.app.status), m = mailText(o, kind), {email} = contactOf(o.app);
  $("#trackout").innerHTML = `<div class="prep mail">
    <div class="prep-h"><button type="button" class="btn ghost small" data-mailback>${tr("← Retour au suivi", "← Back to my applications")}</button>
      <h2 class="section-title" style="--k: var(--blue)">${tr("Écrire un mail", "Write an email")} · ${esc(appTitle(o))}${o.app.company ? " · " + esc(o.app.company) : ""}</h2></div>
    <div class="filters" role="group" aria-label="${tr("Type de mail", "Kind of email")}">${MAILS.map(k => `<button type="button" class="chip" data-mailkind="${k.id}" aria-pressed="${k.id === kind}">${k[LANG]}</button>`).join("")}</div>
    <label class="afield"><span>${tr("Objet", "Subject")}</span><input id="mailsubj" value="${esc(m.subject)}"></label>
    <label class="afield"><span>${tr("Message", "Message")}</span><textarea id="mailbody" rows="12">${esc(m.body)}</textarea></label>
    <p class="hint">${tr("Relis et complète ce qui est entre crochets avant d'envoyer. Le mail part de ta propre messagerie.", "Read it and fill in what is in brackets before sending. The email goes from your own mailbox.")}${email ? "" : tr(" Ajoute l'email du contact dans la fiche pour qu'il soit rempli tout seul.", " Add the contact's email to the card to fill it in automatically.")}</p>
    <div class="export"><button class="btn small" type="button" data-mailsend="${o.id}">${tr("Ouvrir dans ma messagerie", "Open in my email app")}</button><button class="btn light small" type="button" data-mailcopy>${tr("Copier", "Copy")}</button>${kind === "followup" && (o.app.status === "sent" || o.app.status === "silent") ? `<button class="btn light small" type="button" data-markfollow="${o.id}">${tr("Noter comme relancée", "Mark as followed up")}</button>` : ""}</div>
  </div>`;
}

/* ---------- Rappel dans l'agenda (.ics) ---------- */
// Les lignes d'un .ics ne doivent pas dépasser 75 caractères : on les replie avec un espace en début de ligne suivante
const fold75 = l => l.length <= 74 ? l : l.match(/.{1,73}/gu).join("\r\n ");
function icsFor(o){
  const a = o.app, g = ST[a.status].g, d = a.next.replace(/-/g, ""), d2 = addDays(a.next, 1).replace(/-/g, "");
  const what = g === "talk" ? tr("Entretien", "Interview") : (a.status === "sent" || a.status === "followup" || a.status === "silent") ? tr("Relancer", "Follow up") : tr("Candidature", "Application");
  const x = s => String(s || "").replace(/\\/g, "\\\\").replace(/[,;]/g, m => "\\" + m).replace(/\r?\n/g, "\\n");
  const desc = [a.contact && tr("Contact : ", "Contact: ") + a.contact, a.link, a.notes].filter(Boolean).join("\n");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ca colle//FR", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    `UID:${o.id}-${d}@ca-colle.pissits.com`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${d2}`,
    `SUMMARY:${x(`${what} : ${appTitle(o)}${a.company ? " · " + a.company : ""}`)}`, ...(desc ? [`DESCRIPTION:${x(desc)}`] : []), ...(a.link ? [`URL:${a.link}`] : []),
    "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${x(what)}`, "TRIGGER:-PT15H", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].map(fold75).join("\r\n");
}
function downloadIcs(o){
  Export.download(new Blob([icsFor(o)], {type: "text/calendar;charset=utf-8"}), fileBase(appTitle(o)) + ".ics");
  toast(tr("Ouvre le fichier pour l'ajouter à ton agenda", "Open the file to add it to your calendar"));
}

/* ---------- Ce qui manque le plus au CV, sur toutes les offres ---------- */
function gapsHTML(){
  const list = offers.filter(o => o.text && o.text.trim());
  if (list.length < 2 || !cvReady) return "";
  const m = {};
  list.forEach(o => resultsFor(o).forEach(r => {
    if (r.st === "ok" || r.type === "x" || r.type === "y" || r.type === "h") return;
    const g = m[r.k] = m[r.k] || {k: r.k, n: 0, no: 0, must: 0, o: o.id};
    g.n++; if (r.st === "no") g.no++; if (r.prio === "must") { g.must++; g.o = o.id; }
  }));
  const top = Object.values(m).filter(g => g.n >= 2).sort((a, b) => b.n - a.n || b.must - a.must || b.no - a.no).slice(0, 8);
  return `<section class="group gaps"><h2 class="section-title" style="--k: var(--pink)">${tr("Ce qui manque le plus à ton CV", "What your CV lacks most")}</h2>
    ${top.length ? `<p class="hint">${tr(`Sur tes ${list.length} offres, ces points reviennent souvent et ton CV ne les prouve pas encore. Les ajouter aide pour plusieurs candidatures à la fois.`, `Across your ${list.length} offers, these points come up often and your CV does not prove them yet. Adding them helps several applications at once.`)}</p>
      <ul class="gaplist">${top.map(g => `<li><span><b>${esc(g.k)}</b><small>${tr(`revient dans ${g.n} offres sur ${list.length}`, `asked for in ${g.n} of ${list.length} offers`)}${g.must ? tr(" · indispensable dans " + g.must, " · essential in " + g.must) : ""} · ${g.no === g.n ? tr("pas dans ton CV", "not in your CV") : tr("à prouver", "needs proof")}</small></span><i class="bar" style="--w: ${Math.round(g.n / list.length * 100)}%" aria-hidden="true"></i><button type="button" class="btn light small" data-gapfix="${esc(g.k)}" data-o="${g.o}">${tr("Corriger", "Fix")}</button></li>`).join("")}</ul>`
      : `<p class="hint">${tr("Aucun point ne manque dans plusieurs offres à la fois : bonne nouvelle.", "No point is missing from several offers at once: good news.")}</p>`}</section>`;
}

/* ---------- Comparer les offres côte à côte ---------- */
function compareHTML(list){
  const L = list.filter(o => o.text && o.text.trim());
  if (L.length < 2) return `<p class="notice">${tr("Il faut au moins deux offres analysées pour les comparer. Colle une autre offre avec « Comparer avec une autre offre » à l'étape 3.", "You need at least two analysed offers to compare them. Paste another one with \"Compare with another offer\" in step 3.")}</p>`;
  const data = L.map(o => { const ad = adCheck(o.text), f = id => ad.facts.find(x => x.id === id)?.v || "", rs = resultsFor(o); return {o, ad, f, no: rs.filter(r => r.st === "no").length, mustNo: rs.filter(r => r.st === "no" && r.prio === "must").length}; });
  const best = Math.max(...data.map(d => d.o.score ?? -1));
  const rows = [
    [tr("Score", "Score"), d => d.o.score != null ? `<b class="${d.o.score === best ? "best" : ""}">${d.o.score} %</b>` : "–"],
    [tr("État", "Status"), d => esc(stLabel(d.o.app.status))],
    [tr("Contrat", "Contract"), d => esc(d.f("contract")) || "–"],
    [tr("Lieu", "Location"), d => esc(d.f("place")) || "–"],
    [tr("Salaire", "Salary"), d => d.f("salary") ? esc(d.f("salary")) : `<span class="miss">${tr("pas indiqué", "not given")}</span>`],
    [tr("Temps de travail", "Hours"), d => esc(d.f("hours")) || "–"],
    [tr("Télétravail", "Remote work"), d => esc(d.f("remote")) || "–"],
    [tr("Début", "Start"), d => esc(d.f("start")) || "–"],
    [tr("Absent de ton CV", "Missing from your CV"), d => `${d.no}${d.mustNo ? tr(` (dont ${d.mustNo} indispensable${d.mustNo > 1 ? "s" : ""})`, ` (${d.mustNo} essential)`) : ""}`],
    [tr("Alertes", "Warnings"), d => d.ad.flags.length ? `<span class="flagged">⚠ ${esc(d.ad.flags.map(f => f.label).join(", "))}</span>` : "–"]
  ];
  return `<div class="tablewrap"><table class="apps-table compare">
    <thead><tr><th scope="col"><span class="sr-only">${tr("Critère", "Criterion")}</span></th>${data.map(d => `<th scope="col"><button type="button" data-openoffer="${d.o.id}">${esc(appTitle(d.o))}</button>${d.o.app.company ? `<small>${esc(d.o.app.company)}</small>` : ""}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(([l, f]) => `<tr><th scope="row">${l}</th>${data.map(d => `<td>${f(d)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
    <p class="hint">${tr("Seules les offres dont tu as collé le texte apparaissent ici. Clique sur un titre pour revoir son analyse.", "Only offers whose text you pasted appear here. Click a title to see its analysis again.")}</p>`;
}

/* ---------- Questions à poser au recruteur (selon ce que l'annonce ne dit pas) ---------- */
function askQs(o){
  const out = [];
  if (o.text && o.text.trim()) {
    const ad = adCheck(o.text), miss = id => ad.missing.some(m => m.id === id), has = id => ad.facts.some(f => f.id === id);
    if (miss("salary")) out.push(tr("Quel est le salaire prévu pour ce poste ?", "What is the salary for this role?"));
    if (miss("contract")) out.push(tr("Quel type de contrat est proposé, et pour combien de temps ?", "What kind of contract is it, and for how long?"));
    if (miss("hours")) out.push(tr("Quels sont les horaires et le temps de travail ?", "What are the hours and working time?"));
    if (miss("place")) out.push(tr("Où se trouve le lieu de travail ? Y a-t-il des déplacements ?", "Where is the workplace? Is there any travel?"));
    if (!has("remote") && /informati|bureau|logiciel|donnees|digital|numerique|develop|comptab|administrati|software|office|data|developer|admin/.test(fold(o.text))) out.push(tr("Le télétravail est-il possible, même en partie ?", "Is remote work possible, even partly?"));
    if (!has("start")) out.push(tr("Quand le poste commence-t-il ?", "When does the job start?"));
    if (ad.flags.length) out.push(tr("Pouvez-vous me donner le nom et l'adresse exacts de l'entreprise ?", "Could you give me the company's exact name and address?"));
  }
  out.push(
    tr("À quoi ressemble une journée type sur ce poste ?", "What does a typical day look like in this role?"),
    tr("Comment est composée l'équipe ?", "Who is in the team?"),
    tr("Comment se passe l'arrivée d'un nouveau salarié (formation, tuteur) ?", "How do new starters settle in (training, mentor)?"),
    tr("Quelles sont les prochaines étapes du recrutement ?", "What are the next steps in the process?")
  );
  return out;
}
const askHTML = o => `<section class="ask-rec"><h3>${tr("Questions à poser au recruteur", "Questions to ask the recruiter")}</h3>
  <p class="hint">${tr("Choisis-en 2 ou 3. Les premières viennent de ce que l'annonce ne dit pas.", "Pick 2 or 3. The first ones come from what the ad does not say.")}</p>
  <ul>${askQs(o).map(q => `<li>${esc(q)}</li>`).join("")}</ul></section>`;

/* ---------- Sauvegarde dans un fichier (pour passer du PC au téléphone) ---------- */
function exportBackup(){
  syncOffer();
  const data = snapshot();
  Export.download(new Blob([JSON.stringify(data, null, 1)], {type: "application/json"}), tr("ca-colle-sauvegarde-", "ca-colle-backup-") + today() + ".json");
  toast(tr("Fichier enregistré : ouvre-le sur ton autre appareil", "File saved: open it on your other device"));
  stat("sauvegarde", {how: "export"});
}
async function importBackup(file){
  let d;
  try { d = JSON.parse(await file.text()); } catch {}
  if (!d || d.v !== 1 || !Array.isArray(d.offers)) return toast(tr("Ce fichier n'est pas une sauvegarde de Ça colle ?", "This file is not a Ça colle? backup"));
  if ((offers.some(o => o.text.trim() || o.app) || cvReady) && !confirm(tr("Remplacer ce qui est dans l'app par le contenu de ce fichier ?", "Replace what is in the app with the content of this file?"))) return;
  // la case décochée empêche la sauvegarde automatique à la fermeture d'écraser le fichier ouvert ; restore() la recoche
  $("#keep").checked = false; clearTimeout(saveTimer);
  try { localStorage.setItem(STORE, JSON.stringify(d)); } catch { return toast(tr("Impossible d'enregistrer sur cet appareil", "Could not save on this device")); }
  stat("sauvegarde", {how: "import"});
  location.reload();
}

/* ---------- Événements ---------- */
document.addEventListener("click", e => {
  const t = e.target.closest("button"); if (!t) return;
  if (t.dataset.mail) { stat("mail-modele"); mailFor = t.dataset.mail; mailKind = null; prepFor = null; renderTrack(); return $("#trackbelow").scrollIntoView({behavior: "smooth"}); }
  if (t.dataset.mailkind) { mailKind = t.dataset.mailkind; return renderTrack(); }
  if (t.dataset.mailback !== undefined) { mailFor = null; return renderTrack(); }
  if (t.dataset.mailcopy !== undefined) return Export.copy($("#mailsubj").value + "\n\n" + $("#mailbody").value).then(ok => toast(ok ? tr("Mail copié", "Email copied") : tr("Copie impossible", "Copy failed")));
  if (t.dataset.mailsend) {
    const o = offers.find(x => x.id === t.dataset.mailsend), to = contactOf(o.app).email;
    stat("mail-envoi", {kind: mailKind || mailDefault(o.app.status)});
    location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent($("#mailsubj").value)}&body=${encodeURIComponent($("#mailbody").value)}`;
    return;
  }
  if (t.dataset.markfollow) { const o = offers.find(x => x.id === t.dataset.markfollow); setStatus(o, "followup"); o.app.next = addDays(today(), 7); save(); toast(tr("Notée comme relancée, nouveau rappel dans 7 jours", "Marked as followed up, new reminder in 7 days")); mailFor = null; return renderTrack(); }
  if (t.dataset.ics) { stat("agenda"); return downloadIcs(offers.find(x => x.id === t.dataset.ics)); }
  if (t.dataset.gapfix) { stat("manque-corriger"); loadOffer(t.dataset.o); go(4); const el = document.querySelector(`.blank[data-k="${CSS.escape(t.dataset.gapfix)}"], [data-yes="${CSS.escape(t.dataset.gapfix)}"]`); if (el) setTimeout(() => { el.scrollIntoView({block: "center", behavior: "smooth"}); el.focus({preventScroll: true}); }, 60); return; }
  if (t.id === "backup") return exportBackup();
  if (t.id === "restore") return $("#restorefile").click();
});
document.addEventListener("change", e => { if (e.target.id === "restorefile" && e.target.files[0]) { importBackup(e.target.files[0]); e.target.value = ""; } });
