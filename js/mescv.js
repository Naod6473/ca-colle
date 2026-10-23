// Étape 2 : plusieurs CV gardés (5 au plus, nommés par la personne) et « Je n'ai pas de CV » (un CV écrit avec quelques questions).
// Les CV gardés et le formulaire sont dans la session (cvs, build : js/app.js), donc gardés seulement si la case du pied de page est cochée.
// Le score de chaque CV gardé est calculé sur l'appareil avec le moteur (js/moteur.js), rien n'est envoyé.
const CV_MAX = 5, JOB_MAX = 8;
const pctTxt = p => document.documentElement.classList.contains("c-simple") ? tr(`${Math.round(p / 10)} sur 10`, `${Math.round(p / 10)} out of 10`) : p + " %";
const dayTxt = d => { const [y, m, j] = d.split("-").map(Number); return new Date(y, m - 1, j).toLocaleDateString(tr("fr-FR", "en-GB"), {day: "numeric", month: "long"}); };

// Score d'un CV gardé face à l'offre, tel quel (sans les ajouts de l'étape 4 ni les tampons corrigés, faits pour le CV en cours)
function scoreWith(text, offer){
  const keep = [CV, fixes, over, skipped];
  try { CV = parseCV(text); fixes = {}; over = {}; return scoreOf(analyse(offer)); }
  finally { [CV, fixes, over, skipped] = keep; }
}

/* ---------- CV gardés ---------- */
function renderCvLib(){
  const box = $("#cvlib"); if (!box || step !== 2) return;
  const lib = cvs.find(c => c.id === cvFile.lib);
  box.hidden = !cvs.length && !cvReady;
  if (box.hidden) return;
  const withScore = offerOk() && cvs.length > 0, list = cvs.map(c => ({c, s: withScore ? scoreWith(c.text, $("#offer").value) : null}));
  if (withScore) list.sort((a, b) => b.s - a.s);
  const best = withScore && cvs.length > 1 ? list[0] : null, added = Object.values(fixes).some(f => f.state === "accepted");
  const rows = list.map(({c, s}) => `<li class="${c === lib ? "on" : ""}${best && c === best.c ? " best" : ""}">
      <button type="button" data-cvuse="${esc(c.id)}"><span><b>${esc(c.name)}</b><small>${best && c === best.c ? tr("Le plus adapté à cette offre", "The best match for this offer") : c === lib ? tr("Utilisé en ce moment", "In use now") : c.date ? tr(`Modifié le ${dayTxt(c.date)}`, `Changed on ${dayTxt(c.date)}`) : ""}</small></span>${s != null ? `<span class="score">${esc(pctTxt(s))}</span>` : ""}</button>
      <button type="button" class="del" data-cvdel="${esc(c.id)}" aria-label="${esc(tr(`Retirer le CV ${c.name}`, `Remove the CV ${c.name}`))}">✕</button></li>`).join("");
  const add = !cvReady || lib ? ""
    : cvs.length >= CV_MAX ? `<p class="hint">${tr(`Tu as déjà ${CV_MAX} CV gardés : retire-en un pour garder celui-ci.`, `You already keep ${CV_MAX} CVs: remove one to keep this one.`)}</p>`
    : `<div class="cvlib-add"><label for="cvname">${cvs.length ? tr("Garder aussi ce CV", "Keep this CV too") : tr("Garder ce CV pour la prochaine fois", "Keep this CV for next time")}</label>
      <span class="cvlib-in"><input id="cvname" maxlength="40" autocomplete="off" placeholder="${esc(tr("ex : CV caisse", "e.g. Retail CV"))}"><button class="btn small" type="button" id="cvsave" disabled>${tr("+ Ajouter un CV", "+ Add a CV")}</button></span></div>`;
  box.innerHTML = `${cvs.length ? `<b class="cvlib-h">${tr("Tes CV gardés sur cet appareil", "Your CVs kept on this device")}</b><ul class="offers cvlib-list">${rows}</ul>` : ""}
    ${best && best.c !== lib ? `<button class="btn wide" type="button" data-cvuse="${esc(best.c.id)}">${esc(tr(`Utiliser ${best.c.name}`, `Use ${best.c.name}`))}</button>` : ""}
    ${withScore && added ? `<p class="hint">${tr("Score de chaque CV tel qu'il est, sans tes ajouts de l'étape 4.", "Score of each CV as it is, without what you added in step 4.")}</p>` : ""}
    ${add}
    <p class="hint">${tr(`Jusqu'à ${CV_MAX} CV. Tu leur donnes le nom que tu veux.`, `Up to ${CV_MAX} CVs. You name them as you like.`)}${keep() ? "" : ` ${tr("Ils restent la prochaine fois seulement si tu gardes ta session.", "They stay for next time only if you keep your session.")} <button type="button" class="linkbtn" id="cvkeep">${tr("Garder ma session", "Keep my session")}</button>`}</p>`;
}
function useSaved(id){
  const c = cvs.find(x => x.id === id); if (!c) return;
  cvFile = {name: c.name, info: tr("CV gardé sur cet appareil", "CV kept on this device"), conf: 0, lib: c.id};
  me.name = ""; me.contact = ""; $("#ferr").hidden = true;
  setCV(c.text); showFile(c.name, cvFile.info);
  stat("cv-garde-utilise"); toast(tr(`CV choisi : ${c.name}`, `CV chosen: ${c.name}`));
}

