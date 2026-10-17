// Interface de Ça colle ? : 4 étapes (offre, CV, résultat, améliorer). Le calcul est dans js/moteur.js,
// la lecture des fichiers dans js/lecteur.js.
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const MIN_WORDS = 25;
let step = 1, filter = "all", results = [], cvReady = false;

const words = t => t.trim() ? t.trim().split(/\s+/).length : 0;
const offerOk = () => words($("#offer").value) >= MIN_WORDS;
const canReach = n => n === 1 || (n === 2 && offerOk()) || (n >= 3 && offerOk() && cvReady);

function toast(t){ const el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => el.hidden = true, 2000); }

/* Onglets et boutons « suivant » : on n'avance que quand l'étape d'avant est remplie */
function gates(){
  const w = words($("#offer").value);
  $("#next1").disabled = !offerOk();
  $("#hint1").textContent = w === 0 ? "Colle au moins quelques lignes de l'annonce." : offerOk() ? `${w} mots, c'est bon.` : `${w} mots : colle l'annonce en entier, il en faut au moins ${MIN_WORDS}.`;
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
  results = analyse($("#offer").value);
  $$(".tab").forEach(t => t.setAttribute("aria-selected", +t.dataset.step === n));
  $$("[data-p]").forEach(p => p.hidden = +p.dataset.p !== n);
  $$("[data-for]").forEach(p => p.hidden = +p.dataset.for !== n || (n === 2 && !cvReady));
  if (n === 3) renderResult();
  if (n === 4) renderRewrite();
  gates();
  if (window.scrollY > 120) $(".top").scrollIntoView({behavior: "smooth"});
}

/* ---------- Étape 3 ---------- */
const HELP = {
  mid: "C'est dans ton CV, mais sans exemple. Ajoute un fait concret : un chiffre, un lieu, une durée.",
  no: "L'offre le demande. Si tu l'as déjà fait, même en job d'été, ajoute-le dans une expérience."
};
/* Explication d'un point, avec l'extrait du CV qui le prouve ou le cite */
function excerpt(re, onlyExp){
  const l = cvLines(false).find(l => l.raw && (!onlyExp || l.exp) && re.test(l.raw)); if (!l) return "";
  const m = l.raw.match(re), a = Math.max(0, m.index - 40), b = Math.min(l.raw.length, m.index + m[0].length + 40);
  return (a ? "…" : "") + l.raw.slice(a, b).trim() + (b < l.raw.length ? "…" : "");
}
function explain(r, s){
  if (s === "no") return r.no || HELP.no;
  const x = excerpt(r.c, s === "ok" && !r.plain);
  if (s === "ok") return x ? `Prouvé dans ton CV : <span class="proof">« ${esc(x)} »</span>` : "C'est dans ton CV.";
  return (r.mid || HELP.mid) + (x ? ` Trouvé ici : <span class="proof">« ${esc(x)} »</span>` : "");
}
function renderResult(){
  const c = countOf(results), p = scoreOf(results), t = results.length;
  $("#pct").textContent = p;
  $("#verdict").textContent = !t ? "à vérifier" : p >= 80 ? "ça colle !" : p >= 50 ? "ça colle presque" : "à retravailler";
  $("#sum").textContent = t
    ? `L'offre demande ${t} choses. Ton CV en prouve ${c.ok}, en cite ${c.mid} sans exemple et n'en parle pas pour ${c.no}.`
    : "Je n'ai reconnu aucun point dans cette offre.";
  $("#n-all").textContent = t; ["ok","mid","no"].forEach(s => $("#n-" + s).textContent = c[s]);

  const todo = results.filter(r => r.st !== "ok").sort((a, b) => (a.st === "no" ? 0 : 1) - (b.st === "no" ? 0 : 1)).slice(0, 3);
  $("#prio").innerHTML = !t ? `<p>Rien à corriger pour l'instant.</p>`
    : todo.length ? `<ul class="prio-list">${todo.map(r => `<li><b>${esc(r.k)}</b><small>${r.st === "no" ? "absent de ton CV" : "à prouver avec un exemple"}</small>${r.fix ? `<button class="btn small" data-fix="${esc(r.k)}">Corriger</button>` : ""}</li>`).join("")}</ul>
      <button class="btn wide" data-go="4">Améliorer mon CV →</button>`
    : `<p><b>Rien d'urgent.</b> Ton CV couvre tout ce que demande l'offre.</p>`;

  const groups = ["no", "mid", "ok"].filter(s => filter === "all" || filter === s);
  const notice = t < 4 ? `<p class="notice">Pour l'instant, Ça colle ? reconnaît surtout les offres de logistique et d'entrepôt. D'autres métiers arrivent bientôt.</p>` : "";
  $("#groups").innerHTML = notice + groups.map(s => {
    const list = results.filter(r => r.st === s); if (!list.length) return "";
    return `<section class="group"><h2 class="section-title" style="--k: ${s === "ok" ? "var(--green)" : s === "mid" ? "var(--yellow)" : "var(--pink)"}">${LABEL[s]} (${list.length})</h2><div class="points">${list.map(r => `
      <article class="point">
        <i class="stamp ${s}">${LABEL[s]}</i>
        <h3>${esc(r.k)}</h3>
        <p>${r.fixedNow ? "Ajouté à ton CV à l'étape 4." : explain(r, s)}</p>
        ${s !== "ok" && r.fix ? `<button class="btn small" data-fix="${esc(r.k)}">Corriger ce point</button>` : ""}
      </article>`).join("")}</div></section>`;
  }).join("");
}

