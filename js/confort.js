// Mode confort : gros texte, contraste fort, moins d'animations, et lecture à voix haute du résultat.
// Ce réglage d'affichage reste sur l'appareil (aucune donnée personnelle dedans).
const COMFORT_KEY = "cacolle-confort", COMFORTS = ["big", "contrast", "calm"];
let comfort = {};
try { comfort = JSON.parse(localStorage.getItem(COMFORT_KEY)) || {}; } catch {}
const applyComfort = () => COMFORTS.forEach(k => document.documentElement.classList.toggle("c-" + k, !!comfort[k]));
applyComfort();

function initComfort(){
  const menu = document.getElementById("comfortmenu");
  if (!menu) return;
  menu.querySelectorAll("[data-comfort]").forEach(b => b.setAttribute("aria-pressed", !!comfort[b.dataset.comfort]));
  menu.addEventListener("click", e => {
    const b = e.target.closest("[data-comfort]"); if (!b) return;
    const k = b.dataset.comfort; comfort[k] = !comfort[k];
    b.setAttribute("aria-pressed", comfort[k]); applyComfort();
    try { localStorage.setItem(COMFORT_KEY, JSON.stringify(comfort)); } catch {}
  });
  document.addEventListener("click", e => { if (menu.open && !menu.contains(e.target)) menu.open = false; });

  // Écouter le résultat : synthèse vocale du navigateur, rien n'est envoyé par l'app
  const say = document.getElementById("listen");
  if (!say) return;
  if (!("speechSynthesis" in window)) { say.hidden = true; return; }
  say.addEventListener("click", () => {
    if (speechSynthesis.speaking) { speechSynthesis.cancel(); say.setAttribute("aria-pressed", "false"); return; }
    const top = [...document.querySelectorAll("#prio .prio-list b")].map(b => b.textContent);
    const text = [
      document.querySelector("[data-p='3'] .big")?.textContent.replace(/\s+/g, " ").trim(),
      document.getElementById("sum")?.textContent,
      top.length ? tr("À faire en premier : ", "First things to do: ") + top.join(", ") + "." : "",
      document.querySelector(".adcheck .alert b")?.textContent || ""
    ].filter(Boolean).join(" ");
    const u = new SpeechSynthesisUtterance(text);
    u.lang = tr("fr-FR", "en-GB"); u.rate = .95;
    u.onend = u.onerror = () => say.setAttribute("aria-pressed", "false");
    say.setAttribute("aria-pressed", "true");
    speechSynthesis.speak(u);
  });
}
initComfort();