/* ---------- Je n'ai pas de CV : quelques questions, un CV en texte simple ---------- */
const emptyJob = () => ({role: "", company: "", dates: "", t1: "", t2: ""});
const trimT = s => String(s || "").replace(/\s+/g, " ").trim();
// Seulement ce que la personne a tapé, rangé sous les titres que le moteur reconnaît (Expériences, Formation, Compétences…)
function buildText(b){
  const out = [], list = s => String(s || "").split(/\n+/).map(trimT).filter(Boolean);
  const id = [b.name, b.city, b.phone, b.mail].map(trimT).filter(Boolean).join(" · ");
  if (id) out.push(id);
  const jobs = (b.jobs || []).filter(j => [j.role, j.company, j.dates, j.t1, j.t2].some(trimT));
  if (jobs.length) {
    out.push("", tr("Expériences", "Experience"));
    jobs.forEach(j => {
      const head = [cap(trimT(j.role)), trimT(j.company)].filter(Boolean).join(", ") + (trimT(j.dates) ? ` (${trimT(j.dates)})` : "");
      if (trimT(head)) out.push(trimT(head));
      [j.t1, j.t2].map(trimT).filter(Boolean).forEach(t => out.push("- " + cap(t)));
    });
  }
  if (list(b.edu).length) out.push("", tr("Formation", "Education"), ...list(b.edu).map(cap));
  if (list(b.skills).length) out.push("", tr("Compétences", "Skills"), cap(list(b.skills).join(", ")));
  if (trimT(b.langs)) out.push("", tr("Langues", "Languages"), cap(trimT(b.langs)));
  if (trimT(b.hobbies)) out.push("", tr("Loisirs", "Hobbies"), cap(trimT(b.hobbies)));
  return out.join("\n").trim();
}
function renderBuild(){
  const b = build, box = $("#cvbuild");
  const inp = (k, label, ph, type = "text", ac = "") => `<div class="field"><label for="cb-${k}">${label}</label><input id="cb-${k}" type="${type}" data-b="${k}" value="${esc(b[k] || "")}" placeholder="${esc(ph)}"${ac ? ` autocomplete="${ac}"` : ""}></div>`;
  const area = (k, label, ph, help) => `<div class="field"><label for="cb-${k}">${label}</label>${help ? `<span class="hint">${help}</span>` : ""}<textarea id="cb-${k}" rows="3" data-b="${k}" placeholder="${esc(ph)}">${esc(b[k] || "")}</textarea></div>`;
  const job = (j, n) => `<fieldset class="bjob"><legend>${tr(`Emploi ${n + 1}`, `Job ${n + 1}`)}</legend>
      ${b.jobs.length > 1 ? `<button type="button" class="linkbtn bjob-del" data-bjdel="${n}">${tr("Retirer cet emploi", "Remove this job")}</button>` : ""}
      ${[["role", tr("Le poste", "Job title"), tr("ex : Vendeuse", "e.g. Sales assistant")], ["company", tr("L'entreprise ou le lieu", "Company or place"), tr("ex : Boulangerie du centre, Caen", "e.g. Town centre bakery, Leeds")], ["dates", tr("Les années", "Years"), tr("ex : 2021 - 2024", "e.g. 2021 - 2024")], ["t1", tr("Une tâche que tu faisais", "A task you did"), tr("ex : accueil et encaissement des clients", "e.g. serving customers at the till")], ["t2", tr("Une autre tâche", "Another task"), tr("ex : mise en rayon chaque matin", "e.g. stocking shelves every morning")]]
        .map(([k, label, ph]) => `<div class="field"><label for="cb-${n}-${k}">${label}</label><input id="cb-${n}-${k}" data-bj="${n}" data-bk="${k}" value="${esc(j[k] || "")}" placeholder="${esc(ph)}"></div>`).join("")}
    </fieldset>`;
  const handEdit = cvFile.built && b.out && $("#cvraw").value.trim() !== b.out;
  box.innerHTML = `<h2 class="section-title" style="--k: var(--card)">${tr("Ton CV en quelques questions", "Your CV in a few questions")}</h2>
    <p class="hint">${tr("Écris seulement ce qui est vrai. Laisse vide ce que tu n'as pas.", "Only write what is true. Leave empty what you don't have.")}</p>
    <fieldset class="bpart"><legend>${tr("Toi", "You")}</legend><div class="bgrid">
      ${inp("name", tr("Ton prénom et ton nom", "Your first and last name"), tr("ex : Léa Exemple", "e.g. Alex Sample"), "text", "name")}
      ${inp("city", tr("Ta ville", "Your town"), tr("ex : Caen", "e.g. Leeds"), "text", "address-level2")}
      ${inp("phone", tr("Ton téléphone", "Your phone"), tr("ex : 06 00 00 00 00", "e.g. 07700 900000"), "tel", "tel")}
      ${inp("mail", tr("Ton email", "Your email"), tr("ex : lea@exemple.fr", "e.g. alex@example.com"), "email", "email")}
    </div></fieldset>
    <fieldset class="bpart"><legend>${tr("Tes emplois", "Your jobs")}</legend>
      <p class="hint">${tr("Un emploi, un stage, du bénévolat ou un job d'été. Le plus récent d'abord. Mets les années : elles comptent pour l'expérience demandée.", "A job, an internship, volunteering or a summer job. Most recent first. Add the years: they count towards the experience asked for.")}</p>
      ${b.jobs.map(job).join("")}
      ${b.jobs.length < JOB_MAX ? `<button type="button" class="btn light small" id="bjadd">${tr("+ Ajouter un emploi", "+ Add a job")}</button>` : ""}
    </fieldset>
    <fieldset class="bpart"><legend>${tr("Le reste", "The rest")}</legend>
      ${area("edu", tr("Tes diplômes et formations", "Your qualifications and training"), tr("ex : CAP Employé de commerce (2020)", "e.g. GCSEs, Leeds High School (2020)"), tr("Un par ligne.", "One per line."))}
      ${area("skills", tr("Ce que tu sais faire", "What you can do"), tr("ex : caisse, mise en rayon, permis B", "e.g. till, stocking shelves, driving licence"), tr("Sépare par des virgules.", "Separate with commas."))}
      ${inp("langs", tr("Tes langues", "Your languages"), tr("ex : français, anglais (bases)", "e.g. English, Polish (fluent)"))}
      ${inp("hobbies", tr("Tes loisirs (si tu veux)", "Your hobbies (if you like)"), tr("ex : football en club, cuisine", "e.g. club football, cooking"))}
    </fieldset>
    <div class="next-row"><button class="btn" type="button" id="buildok">${cvFile.built ? tr("Mettre à jour mon CV", "Update my CV") : tr("Créer mon CV", "Create my CV")}</button>
      <span class="hint">${handEdit ? tr("Attention : ce que tu as changé à la main dans le texte du CV sera remplacé.", "Careful: what you changed by hand in the CV text will be replaced.") : tr("Tu pourras le relire et le corriger ensuite.", "You can check and correct it afterwards.")}</span></div>`;
}
function syncNoCv(){
  const box = $("#nocvbox"); if (!box) return;
  box.hidden = cvReady && !cvFile.built;
  if (box.hidden) { $("#cvbuild").hidden = true; $("#nocv").setAttribute("aria-expanded", "false"); }
  $("#nocv").textContent = cvFile.built ? tr("Modifier mon CV avec les questions", "Edit my CV with the questions") : tr("Je n'ai pas de CV", "I don't have a CV");
  box.querySelector(".hint").hidden = !!cvFile.built;
}
function openBuild(open){
  const box = $("#cvbuild");
  if (open && !build) build = {name: "", city: "", phone: "", mail: "", jobs: [emptyJob()], edu: "", skills: "", langs: "", hobbies: ""};
  if (open) { renderBuild(); stat("cv-formulaire"); }
  box.hidden = !open; $("#nocv").setAttribute("aria-expanded", String(open));
  if (open) setTimeout(() => box.querySelector("input")?.focus(), 30);
}

