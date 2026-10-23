// S'entraîner à l'entretien : 6 questions tirées de l'offre et de ce qui manque au CV (interviewQs, js/suivi.js),
// lues à voix haute par le navigateur (speechSynthesis), avec un chrono. Rien n'est enregistré ni envoyé.
let practice = null; // {id, qs, i, sec, run}

// La présentation d'abord, puis les points de l'offre (les manques d'abord), puis des questions classiques pour arriver à 6
function practiceQs(o){
  const all = interviewQs(o), byId = id => all.find(q => q.id === id);
  const fromAd = all.filter(q => q.id.startsWith("r:")).slice(0, 4);
  const qs = [byId("g1"), ...fromAd];
  for (const id of ["g3", "g2", "g4", "g5", "g6"]) if (qs.length < 6) qs.push(byId(id));
  return qs.filter(Boolean).slice(0, 6);
}
const mmss = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
function stopVoice(){ try { if ("speechSynthesis" in window) speechSynthesis.cancel(); } catch {} }
function stopClock(){ if (practice) practice.run = false; clearInterval(stopClock.iv); }
function renderPractice(o){
  if (!o) { practFor = null; return renderTrack(); }
  if (!practice || practice.id !== o.id) practice = {id: o.id, qs: practiceQs(o), i: 0, sec: 0, run: false};
  const P = practice, q = P.qs[P.i], last = P.i === P.qs.length - 1, fromAd = q.id.startsWith("r:");
  const voice = "speechSynthesis" in window;
  $("#trackout").innerHTML = `<div class="prep practice">
    <div class="prep-h"><button type="button" class="btn ghost small" id="practback">${tr("← Retour au suivi", "← Back to my applications")}</button>
      <h2 class="section-title" style="--k: var(--orange)">${tr("S'entraîner", "Practise")} · ${esc(appTitle(o))}${o.app.company ? " · " + esc(o.app.company) : ""}</h2></div>
    ${!o.text.trim() || !cvReady ? `<p class="notice">${tr("Pour avoir des questions sur cette offre, ajoute le texte de l'annonce et ton CV. En attendant, voici les questions classiques.", "To get questions about this offer, add the ad's text and your CV. Meanwhile, here are the classic questions.")}</p>` : ""}
    <div class="pr-q" aria-live="polite">
      <p class="pr-n">${tr(`Question ${P.i + 1} sur ${P.qs.length}`, `Question ${P.i + 1} of ${P.qs.length}`)}</p>
      <p class="pr-from">${fromAd ? tr("Tirée de l'offre", "From the offer") : tr("Question souvent posée", "Common question")}</p>
      <h3>${esc(q.q)}</h3>
      ${q.tip ? `<p class="hint">${esc(q.tip)}</p>` : ""}
      ${voice ? `<button type="button" class="btn light small" id="practsay" aria-pressed="false">${tr("Écouter la question", "Hear the question")}</button>` : ""}
    </div>
    <div class="pr-clock">
      <p class="pr-lab">${tr("Ton temps de réponse", "Your answer time")}</p>
      <p class="pr-time" id="practtime" role="timer" aria-live="off">${mmss(P.sec)}</p>
      <p class="hint">${tr("Conseil : entre 1 et 2 minutes", "Tip: between 1 and 2 minutes")}</p>
      <div class="export"><button type="button" class="btn small" id="practgo">${P.run ? tr("Pause", "Pause") : P.sec ? tr("Reprendre", "Resume") : tr("Démarrer", "Start")}</button><button type="button" class="btn light small" id="practnext">${last ? tr("Recommencer", "Start again") : tr("Question suivante", "Next question")}</button></div>
    </div>
    <p class="hint">${tr("Réponds à voix haute, comme le jour de l'entretien. Rien n'est enregistré ni envoyé.", "Answer out loud, as on the day. Nothing is recorded or sent.")} <button type="button" class="linkbtn" data-prep="${esc(o.id)}">${tr("Écrire mes réponses", "Write my answers")}</button></p>
  </div>`;
}
function tick(){
  const el = document.getElementById("practtime");
  if (!el || !practice?.run) return stopClock(); // on a quitté l'entraînement (retour, autre vue, autre étape)
  practice.sec++; el.textContent = mmss(practice.sec);
}
document.addEventListener("click", e => {
  const t = e.target.closest("button"); if (!t) return;
  if (t.dataset.practice) {
    stat("entretien-entrainement"); stopClock(); stopVoice(); practice = null;
    practFor = t.dataset.practice; prepFor = null; mailFor = null; renderTrack();
    return $("#trackbelow").scrollIntoView({behavior: "smooth"});
  }
  if (!practice) return;
  if (t.id === "practback") { stopClock(); stopVoice(); practFor = null; practice = null; return renderTrack(); }
  if (t.id === "practgo") {
    practice.run = !practice.run; clearInterval(stopClock.iv);
    if (practice.run) stopClock.iv = setInterval(tick, 1000);
    t.textContent = practice.run ? tr("Pause", "Pause") : tr("Reprendre", "Resume");
    return;
  }
  if (t.id === "practnext") {
    stopClock(); stopVoice();
    practice.i = (practice.i + 1) % practice.qs.length; practice.sec = 0;
    renderTrack(); return $("#practsay, #practgo")?.focus();
  }
  if (t.id === "practsay") {
    if (speechSynthesis.speaking) { stopVoice(); t.setAttribute("aria-pressed", "false"); return; }
    const u = new SpeechSynthesisUtterance(practice.qs[practice.i].q);
    u.lang = tr("fr-FR", "en-GB"); u.rate = .95;
    u.onend = u.onerror = () => t.setAttribute("aria-pressed", "false");
    t.setAttribute("aria-pressed", "true"); stat("entretien-ecouter");
    speechSynthesis.speak(u);
  }
});
