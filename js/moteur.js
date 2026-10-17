// Moteur de Ça colle ? : exemples, découpage du CV, points repérés dans l'offre, réécritures à trous.
// Aucune interface ici : js/app.js s'en charge.

const OFFER = `Employé(e) logistique polyvalent(e) – CDI – Caen (exemple fictif)

Au sein de notre entrepôt, vous préparez les commandes et participez à la réception des marchandises.

Vos missions :
- Préparation de commandes et contrôle qualité
- Réception et rangement des livraisons
- Gestion des stocks et inventaires
- Conduite de chariot élévateur (CACES 1 et 3)
- Saisie informatique sur Excel

Profil recherché :
- Permis B indispensable
- Travail en équipe, ponctualité, rigueur
- Anglais de base apprécié
- Horaires en 2x8`;

/* CV fictif de démonstration, remplacé par le texte lu dans le vrai CV */
const SAMPLE_CV = `Camille Martin · Caen · 06 00 00 00 00
Expériences
Préparatrice de commandes, Drive Super U (2022-2025) : 120 commandes par jour, contrôle qualité des produits frais, travail en équipe de 6.
Vendeuse, boulangerie du centre (2020-2022) : ouverture à 6h, caisse, rangement des livraisons chaque matin.
Compétences
Excel, gestion des stocks, rigueur, ponctualité
Divers
Permis B, véhicule personnel`;

