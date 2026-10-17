// Moteur de Ça colle ? : exemples, découpage du CV, points repérés dans l'offre (tous métiers),
// mots différents entre CV et offre, test « robot recruteur », réécritures à trous.
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
- 2 ans d'expérience en entrepôt
- Permis B indispensable
- Travail en équipe, ponctualité, rigueur
- Anglais de base apprécié
- Horaires en 2x8`;

/* CV fictif de démonstration, remplacé par le texte lu dans le vrai CV */
const SAMPLE_CV = `Camille Martin · Caen · camille.martin@exemple.fr · 06 00 00 00 00
Expériences
Préparatrice de commandes, Drive Super U (2022-2025) : 120 commandes par jour, contrôle qualité des produits frais, travail en équipe de 6.
Vendeuse, boulangerie du centre (2020-2022) : ouverture à 6h, caisse, rangement des livraisons chaque matin.
Formation
CAP Employé de commerce (2020)
Compétences
Tableur, gestion des stocks, rigueur, ponctualité
Divers
Permis B, véhicule personnel`;

const esc = t => String(t).replace(/[&<>"]/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const LABEL = {ok:"Ça colle", mid:"À préciser", no:"Pas dans ton CV"};
// Texte sans accents ni majuscules, de même longueur que l'original (les positions restent valables)
const fold = s => [...String(s)].map(ch => { const d = ch.normalize("NFD"); return d.length > 1 && /^[̀-ͯ]+$/.test(d.slice(1)) ? d[0] : ch; }).join("").toLowerCase();
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- Découpage du CV ---------- */
const SECS = [
  ["exp", /^(experiences?( professionnelles?)?|parcours( professionnel)?|emplois?|postes? occupes|work experience|experience)$/],
  ["skills", /^(competences( cles| techniques)?|savoir[- ]faire|savoir[- ]etre|qualites|outils|informatique|langues|skills|atouts)$/],
  ["edu", /^(formations?|diplomes?|etudes|scolarite|education|formation et diplomes|diplomes et formations)$/],
  ["misc", /^(divers|loisirs|centres? d'interets?|informations?( complementaires)?|autres|interets|hobbies)$/]
];
function parseCV(text){
  const out = []; let kind = null, n = 0, named = false;
  text.split("\n").map(l => l.replace(/^[\s•●▪◦‣\-–—*·«»"'.,]+/, "").trim()).filter(Boolean).forEach(l => {
    // Ligne coupée par la mise en page (PDF, photo) : elle commence en minuscule, on la recolle à la précédente
    const prev = out[out.length - 1];
    if (/^[a-zà-ÿ(]/.test(l) && prev && prev.t && !prev.name) { prev.t += " " + l; return; }
    const bare = l.replace(/[\s:]+$/, "");
    const h = bare.split(/\s+/).length <= 4 && SECS.find(([, re]) => re.test(fold(bare)));
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

/* ---------- Lexique des métiers ----------
   [nom, motif (texte sans accents), type, exemple pour les trous, motif côté CV si plus large]
   Types : t = tâche, s = qualité, o = outil ou logiciel, l = permis, diplôme ou habilitation, g = langue, h = horaires */
const LEX = [
  // Logistique, entrepôt
  ["Préparation de commandes", "prepar\\w* (de |des )?commandes?|picking", "t", "120 commandes par jour"],
  ["Contrôle qualité", "controle (de la )?qualite|controle des produits|controle qualite", "t", "vérification des dates et des quantités"],
  ["Réception des marchandises", "reception (des |de la )?(marchandises?|livraisons?|colis|palettes)|receptionner|\\breception et\\b", "t", "30 palettes par jour", "reception|receptionn|livraisons?"],
  ["Gestion des stocks", "gestion (des |du )?stocks?|suivi (des |du )?stocks?|reapprovisionn", "t", "commande chaque semaine"],
  ["Inventaires", "inventaires?", "t", "inventaire annuel de 3 000 références"],
  ["CACES (chariot élévateur)", "caces|chariots? elevateurs?|cariste|transpalette|gerbeur", "l", "R489 catégories 1 et 3, 2023"],
  ["Expédition et emballage", "expeditions?|emballage|conditionnement|colisage", "t", "200 colis par jour"],
  ["Manutention", "manutention|port de charges|charges lourdes", "t", "chargement des camions"],
  // Vente, commerce
  ["Encaissement", "encaiss\\w*|tenue de (la )?caisse|caissier|caissiere|hote(sse)? de caisse|\\bcaisse\\b", "t", "jusqu'à 300 clients par jour"],
  ["Accueil des clients", "accueil (des |de la )?(clients?|clientele|public|patients|visiteurs)|accueillir (les |la )?(clients?|clientele|public)|accueil physique", "t", "accueil de 80 clients par jour", "accueil|accueill"],
  ["Conseil client", "conseil(ler)? (les |la )?(clients?|clientele)|conseil clientele|vendeu(r|se) conseil|conseill(er|ere) de vente", "t", "conseil sur les produits frais", "conseil"],
  ["Vente", "\\bvente\\b|\\bvendre\\b|vendeu(r|se)|objectifs (de vente|commerciaux)|chiffre d'affaires", "t", "objectif mensuel atteint 10 mois sur 12", "vente|vendu|vendeu|vendre"],
  ["Mise en rayon", "mise en rayon|mettre en rayon|reassort|facing|balisage|merchandising", "t", "rayon frais chaque matin"],
  ["Relation client", "relation client|service client|satisfaction client|fidelis\\w*|reclamations?|litiges?|retours? clients?", "t", "traitement des réclamations"],
  ["Prospection", "prospection|prospecter|demarchage|nouveaux clients", "t", "20 nouveaux clients en un an"],
  ["Négociation", "negoci\\w*", "t", "négociation avec 15 fournisseurs"],
  // Aide à la personne, santé, enfance
  ["Accompagnement des personnes âgées", "personnes? agees|seniors?|ehpad|personnes? dependantes|perte d'autonomie", "t", "6 personnes suivies chaque semaine"],
  ["Aide à domicile", "aide a domicile|auxiliaire de vie|aide menager\\w*|\\badvf\\b|\\bdeavs\\b|\\baes\\b", "t", "interventions chez 6 personnes"],
  ["Aide à la toilette", "aide a la toilette|toilette|soins d'hygiene|aide au lever|aide au coucher", "t", "aide au lever et à la toilette"],
  ["Préparation des repas", "preparation des repas|aide (aux|au) repas|confection des repas", "t", "repas pour 4 personnes"],
  ["Garde d'enfants", "garde d'enfants|petite enfance|creche|periscolaire|assistante? maternelle|cap aepe|animat(eur|rice)", "t", "garde de 3 enfants de 2 à 8 ans"],
  ["Diplôme d'aide-soignant", "aide[- ]soignant\\w*|\\bdeas\\b", "l", "obtenu en 2021"],
  ["Soins infirmiers", "infirmi(er|ere)s?|\\bide\\b", "l", "diplôme d'État 2019"],
  // Restauration, hôtellerie, propreté
  ["Service en salle", "service en salle|serveu(r|se)|prise de commandes?|service au plateau|chef de rang|runner", "t", "service de 60 couverts"],
  ["Cuisine", "cuisine|cuisinier|cuisiniere|\\bcommis\\b|mise en place|preparation culinaire", "t", "mise en place pour 80 couverts"],
  ["Règles d'hygiène (HACCP)", "haccp|hygiene alimentaire|normes d'hygiene|regles d'hygiene", "l", "formation HACCP 2022"],
  ["Plonge", "\\bplonge\\b|plongeu(r|se)|vaisselle", "t", "plonge pour 100 couverts"],
  ["Bar", "\\bbar\\b|barman|barmaid|barista|cocktails?", "t", "préparation des boissons chaudes"],
  ["Réception hôtelière", "reception hoteliere|receptionniste|check[- ]?in|reservations?", "t", "accueil et réservations, 40 chambres"],
  ["Entretien et nettoyage", "menage|nettoyage|entretien des locaux|agent d'entretien|proprete|bionettoyage", "t", "entretien de 800 m² de bureaux"],
  // BTP, industrie, technique
  ["Lecture de plans", "lecture de plans?|lire (un |des |les )?plans?|plans techniques", "o", "plans d'exécution sur chantier"],
  ["Habilitation électrique", "habilitations? electriques?|\\bb0\\b|\\bh0v?\\b|\\bbr\\b|\\bb1v?\\b|\\bb2v?\\b", "l", "B1V, 2024"],
  ["Électricité", "electricit\\w*|electricien|cablage|tableaux? electriques?", "t", "câblage de tableaux électriques"],
  ["Plomberie et chauffage", "plomb\\w*|sanitaires?|chauffagiste|chauffage", "t", "installation de salles de bain"],
  ["Maçonnerie", "maconn\\w*|coffrage|beton|gros oeuvre", "t", "coffrage et coulage de dalles"],
  ["Peinture", "peintre|peinture|enduits?", "t", "rénovation de 10 appartements"],
  ["Travail en hauteur", "travail en hauteur|nacelles?|echafaudages?|harnais", "l", "CACES nacelle R486, 2023"],
  ["Règles de sécurité", "regles de securite|consignes de securite|\\bepi\\b|securite au travail|prevention des risques", "s", "zéro accident en 3 ans"],
  ["Conduite de machines", "conduite de (machines?|lignes?|production)|operat(eur|rice) de production|regleu(r|se)|commande numerique", "t", "conduite d'une ligne de conditionnement"],
  ["Soudure", "soudu\\w*|soudeu(r|se)|souder", "t", "soudure MIG et TIG"],
  ["Maintenance", "\\bmaintenance|\\bdepannage|\\breparation", "t", "maintenance préventive de 20 machines"],
  ["Mécanique", "mecani\\w*", "t", "entretien de véhicules légers"],
  // Bureau, administratif
  ["Accueil téléphonique", "accueil telephonique|standard telephonique|standardiste|appels? telephoniques?|au telephone", "t", "50 appels par jour", "telephon|standard|appels?"],
  ["Pack Office", "pack office|microsoft office|suite office|office 365|microsoft 365|\\bword\\b|powerpoint|outlook", "o", "courriers sur Word, mails sur Outlook"],
  ["Excel", "excel|tableur", "o", "tableau de suivi des commandes"],
  ["Outils informatiques", "outils? informatiques?|bureautique|maitrise de l'informatique", "o", "Word, mails, tableaux simples", "informatique|bureautique|\\bword\\b|excel|tableur|office|ordinateur|logiciels?"],
  ["Saisie de données", "saisie|encodage", "t", "saisie des bons de livraison"],
  ["Gestion d'agenda", "gestion (de l'|d'|des |du )?(agendas?|plannings?)|prise de rendez-vous|rendez-vous", "t", "agenda de 3 médecins"],
  ["Rédaction de courriers", "courriers?|redaction|redig\\w*|comptes? rendus?", "t", "courriers aux clients"],
  ["Facturation", "factur\\w*|devis|relances?", "t", "100 factures par mois"],
  ["Comptabilité", "comptab\\w*|rapprochement bancaire|ecritures comptables", "t", "saisie des écritures"],
  ["Paie", "\\bpaie\\b|bulletins? de salaire", "t", "paie de 40 salariés"],
  ["Classement et archivage", "classement|archiv\\w*|gestion documentaire", "t", "archivage des dossiers"],
  ["Logiciel de gestion (ERP)", "\\bsap\\b|\\berp\\b|\\bsage\\b|cegid|\\bebp\\b", "o", "SAP, commandes et stocks"],
  ["Recrutement", "recrutement|recruter|ressources humaines|\\brh\\b", "t", "20 recrutements par an"],
  // Informatique
  ["Support utilisateurs", "support (aux |des )?utilisateurs|assistance (aux |des )?utilisateurs|helpdesk|hotline|\\bn1\\b|\\bn2\\b|niveau [12]", "t", "30 tickets par jour"],
  ["Windows", "windows", "o", "installation de postes Windows 11"],
  ["Linux", "linux|debian|ubuntu", "o", "serveurs Debian"],
  ["Réseaux informatiques", "reseaux? informatiques?|\\btcp\\b|vlan|switch\\w*|routeurs?|\\bwi-?fi\\b|administration reseau", "o", "VLAN et switchs d'un site de 50 postes"],
  ["Active Directory", "active directory|\\bgpo\\b|azure ad|entra id", "o", "comptes et droits de 300 utilisateurs"],
  ["Cybersécurité", "cyber\\w*|securite informatique|pare-feu|firewall|antivirus|\\bedr\\b|\\brgpd\\b", "o", "mise en place d'un pare-feu"],
  ["Python", "python", "o", "scripts d'automatisation"],
  ["JavaScript", "javascript|typescript|\\breact\\b|node\\.?js", "o", "site web en React"],
  ["HTML / CSS", "\\bhtml\\d?\\b|\\bcss\\d?\\b", "o", "pages web responsive"],
  ["SQL", "\\bsql\\b|mysql|postgre\\w*|bases? de donnees", "o", "requêtes sur une base clients"],
  ["Cloud", "\\bcloud\\b|\\bazure\\b|\\baws\\b", "o", "migration vers Microsoft 365"],
  ["Gestion de projet", "gestion de projets?|chef de projets?|pilotage de projets?|conduite de projets?", "t", "projet de 6 mois, 3 personnes"],
  ["Management d'équipe", "management|manag(er|eur)|encadr\\w*|chef d'equipe|responsable d'equipe|animer (une |l')equipe", "t", "équipe de 5 personnes"],
  // Qualités et conditions, tous métiers
  ["Permis B", "permis b\\b|permis de conduire|permis vl", "l", "depuis 2018", "permis b\\b|permis de conduire|permis vl|vehicule"],
  ["Travail en équipe", "travail(ler)? en equipe|esprit d'equipe|sens du travail en equipe", "s", "équipe de 6 personnes", "en equipe|equipe de|esprit d'equipe"],
  ["Autonomie", "autonom\\w*", "s", "seule à l'ouverture du magasin"],
  ["Rigueur", "rigueur|rigoureu(x|se)|minutie|minutieu(x|se)|precision", "s", "aucune erreur de commande en 2024"],
  ["Ponctualité", "ponctu\\w*|assiduite|assidu\\w*", "s", "ouverture à 6h pendant 2 ans", "ponctu|assidu|ouverture|[4-7] ?h\\b"],
  ["Sens de l'organisation", "sens de l'organisation|organise(e)?\\b|bonne organisation|methodique|capacite d'organisation", "s", "planning de 4 personnes"],
  ["Sens du contact", "sens du contact|relationnel\\w*|aisance relationnelle|sociable|souriant\\w*|sourire|bonne presentation", "s", "accueil de 80 clients par jour"],
  ["Polyvalence", "polyvalen\\w*", "s", "caisse, rayon et réception selon les jours"],
  ["Dynamisme", "dynamisme", "s", "rush du samedi"],
  ["Gestion du stress", "stress|sous pression|sang-froid|coup de feu|forte affluence", "s", "service du samedi soir"],
  ["Écoute", "ecoute|empathi\\w*|bienveillan\\w*", "s", "accompagnement de personnes âgées"],
  ["Discrétion", "discretion|discret(e)?\\b|confidentialite", "s", "dossiers médicaux"],
  ["Adaptabilité", "adaptabilite|capacite d'adaptation|s'adapter|flexibilite|flexible", "s", "changements de poste chaque semaine"],
  ["Communication", "qualites? de communication|bonne communication|aisance (a l'oral|orale)|expression ecrite|orthographe", "s", "compte rendu chaque semaine"],
  ["Anglais", "anglais|english|toeic|toefl", "g", "scolaire"],
  ["Espagnol", "espagnol", "g", "scolaire"],
  ["Allemand", "allemand", "g", "scolaire"],
  ["Horaires décalés", "horaires decales|2x8|3x8|travail de nuit|de nuit\\b|week-?ends?|dimanches?|jours feries|astreintes?", "h", "", "horaires decales|2x8|3x8|nuit|week-?end|dimanche|ouverture|fermeture|[4-7] ?h\\b"],
  ["Premiers secours (SST)", "\\bsst\\b|sauveteur secouriste|premiers secours|\\bpsc ?1\\b", "l", "SST, 2023"],
  ["BAFA", "\\bbafa\\b|\\bbafd\\b", "l", "obtenu en 2022"]
].map(([k, o, type, ex, c]) => ({k, o: new RegExp(o), c: new RegExp(c || o), type, ex, broad: !!c}));

/* ---------- Réécritures à trous, selon le type de point ---------- */
const ART = {s: "cette qualité", t: "ça", o: "cet outil", l: "ça", g: "cette langue", h: "ces horaires"};
function makeFix(r){
  const ex = r.ex ? `ex : ${r.ex}` : "ex : …", K = r.k, k = r.k.toLowerCase();
  switch (r.type) {
    case "t": return r.st === "mid"
      ? {line:"exp", why:"C'est cité, mais aucune expérience ne le montre. Dis où tu l'as fait.", tpl:` ${K} : {où et combien ? ${ex}}.`}
      : {line:"exp", ask:`As-tu déjà fait ça : ${k} ?`, tpl:` ${K} : {où et combien ? ${ex}}.`, nope:"Pas grave. Si tu es prêt(e) à apprendre, dis-le dans ta lettre de motivation."};
    case "s": return {line:"exp", why: r.st === "mid" ? "Un mot seul ne prouve rien : ajoute un fait concret." : "L'offre le demande : prouve-le par un fait, pas par un adjectif.", tpl:` {un fait qui montre ${ART.s} ? ${ex}}.`};
    case "o": return r.st === "mid" && r.cvWord
      ? {line:"skills", find:r.cvWord, why:"Dis à quoi il te sert, ça parle plus qu'un nom de logiciel.", tpl:`${r.cvWord} ({pour quoi faire ? ${ex}})`}
      : {line:"skills", ask:`Sais-tu utiliser ${K} ?`, tpl:`, ${K} ({ton niveau ou un exemple ? ${ex}})`, nope:"Si c'est un « plus », ce n'est pas bloquant. Sinon, une formation courte peut suffire."};
    case "l": return {line: /dipl|cap|bac|bts|licence|master/i.test(K) ? "edu" : "skills", ask:`As-tu : ${K} ?`, tpl:`, ${K} ({année ou détail ? ${r.ex ? "ex : " + r.ex : "ex : 2023"}})`, nope:"Certaines entreprises financent la formation. Tu peux dire dans ta lettre que tu es prêt(e) à la passer."};
    case "g": return r.st === "mid" && r.cvWord
      ? {line:"skills", find:r.cvWord, tpl:`${r.cvWord} ({ton niveau ? ex : scolaire, courant})`}
      : {line:"skills", ask:`Tu parles ${k} ?`, tpl:`, ${k} {ton niveau ? ex : scolaire}`, nope:"Si l'offre dit « apprécié », ce n'est pas bloquant."};
    case "h": return {line:"skills", ask:"Acceptes-tu ces horaires ?", tpl:", disponible {quand ? ex : en horaires décalés et le week-end}", nope:"Dis-le franchement en entretien : c'est mieux que de mauvaises surprises."};
    case "d": return {line:"edu", ask:`As-tu ce diplôme (${r.word}) ?`, tpl:`${r.word.toUpperCase()} {spécialité et année ? ex : Employé de commerce, 2020}`, nope:"Une expérience équivalente compte souvent autant : mets-la en avant dans ta lettre."};
    default: return r.st === "mid"
      ? {line:"exp", why:"C'est cité, mais sans exemple concret.", tpl:` {un exemple concret ? ex : où, combien, pendant combien de temps}.`}
      : {line:"exp", ask:"As-tu déjà fait ça ?", tpl:` {ce que tu as fait ? ex : où, combien, pendant combien de temps}.`, nope:"Pas grave : mets en avant ce qui s'en rapproche le plus."};
  }
}

let fixes = {}; // nom du point -> {vals:{}, state:"open"|"yes"|"accepted"|"skipped", fix}
const blanksOf = tpl => [...tpl.matchAll(/\{([^}]+)\}/g)].map(m => m[1]);
const filled = k => { const f = fixes[k]; return blanksOf(f.fix.tpl).every((b, i) => (f.vals[i] || "").trim()); };
const fillTpl = (fix, vals) => { let i = 0; return fix.tpl.replace(/\{[^}]+\}/g, () => vals[i++] || ""); };

/* Ligne du CV où va une réécriture : celle qui contient le mot à remplacer, sinon la première expérience, la formation ou les compétences */
function targetId(fix){
  const body = CV.filter(l => l.t !== undefined && !l.name && !l.sec);
  if (fix.find) { const l = body.find(l => fold(l.t).includes(fold(fix.find))); if (l) return l.id; }
  const skills = body.find(l => l.kind === "skills" && l.t) || CV.find(l => l.id === "kAuto");
  if (fix.line === "exp") return (body.find(l => l.exp) || skills).id;
  if (fix.line === "edu") return (body.find(l => l.kind === "edu") || skills).id;
  return skills.id;
}
const put = (s, a) => !s ? a.replace(/^[,.\s]+/, "").replace(/^./, c => c.toUpperCase()) : s.endsWith(".") && a.startsWith(",") ? s.slice(0, -1) + a + "." : s + a;

function cvLines(withIns){
  const acc = Object.values(fixes).filter(f => f.state === "accepted" && f.fix);
  const lines = CV.map(l => {
    if (l.sec || l.name) return {...l};
    let t = esc(l.t), raw = l.t;
    acc.filter(f => targetId(f.fix) === l.id).forEach(f => {
      const add = fillTpl(f.fix, f.vals), wrap = x => withIns ? `<ins>${esc(x)}</ins>` : esc(x);
      const i = f.fix.find ? fold(raw).indexOf(fold(f.fix.find)) : -1;
      if (i >= 0) { const word = raw.substr(i, f.fix.find.length); t = t.replace(esc(word), wrap(add)); raw = raw.replace(word, add); }
      else {
        const a2 = f.fix.find || (f.fix.line === "edu" && raw && !/^[,.\s]/.test(add)) ? ", " + add : add, before = raw.endsWith(".") && a2.startsWith(",");
        t = !raw ? wrap(put("", a2)) : before ? t.slice(0, -1) + wrap(a2) + "." : t + wrap(a2);
        raw = put(raw, a2);
      }
    });
    return {...l, html:t, raw};
  });
  const autoEmpty = !lines.find(l => l.id === "kAuto")?.raw;
  return lines.filter(l => !(l.auto && autoEmpty));
}

/* ---------- Années d'expérience écrites dans le CV ---------- */
function cvYears(text){
  const now = new Date().getFullYear(), iv = [];
  for (const m of fold(text).matchAll(/\b((?:19|20)\d\d)\s*(?:-|–|—|à|a|au|\/)\s*((?:19|20)\d\d|aujourd'hui|auj\.?|present|actuel\w*|maintenant|en cours|ce jour)/g)) {
    const a = +m[1], b = /^\d/.test(m[2]) ? +m[2] : now;
    if (b >= a && b - a < 45) iv.push([a, Math.max(b, a + .5)]);
  }
  if (!iv.length) return null;
  iv.sort((x, y) => x[0] - y[0]);
  let tot = 0, [s, e] = iv[0];
  for (const [a, b] of iv.slice(1)) { if (a <= e) e = Math.max(e, b); else { tot += e - s; [s, e] = [a, b]; } }
  return Math.round(tot + e - s);
}

/* ---------- Mots importants d'une ligne de l'offre qui n'est pas dans le lexique ---------- */
const STOP = new Set(("le la les un une des du de d l au aux et ou en a dans sur pour par avec sans sous chez vers entre ce cet cette ces son sa ses leur leurs votre vos notre nos vous nous il elle ils elles on qui que quoi dont est sont etre avoir sera serez etes avez ont fait faire tout tous toute toutes tres plus moins bien bon bonne bonnes bons poste postes missions mission profil recherche recherchons recherche h f h/f cdi cdd temps plein partiel salaire experience experiences ans annee annees minimum maximum souhaite souhaitee apprecie appreciee requis requise exige exigee indispensable obligatoire capacite capacites savoir connaissance connaissances maitrise maitriser assurer assurez participer participez realiser realisez effectuer effectuez gerer gerez etc ainsi selon afin lors type idealement equivalent similaire premiere premier divers diverses ensemble differentes differents").split(" "));
const tokens = s => [...new Set(fold(s).split(/[^a-z0-9+#]+/).filter(w => w.length >= 4 && !STOP.has(w)).map(w => w.slice(0, 6)))];
const NOT_SKILL = /salaire|remuneration|€|euros?|\bcdi\b|\bcdd\b|contrat|temps (plein|partiel)|avantages|mutuelle|tickets? resto|primes?|postuler|candidature|envoy|\bcv\b|lieu de travail|poste base|prise de poste|date de debut|horaires? :|rejoignez|nous sommes|notre (entreprise|societe|groupe)|entreprise de|leader|\bdes que possible\b/;

const DIPLOMA = /\b(cap|bep|bac ?\+ ?\d|bac pro|bac|bts|dut|but|licence|master|titre professionnel|diplome d'etat)\b/;

/* ---------- Analyse : chaque point de l'offre reçoit ok (prouvé par une expérience), mid (cité sans preuve) ou no (absent) ---------- */
function analyse(offer){
  const lines = cvLines(false), O = fold(offer);
  const expTxt = lines.filter(l => l.exp).map(l => l.raw).join("\n"), allTxt = lines.filter(l => l.raw).map(l => l.raw).join("\n");
  const E = fold(expTxt), A = fold(allTxt);
  const lineAt = i => { const a = O.lastIndexOf("\n", i) + 1, b = O.indexOf("\n", i); return O.slice(a, b < 0 ? O.length : b); };
  const weight = i => { const l = lineAt(i); return /indispensable|exige|obligatoire|imperati|requis/.test(l) ? "must" : /apprecie|un plus|souhait|serait un|idealement|atout/.test(l) ? "nice" : ""; };
  const out = [];

  // Points du lexique
  LEX.forEach(d => {
    const mo = O.match(d.o); if (!mo) return;
    const offerWord = offer.substr(mo.index, mo[0].length);
    let st = "no", cvWord = "";
    const me = E.match(d.c), ma = A.match(d.c);
    if (me) { st = "ok"; cvWord = expTxt.substr(me.index, me[0].length); }
    else if (ma) { st = (d.type === "l" || d.type === "h") ? "ok" : "mid"; cvWord = allTxt.substr(ma.index, ma[0].length); }
    out.push({k:d.k, type:d.type, ex:d.ex, st, pos:mo.index, prio:weight(mo.index), offerWord, cvWord, re:d.c, broad:d.broad});
  });

  // Années d'expérience demandées
  const my = O.match(/(\d{1,2})\s*(?:a|à)?\s*\d{0,2}\s*ans? (?:minimum )?(?:d'|d’|de )?experience|experience (?:de |d'au moins |minimum (?:de )?)?(\d{1,2}) ans?/);
  if (my) {
    const need = +(my[1] || my[2]), have = cvYears(allTxt);
    out.push({k:`${need} an${need > 1 ? "s" : ""} d'expérience`, type:"y", st: have === null ? "mid" : have >= need ? "ok" : "no", pos:my.index, prio:weight(my.index), need, have});
  }

  // Diplôme demandé
  const md = O.match(DIPLOMA);
  if (md && !out.some(r => r.type === "l" && /dipl/i.test(r.k))) {
    const w = offer.substr(md.index, md[0].length), base = fold(w).replace(/\s/g, "");
    const inCv = new RegExp("\\b" + base.replace(/\+/g, " ?\\+ ?").replace("bac", "bac ?") + "\\b").test(A.replace(/\s+/g, " ")) || (base.startsWith("bac") && /\b(bac|bts|dut|but|licence|master)\b/.test(A));
    out.push({k:`Diplôme : ${w.toUpperCase()}`, type:"d", word:w, st: inCv ? "ok" : "no", pos:md.index, prio:weight(md.index), re:new RegExp("\\b(" + base.slice(0, 3) + "\\w*)")});
  }

  // Lignes à puces de l'offre que le lexique ne connaît pas : on compare leurs mots importants
  let generic = 0;
  offer.split("\n").forEach((raw, idx, all) => {
    if (generic >= 8 || !/^\s*[-•●▪◦*–·✓✔>]/.test(raw)) return;
    const line = raw.replace(/^\s*[-•●▪◦*–·✓✔>]+\s*/, "").replace(/[.;]+$/, "").trim(), F = fold(line);
    if (line.length < 6 || line.length > 120 || NOT_SKILL.test(F) || LEX.some(d => d.o.test(F)) || /\d+\s*ans?\b/.test(F) || DIPLOMA.test(F)) return;
    const tk = tokens(line); if (tk.length < 1) return;
    const share = T => tk.filter(w => T.split(/[^a-z0-9+#]+/).some(x => x.startsWith(w))).length / tk.length;
    const se = share(E), sa = share(A);
    const pos = O.indexOf(F);
    out.push({k: cap(line.length > 70 ? line.slice(0, 67).replace(/\s\S*$/, "") + "…" : line), type:"x", st: se >= .6 ? "ok" : sa >= .6 ? "mid" : "no", pos: pos < 0 ? 1e6 + idx : pos, prio:weight(Math.max(0, pos)), tk});
    generic++;
  });

  // Mots différents entre CV et offre (ex : CV « caissière », offre « hôte de caisse »)
  out.forEach(r => {
    if (r.st === "no" || !r.cvWord || !r.offerWord || r.type === "s" || r.type === "h" || r.broad) return;
    const a = fold(r.offerWord), b = fold(r.cvWord);
    if (a !== b && !a.includes(b.slice(0, 5)) && !b.includes(a.slice(0, 5))) r.vocab = {offer:r.offerWord, cv:r.cvWord};
  });

  out.sort((a, b) => a.pos - b.pos);
  out.forEach(r => {
    const f = fixes[r.k];
    r.fixedNow = f?.state === "accepted";
    if (r.fixedNow) r.st = "ok";
    if (r.type !== "y" && (r.st !== "ok" || r.fixedNow)) r.fix = f?.fix && (f.state === "accepted" || f.state === "skipped") ? f.fix : makeFix(r);
  });
  return out;
}
const W = r => r.prio === "must" ? 2 : r.prio === "nice" ? .5 : 1;
const countOf = rs => ({ok:rs.filter(r => r.st === "ok").length, mid:rs.filter(r => r.st === "mid").length, no:rs.filter(r => r.st === "no").length});
const scoreOf = rs => { const tot = rs.reduce((s, r) => s + W(r), 0); return tot ? Math.round(rs.reduce((s, r) => s + W(r) * (r.st === "ok" ? 1 : r.st === "mid" ? .5 : 0), 0) / tot * 100) : 0; };

/* ---------- Test « robot recruteur » : ce qui gêne les logiciels de tri des CV ---------- */
function atsCheck(text, info){
  const t = text || "", F = fold(t), w = t.trim() ? t.trim().split(/\s+/).length : 0, cv = parseCV(t);
  const has = k => cv.some(l => l.sec && !l.auto && l.kind === k);
  const expDated = cv.filter(l => l.exp).some(l => /\b(19|20)\d\d\b/.test(l.t));
  const img = /scann|photo/i.test(info || "");
  return [
    {ok: !img, label: img ? "Ton CV est une image" : "Ton CV contient du vrai texte", help: img ? "Beaucoup de logiciels de tri ne lisent pas les images. Envoie plutôt un PDF enregistré depuis Word ou Google Docs." : "Les logiciels de tri peuvent le lire."},
    {ok: /[\w.+-]+@[\w-]+\.[a-z.]{2,}/i.test(t), label: "Adresse email", help: "Mets ton email en haut du CV, en texte (pas dans une image)."},
    {ok: /(\+33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/.test(t), label: "Numéro de téléphone", help: "Ajoute ton numéro en haut du CV, au format 06 12 34 56 78."},
    {ok: has("exp"), label: "Titre « Expériences »", help: "Écris un titre clair « Expériences professionnelles » au-dessus de tes postes."},
    {ok: has("skills"), label: "Titre « Compétences »", help: "Ajoute une rubrique « Compétences » avec les mots de l'offre."},
    {ok: has("edu"), label: "Titre « Formation »", help: "Ajoute une rubrique « Formation » avec tes diplômes, même s'il n'y en a qu'un."},
    {ok: expDated, label: "Dates sur tes expériences", help: "Mets les années de début et de fin de chaque poste (ex : 2022 - 2025)."},
    {ok: w >= 120 && w <= 1000, label: w < 120 ? "CV un peu court" : w > 1000 ? "CV très long" : "Longueur correcte", help: w < 120 ? "Détaille un peu plus tes expériences : ce que tu faisais, avec des chiffres." : "Garde l'essentiel sur 1 ou 2 pages."},
    {ok: !/[-]|□|�/.test(t), label: "Pas de caractères bizarres", help: "Certains symboles ou icônes ne sont pas lus. Remplace-les par du texte (ex : « Tél : »)."}
  ];
}