/* ---------- Étape 4 ---------- */
function renderRewrite(){
  DICT.forEach(d => { if (d.fix && !fixes[d.k]) fixes[d.k] = {vals:{}, state: d.fix.ask ? "open" : "yes"}; });
  const list = results.filter(r => r.fix && (r.st !== "ok" || r.fixedNow));
  $("#sugs").innerHTML = list.map(r => {
    const f = fixes[r.k], line = CV.find(l => l.id === targetId(r)); let i = 0;
    const blanks = esc(r.fix.tpl).replace(/\{([^}]+)\}/g, (m, ph) => { const j = i++; return `<input class="blank" data-k="${esc(r.k)}" data-i="${j}" placeholder="${esc(ph)}" value="${esc(f.vals[j] || "")}" size="${Math.max(8, ph.length - 4)}" aria-label="${esc(ph)}">`; });
    let body;
    if (f.state === "open") body = `<div class="ask">${esc(r.fix.ask)} <button class="btn small" data-yes="${esc(r.k)}">Oui</button><button class="btn light small" data-no="${esc(r.k)}">Non</button></div>`;
    else if (f.state === "skipped") body = `<p>${esc(r.fix.nope || "Point laissé de côté.")}</p><div class="sug-a"><button class="btn light small" data-undo="${esc(r.k)}">Revenir sur ce point</button></div>`;
    else body = `${r.fix.why ? `<p>${esc(r.fix.why)}</p>` : ""}
      <span class="where">Dans ${line && line.exp ? "ton expérience : " + esc(line.t.split(/[,:(]/)[0].slice(0, 60)) : "tes compétences"}</span>
      <div class="sentence">${r.fix.find ? `<span class="old">${esc(r.fix.find)}</span> → ` : "… "}${blanks}</div>
      <div class="sug-a">${f.state === "accepted"
        ? `<i class="stamp ok">Ajouté</i><button class="btn light small" data-undo="${esc(r.k)}">Retirer</button>`
        : `<button class="btn small" data-add="${esc(r.k)}" ${filled(r.k) ? "" : "disabled"}>Ajouter à mon CV</button><small>${filled(r.k) ? "Prêt." : "Remplis les cases jaunes."}</small>`}</div>`;
    return `<article class="sug ${f.state === "accepted" ? "accepted" : f.state === "skipped" ? "skipped" : ""}">
      <div class="sug-h"><h3>${esc(r.k)}</h3><i class="stamp ${r.fixedNow ? "ok" : r.st}">${r.fixedNow ? "Ça colle" : LABEL[r.st]}</i></div>${body}</article>`;
  }).join("") || `<p class="notice">Rien à améliorer pour cette offre : ton CV couvre déjà tout ce qu'on sait repérer.</p>`;
  const p = scoreOf(results), c = countOf(results);
  $("#score4").textContent = p + " %"; $("#meter4").style.width = p + "%";
  $("#score4txt").textContent = `${c.ok} point${c.ok > 1 ? "s" : ""} sur ${results.length} prouvé${c.ok > 1 ? "s" : ""} dans ton CV.`;
  $("#cv4").innerHTML = cvLines(true).map(l => l.name ? `<div class="name">${esc(l.t)}</div>` : l.sec ? `<div class="sec">${esc(l.sec)}</div>` : `<p>${l.html}</p>`).join("");
}
const refresh = () => { results = analyse($("#offer").value); renderRewrite(); };