/* Découpage du CV : titres de rubrique reconnus, le reste devient des lignes rattachées à la rubrique */
const SECS = [
  ["exp", /^(exp[ée]riences?( professionnelles?)?|parcours( professionnel)?|emplois?|postes? occup[ée]s|work experience|experience)$/i],
  ["skills", /^(comp[ée]tences( cl[ée]s| techniques)?|savoir[- ]faire|savoir[- ][êe]tre|qualit[ée]s|outils|informatique|langues|skills|atouts)$/i],
  ["edu", /^(formations?|dipl[ôo]mes?|[ée]tudes|scolarit[ée]|education|formation et dipl[ôo]mes)$/i],
  ["misc", /^(divers|loisirs|centres? d'int[ée]r[êe]ts?|informations?( compl[ée]mentaires)?|autres|int[ée]r[êe]ts|hobbies)$/i]
];
function parseCV(text){
  const out = []; let kind = null, n = 0, named = false;
  text.split("\n").map(l => l.replace(/^[\s•●▪◦‣\-–—*·«»"'.,]+/, "").trim()).filter(Boolean).forEach(l => {
    // Ligne coupée par la mise en page (PDF, photo) : elle commence en minuscule, on la recolle à la précédente
    const prev = out[out.length - 1];
    if (/^[a-zà-ÿ(]/.test(l) && prev && prev.t && !prev.name) { prev.t += " " + l; return; }
    const bare = l.replace(/[\s:]+$/, "");
    const h = bare.split(/\s+/).length <= 4 && SECS.find(([, re]) => re.test(bare));
    if (h) { kind = h[0]; out.push({id:"s" + n++, sec:bare, kind}); return; }
    if (!named && !kind) { named = true; out.push({id:"nom", t:l, name:true}); return; }
    out.push({id:"l" + n++, t:l, exp: kind === "exp", kind: kind || "misc"});
  });
  // Pas de rubrique Expériences repérée : une ligne avec une année compte comme expérience
  if (!out.some(l => l.exp)) out.forEach(l => { if (l.t && !l.name && l.kind !== "edu" && /\b(19|20)\d\d\b/.test(l.t)) l.exp = true; });
  if (!out.some(l => l.kind === "skills" && l.t)) out.push({id:"sAuto", sec:"Compétences", kind:"skills", auto:true}, {id:"kAuto", t:"", kind:"skills", auto:true});
  return out;
}
let CV = parseCV(SAMPLE_CV);

/* Points de l'offre. fix = réécriture proposée : ligne visée, texte avec {trous}, question si c'est absent du CV */
const DICT = [
  {k:"Préparation de commandes", o:/pr[ée]paration de commandes?/i, c:/pr[ée]par\w* de commandes?/i, ok:"Tu donnes un chiffre (<em>120 par jour</em>), c'est parfait."},
  {k:"Contrôle qualité", o:/contr[ôo]le qualit[ée]/i, c:/contr[ôo]le qualit[ée]/i, ok:"Ton exemple des <em>produits frais</em> parle tout seul."},
  {k:"Réception des livraisons", o:/r[ée]ception/i, c:/livraisons?|r[ée]ception/i, ok:"Tu en parles pour la boulangerie."},
  {k:"Gestion des stocks", o:/gestion des stocks?/i, c:/gestion des stocks?|suivi des stocks/i,
    mid:"Le mot est dans ta liste, mais aucune expérience ne le montre.",
    fix:{line:"exp", why:"Montre où tu as géré du stock.", tpl:" Suivi des stocks de {quoi ? ex : farine et emballages} et commande {à quelle fréquence ? ex : chaque semaine}."}},
  {k:"Inventaires", o:/inventaires?/i, c:/inventaires?/i,
    no:"L'annonce le demande, ton CV n'en parle pas.",
    fix:{line:"exp", ask:"As-tu déjà participé à un inventaire ?", tpl:" Participation à l'inventaire annuel ({combien ? ex : 3 000} références).", nope:"Pas grave. Dis en entretien que tu sais compter et vérifier, avec l'exemple du contrôle qualité."}},
  {k:"CACES (chariot élévateur)", o:/caces|chariot/i, c:/caces|chariot|transpalette/i,
    no:"Souvent demandé en entrepôt.",
    fix:{line:"skills", ask:"As-tu le CACES ?", tpl:", CACES R489 catégories {lesquelles ? ex : 1 et 3} ({année})", nope:"Beaucoup d'entreprises le financent. Tu peux écrire dans ta lettre que tu es prête à le passer."}},
  {k:"Excel", o:/excel/i, c:/excel/i,
    mid:"Cité dans ta liste, sans dire à quoi il te sert.",
    fix:{line:"skills", find:"Excel", tpl:"Excel ({pour quoi faire ? ex : tableau de suivi des commandes})"}},
  {k:"Permis B", o:/permis b/i, c:/permis b/i, plain:true, ok:"Bien visible, et le véhicule est un plus."},
  {k:"Travail en équipe", o:/travail en [ée]quipe/i, c:/travail en [ée]quipe|[ée]quipe de/i, ok:"Tu donnes la taille de l'équipe."},
  {k:"Ponctualité", o:/ponctualit[ée]/i, c:/ponctualit[ée]|ouverture [àa] \d|6h/i, ok:"L'ouverture à 6h le prouve mieux qu'un mot."},
  {k:"Rigueur", o:/rigueur/i, c:/rigueur/i,
    mid:"Juste un mot dans ta liste. Il faut un exemple.",
    fix:{line:"exp", why:"Un fait concret prouve ta rigueur.", tpl:" {un exemple ? ex : aucune erreur de commande signalée en 2024}."}},
  {k:"Anglais", o:/anglais/i, c:/anglais|english/i,
    no:"« Apprécié » : pas bloquant, mais ça peut départager.",
    fix:{line:"skills", ask:"Tu parles un peu anglais ?", tpl:", anglais {ton niveau ? ex : scolaire}", nope:"Aucun souci, l'annonce dit seulement « apprécié »."}},
  {k:"Horaires en 2x8", o:/2x8|horaires d[ée]cal[ée]s/i, c:/2x8|ouverture [àa] \d|6h|horaires d[ée]cal[ée]s/i, ok:"Tes horaires à 6h montrent que tu sais te lever tôt."}
];

const esc = t => String(t).replace(/[&<>"]/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const LABEL = {ok:"Ça colle", mid:"À préciser", no:"Pas dans ton CV"};
const fixes = {}; // k -> {vals:{}, state:"open"|"yes"|"accepted"|"skipped"}

const blanksOf = tpl => [...tpl.matchAll(/\{([^}]+)\}/g)].map(m => m[1]);
const filled = (k) => { const f = fixes[k], d = DICT.find(x => x.k === k); return blanksOf(d.fix.tpl).every((b,i) => (f.vals[i]||"").trim()); };
const fillTpl = (d, f) => { let i = 0; return d.fix.tpl.replace(/\{[^}]+\}/g, () => f.vals[i++] || ""); };

/* Ligne du CV où va une réécriture : celle qui contient le mot à remplacer, sinon la première expérience ou la ligne de compétences */
function targetId(d){
  const body = CV.filter(l => l.t !== undefined && !l.name && !l.sec);
  if (d.fix.find) { const l = body.find(l => l.t.toLowerCase().includes(d.fix.find.toLowerCase())); if (l) return l.id; }
  const skills = body.find(l => l.kind === "skills" && l.t) || CV.find(l => l.id === "kAuto");
  if (d.fix.line === "exp") return (body.find(l => l.exp) || skills).id;
  return skills.id;
}
const put = (s, a) => !s ? a.replace(/^[,.\s]+/, "").replace(/^./, c => c.toUpperCase()) : s.endsWith(".") && a.startsWith(",") ? s.slice(0, -1) + a + "." : s + a;

function cvLines(withIns){
  const lines = CV.map(l => {
    if (l.sec || l.name) return {...l};
    let t = esc(l.t), raw = l.t;
    DICT.filter(d => d.fix && fixes[d.k]?.state === "accepted" && targetId(d) === l.id).forEach(d => {
      const add = fillTpl(d, fixes[d.k]), wrap = x => withIns ? `<ins>${esc(x)}</ins>` : esc(x);
      const i = d.fix.find ? raw.toLowerCase().indexOf(d.fix.find.toLowerCase()) : -1;
      if (i >= 0) { const word = raw.substr(i, d.fix.find.length); t = t.replace(esc(word), wrap(add)); raw = raw.replace(word, add); }
      else {
        const a2 = d.fix.find ? ", " + add : add, before = raw.endsWith(".") && a2.startsWith(",");
        t = !raw ? wrap(put("", a2)) : before ? t.slice(0, -1) + wrap(a2) + "." : t + wrap(a2);
        raw = put(raw, a2);
      }
    });
    return {...l, html:t, raw};
  });
  const autoEmpty = !lines.find(l => l.id === "kAuto")?.raw;
  return lines.filter(l => !(l.auto && autoEmpty));
}

/* Compare l'offre au CV : chaque point reconnu dans l'offre reçoit ok (prouvé par une expérience), mid (cité sans preuve) ou no (absent) */
function analyse(offer){
  const lines = cvLines(false);
  const exp = lines.filter(l => l.exp).map(l => l.raw).join("\n"), other = lines.filter(l => l.raw && !l.exp).map(l => l.raw).join("\n");
  return DICT.filter(d => d.o.test(offer)).map(d => {
    const fixedNow = fixes[d.k]?.state === "accepted";
    let st = "no";
    if (fixedNow || d.c.test(exp)) st = "ok";
    else if (d.c.test(other)) st = d.plain ? "ok" : "mid";
    return {...d, st, fixedNow};
  });
}
const countOf = rs => ({ok:rs.filter(r => r.st === "ok").length, mid:rs.filter(r => r.st === "mid").length, no:rs.filter(r => r.st === "no").length});
const scoreOf = rs => { const c = countOf(rs); return rs.length ? Math.round((c.ok + c.mid * .5) / rs.length * 100) : 0; };
