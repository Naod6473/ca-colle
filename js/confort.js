// Mode confort : gros texte, contraste fort, moins d'animations, mots simples (phrases courtes, un picto par idée, score sur 10), mode sombre (suit le téléphone tant qu'on n'a pas choisi), et lecture à voix haute du résultat.
// Ce réglage d'affichage reste sur l'appareil (aucune donnée personnelle dedans).
const COMFORT_KEY = "cacolle-confort", COMFORTS = ["big", "contrast", "calm", "simple"];
let comfort = {};
try { comfort = JSON.parse(localStorage.getItem(COMFORT_KEY)) || {}; } catch {}
const darkMQ = matchMedia("(prefers-color-scheme: dark)"), isDark = () => comfort.dark ?? darkMQ.matches;
const applyComfort = () => { COMFORTS.forEach(k => document.documentElement.classList.toggle("c-" + k, !!comfort[k])); document.documentElement.classList.toggle("c-dark", isDark()); document.querySelector('meta[name="theme-color"]')?.setAttribute("content", getComputedStyle(document.documentElement).getPropertyValue("--paper").trim() || "#fdf3e3"); if (comfort.skin === "fiche") document.documentElement.dataset.skin = "fiche"; else delete document.documentElement.dataset.skin; };
applyComfort();

function initComfort(){
  const menu = document.getElementById("comfortmenu");
  if (!menu) return;
  const pressed = () => menu.querySelectorAll("[data-comfort]").forEach(b => b.setAttribute("aria-pressed", b.dataset.comfort === "dark" ? isDark() : !!comfort[b.dataset.comfort]));
  pressed();
  darkMQ.addEventListener?.("change", () => { if (comfort.dark === undefined) { applyComfort(); pressed(); } });
  const skinBtns = () => menu.querySelectorAll("button[data-skin]").forEach(b => b.setAttribute("aria-pressed", b.dataset.skin === (comfort.skin || "tampon")));
  skinBtns();
  menu.addEventListener("click", e => {
    const s = e.target.closest("button[data-skin]");
    if (s) { comfort.skin = s.dataset.skin; applyComfort(); skinBtns(); stat("skin", {s: s.dataset.skin}); try { localStorage.setItem(COMFORT_KEY, JSON.stringify(comfort)); } catch {} return; }
    const b = e.target.closest("[data-comfort]"); if (!b) return;
    const k = b.dataset.comfort; comfort[k] = k === "dark" ? !isDark() : !comfort[k];
    applyComfort(); pressed(); if (comfort[k]) stat("confort", {k});
    if (k === "simple") document.dispatchEvent(new Event("cacolle-simple")); // « Mots simples » : l'app réécrit ce qu'elle a affiché
    try { localStorage.setItem(COMFORT_KEY, JSON.stringify(comfort)); } catch {}
  });
  // Langue choisie à la main : plus de redirection automatique selon le navigateur
  document.addEventListener("click", e => { const a = e.target.closest(".lang-menu a[hreflang]"); if (a) try { localStorage.setItem("cacolle-lang", a.hreflang); } catch {} });
  document.addEventListener("click", e => { [menu, document.getElementById("langmenu"), document.getElementById("iomenu")].forEach(m => { if (m?.open && (!m.contains(e.target) || e.target.closest(".io-item > b, button.io-item"))) m.open = false; }); });
  // Échap ferme les menus Aa, langue et Import / Export, et rend le focus à leur bouton
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    const m = [menu, document.getElementById("langmenu"), document.getElementById("iomenu")].find(m => m?.open);
    if (!m) return;
    m.open = false; m.querySelector("summary")?.focus(); e.preventDefault();
  });

  // Écouter le résultat : synthèse vocale du navigateur, rien n'est envoyé par l'app
  const say = document.getElementById("listen");
  if (!say) return;
  if (!("speechSynthesis" in window)) { say.hidden = true; return; }
  say.addEventListener("click", () => {
    if (speechSynthesis.speaking) { speechSynthesis.cancel(); say.setAttribute("aria-pressed", "false"); return; }
    const top = [...document.querySelectorAll("#prio .prio-list b")].map(b => b.textContent);
    const text = [
      document.querySelector(document.documentElement.classList.contains("c-simple") ? "#pct10" : "[data-p='3'] .big .full-only")?.textContent.replace(/\s+/g, " ").trim(),
      spoken(document.getElementById("sum")),
      top.length ? tr("À faire en premier : ", "First things to do: ") + top.join(", ") + "." : "",
      document.querySelector(".adcheck .alert b")?.textContent || ""
    ].filter(Boolean).join(" ");
    const u = new SpeechSynthesisUtterance(text);
    u.lang = tr("fr-FR", "en-GB"); u.rate = .95;
    u.onend = u.onerror = () => say.setAttribute("aria-pressed", "false");
    say.setAttribute("aria-pressed", "true"); stat("ecouter");
    speechSynthesis.speak(u);
  });
}
initComfort();
// Texte lu à voix haute : sans les pictos (aria-hidden)
function spoken(el){ if (!el) return ""; const c = el.cloneNode(true); c.querySelectorAll("[aria-hidden='true']").forEach(x => x.remove()); return c.textContent.replace(/\s+/g, " ").trim(); }
// « Mots simples » à l'étape 3 : une idée par ligne, un picto par idée (appelé par renderResult, js/app.js)
function simpleSum(c, t, must){
  const li = (pic, txt) => `<span class="sl"><span class="pic" aria-hidden="true">${pic}</span> ${esc(txt)}</span>`;
  return [
    li("✅", tr(`Ton CV montre ${plural(c.ok, "chose")} sur ${t}.`, `Your CV shows ${plural(c.ok, "thing")} out of ${t}.`)),
    c.mid ? li("✍️", tr(`${plural(c.mid, "chose")} à mieux expliquer.`, `${plural(c.mid, "thing")} to explain better.`)) : "",
    c.no ? li("❌", tr(`Il manque ${plural(c.no, "chose")}.`, `${plural(c.no, "thing")} missing.`)) : "",
    must ? li("⚠️", must > 1 ? tr(`Dont ${must} choses très importantes.`, `${must} of them are very important.`) : tr("Dont 1 chose très importante.", "1 of them is very important.")) : "",
    c.no || c.mid ? li("👉", tr("On les ajoute ensemble.", "Let's add them together.")) : li("🎉", tr("Ton CV est prêt pour cette offre.", "Your CV is ready for this offer."))
  ].join("");
}