document.addEventListener("click", e => {
  const t = e.target.closest("button"); if (!t) return;
  if (t.dataset.cvuse) return useSaved(t.dataset.cvuse);
  if (t.dataset.cvdel) {
    const c = cvs.find(x => x.id === t.dataset.cvdel); if (!c) return;
    cvs = cvs.filter(x => x !== c); if (cvFile.lib === c.id) delete cvFile.lib;
    renderCvLib(); save(); return toast(tr(`CV retiré : ${c.name}`, `CV removed: ${c.name}`));
  }
  if (t.dataset.bjdel !== undefined) { build.jobs.splice(+t.dataset.bjdel, 1); renderBuild(); save(); return; }
  switch (t.id) {
    case "cvsave": {
      const name = trimT($("#cvname").value).slice(0, 40); if (!name || !cvReady || cvs.length >= CV_MAX) return;
      const c = {id: newId(), name, text: $("#cvraw").value, date: ymd(new Date())};
      cvs.push(c); cvFile.lib = c.id; showFile(cvFile.name || c.name, cvFile.info);
      stat("cv-garde", {n: cvs.length}); renderCvLib(); save();
      return toast(keep() ? tr(`CV gardé : ${name}`, `CV kept: ${name}`) : tr(`CV gardé pour cette visite : ${name}`, `CV kept for this visit: ${name}`));
    }
    case "cvkeep": $("#keep").checked = true; $("#keep").dispatchEvent(new Event("change", {bubbles: true})); return renderCvLib();
    case "nocv": return openBuild($("#cvbuild").hidden);
    case "bjadd": {
      build.jobs.push(emptyJob()); renderBuild(); save();
      return $(`#cb-${build.jobs.length - 1}-role`)?.focus();
    }
    case "buildok": {
      const text = buildText(build);
      if (!text) return toast(tr("Remplis au moins une case", "Fill in at least one box"));
      build.out = text;
      cvFile = {name: tr("Mon CV fait ici", "My CV made here"), info: tr("Écrit avec les questions de l'app", "Written with the app's questions"), conf: 0, built: true};
      me.name = ""; me.contact = ""; $("#ferr").hidden = true;
      setCV(text); showFile(cvFile.name, cvFile.info); openBuild(false);
      stat("cv-cree"); $("#check").open = true;
      $("#filecard").scrollIntoView({block: "center", behavior: "smooth"});
      return toast(tr("Ton CV est prêt. Relis-le dans « Vérifier le texte lu ».", "Your CV is ready. Check it in \"Check the text read\"."), 4000);
    }
  }
});
document.addEventListener("input", e => {
  const t = e.target;
  if (t.id === "cvname") { $("#cvsave").disabled = !trimT(t.value); return; }
  if (!build || !t.closest("#cvbuild")) return;
  if (t.dataset.b) build[t.dataset.b] = t.value;
  else if (t.dataset.bj !== undefined) build.jobs[+t.dataset.bj][t.dataset.bk] = t.value;
  save();
});
document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.id === "cvname") { e.preventDefault(); $("#cvsave").click(); } });
// « Mots simples » changé dans le menu Aa : scores sur 10
document.addEventListener("cacolle-simple", renderCvLib);
syncNoCv(); renderCvLib();