/* ---------- Étape 2 : lecture du CV ---------- */
let cvTimer;
function setCV(text, typed){
  CV = parseCV(text); cvReady = text.trim().length > 0;
  if (!typed) $("#cvraw").value = text;
  const n = CV.filter(l => l.t).length, exp = CV.filter(l => l.exp).length, secs = CV.filter(l => l.sec && !l.auto).length;
  $("#cvsum").textContent = `${n} lignes · ${exp} expérience${exp > 1 ? "s" : ""} repérée${exp > 1 ? "s" : ""}` + (secs ? "" : " · aucun titre de rubrique trouvé (Expériences, Compétences…)");
  $$("[data-for='2']").forEach(p => p.hidden = step !== 2 || !cvReady);
  gates();
}
function showFile(name, info){ $("#filecard").hidden = false; $("#fname").textContent = name; $("#finfo").textContent = info; }
async function useFile(f){
  if (!f) return;
  if (step !== 2 && canReach(2)) go(2);
  $("#ferr").hidden = true; $("#filecard").hidden = true; $("#job").hidden = false;
  try {
    const r = await readCV(f, (p, m) => { $("#jbar").style.width = Math.round(p * 100) + "%"; $("#jobtxt").textContent = m; });
    setCV(r.text);
    showFile(f.name, r.info + (r.conf && r.conf < 75 ? " · relis le texte lu, la photo n'était pas très nette" : ""));
    if (r.conf && r.conf < 75) $("#check").open = true;
    toast("CV lu");
  } catch (e) {
    $("#ferr").textContent = e.message || "Je n'ai pas réussi à lire ce fichier. Essaie un PDF.";
    $("#ferr").hidden = false;
  } finally { $("#job").hidden = true; $("#file").value = ""; }
}

/* ---------- Événements ---------- */
document.addEventListener("click", e => {
  const t = e.target.closest("button"); if (!t) return;
  if (t.dataset.step) return go(+t.dataset.step);
  if (t.dataset.go) return go(+t.dataset.go);
  if (t.dataset.fix) { go(4); const el = $(`.blank[data-k="${CSS.escape(t.dataset.fix)}"], [data-yes="${CSS.escape(t.dataset.fix)}"]`); if (el) setTimeout(() => { el.scrollIntoView({block: "center", behavior: "smooth"}); el.focus({preventScroll: true}); }, 50); return; }
  if (t.dataset.f) { filter = t.dataset.f; $$(".chip").forEach(c => c.setAttribute("aria-pressed", c === t)); return renderResult(); }
  if (t.dataset.yes) { fixes[t.dataset.yes].state = "yes"; renderRewrite(); $(`.blank[data-k="${CSS.escape(t.dataset.yes)}"]`)?.focus(); return; }
  if (t.dataset.no) { fixes[t.dataset.no].state = "skipped"; return renderRewrite(); }
  if (t.dataset.undo) { const d = DICT.find(x => x.k === t.dataset.undo); fixes[d.k].state = d.fix.ask ? "open" : "yes"; return refresh(); }
  if (t.dataset.add) { fixes[t.dataset.add].state = "accepted"; refresh(); return toast("Ajouté à ton CV"); }
  if (t.id === "demo") {
    $("#offer").value = OFFER; setCV(SAMPLE_CV); showFile("Exemple : CV de Camille Martin", "CV fictif pour essayer");
    return go(3);
  }
  if (t.id === "copy") {
    const txt = cvLines(false).map(l => l.name ? l.t : l.sec ? "\n" + l.sec.toUpperCase() : l.raw).join("\n");
    try { navigator.clipboard.writeText(txt).then(() => toast("Texte copié"), () => toast("Copie impossible : sélectionne le texte")); }
    catch { toast("Copie impossible : sélectionne le texte"); }
  }
});
document.addEventListener("input", e => {
  if (e.target.id === "offer") return gates();
  if (e.target.id === "cvraw") { clearTimeout(cvTimer); cvTimer = setTimeout(() => setCV(e.target.value, true), 300); return; }
  if (e.target.classList.contains("blank")) {
    const k = e.target.dataset.k; fixes[k].vals[e.target.dataset.i] = e.target.value;
    const card = e.target.closest(".sug"), btn = card.querySelector("[data-add]"), sm = card.querySelector(".sug-a small");
    if (btn) { btn.disabled = !filled(k); sm.textContent = filled(k) ? "Prêt." : "Remplis les cases jaunes."; }
  }
});
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.classList.contains("blank")) { const b = e.target.closest(".sug").querySelector("[data-add]"); if (b && !b.disabled) b.click(); }
});
$("#file").addEventListener("change", e => useFile(e.target.files[0]));
const drop = $("#drop");
["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("over"); }));
["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("over"); }));
drop.addEventListener("drop", e => { e.stopPropagation(); useFile(e.dataTransfer.files[0]); });
window.addEventListener("dragover", e => e.preventDefault());
window.addEventListener("drop", e => { e.preventDefault(); if (canReach(2)) useFile(e.dataTransfer.files[0]); });

go(1);
