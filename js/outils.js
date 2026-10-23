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
  // Autre langue : L10N.mails({job, at, sentOn}) rend le même objet que la version anglaise
  const M = L10N?.mails ? L10N.mails({job, at, sentOn}) : EN ? {
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
    <div class="filters" role="group" aria-label="${tr("Type de mail", "Kind of email")}">${MAILS.map(k => `<button type="button" class="chip" data-mailkind="${k.id}" aria-pressed="${k.id === kind}">${LL(k)}</button>`).join("")}</div>
    <label class="afield"><span>${tr("Objet", "Subject")}</span><input id="mailsubj" value="${esc(m.subject)}"></label>
    <label class="afield"><span>${tr("Message", "Message")}</span><textarea id="mailbody" rows="12">${esc(m.body)}</textarea></label>
    <p class="hint">${tr("Relis et complète ce qui est entre crochets avant d'envoyer. Le mail part de ta propre messagerie.", "Read it and fill in what is in brackets before sending. The email goes from your own mailbox.")}${email ? "" : tr(" Ajoute l'email du contact dans la fiche pour qu'il soit rempli tout seul.", " Add the contact's email to the card to fill it in automatically.")}</p>
    <div class="export"><button class="btn small" type="button" data-mailsend="${esc(o.id)}">${tr("Ouvrir dans ma messagerie", "Open in my email app")}</button><button class="btn light small" type="button" data-mailcopy>${tr("Copier", "Copy")}</button>${kind === "followup" && (o.app.status === "sent" || o.app.status === "silent") ? `<button class="btn light small" type="button" data-markfollow="${esc(o.id)}">${tr("Noter comme relancée", "Mark as followed up")}</button>` : ""}</div>
  </div>`;
}

/* ---------- Rappel dans l'agenda (.ics) ---------- */
// Les lignes d'un .ics ne doivent pas dépasser 75 caractères : on les replie avec un espace en début de ligne suivante
const fold75 = l => l.length <= 74 ? l : l.match(/.{1,73}/gu).join("\r\n ");
// Un événement sur une journée, avec un rappel la veille au soir (candidatures, et contacts : js/contacts.js)
function icsEvent({uid, date, what, summary, desc, url}){
  const d = date.replace(/-/g, ""), d2 = addDays(date, 1).replace(/-/g, "");
  const x = s => String(s || "").replace(/\\/g, "\\\\").replace(/[,;]/g, m => "\\" + m).replace(/\r?\n/g, "\\n");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ca colle//FR", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    `UID:${uid}-${d}@ca-colle.pissits.com`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${d2}`,
    `SUMMARY:${x(summary)}`, ...(desc ? [`DESCRIPTION:${x(desc)}`] : []), ...(url ? [`URL:${url}`] : []),
    "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${x(what)}`, "TRIGGER:-PT15H", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].map(fold75).join("\r\n");
}
function icsFor(o){
  const a = o.app, g = ST[a.status].g;
  const what = g === "talk" ? tr("Entretien", "Interview") : (a.status === "sent" || a.status === "followup" || a.status === "silent") ? tr("Relancer", "Follow up") : tr("Candidature", "Application");
  const desc = [a.contact && tr("Contact : ", "Contact: ") + a.contact, a.link, a.notes].filter(Boolean).join("\n");
  return icsEvent({uid: o.id, date: a.next, what, summary: `${what}${tr(" : ", ": ")}${appTitle(o)}${a.company ? " · " + a.company : ""}`, desc, url: a.link});
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
      <ul class="gaplist">${top.map(g => `<li><span><b>${esc(g.k)}</b><small>${tr(`revient dans ${g.n} offres sur ${list.length}`, `asked for in ${g.n} of ${list.length} offers`)}${g.must ? tr(" · indispensable dans " + g.must, " · essential in " + g.must) : ""} · ${g.no === g.n ? tr("pas dans ton CV", "not in your CV") : tr("à prouver", "needs proof")}</small></span><i class="bar" style="--w: ${Math.round(g.n / list.length * 100)}%" aria-hidden="true"></i><button type="button" class="btn light small" data-gapfix="${esc(g.k)}" data-o="${esc(g.o)}">${tr("Corriger", "Fix")}</button></li>`).join("")}</ul>`
      : `<p class="hint">${tr("Aucun point ne manque dans plusieurs offres à la fois : bonne nouvelle.", "No point is missing from several offers at once: good news.")}</p>`}</section>`;
}

