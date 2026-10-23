// Carnet de contacts du suivi : les personnes rencontrées (salon, stage, entretien…), avec une date pour les recontacter
// et un rappel dans l'agenda (.ics, js/outils.js). Gardé avec le suivi sur l'appareil et dans la sauvegarde ;
// relu par cleanSave (js/app.js). Rien n'est envoyé.
let openCt = null;
const CT_FIELDS = ["name", "company", "where", "phone", "email", "next", "note"];
const ctTitle = c => c.name.trim() || tr("Nouvelle personne", "New person");
const ctSub = c => [c.where, c.company].map(s => s.trim()).filter(Boolean).join(" · ");
const ctMail = c => /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(c.email.trim()) ? c.email.trim() : "";
const ctTel = c => c.phone.replace(/[^\d+]/g, "");
function ctDue(c){
  if (!c.next) return null;
  const d = daysFrom(c.next);
  if (d > 0) return {urgent: true, t: tr(`À recontacter depuis ${plural(d, "jour")}`, `Get back in touch: ${plural(d, "day")} overdue`)};
  if (d === 0) return {urgent: true, t: tr("À recontacter aujourd'hui", "Get back in touch today")};
  return {t: tr(`Rappel le ${fmtDate(c.next)}`, `Reminder on ${fmtDate(c.next)}`)};
}
function contactCard(c){
  const id = esc(c.id), due = ctDue(c), open = openCt === c.id, mail = ctMail(c), tel = ctTel(c);
  const f = (k, label, type = "text", ph = "") => `<label class="afield"><span>${label}</span>${type === "area"
    ? `<textarea data-ct="${id}" data-cf="${k}" rows="3" placeholder="${esc(ph)}">${esc(c[k])}</textarea>`
    : `<input type="${type}" data-ct="${id}" data-cf="${k}" value="${esc(c[k])}" placeholder="${esc(ph)}"${type === "tel" ? ' autocomplete="off"' : ""}>`}</label>`;
  return `<article class="app-card ct-card" id="ct-${id}" style="--k: var(--teal)">
    <div class="app-h"><div><h3 data-cth>${esc(ctTitle(c))}</h3><p data-cts>${esc(ctSub(c))}</p></div></div>
    ${due ? `<div class="app-row"><i class="tag ${due.urgent ? "must" : ""}">${esc(due.t)}</i></div>` : ""}
    ${c.note.trim() && !open ? `<p class="ct-note">${esc(c.note.trim().slice(0, 160))}${c.note.trim().length > 160 ? "…" : ""}</p>` : ""}
    <details class="app-more" ${open ? "open" : ""} data-ctmore="${id}"><summary>${tr("Modifier", "Edit")}</summary>
      <div class="app-form">
        ${f("name", tr("Nom", "Name"), "text", tr("ex : Mme Exemple", "e.g. Ms Example"))}${f("company", tr("Entreprise", "Company"))}
        ${f("where", tr("Rencontré(e) où", "Where you met"), "text", tr("ex : salon de l'emploi, stage, entretien", "e.g. job fair, work placement, interview"))}${f("next", tr("Date pour recontacter", "Date to get back in touch"), "date")}
        ${f("phone", tr("Téléphone (si tu veux)", "Phone (optional)"), "tel")}${f("email", tr("Email (si tu veux)", "Email (optional)"), "email")}
        ${f("note", tr("Note", "Note"), "area", tr("ex : m'a conseillé de postuler en mars, cherche des caristes", "e.g. advised me to apply in March, looking for forklift drivers"))}
      </div>
    </details>
    <div class="app-actions">
      ${tel ? `<a class="btn light small" href="tel:${esc(tel)}">${tr("Appeler", "Call")}</a>` : ""}
      ${mail ? `<a class="btn light small" href="mailto:${esc(encodeURIComponent(mail))}">${tr("Écrire", "Email")}</a>` : ""}
      ${c.next ? `<button type="button" class="btn light small" data-ctics="${id}">${tr("Ajouter à l'agenda", "Add to calendar")}</button>` : ""}
      <button type="button" class="btn ghost small" data-ctdel="${id}">${tr("Supprimer", "Delete")}</button>
    </div>
  </article>`;
}
function contactsHTML(){
  // à recontacter d'abord (date la plus proche), puis les autres par nom
  const list = contacts.slice().sort((a, b) => (a.next ? 0 : 1) - (b.next ? 0 : 1) || a.next.localeCompare(b.next) || ctTitle(a).localeCompare(ctTitle(b)));
  return `<div class="prep contacts">
    <div class="prep-h"><h2 class="section-title" style="--k: var(--teal)">${tr("Mes contacts", "My contacts")}${contacts.length ? ` · ${contacts.length}` : ""}</h2>
      <button type="button" class="btn small" id="addcontact">${tr("+ Ajouter une personne", "+ Add a person")}</button></div>
    <p class="hint">${tr("Les personnes rencontrées pendant ta recherche : salon, stage, entretien, ancien collègue. Note quand les recontacter. Tout reste sur cet appareil et dans ta sauvegarde.", "People you meet while job hunting: job fair, placement, interview, former colleague. Note when to get back in touch. Everything stays on this device and in your backup.")}</p>
    ${list.length ? `<div class="apps">${list.map(contactCard).join("")}</div>` : `<p class="notice">${tr("Aucun contact pour l'instant. Ajoute la personne rencontrée à un salon ou pendant un stage.", "No contacts yet. Add someone you met at a job fair or during a placement.")}</p>`}
  </div>`;
}
document.addEventListener("click", e => {
  const t = e.target.closest("button"); if (!t) return;
  if (t.id === "addcontact") {
    stat("contact-ajout");
    const c = {id: newId(), name: "", company: "", where: "", phone: "", email: "", next: "", note: ""};
    contacts.push(c); openCt = c.id; save(); renderTrack();
    const el = document.querySelector(`#ct-${c.id} [data-cf="name"]`); el?.scrollIntoView({block: "center", behavior: "smooth"}); el?.focus({preventScroll: true});
    return;
  }
  if (t.dataset.ctics) {
    const c = contacts.find(x => x.id === t.dataset.ctics); if (!c?.next) return;
    stat("contact-agenda");
    const what = tr("Recontacter", "Get back in touch"), co = c.company.trim();
    const desc = [c.where && tr("Rencontré(e) : ", "Met: ") + c.where, c.phone, c.email, c.note].filter(Boolean).join("\n");
    Export.download(new Blob([icsEvent({uid: "ct" + c.id, date: c.next, what, summary: `${what}${tr(" : ", ": ")}${ctTitle(c)}${co ? " · " + co : ""}`, desc})], {type: "text/calendar;charset=utf-8"}), fileBase(what + " " + ctTitle(c)) + ".ics");
    return toast(tr("Ouvre le fichier pour l'ajouter à ton agenda", "Open the file to add it to your calendar"));
  }
  if (t.dataset.ctdel) {
    const c = contacts.find(x => x.id === t.dataset.ctdel);
    if (!c || !confirm(tr(`Supprimer « ${ctTitle(c)} » de tes contacts ?`, `Remove "${ctTitle(c)}" from your contacts?`))) return;
    contacts = contacts.filter(x => x !== c); save(); return renderTrack();
  }
});
document.addEventListener("input", e => {
  const t = e.target; if (!t.dataset.ct || !CT_FIELDS.includes(t.dataset.cf)) return;
  const c = contacts.find(x => x.id === t.dataset.ct); if (!c) return;
  c[t.dataset.cf] = t.dataset.cf === "next" ? (/^\d{4}-\d{2}-\d{2}$/.test(t.value) ? t.value : "") : t.value.slice(0, t.dataset.cf === "note" ? 5000 : 300);
  const card = t.closest(".ct-card");
  if (card) { card.querySelector("[data-cth]").textContent = ctTitle(c); card.querySelector("[data-cts]").textContent = ctSub(c); }
  save();
});
// Date, téléphone ou mail changés : on redessine la fiche (rappel, boutons Appeler / Écrire) sans perdre le champ suivant
document.addEventListener("change", e => {
  const t = e.target; if (!t.dataset.ct || !["next", "phone", "email"].includes(t.dataset.cf)) return;
  openCt = t.dataset.ct;
  setTimeout(() => { const a = document.activeElement, sel = a?.dataset?.ct ? `[data-ct="${CSS.escape(a.dataset.ct)}"][data-cf="${CSS.escape(a.dataset.cf)}"]` : ""; renderTrack(); if (sel) document.querySelector(sel)?.focus(); });
});
document.addEventListener("toggle", e => { const id = e.target.dataset?.ctmore; if (id) openCt = e.target.open ? id : openCt === id ? null : openCt; }, true);