// Onglets des étapes : même état que dans l'app (hachurés tant que l'offre et le CV ne sont pas remplis), lu dans la session gardée
(() => {
  let d = null; try { d = JSON.parse(localStorage.getItem(LANG === "fr" ? "cacolle-v1" : `cacolle-${LANG}-v1`)); } catch {}
  const L = Array.isArray(d?.offers) ? d.offers : [], o = L.find(x => x?.id === d.cur) || L.at(-1), txt = typeof o?.text === "string" ? o.text : ""; // session abîmée : onglets fermés
  const ok1 = txt.trim().split(/\s+/).filter(Boolean).length >= 25 && !/^\s*https?:\/\/\S+\s*$/.test(txt), ok2 = typeof d?.cv?.text === "string" && !!d.cv.text.trim();
  document.querySelectorAll('a.tab[href*="#etape-"]').forEach(a => {
    const n = +a.href.slice(-1), can = n === 1 || (n === 2 && ok1) || (n >= 3 && ok1 && ok2);
    a.classList.toggle("done", (n === 1 && ok1) || (n === 2 && ok2));
    if (can) return;
    a.setAttribute("aria-disabled", "true"); a.removeAttribute("href");
    a.title = n === 2 ? tr("Colle d'abord l'offre", "Paste the offer first") : tr("Ajoute d'abord l'offre et ton CV", "Add the offer and your CV first");
  });
})();