/* ---------- Comparer les offres côte à côte ---------- */
function compareHTML(list){
  const L = list.filter(o => o.text && o.text.trim());
  if (L.length < 2) return `<p class="notice">${tr("Il faut au moins deux offres analysées pour les comparer. Colle une autre offre avec « Comparer avec une autre offre » à l'étape 3.", "You need at least two analysed offers to compare them. Paste another one with \"Compare with another offer\" in step 3.")}</p>`;
  const data = L.map(o => { const ad = adCheck(o.text), f = id => ad.facts.find(x => x.id === id)?.v || "", rs = resultsFor(o); return {o, ad, f, no: rs.filter(r => r.st === "no").length, mustNo: rs.filter(r => r.st === "no" && r.prio === "must").length}; });
  const best = Math.max(...data.map(d => d.o.score ?? -1));
  const rows = [
    [tr("Score", "Score"), d => d.o.score != null ? `<b class="${d.o.score === best ? "best" : ""}">${esc(d.o.score)} %</b>` : "–"],
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
    <thead><tr><th scope="col"><span class="sr-only">${tr("Critère", "Criterion")}</span></th>${data.map(d => `<th scope="col"><button type="button" data-openoffer="${esc(d.o.id)}">${esc(appTitle(d.o))}</button>${d.o.app.company ? `<small>${esc(d.o.app.company)}</small>` : ""}</th>`).join("")}</tr></thead>
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
    if (!has("remote") && LX("office", /informati|bureau|logiciel|donnees|digital|numerique|develop|comptab|administrati|software|office|data|developer|admin/).test(fold(o.text))) out.push(tr("Le télétravail est-il possible, même en partie ?", "Is remote work possible, even partly?"));
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
  const data = snapshot(true); // le fichier contient tout, même si la case « Garder ma session » n'est pas cochée
  Export.download(new Blob([JSON.stringify(data, null, 1)], {type: "application/json"}), tr("ca-colle-sauvegarde-", "ca-colle-backup-") + today() + ".json");
  toast(tr("Fichier enregistré : ouvre-le sur ton autre appareil", "File saved: open it on your other device"));
  stat("sauvegarde", {how: "export"});
}
// « Envoyer ma sauvegarde » : la feuille de partage du téléphone (mail, messagerie, fichiers…) avec le fichier.
// Chrome sur Android ne partage pas les .json : on essaie alors le même contenu en .txt (« Ouvrir une sauvegarde » lit les deux).
// Sans partage de fichier (la plupart des ordinateurs) : téléchargement, comme « Sauvegarde complète ».
async function shareBackup(){
  syncOffer();
  const json = JSON.stringify(snapshot(true), null, 1), base = tr("ca-colle-sauvegarde-", "ca-colle-backup-") + today();
  const file = [new File([json], base + ".json", {type: "application/json"}), new File([json], base + ".txt", {type: "text/plain"})]
    .find(f => { try { return !!navigator.canShare?.({files: [f]}); } catch { return false; } });
  if (!file) { stat("sauvegarde-envoi-fichier"); Export.download(new Blob([json], {type: "application/json"}), base + ".json"); return toast(tr("Fichier téléchargé : envoie-le-toi par mail, puis « Ouvrir une sauvegarde » sur ton autre appareil", "File downloaded: email it to yourself, then \"Open a backup\" on your other device"), 6000); }
  try {
    await navigator.share({files: [file], title: tr("Ma sauvegarde Ça colle ?", "My Good fit? backup")});
    stat("sauvegarde-envoi");
    toast(tr("Sur ton autre appareil, ouvre ce fichier avec « Ouvrir une sauvegarde »", "On your other device, open this file with \"Open a backup\""), 5000);
  } catch (e) { if (e?.name !== "AbortError") { Export.download(file, file.name); toast(tr("Partage impossible : le fichier est téléchargé à la place", "Sharing failed: the file was downloaded instead"), 4000); } }
}
// Le fichier vient peut-être de quelqu'un d'autre : il passe par cleanSave (js/app.js), qui ne garde que les champs connus
async function importBackup(file){
  let d = null;
  try { if (file.size < 20e6) d = cleanSave(JSON.parse(await file.text())); } catch {}
  if (!d || !(d.offers.length || d.cv.text || d.contacts.length)) return toast(tr("Ce fichier n'est pas une sauvegarde de Ça colle ?", "This file is not a Good fit? backup"), 4000);
  if ((offers.some(o => o.text.trim() || o.app) || cvReady || contacts.length) && !confirm(tr("Remplacer ce qui est dans l'app par le contenu de ce fichier ?", "Replace what is in the app with the content of this file?"))) return;
  // tout le contenu du fichier est gardé sur l'appareil (case « Garder ma session » cochée), puis on rouvre sur le suivi
  d.keep = true; d.imported = true;
  noSave = true; clearTimeout(saveTimer); // la sauvegarde automatique à la fermeture ne doit pas écraser le fichier ouvert
  try { localStorage.setItem(STORE, JSON.stringify(d)); } catch { noSave = false; return toast(tr("Impossible d'enregistrer sur cet appareil", "Could not save on this device"), 4000); }
  stat("sauvegarde", {how: "import"});
  history.replaceState(null, "", location.pathname + location.search + "#suivi");
  location.reload();
}

/* ---------- Événements ---------- */
document.addEventListener("click", e => {
  const t = e.target.closest("button"); if (!t) return;
  if (t.dataset.mail) { stat("mail-modele"); mailFor = t.dataset.mail; mailKind = null; prepFor = null; practFor = null; renderTrack(); return $("#trackbelow").scrollIntoView({behavior: "smooth"}); }
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
  if (t.id === "sharebackup") return shareBackup();
  if (t.id === "restore") return $("#restorefile").click();
});
document.addEventListener("change", e => { if (e.target.id === "restorefile" && e.target.files[0]) { importBackup(e.target.files[0]); e.target.value = ""; } });

/* ---------- Justificatif de recherche d'emploi (PDF à imprimer) ---------- */
const sentDate = o => o.app.appliedDate || (o.app.history.find(h => h.s !== "todo") || {}).d || "";
function proofDoc(period){
  const now = new Date(today() + "T12:00:00"), ym = d => d.slice(0, 7);
  const last = ymd(new Date(now.getFullYear(), now.getMonth() - 1, 15)).slice(0, 7);
  const keepIt = d => d && (period === "all" || (period === "month" ? ym(d) === today().slice(0, 7) : ym(d) === last));
  const list = apps().filter(o => o.app.status !== "todo" && keepIt(sentDate(o))).sort((a, b) => sentDate(a).localeCompare(sentDate(b)));
  if (!list.length) return toast(tr("Aucune candidature envoyée sur cette période", "No application sent in this period"));
  const ds = list.map(sentDate), when = period === "all" ? tr(`du ${fmtDate(ds[0])} au ${fmtDate(ds[ds.length - 1])}`, `from ${fmtDate(ds[0])} to ${fmtDate(ds[ds.length - 1])}`)
    : new Date((period === "month" ? today().slice(0, 7) : last) + "-15T12:00:00").toLocaleDateString(tr("fr-FR", "en-GB"), {month: "long", year: "numeric"});
  const html = `<div class="p-proof">
    <h1>${tr("Mes démarches de recherche d'emploi", "My job search activity")}</h1>
    <p><b>${esc(me.name || personName() || tr("[ton nom]", "[your name]"))}</b>${me.contact ? " · " + esc(me.contact) : ""}</p>
    <p>${tr("Période : ", "Period: ")}${esc(when)} · ${plural(list.length, tr("candidature", "application"))}</p>
    <table><thead><tr><th>${tr("Date", "Date")}</th><th>${tr("Entreprise", "Company")}</th><th>${tr("Poste", "Job")}</th><th>${tr("État", "Status")}</th><th>${tr("Contact ou lien", "Contact or link")}</th></tr></thead>
    <tbody>${list.map(o => `<tr><td>${fmtDate(sentDate(o))}</td><td>${esc(o.app.company || "–")}</td><td>${esc(appTitle(o))}</td><td>${esc(stLabel(o.app.status))}</td><td>${esc(o.app.contact || o.app.link || "–")}</td></tr>`).join("")}</tbody></table>
    <p class="p-foot">${tr(`Liste établie le ${fmtDate(today())} à partir du suivi tenu par la personne avec Ça colle ? (ca-colle.pissits.com).`, `List made on ${fmtDate(today())} from the person's own tracker in Good fit? (ca-colle.pissits.com).`)}</p></div>`;
  stat("justificatif", {period});
  toast(tr("Choisis « Enregistrer en PDF »", "Choose \"Save as PDF\""));
  setTimeout(() => Export.printHTML(html), 300);
}

/* ---------- Mon tableau de bord : rythme, réponses, objectif de la semaine ---------- */
const REPLY = ["call", "interview", "met", "test", "offer", "accepted", "refused"];
const monday = d => { const x = new Date(d + "T12:00:00"), k = (x.getDay() + 6) % 7; x.setDate(x.getDate() - k); return ymd(x); };
function statsHTML(){
  const all = apps(), sent = all.filter(o => o.app.status !== "todo" && sentDate(o));
  if (!sent.length) return `<p class="notice">${tr("Ton tableau de bord se remplira quand tu auras noté des candidatures envoyées.", "Your dashboard fills up once you have noted applications as sent.")}</p>`;
  const replied = sent.filter(o => o.app.history.some(h => REPLY.includes(h.s))), talks = sent.filter(o => o.app.history.some(h => h.s === "interview" || h.s === "met"));
  const delays = replied.map(o => daysFrom(sentDate(o)) - daysFrom(o.app.history.find(h => REPLY.includes(h.s)).d)).filter(n => n >= 0);
  const avg = delays.length ? Math.round(delays.reduce((a, b) => a + b, 0) / delays.length) : null;
  const goal = +me.goal || 5, wk = monday(today()), weeks = [...Array(8)].map((_, i) => addDays(wk, -7 * (7 - i)));
  const per = weeks.map(w => sent.filter(o => monday(sentDate(o)) === w).length), max = Math.max(goal, ...per), now = per[per.length - 1];
  const rate = Math.round(replied.length / sent.length * 100);
  const byStatus = STATUSES.map(s => ({s, n: all.filter(o => o.app.status === s.id).length})).filter(x => x.n);
  return `<div class="stats">
    <div class="kpis">
      <div><b>${sent.length}</b><span>${tr("candidatures envoyées", "applications sent")}</span></div>
      <div><b>${rate}${tr(" %", "%")}</b><span>${tr(`de réponses (${replied.length})`, `got a reply (${replied.length})`)}</span></div>
      <div><b>${talks.length}</b><span>${tr("entretiens obtenus", "interviews")}</span></div>
      <div><b>${avg == null ? "–" : plural(avg, tr("jour", "day"))}</b><span>${tr("avant une réponse, en moyenne", "on average before a reply")}</span></div>
    </div>
    <section class="group"><h2 class="section-title" style="--k: var(--yellow)">${tr("Cette semaine : ", "This week: ")}${now} / ${goal}</h2>
      <div class="goalbar" role="img" aria-label="${tr(`${now} candidatures sur un objectif de ${goal}`, `${now} applications out of a goal of ${goal}`)}"><i style="width: ${Math.min(100, Math.round(now / goal * 100))}%"></i></div>
      <label class="goal-in">${tr("Mon objectif par semaine", "My weekly goal")} <input type="number" id="goal" min="1" max="50" value="${goal}"></label>
      <p class="hint">${now >= goal ? tr("Objectif atteint, bravo. Pense aussi à te reposer.", "Goal reached, well done. Remember to rest too.") : tr(`Encore ${goal - now} pour atteindre ton objectif. La qualité compte plus que le nombre : une lettre adaptée vaut mieux que trois envois rapides.`, `${goal - now} more to reach your goal. Quality matters more than numbers: one tailored letter beats three quick ones.`)}</p>
    </section>
    <section class="group"><h2 class="section-title" style="--k: var(--blue)">${tr("Candidatures par semaine", "Applications per week")}</h2>
      <div class="weeks">${weeks.map((w, i) => `<div class="wk"><i style="height: ${Math.round(per[i] / max * 100)}%" title="${per[i]}"></i><b>${per[i]}</b><small>${new Date(w + "T12:00:00").toLocaleDateString(tr("fr-FR", "en-GB"), {day: "numeric", month: "short"})}</small></div>`).join("")}</div>
    </section>
    <section class="group"><h2 class="section-title" style="--k: var(--violet)">${tr("Où en sont tes candidatures", "Where your applications stand")}</h2>
      <ul class="stbars">${byStatus.map(x => `<li><span>${esc(LL(x.s))}</span><i style="--w: ${Math.round(x.n / all.length * 100)}%; --k: ${x.s.c}"></i><b>${x.n}</b></li>`).join("")}</ul>
    </section>
  </div>`;
}
// Objectif de la semaine, en haut du suivi : candidatures envoyées depuis lundi (dates locales), sur le nombre choisi
function weekGoalHTML(){
  const goal = +me.goal || 0, wk = monday(today());
  const now = apps().filter(o => o.app.status !== "todo" && sentDate(o) && monday(sentDate(o)) === wk).length;
  const opts = [...new Set([...Array(10)].map((_, i) => i + 1).concat(goal ? [goal] : []))].sort((a, b) => a - b);
  const sel = `<label class="wg-in"><span>${tr("Objectif de la semaine", "Weekly goal")}</span><select id="weekgoalsel">${goal ? "" : `<option value="">${tr("Choisir", "Choose")}</option>`}${opts.map(n => `<option value="${n}" ${n === goal ? "selected" : ""}>${n}</option>`).join("")}</select></label>`;
  if (!goal) return `${sel}<p class="hint">${tr("Choisis combien de candidatures tu veux envoyer par semaine. Le compte repart à zéro chaque lundi.", "Choose how many applications you want to send each week. The count starts again every Monday.")}</p>`;
  const left = goal - now;
  return `${sel}<p class="wg-t">${tr(`${now} sur ${goal} cette semaine`, `${now} of ${goal} this week`)}</p>
    <div class="goalbar" role="img" aria-label="${tr(`${now} candidatures sur un objectif de ${goal}`, `${now} applications out of a goal of ${goal}`)}"><i style="width: ${Math.min(100, Math.round(now / goal * 100))}%"></i></div>
    <p class="hint">${left > 0 ? tr(`Encore ${plural(left, tr("candidature", "application"))} d'ici dimanche.`, `${plural(left, tr("candidature", "application"))} to go by Sunday.`) : tr("Objectif atteint, bravo.", "Goal reached, well done.")}</p>`;
}
document.addEventListener("change", e => { if (e.target.id === "weekgoalsel" && e.target.value) { me.goal = Math.max(1, Math.min(50, +e.target.value)); stat("objectif-semaine"); save(); renderTrack(); $("#weekgoalsel")?.focus(); } });
document.addEventListener("click", e => {
  const t = e.target.closest("button"); if (!t) return;
  if (t.dataset.proof) { t.closest("details")?.removeAttribute("open"); return proofDoc(t.dataset.proof); }
});
document.addEventListener("input", e => { if (e.target.id === "goal") { me.goal = Math.max(1, Math.min(50, +e.target.value || 5)); save(); clearTimeout(statsHTML.t); statsHTML.t = setTimeout(() => { const v = document.activeElement === e.target; renderTrack(); if (v) $("#goal")?.focus(); }, 500); } });

/* ---------- Pitch d'une minute (« Présentez-vous ») : construit avec ce qui est écrit dans le CV ---------- */
function pitchText(o){
  const exp = CV.find(l => l.exp), title = exp ? exp.t.split(/\s*[,(:]\s*|\s+[–-]\s+/)[0].trim() : "", yrs = cvYears($("#cvraw").value);
  const rs = resultsFor(o).filter(r => r.st === "ok" && !["y", "h", "l", "d", "x"].includes(r.type)).sort((a, b) => (a.prio === "must" ? 0 : 1) - (b.prio === "must" ? 0 : 1));
  const low = k => KEEPCASE ? k : k.charAt(0).toLowerCase() + k.slice(1), top = rs.slice(0, 2).map(r => r.k), P = rs.find(r => r.proof && r.proof.exp)?.proof;
  // l'exemple : la description du poste qui prouve le premier point fort, coupée proprement
  let proof = P ? (P.t.includes(":") ? P.t.slice(P.t.indexOf(":") + 1) : P.t).trim().replace(/[.;]+$/, "") : "";
  if (proof.length > 140) proof = proof.slice(0, 140).replace(/[,;\s]+\S*$/, "");
  const name = me.name || personName() || tr("[ton prénom]", "[your name]"), job = appTitle(o), co = o.app.company;
  if (L10N?.pitch) return L10N.pitch({name, title, yrs: yrs ? Y(yrs) : "", top, proof, co, job});
  return EN ? [
    `My name is ${name}.`,
    title ? `My current role: ${title}${yrs ? `, with about ${Y(yrs)} of experience` : ""}.` : "[What you do today, in one sentence.]",
    top.length ? `My strengths: ${top.join(" and ")}.` : "[What you do best.]",
    proof ? `For example: ${proof}.` : "[One example with a number.]",
    `Today I would like to join ${co || "your company"} as ${job} because [your reason].`
  ].join(" ") : [
    `Je m'appelle ${name}.`,
    title ? `Je suis ${low(title)}${yrs ? `, avec environ ${Y(yrs)} d'expérience` : ""}.` : "[Ce que tu fais aujourd'hui, en une phrase.]",
    top.length ? `Mes points forts : ${top.join(" et ")}.` : "[Ce que tu fais le mieux.]",
    proof ? `Par exemple : ${proof.charAt(0).toLowerCase() + proof.slice(1)}.` : "[Un exemple avec un chiffre.]",
    `Aujourd'hui, je souhaite rejoindre ${co || "votre entreprise"} comme ${job} parce que [ta raison].`
  ].join(" ");
}
document.addEventListener("click", e => {
  const t = e.target.closest("button[data-pitch]"); if (!t) return;
  const o = offers.find(x => x.id === t.dataset.pitch); o.prep = o.prep || {};
  const cur0 = (o.prep.g1 || {}).t;
  if (cur0 && !confirm(tr("Remplacer ta réponse actuelle par le pitch ?", "Replace your current answer with the pitch?"))) return;
  o.prep.g1 = {t: pitchText(o)}; save(); stat("pitch"); renderTrack();
  toast(tr("Pitch prêt : complète ce qui est entre crochets", "Pitch ready: fill in what is in brackets"));
});
