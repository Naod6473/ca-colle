// Moteur de Ça colle ? : exemples, découpage du CV, points repérés dans l'offre (tous métiers),
// mots différents entre CV et offre, test « robot recruteur », réécritures à trous.
// Aucune interface ici : js/app.js s'en charge.

const OFFER_FR = `Employé(e) logistique polyvalent(e) – CDI – Caen (exemple fictif)

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
const SAMPLE_CV_FR = `Camille Martin · Caen · camille.martin@exemple.fr · 06 00 00 00 00
Expériences
Préparatrice de commandes, Drive Super U (2022-2025) : 120 commandes par jour, contrôle qualité des produits frais, travail en équipe de 6.
Vendeuse, boulangerie du centre (2020-2022) : ouverture à 6h, caisse, rangement des livraisons chaque matin.
Formation
CAP Employé de commerce (2020)
Compétences
Tableur, gestion des stocks, rigueur, ponctualité
Divers
Permis B, véhicule personnel`;

const OFFER_EN = `Warehouse operative – permanent – Manchester (sample offer)

In our warehouse, you will pick orders and help receive goods.

Your tasks:
- Order picking and quality control
- Receiving and putting away deliveries
- Stock management and stock counts
- Driving a forklift (counterbalance and reach)
- Data entry in Excel

What we are looking for:
- 2 years of experience in a warehouse
- Driving licence essential
- Teamwork, punctuality, attention to detail
- Basic Spanish a plus
- Shift work (early and late)`;

const SAMPLE_CV_EN = `Sam Taylor · Manchester · sam.taylor@example.com · 07700 900123
Experience
Order picker, FreshMart online (2022-2025): 120 orders a day, quality checks on fresh products, team of 6.
Shop assistant, town centre bakery (2020-2022): 6 am opening, till, putting away deliveries every morning.
Education
GCSEs, Manchester High School (2020)
Skills
Spreadsheets, stock management, attention to detail, punctuality
Other
Driving licence, own car`;
const OFFER = L10N?.offer || (LANG === "fr" ? OFFER_FR : OFFER_EN), SAMPLE_CV = L10N?.cv || (LANG === "fr" ? SAMPLE_CV_FR : SAMPLE_CV_EN);
// Motifs propres à une autre langue (js/i18n) : ajoutés aux motifs français et anglais
const LX = (k, base) => L10N?.re?.[k] ? new RegExp(`(?:${base.source})|(?:${L10N.re[k]})`, base.flags) : base;

const esc = t => String(t).replace(/[&<>"]/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const LABEL = {ok: tr("Ça colle", "It fits"), mid: tr("À préciser", "Needs proof"), no: tr("Pas dans ton CV", "Not in your CV")};
// Texte sans accents ni majuscules, de même longueur que l'original (les positions restent valables)
const fold = s => [...String(s)].map(ch => { const d = ch.normalize("NFD"); return d.length > 1 && /^[̀-ͯ]+$/.test(d.slice(1)) ? d[0] : ch; }).join("").toLowerCase();
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- Découpage du CV ---------- */
const SECS = [
  ["exp", /^(experiences?( professionnelles?)?|parcours( professionnel)?|emplois?|postes? occupes|(work |professional |relevant )?experience|employment( history)?|work history|career history)$/],
  ["skills", /^(competences( cles| techniques)?|savoir[- ]faire|savoir[- ]etre|qualites|outils|informatique|langues|(key |technical |core )?skills|competencies|languages|strengths)$/],
  ["edu", /^((formations?|diplomes?|certifications?)( et (formations?|diplomes?|certifications?))*|etudes|scolarite|cursus|education( and training)?|qualifications|training|certifications? and training)$/],
  ["misc", /^(divers|loisirs|centres? d'interets?|informations?( complementaires)?|autres|interets|hobbies|resume( professionnel)?|profil( professionnel)?|a propos( de moi)?|objectif professionnel|interests|hobbies( and interests)?|additional information|profile|(professional )?summary|about me|personal statement|references|other)$/]
];
function parseCV(text){
  const out = []; let kind = null, n = 0, named = false;
  text.split("\n").map(l => l.replace(/^[\s•●▪◦‣\-–—*·«»"'.,]+/, "").trim()).filter(Boolean).forEach(l => {
    // Ligne coupée par la mise en page (PDF, photo) : elle commence en minuscule, on la recolle à la précédente
    const prev = out[out.length - 1];
    if (/^[a-zà-ÿ(]/.test(l) && prev && prev.t && !prev.name) { prev.t += " " + l; return; }
    const bare = l.replace(/[\s:]+$/, "");
    const h = bare.split(/\s+/).length <= 4 && SECS.find(([k, re]) => re.test(fold(bare)) || (L10N?.secs?.[k] && new RegExp(`^(${L10N.secs[k]})$`).test(fold(bare))));
    if (h) { kind = h[0]; out.push({id:"s" + n++, sec:bare, kind}); return; }
    if (!named && !kind) { named = true; out.push({id:"nom", t:l, name:true}); return; }
    out.push({id:"l" + n++, t:l, exp: kind === "exp", kind: kind || "misc"});
  });
  // Pas de rubrique Expériences repérée : une ligne avec une année compte comme expérience
  if (!out.some(l => l.exp)) out.forEach(l => { if (l.t && !l.name && l.kind !== "edu" && /\b(19|20)\d\d\b/.test(l.t)) l.exp = true; });
  if (!out.some(l => l.kind === "skills" && l.t)) out.push({id:"sAuto", sec:tr("Compétences", "Skills"), kind:"skills", auto:true}, {id:"kAuto", t:"", kind:"skills", auto:true});
  return out;
}
let CV = parseCV(SAMPLE_CV);

/* ---------- Lexique des métiers ----------
   [nom, motif (texte sans accents), type, exemple pour les trous, motif côté CV si plus large]
   Types : t = tâche, s = qualité, o = outil ou logiciel, l = permis, diplôme ou habilitation, g = langue, h = horaires */
/* Version anglaise du lexique : [nom anglais, motif anglais ajouté au motif français, exemple anglais].
   Les deux langues sont cherchées dans l'offre comme dans le CV : un CV anglais face à une offre française marche aussi. */
const LEX_EN = {
  "Préparation de commandes": ["Order picking", "order (picking|preparation|fulfil\\w*)|pick(ing)? and pack\\w*", "120 orders a day", "order pick\\w*|pick(ing)? and pack\\w*|\\bpick(er|ing)\\b|fulfil\\w*"],
  "Contrôle qualité": ["Quality control", "quality (control|checks?|assurance)", "checking dates and quantities"],
  "Réception des marchandises": ["Goods receiving", "goods (in|inwards|receiving|receipt)|receiving (goods|deliveries|stock)|receiving and put(ting)? away|put(ting)? away (deliveries|stock)|unloading", "30 pallets a day", "receiv\\w*|deliver(y|ies)|put(ting)? away|unloading|goods in"],
  "Gestion des stocks": ["Stock management", "stock (management|control|rotation)|inventory (management|control)|replenish\\w*", "weekly reordering"],
  "Inventaires": ["Stock counts", "stock ?(counts?|takes?)|stocktak\\w*|inventory counts?", "annual count of 3,000 items"],
  "CACES (chariot élévateur)": ["Forklift licence", "forklift|reach truck|pallet (truck|jack)", "counterbalance and reach truck, 2023"],
  "Expédition et emballage": ["Shipping and packing", "shipping|dispatch|\\bpacking\\b|packaging", "200 parcels a day"],
  "Manutention": ["Manual handling", "manual handling|heavy lifting|loading and unloading", "loading trucks"],
  "Encaissement": ["Cash handling", "cashier|cash (handling|register|desk)|\\btill\\b|checkout|point of sale", "up to 300 customers a day"],
  "Accueil des clients": ["Welcoming customers", "(greet|welcom)\\w* (customers|guests|visitors|patients)|front desk|reception desk", "80 customers a day", "greet\\w*|welcom\\w*|front desk|reception"],
  "Conseil client": ["Customer advice", "advis\\w* customers|customer advice|product advice", "advice on fresh products", "advi[sc]\\w*"],
  "Vente": ["Sales", "\\bsales\\b|\\bselling\\b|sales targets|retail assistant", "monthly target met 10 months out of 12", "sales|selling|sold|retail"],
  "Mise en rayon": ["Shelf stocking", "shelf (stocking|filling)|stock(ing)? shelves|merchandis\\w*|restock\\w*", "fresh aisle every morning"],
  "Relation client": ["Customer service", "customer (service|relations|satisfaction|complaints|care)|complaints|returns", "handling complaints"],
  "Prospection": ["Business development", "prospect\\w*|business development|lead generation|new clients|cold call\\w*", "20 new clients in a year"],
  "Négociation": ["Negotiation", "negotiat\\w*", "negotiation with 15 suppliers"],
  "Accompagnement des personnes âgées": ["Elderly care", "elderly|older (people|adults)|care homes?|nursing homes?", "6 people a week"],
  "Aide à domicile": ["Home care", "home care|care worker|\\bcarer\\b|caregiver|domestic help", "visits to 6 clients"],
  "Aide à la toilette": ["Personal care", "personal care|washing and dressing|bathing", "help getting up and washing"],
  "Préparation des repas": ["Meal preparation", "meal (preparation|prep)|preparing meals|cooking meals", "meals for 4 people"],
  "Garde d'enfants": ["Childcare", "child ?care|nanny|babysit\\w*|nursery|early years", "3 children aged 2 to 8"],
  "Diplôme d'aide-soignant": ["Healthcare assistant qualification", "healthcare assistant|nursing assistant|care assistant", "qualified 2021"],
  "Soins infirmiers": ["Nursing", "\\bnurs(e|es|ing)\\b|registered nurse", "registered 2019"],
  "Service en salle": ["Table service", "\\bwaiter\\b|waitress|waiting staff|table service|front of house", "60 covers a night"],
  "Cuisine": ["Cooking", "\\bcook\\b|line cook|head chef|sous[- ]chef|commis chef|\\bkitchen\\b|food prep\\w*", "prep for 80 covers"],
  "Règles d'hygiène (HACCP)": ["Food hygiene (HACCP)", "food (hygiene|safety)", "food hygiene level 2, 2022"],
  "Plonge": ["Dishwashing", "dishwash\\w*|kitchen porter|washing up", "100 covers"],
  "Bar": ["Bar", "bartend\\w*", "hot drinks"],
  "Réception hôtelière": ["Hotel reception", "hotel recept\\w*|receptionist|bookings", "40 rooms"],
  "Entretien et nettoyage": ["Cleaning", "cleaning|cleaner|housekeep\\w*|janitor\\w*|custodian", "800 m² of offices"],
  "Lecture de plans": ["Reading drawings", "read(ing)? (plans|drawings|blueprints)|technical drawings|blueprints", "site drawings"],
  "Habilitation électrique": ["Electrical certification", "electrical (certification|clearance|authori[sz]ation)|18th edition", "2024"],
  "Électricité": ["Electrical work", "electrician|electrical (work|installation)|wiring", "wiring consumer units"],
  "Plomberie et chauffage": ["Plumbing and heating", "plumb\\w*|heating engineer|gas safe", "bathroom fitting"],
  "Maçonnerie": ["Masonry", "mason\\w*|bricklay\\w*|concrete|formwork", "pouring slabs"],
  "Peinture": ["Painting", "painter|painting|decorat(ing|or)", "10 flats renovated"],
  "Travail en hauteur": ["Working at height", "work(ing)? at height|scaffold\\w*|\\bmewp\\b|cherry picker|\\bipaf\\b", "IPAF, 2023"],
  "Règles de sécurité": ["Health and safety", "health and safety|safety (rules|procedures)|\\bppe\\b|risk assessments?", "zero accidents in 3 years"],
  "Conduite de machines": ["Machine operation", "machine operat\\w*|production (line|operative)|\\bcnc\\b", "packaging line"],
  "Soudure": ["Welding", "weld\\w*", "MIG and TIG"],
  "Maintenance": ["Maintenance", "repair\\w*|troubleshoot\\w*", "preventive maintenance of 20 machines"],
  "Mécanique": ["Mechanics", "mechanic\\w*", "light vehicle servicing"],
  "Accueil téléphonique": ["Phone handling", "(answering|handling) (the )?(phone|calls)|switchboard|telephone|phone calls", "50 calls a day", "phone|calls|switchboard|telephone"],
  "Pack Office": ["Microsoft Office", "ms office", "letters in Word, emails in Outlook"],
  "Excel": ["Excel", "spreadsheets?", "order tracking sheet"],
  "Outils informatiques": ["Computer skills", "computer (skills|literate)|it skills|digital skills", "Word, email, simple spreadsheets", "computer|software|\\bword\\b|excel|spreadsheet|office"],
  "Saisie de données": ["Data entry", "data (entry|input)|keying", "delivery notes"],
  "Gestion d'agenda": ["Diary management", "(diary|calendar) management|scheduling|appointments?", "3 doctors' diaries"],
  "Rédaction de courriers": ["Writing letters", "(writing|drafting) (letters|correspondence|reports|minutes)|correspondence|(taking|writing) minutes", "letters to customers"],
  "Facturation": ["Invoicing", "invoic\\w*|billing|quotes", "100 invoices a month"],
  "Comptabilité": ["Bookkeeping", "bookkeep\\w*|accounting|accounts (payable|receivable)|bank reconciliation", "ledger entries"],
  "Paie": ["Payroll", "payroll|payslips?", "payroll for 40 staff"],
  "Classement et archivage": ["Filing and archiving", "\\bfiling\\b|record(s)? management|document management", "archiving files"],
  "Logiciel de gestion (ERP)": ["ERP software", "erp software", "SAP, orders and stock"],
  "Recrutement": ["Recruitment", "recruit\\w*|hiring|human resources|talent acquisition", "20 hires a year"],
  "Support utilisateurs": ["User support", "(end[- ])?user support|help ?desk|service desk|(first|second|1st|2nd)[- ]line|it support|technical support", "30 tickets a day", "support|help ?desk|service desk"],
  "Windows": ["Windows", "windows", "rolling out Windows 11"],
  "Linux": ["Linux", "linux", "Debian servers"],
  "Réseaux informatiques": ["Networking", "network(s|ing)?\\b|routers?|wi-?fi", "VLANs and switches for 50 workstations"],
  "Active Directory": ["Active Directory", "active directory", "accounts and rights for 300 users"],
  "Cybersécurité": ["Cybersecurity", "information security|firewalls?|antivirus", "firewall roll-out"],
  "Administration des serveurs": ["Server administration", "server (administration|management)|administer\\w* (servers|systems)|sysadmin|system administration", "15 Windows and Linux servers", "servers?|sysadmin|system administration|vmware|hyper-v"],
  "Virtualisation": ["Virtualisation", "virtuali[sz]\\w*", "VMware, 20 virtual machines"],
  "Sauvegardes et restauration": ["Backup and restore", "backups?|restor(e|ing)\\b", "daily backup of 10 servers"],
  "Supervision": ["Monitoring", "(system|network|infrastructure) monitoring|monitor(ing)? (systems|networks|infrastructure)", "50 devices monitored", "monitor\\w*"],
  "Gestion des incidents (ITIL)": ["Incident management (ITIL)", "incident management|service desk|tickets?", "30 tickets a day", "incidents?|tickets?|service desk|support"],
  "Comptes et droits d'accès": ["User accounts and access", "user accounts?|access (rights|control|management)|permissions|identity management", "accounts and rights for 300 users", "accounts?|access|permissions|active directory|entra|\\bmfa\\b"],
  "Déploiement de logiciels": ["Software deployment", "deploy\\w* (software|applications|devices|laptops)|software (deployment|rollout)|roll-?out|imaging", "300 laptops deployed", "deploy\\w*|roll-?out|intune|imaging"],
  "Gestion de parc": ["IT asset management", "(it )?asset management|hardware inventory|device fleet", "fleet of 500 devices"],
  "Documentation technique": ["Technical documentation", "(technical )?documentation|knowledge base", "procedures for the support team", "documentation|procedures?|knowledge base|wiki"],
  "Veille technologique": ["Technology watch", "technology watch|tech watch|keep(ing)? up to date", "weekly security watch"],
  "Relation avec les prestataires": ["Vendor management", "vendors?|suppliers?|contractors?|third[- ]part(y|ies)|service providers?", "10 suppliers managed"],
  "Politique de sécurité (PSSI)": ["Security policy", "(information )?security polic(y|ies)|\\bisms\\b", "wrote the security policy", "security polic(y|ies)|\\bisms\\b|nis ?2"],
  "Conformité (RGPD, NIS2…)": ["Compliance (GDPR, NIS2…)", "\\bgdpr\\b|compliance|soc ?2", "NIS2 compliance", "\\bgdpr\\b|compliance|nis ?2|iso ?27001|soc ?2"],
  "Sensibilisation des utilisateurs": ["Security awareness", "awareness|phishing (training|simulations?)", "awareness training for 300 staff"],
  "Continuité d'activité (PCA/PRA)": ["Business continuity (BCP/DRP)", "business continuity|disaster recovery|\\bbcp\\b|\\bdrp\\b", "DRP tested every year"],
  "Gestion de crise": ["Crisis management", "crisis (management|situations?)|incident response", "crisis unit during a cyberattack"],
  "Transformation numérique": ["Digital transformation", "digital (transformation|tools)|digiti[sz]\\w*|digitali[sz]\\w*", "paperless invoicing", "digital|digiti[sz]\\w*|moderni[sz]\\w*"],
  "Python": ["Python", "python", "automation scripts"],
  "JavaScript": ["JavaScript", "javascript", "React website"],
  "HTML / CSS": ["HTML / CSS", "\\bhtml\\b", "responsive pages"],
  "SQL": ["SQL", "databases?", "queries on a customer database"],
  "Cloud": ["Cloud", "\\bcloud\\b", "move to Microsoft 365"],
  "Gestion de projet": ["Project management", "project (management|manager|lead\\w*)|manag(e|ing) projects|lead(ing)? projects", "6-month project, 3 people", "projects?"],
  "Management d'équipe": ["Team management", "team (lead\\w*|manag\\w*)|managing (a team|staff)|supervis(e|ing) (staff|a team)|line manag\\w*|\\bmanager\\b", "team of 5"],
  "Permis B": ["Driving licence", "driving licen[cs]e|driver'?s licen[cs]e|full (uk )?licen[cs]e|own (car|transport)", "since 2018", "driving licen[cs]e|driver'?s licen[cs]e|full (uk )?licen[cs]e|own (car|transport)"],
  "Travail en équipe": ["Teamwork", "team ?work|team player|work(ing)? (well )?in a team|collaborat\\w*", "team of 6", "team|collaborat\\w*"],
  "Autonomie": ["Autonomy", "independen\\w*|self-motivated|own initiative|on your own", "alone at store opening"],
  "Rigueur": ["Attention to detail", "attention to detail|detail[- ]oriented|accura\\w*|thorough\\w*", "zero order errors in 2024"],
  "Ponctualité": ["Punctuality", "punctual\\w*|reliab(le|ility)|timekeeping", "6 am opening for 2 years", "punctual|reliab|opening|[4-7] ?am\\b"],
  "Sens de l'organisation": ["Organisation skills", "organi[sz]ational skills|(well[- ])?organi[sz]ed|time management|prioriti[sz]\\w*", "schedule for 4 people", "organi[sz]\\w*|prioriti[sz]\\w*"],
  "Sens du contact": ["People skills", "people skills|interpersonal|friendly|outgoing|approachable|customer[- ]facing", "80 customers a day"],
  "Polyvalence": ["Versatility", "versatil\\w*|multi-?skilled|all-rounder", "till, shelves and deliveries"],
  "Dynamisme": ["Energy", "energetic|enthusias\\w*", "Saturday rush"],
  "Gestion du stress": ["Working under pressure", "under pressure|fast[- ]paced|busy (periods|environment)", "Saturday night service"],
  "Écoute": ["Listening and empathy", "listening|empath\\w*|caring|compassion\\w*", "supporting older people"],
  "Discrétion": ["Discretion", "discre(et|tion)|confidential\\w*", "medical records"],
  "Adaptabilité": ["Adaptability", "adaptab\\w*|adapt to|flexib\\w*", "new post every week"],
  "Communication": ["Communication skills", "communication skills|written and verbal|verbal and written|good communicat\\w*", "weekly report"],
  "Anglais": ["English", "english", "intermediate"],
  "Espagnol": ["Spanish", "spanish", "basic"],
  "Allemand": ["German", "german", "basic"],
  "Horaires décalés": ["Shift work", "shifts?\\b|night (work|shifts)|weekends?|bank holidays|on[- ]call|\\brota\\b", "", "shifts?|nights?|weekends?|on[- ]call|rota|opening|closing|[4-7] ?am\\b"],
  "Premiers secours (SST)": ["First aid", "first aid(er)?", "first aid, 2023"],
  "BAFA": ["Youth work certificate", "youth work(er)?|camp counsel+or", "2022"]
};
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
  ["Service en salle", "service en salle|\\bserveuse\\b|\\bserveur ?(\\/|\\()|serveur de restaurant|serveur en (salle|restauration)|prise de commandes? en salle|service au plateau|chef de rang|\\brunner\\b", "t", "service de 60 couverts"],
  ["Cuisine", "\\bcuisine\\b|cuisinier|cuisiniere|\\bcommis\\b|mise en place (en cuisine|des plats)|preparation culinaire", "t", "mise en place pour 80 couverts"],
  ["Règles d'hygiène (HACCP)", "haccp|hygiene alimentaire|normes d'hygiene|regles d'hygiene", "l", "formation HACCP 2022"],
  ["Plonge", "\\bplonge\\b|plongeu(r|se)|vaisselle", "t", "plonge pour 100 couverts"],
  ["Bar", "\\bbar\\b|barman|barmaid|barista|cocktails?", "t", "préparation des boissons chaudes"],
  ["Réception hôtelière", "reception hoteliere|receptionniste|check[- ]?in|reservations?", "t", "accueil et réservations, 40 chambres"],
  ["Entretien et nettoyage", "menage|nettoyage|entretien (des locaux|du logement|de la maison|du domicile|du linge|des bureaux)|agent d'entretien|proprete|bionettoyage", "t", "entretien de 800 m² de bureaux"],
  // BTP, industrie, technique
  ["Lecture de plans", "lecture de plans?|lire (un |des |les )?plans?|plans techniques", "o", "plans d'exécution sur chantier"],
  ["Habilitation électrique", "habilitations? electriques?|\\bb0\\b|\\bh0v?\\b|\\bbr\\b|\\bb1v?\\b|\\bb2v?\\b", "l", "B1V, 2024"],
  ["Électricité", "electricit\\w*|electricien|cablage|tableaux? electriques?", "t", "câblage de tableaux électriques"],
  ["Plomberie et chauffage", "plomb\\w*|installations? sanitaires?|chauffagiste|chauffage", "t", "installation de salles de bain"],
  ["Maçonnerie", "maconn\\w*|coffrage|beton|gros oeuvre", "t", "coffrage et coulage de dalles"],
  ["Peinture", "peintre|peinture|enduits?", "t", "rénovation de 10 appartements"],
  ["Travail en hauteur", "travail en hauteur|nacelles?|echafaudages?|harnais", "l", "CACES nacelle R486, 2023"],
  ["Règles de sécurité", "regles de securite|consignes de securite|\\bepi\\b|securite au travail|prevention des risques", "s", "zéro accident en 3 ans"],
  ["Conduite de machines", "conduite de (machines?|lignes?|production)|operat(eur|rice) de production|regleu(r|se)|commande numerique", "t", "conduite d'une ligne de conditionnement"],
  ["Soudure", "soudu\\w*|soudeu(r|se)|souder", "t", "soudure MIG et TIG"],
  ["Maintenance", "\\bmaintenance|\\bdepannage|\\breparation", "t", "maintenance préventive de 20 machines"],
  ["Mécanique", "mecanique|mecanicien\\w*", "t", "entretien de véhicules légers"],
  // Bureau, administratif
  ["Accueil téléphonique", "accueil telephonique|standard telephonique|standardiste|appels? telephoniques?|au telephone", "t", "50 appels par jour", "telephon|standard|appels?"],
  ["Pack Office", "pack office|microsoft office|suite office|office 365|microsoft 365|\\bword\\b|powerpoint|outlook", "o", "courriers sur Word, mails sur Outlook"],
  ["Excel", "\\bexcel\\b|tableur", "o", "tableau de suivi des commandes"],
  ["Outils informatiques", "outils? informatiques?|bureautique|maitrise de l'informatique", "o", "Word, mails, tableaux simples", "informatique|bureautique|\\bword\\b|excel|tableur|office|ordinateur|logiciels?"],
  ["Saisie de données", "saisie|encodage", "t", "saisie des bons de livraison"],
  ["Gestion d'agenda", "gestion (de l'|d'|des |du )?(agendas?|plannings?)|prise de rendez-vous|rendez-vous", "t", "agenda de 3 médecins"],
  ["Rédaction de courriers", "courriers?|redaction de (courriers|lettres|comptes? rendus)|comptes? rendus?", "t", "courriers aux clients"],
  ["Facturation", "factur\\w*|devis|relances?", "t", "100 factures par mois"],
  ["Comptabilité", "comptab\\w*|rapprochement bancaire|ecritures comptables", "t", "saisie des écritures"],
  ["Paie", "\\bpaie\\b|bulletins? de salaire", "t", "paie de 40 salariés"],
  ["Classement et archivage", "classement|archiv\\w*|gestion documentaire", "t", "archivage des dossiers"],
  ["Logiciel de gestion (ERP)", "\\bsap\\b|\\berp\\b|\\bsage\\b|cegid|\\bebp\\b", "o", "SAP, commandes et stocks"],
  ["Recrutement", "recrutement|recruter|ressources humaines|\\brh\\b", "t", "20 recrutements par an"],
  // Informatique
  ["Support utilisateurs", "support (aux |des |a l'|de proximite )?utilisateurs?|assistance (aux |des )?utilisateurs?|helpdesk|hotline|\\bn1\\b|\\bn2\\b|niveau [12]|support informatique", "t", "30 tickets par jour", "support (aux |des |a l'|de proximite )?utilisateurs?|support de [\\d ]+ utilisateurs|assistance (aux |des )?utilisateurs?|helpdesk|hotline|\\bn1\\b|\\bn2\\b|niveau [12]|support informatique|support vip|\\bsupport\\b"],
  ["Windows", "windows", "o", "installation de postes Windows 11"],
  ["Linux", "linux|debian|ubuntu", "o", "serveurs Debian"],
  ["Réseaux informatiques", "reseaux? informatiques?|equipements? reseaux?|reseaux et systemes|systemes et reseaux|\\blan\\b|\\bwan\\b|\\btcp\\b|vlan|switch\\w*|routeurs?|\\bwi-?fi\\b|administration reseau", "o", "VLAN et switchs d'un site de 50 postes"],
  ["Active Directory", "active directory|\\bgpo\\b|azure ad|entra id", "o", "comptes et droits de 300 utilisateurs"],
  ["Cybersécurité", "cyber\\w*|securite informatique|pare-feu|firewall|antivirus|\\bedr\\b", "o", "mise en place d'un pare-feu"],
  ["Administration des serveurs", "administr\\w* (et maintenir )?(les |des )?(serveurs?|systemes?)|administration systemes?|windows server|serveurs? (windows|linux)", "t", "15 serveurs Windows et Linux", "serveurs?|windows server|administration (systemes?|de l'active directory|du tenant)|vmware|hyper-v|proxmox"],
  ["Virtualisation", "virtualis\\w*|vmware|hyper-v|proxmox|vsphere", "o", "VMware, 20 machines virtuelles"],
  ["Sauvegardes et restauration", "sauvegardes?|backups?|restauration (des |de )?donnees|operations de restauration|veeam", "t", "sauvegarde quotidienne de 10 serveurs", "sauvegardes?|backups?|restauration|veeam|\\bpra\\b"],
  ["Supervision", "supervis\\w*|monitoring|zabbix|centreon|nagios|\\bprtg\\b", "t", "supervision de 50 équipements"],
  ["Gestion des incidents (ITIL)", "\\bitil\\b|\\bitsm\\b|gestion des incidents|incidents? (materiels|systemes|reseaux|informatiques)|tickets?", "t", "30 tickets par jour", "\\bitil\\b|\\bitsm\\b|incidents?|tickets?|glpi|support"],
  ["Comptes et droits d'accès", "comptes? utilisateurs?|droits d'acces|controle d'acces|gestion des acces|habilitations? (informatiques|utilisateurs)", "t", "comptes et droits de 300 utilisateurs", "comptes? utilisateurs?|droits d'acces|controle d'acces|active directory|entra|\\bgpo\\b|\\bmfa\\b"],
  ["Déploiement de logiciels", "deploi\\w* (et faire evoluer )?(des |de |les )?(logiciels?|applications?|postes?|solutions?)|deployer (et faire evoluer )?(les |des )?(logiciels?|applications?)|intune|\\bsccm\\b|masteris\\w*", "t", "déploiement de 300 postes", "deploi\\w*|deployer|intune|\\bsccm\\b|masteris\\w*"],
  ["Gestion de parc", "gestion (de |du )?parc|parc informatique|\\bglpi\\b", "t", "parc de 500 postes"],
  ["Documentation technique", "documentation (technique|informatique)|redig\\w* (et maintenir )?(la )?documentation|procedures? techniques?", "t", "procédures pour l'équipe support", "documentation|procedures?|wiki"],
  ["Veille technologique", "veille (technologique|technique)|veille", "t", "veille sécurité chaque semaine"],
  ["Relation avec les prestataires", "prestataires?|editeurs? (de logiciels)?|fournisseurs?|sous-traitants?", "t", "suivi de 10 prestataires"],
  ["Politique de sécurité (PSSI)", "politique de (cyber)?securite|politiques de securite|\\bpssi\\b", "t", "rédaction de la PSSI", "politique de (cyber)?securite|politiques de securite|\\bpssi\\b|nis ?2|\\banssi\\b"],
  ["Conformité (RGPD, NIS2…)", "\\brgpd\\b|conformite (reglementaire|rgpd)|\\bhds\\b|nis ?2|iso ?27001", "l", "mise en conformité NIS2", "\\brgpd\\b|conformite|\\bhds\\b|nis ?2|iso ?27001"],
  ["Sensibilisation des utilisateurs", "sensibilis\\w*", "t", "sensibilisation de 300 agents"],
  ["Continuité d'activité (PCA/PRA)", "\\bpca\\b|\\bpra\\b|continuite d'activite|reprise d'activite|plan de continuite", "t", "PRA testé chaque année"],
  ["Gestion de crise", "gestion (de |des )?(la )?crises?|situations? de crise|cellule de crise", "t", "cellule de crise lors d'une cyberattaque"],
  ["Transformation numérique", "transformation (numerique|digitale)|digitalisation|dematerialis\\w*|outils numeriques", "t", "dématérialisation des factures", "transformation (numerique|digitale)|digitalis\\w*|dematerialis\\w*|numerique|modernisation"],
  ["Python", "python", "o", "scripts d'automatisation"],
  ["JavaScript", "javascript|typescript|\\breact\\b|node\\.?js", "o", "site web en React"],
  ["HTML / CSS", "\\bhtml\\d?\\b|\\bcss\\d?\\b", "o", "pages web responsive"],
  ["SQL", "\\bsql\\b|mysql|postgre\\w*|bases? de donnees", "o", "requêtes sur une base clients"],
  ["Cloud", "\\bcloud\\b|\\bazure\\b|\\baws\\b", "o", "migration vers Microsoft 365"],
  ["Gestion de projet", "gestion de projets?|chefs? de projets?|pilot\\w* (de |des )?projets?|conduite de projets?|participer (aux|au) (deploiement des )?projets?|projets? informatiques?", "t", "projet de 6 mois, 3 personnes", "gestion de projets?|chefs? de projets?|pilot\\w* (de |des )?projets?|conduite de projets?|projets?"],
  ["Management d'équipe", "(?<!(stock|project|risk|asset|incident|identity|access|diary|calendar|time|crisis|server|change|records?|document|vendor|supplier|account|data|quality|des stocks|de projets?|de crise|de parc) )\\bmanagement\\b(?! (de|des|du) (stocks?|projets?|crise|parc|la qualite))|\\bmanag(er|eur)s?\\b|encadr\\w*|chef d'equipe|responsable d'equipe|animer (une |l')equipe", "t", "équipe de 5 personnes"],
  // Qualités et conditions, tous métiers
  ["Permis B", "permis b\\b|permis de conduire|permis vl", "l", "depuis 2018", "permis b\\b|permis de conduire|permis vl|vehicule"],
  ["Travail en équipe", "travail(ler)? en equipe|esprit d'equipe|sens du travail en equipe", "s", "équipe de 6 personnes", "en equipe|equipe de|esprit d'equipe"],
  ["Autonomie", "autonom\\w*", "s", "seule à l'ouverture du magasin"],
  ["Rigueur", "rigueur|rigoureu(x|se)|minutie|minutieu(x|se)|precision", "s", "aucune erreur de commande en 2024"],
  ["Ponctualité", "ponctu\\w*|assiduite|assidu\\w*", "s", "ouverture à 6h pendant 2 ans", "ponctu|assidu|ouverture|[4-7] ?h\\b"],
  ["Sens de l'organisation", "sens de l'organisation|organise(e)?\\b|bonne organisation|methodique|capacite d'organisation", "s", "planning de 4 personnes", "organis\\w*|methodique"],
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
].map(([k, o, type, ex, c]) => {
  const [ek, eo, eex, ec] = LEX_EN[k] || [k, "", ex];
  // Autre langue : [nom, motif, exemple, motif côté CV] dans L10N.lex, ajoutés aux motifs français et anglais
  const [xk, xo, xex, xc] = L10N?.lex?.[k] || [];
  let O2 = eo ? o + "|" + eo : o, C2 = (c || o) + (ec || eo ? "|" + (ec || eo) : "");
  if (xo) { O2 += "|" + xo; C2 += "|" + (xc || xo); }
  return {k: LANG === "fr" ? k : xk || ek, o: new RegExp(O2), c: new RegExp(C2), type, ex: LANG === "fr" ? ex : xk ? xex : eex, broad: !!(c || ec || xc)};
});

/* ---------- Réécritures à trous, selon le type de point ---------- */
const ART = {s: tr("cette qualité", "this quality")};
function makeFix(r){
  const ex = r.ex ? tr(`ex : ${r.ex}`, `e.g. ${r.ex}`) : tr("ex : …", "e.g. …"), K = r.k, k = KEEPCASE ? r.k : r.k.toLowerCase();
  const learn = tr("Pas grave. Si tu es prêt(e) à apprendre, dis-le dans ta lettre de motivation.", "No problem. If you are ready to learn, say so in your cover letter.");
  switch (r.type) {
    case "t": return r.st === "mid"
      ? {line:"exp", why:tr("C'est cité, mais aucune expérience ne le montre. Dis où tu l'as fait.", "It is mentioned, but no job shows it. Say where you did it."), tpl:tr(` ${K} : {où et combien ? ${ex}}.`, ` ${K}: {where and how much? ${ex}}.`)}
      : {line:"exp", ask:tr(`As-tu déjà fait ça : ${k} ?`, `Have you done this before: ${k}?`), tpl:tr(` ${K} : {où et combien ? ${ex}}.`, ` ${K}: {where and how much? ${ex}}.`), nope:learn};
    case "s": return {line:"exp", why: r.st === "mid" ? tr("Un mot seul ne prouve rien : ajoute un fait concret.", "A word alone proves nothing: add a real example.") : tr("L'offre le demande : prouve-le par un fait, pas par un adjectif.", "The offer asks for it: prove it with a fact, not an adjective."), tpl:tr(` {un fait qui montre ${ART.s} ? ${ex}}.`, ` {a fact that shows ${ART.s}? ${ex}}.`)};
    case "o": return r.st === "mid" && r.cvWord
      ? {line:"skills", find:r.cvWord, why:tr("Dis à quoi il te sert, ça parle plus qu'un nom de logiciel.", "Say what you use it for: it says more than a software name."), tpl:tr(`${r.cvWord} ({pour quoi faire ? ${ex}})`, `${r.cvWord} ({what for? ${ex}})`)}
      : {line:"skills", ask:tr(`Sais-tu utiliser ${K} ?`, `Can you use ${K}?`), tpl:tr(`, ${K} ({ton niveau ou un exemple ? ${ex}})`, `, ${K} ({your level or an example? ${ex}})`), nope:tr("Si c'est un « plus », ce n'est pas bloquant. Sinon, une formation courte peut suffire.", "If it is only a plus, it is not a deal-breaker. Otherwise, a short course may be enough.")};
    case "l": return {line: /dipl|cap|bac|bts|licence|master|degree|qualif/i.test(K) ? "edu" : "skills", ask:tr(`As-tu : ${K} ?`, `Do you have: ${K}?`), tpl:tr(`, ${K} ({année ou détail ? ${r.ex ? "ex : " + r.ex : "ex : 2023"}})`, `, ${K} ({year or detail? ${r.ex ? "e.g. " + r.ex : "e.g. 2023"}})`), nope:tr("Certaines entreprises financent la formation. Tu peux dire dans ta lettre que tu es prêt(e) à la passer.", "Some employers pay for the training. You can say in your letter that you are ready to take it.")};
    case "g": return r.st === "mid" && r.cvWord
      ? {line:"skills", find:r.cvWord, tpl:tr(`${r.cvWord} ({ton niveau ? ex : scolaire, courant})`, `${r.cvWord} ({your level? e.g. basic, fluent})`)}
      : {line:"skills", ask:tr(`Tu parles ${k} ?`, `Do you speak ${k}?`), tpl:tr(`, ${k} {ton niveau ? ex : scolaire}`, `, ${k} {your level? e.g. basic}`), nope:tr("Si l'offre dit « apprécié », ce n'est pas bloquant.", "If the offer says \"a plus\", it is not a deal-breaker.")};
    case "h": return {line:"skills", ask:tr("Acceptes-tu ces horaires ?", "Are you OK with these hours?"), tpl:tr(", disponible {quand ? ex : en horaires décalés et le week-end}", ", available {when? e.g. shifts and weekends}"), nope:tr("Dis-le franchement en entretien : c'est mieux que de mauvaises surprises.", "Say it honestly at the interview: better than bad surprises.")};
    case "d": return {line:"edu", ask:tr(`As-tu ce diplôme (${r.word}) ?`, `Do you have this qualification (${r.word})?`), tpl:tr(`${r.word.toUpperCase()} {spécialité et année ? ex : Employé de commerce, 2020}`, `${r.word} {subject and year? e.g. Business, 2020}`), nope:tr("Une expérience équivalente compte souvent autant : mets-la en avant dans ta lettre.", "Similar experience often counts as much: highlight it in your letter.")};
    default: return r.st === "mid"
      ? {line:"exp", why:tr("C'est cité, mais sans exemple concret.", "It is mentioned, but with no real example."), tpl:tr(` {un exemple concret ? ex : où, combien, pendant combien de temps}.`, ` {a real example? e.g. where, how many, for how long}.`)}
      : {line:"exp", ask:tr("As-tu déjà fait ça ?", "Have you done this before?"), tpl:tr(` {ce que tu as fait ? ex : où, combien, pendant combien de temps}.`, ` {what you did? e.g. where, how many, for how long}.`), nope:tr("Pas grave : mets en avant ce qui s'en rapproche le plus.", "No problem: highlight what comes closest.")};
  }
}

let over = {}, skipped = [];  // nom du point -> "ok" | "mid" | "no" | "skip" : tampon corrigé à la main
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
  for (const m of fold(text).matchAll(new RegExp(String.raw`\b((?:19|20)\d\d)\s*(?:-|–|—|à|a|au|to|\/${L10N?.re?.to ? "|" + L10N.re.to : ""})\s*((?:19|20)\d\d|aujourd'hui|auj\.?|present|actuel\w*|maintenant|en cours|ce jour|current\w*|now|today|ongoing|date${L10N?.re?.now ? "|" + L10N.re.now : ""})`, "g"))) {
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
const STOP = new Set(("le la les un une des du de d l au aux et ou en a dans sur pour par avec sans sous chez vers entre ce cet cette ces son sa ses leur leurs votre vos notre nos vous nous il elle ils elles on qui que quoi dont est sont etre avoir sera serez etes avez ont fait faire tout tous toute toutes tres plus moins bien bon bonne bonnes bons poste postes missions mission profil recherche recherchons recherche h f h/f cdi cdd temps plein partiel salaire experience experiences ans annee annees minimum maximum souhaite souhaitee apprecie appreciee requis requise exige exigee indispensable obligatoire capacite capacites savoir connaissance connaissances maitrise maitriser assurer assurez participer participez realiser realisez effectuer effectuez gerer gerez etc ainsi selon afin lors type idealement equivalent similaire premiere premier divers diverses ensemble differentes differents garantir mettre oeuvre intervenir contribuer veiller cadre the and with for from your you our will that this have has are can able ability must should strong excellent good great knowledge including such other within across into well role job position responsibilities requirements required preferred desired years year experience working work ensure using use help").split(" ").concat(L10N?.stop ? L10N.stop.split(" ") : []));
const tokens = s => [...new Set(fold(s).split(/[^a-z0-9+#]+/).filter(w => w.length >= 4 && !STOP.has(w)).map(w => w.slice(0, 6)))];
/* Familles de mots proches : un mot de l'offre est retrouvé dans le CV par un mot de la même famille.
   Racines de 6 lettres au plus, sans accents (comme les mots importants ci-dessus). */
const SYN = [
  "restau brasse bistro cafete pizzer snack traite hotel cantin", "vente vendre vendeu commer", "encais caisse caissi",
  "magasi boutiq superm hyperm enseig", "entrep logist platef", "client cliente", "livrai livreu livrer", "conduc chauff",
  "nettoy entret menage propre", "patien malade reside usager benefi", "enfant jeune eleve", "equipe collab collegu",
  "ordina inform numeri digita", "docume proced wiki", "superv monito", "sauveg backup", "instal deploi deploy",
  "config parame", "reseau networ", "serveu server", "securi cyber", "incide panne depann ticket", "utilis usager user",
  "projet project", "manage encadr", "budget financ couts", "crise crisis", "chanti travau batime", "ponctu assidu",
  "commun relati", "accomp suivi", "repara depann", "prepar confec", "rangem range ordonn", "plann agenda calend", "wareho entrep logist", "custom client", "deliv livrai", "cleani nettoy entret", "repair repara", "kitche cuisin cook", "childr enfant", "colleag equipe team staff", "sales vente selling retail", "shop magasi store", "patien resident", "elderl agees senior"
].concat(L10N?.syn || []).map(g => g.split(" "));
const synOf = w => [w, ...SYN.filter(g => g.some(x => w.startsWith(x) || x.startsWith(w))).flat()];
const NOT_SKILL = LX("notSkill", /salaire|remuneration|€|euros?|\bcdi\b|\bcdd\b|contrat|temps (plein|partiel)|avantages|mutuelle|tickets? resto|primes?|postuler|candidature|envoy|\bcv\b|lieu de travail|poste base|prise de poste|date de debut|horaires? :|rejoignez|nous sommes|notre (entreprise|societe|groupe)|entreprise de|leader|\bdes que possible\b|vous aurez|principales missions|en lien direct|salary|£|\$|per (hour|annum|year)|benefits|pension|holidays?|apply now|how to apply|application process|full[- ]time|part[- ]time|permanent (contract|role|position)|about us|we are|our (company|team is)|equal opportunit|start date|location/);

const DIPLOMA = L10N?.re?.diploma ? new RegExp(L10N.re.diploma) : EN ? /\b(bachelor'?s degree|master'?s degree|degree|phd|high school diploma|gcses?|a[- ]levels?|nvq level \d|hnd|hnc|bac ?\+ ?\d|bts)\b/ : /\b(cap|bep|bac ?\+ ?\d|bac pro|bac|bts|dut|but|licence|master|titre professionnel|diplome d'etat)\b/;

/* ---------- Analyse : chaque point de l'offre reçoit ok (prouvé par une expérience), mid (cité sans preuve) ou no (absent) ---------- */
function analyse(offer){
  const lines = cvLines(false), O = fold(offer);
  const expTxt = lines.filter(l => l.exp).map(l => l.raw).join("\n"), allTxt = lines.filter(l => l.raw).map(l => l.raw).join("\n");
  const E = fold(expTxt), A = fold(allTxt);
  const body = lines.filter(l => l.raw && !l.sec);
  // Meilleure ligne du CV pour un point : le motif exact de l'offre vaut plus que le motif large, une ligne longue (avec du détail) plus qu'un mot seul
  const bestLine = (ls, d) => {
    let best = null;
    ls.forEach(l => {
      const F = fold(l.raw), m = F.match(d.o) || F.match(d.c); if (!m) return;
      const sc = (d.o.test(F) ? 4 : 0) + (l.exp ? 2 : 0) + Math.min(2, l.raw.length / 80);
      if (!best || sc > best.sc) best = {t:l.raw, i:m.index, n:m[0].length, word:l.raw.substr(m.index, m[0].length), sc, exp:!!l.exp};
    });
    return best;
  };
  const ctxAt = i => { const a = Math.max(O.lastIndexOf("\n", i) + 1, i - 70), b0 = O.indexOf("\n", i), b = Math.min(b0 < 0 ? O.length : b0, i + 90); return (a > O.lastIndexOf("\n", i) + 1 ? "…" : "") + offer.slice(a, b).trim().replace(/^[-•●▪◦*–·✓✔>]+\s*/, "") + (b < (b0 < 0 ? O.length : b0) ? "…" : ""); };
  const lineAt = i => { const a = O.lastIndexOf("\n", i) + 1, b = O.indexOf("\n", i); return O.slice(a, b < 0 ? O.length : b); };
  const clauseAt = i => { const l = O.slice(0, i).search(/[^,;.\n:]*$/), m = O.slice(i).search(/[,;.\n]/); return O.slice(l, m < 0 ? O.length : i + m); };
  const MUST = LX("must", /indispensable|exige|obligatoire|imperati|requis|\brequired\b|essential|mandatory|must have/), NICE = LX("nice", /apprecie|un plus|souhait|serait un|idealement|atout|desirable|preferred|nice to have|a plus\b|bonus|ideally|advantage/);
  const weight = i => { const l = clauseAt(i); return MUST.test(l) ? "must" : NICE.test(l) ? "nice" : ""; };
  const out = [];

  // Points du lexique
  LEX.forEach(d => {
    const mo = O.match(d.o); if (!mo) return;
    const offerWord = offer.substr(mo.index, mo[0].length);
    let st = "no", cvWord = "";
    const pe = bestLine(body.filter(l => l.exp), d), pa = pe || bestLine(body, d);
    if (pe) st = "ok"; else if (pa) st = (d.type === "l" || d.type === "h") ? "ok" : "mid";
    if (pa) cvWord = pa.word;
    out.push({k:d.k, type:d.type, ex:d.ex, st, pos:mo.index, prio:weight(mo.index), offerWord, offerCtx:ctxAt(mo.index), cvWord, proof:pa, re:d.c, broad:d.broad});
  });

  // Années d'expérience demandées
  const my = O.match(L10N?.re?.years ? new RegExp(L10N.re.years) : /(\d{1,2})\s*(?:a|à)?\s*\d{0,2}\s*ans? (?:minimum )?(?:d'|d’|de )?experience|experience (?:de |d'au moins |minimum (?:de )?)?(\d{1,2}) ans?|(\d{1,2})\+?\s*(?:years?|yrs?)(?:'|’)?\s*(?:of\s+)?(?:[a-z-]+\s+){0,3}?experience|at least (\d{1,2}) years?|experience of (\d{1,2})\+? years?/);
  if (my) {
    const need = +(my[1] || my[2] || my[3] || my[4] || my[5]), have = cvYears(allTxt);
    out.push({k: need > 1 ? tr(`${need} ans d'expérience`, `${need} years of experience`) : tr("1 an d'expérience", "1 year of experience"), type:"y", st: have === null ? "mid" : have >= need ? "ok" : "no", pos:my.index, prio:weight(my.index), need, have, offerCtx:ctxAt(my.index)});
  }

  // Diplôme demandé
  const md = O.match(DIPLOMA);
  if (md && !out.some(r => r.type === "l" && /dipl/i.test(r.k))) {
    const w = offer.substr(md.index, md[0].length), base = fold(w).replace(/\s/g, "");
    const pat = fold(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s*");
    const inCv = new RegExp("\\b" + pat + "\\b").test(A) || (base.startsWith("bac") && /\b(bac|bts|dut|but|licence|master)\b/.test(A));
    const dre = new RegExp("\\b(" + base.slice(0, 3) + "\\w*)"), dl = inCv && bestLine(body.filter(l => l.kind === "edu").concat(body), {o:dre, c:dre});
    out.push({k: /^dipl/i.test(fold(w)) ? cap(w) : LANG === "fr" ? `Diplôme : ${w.toUpperCase()}` : tr(`Diplôme : ${w.length > 4 ? cap(w) : w.toUpperCase()}`, `Qualification: ${w.length > 4 ? cap(w) : w.toUpperCase()}`), type:"d", word:w, st: inCv ? "ok" : "no", pos:md.index, prio:weight(md.index), offerWord:w, offerCtx:ctxAt(md.index), proof:dl || null, re:dre});
  }

  // Lignes à puces de l'offre que le lexique ne connaît pas : on compare leurs mots importants
  // Sans puces (annonce copiée d'un site), on prend les lignes courtes qui se suivent : c'est une liste.
  let generic = 0;
  const BUL = /^\s*[-•●▪◦*–·✓✔>]/, rows = offer.split("\n"), useBullets = rows.filter(l => BUL.test(l)).length >= 3;
  const short = l => { const t = (l || "").trim(); return t.length >= 12 && t.length <= 160 && !/:\s*$/.test(t); };
  const listy = i => short(rows[i]) && (short(rows[i - 1]) || short(rows[i + 1]));
  rows.forEach((raw, idx) => {
    if (generic >= 15 || !(useBullets ? BUL.test(raw) : listy(idx))) return;
    const line = raw.replace(/^\s*[-•●▪◦*–·✓✔>]+\s*/, "").replace(/[.;]+$/, "").trim(), F = fold(line);
    if (line.length < 6 || line.length > 120 || NOT_SKILL.test(F) || LEX.some(d => d.o.test(F)) || (L10N?.re?.yearsWord ? new RegExp(String.raw`\d+\+?\s*(ans?|years?|${L10N.re.yearsWord})\b`) : /\d+\+?\s*(ans?|years?)\b/).test(F) || DIPLOMA.test(F)) return;
    const tk = tokens(line); if (tk.length < 1) return;
    const hits = T => { const ws = T.split(/[^a-z0-9+#]+/); return tk.filter(w => synOf(w).some(v => ws.some(x => x.startsWith(v)))); };
    const se = hits(E).length / tk.length, sa = hits(A).length / tk.length;
    const st = se >= .6 ? "ok" : sa >= .6 ? "mid" : "no";
    // Preuve : la ligne du CV qui partage le plus de mots avec cette ligne de l'offre
    let proof = null;
    if (st !== "no") body.filter(l => st !== "ok" || l.exp).forEach(l => {
      const F2 = fold(l.raw), h = hits(F2); if (!h.length || (proof && h.length <= proof.sc)) return;
      const ws = h.flatMap(synOf), m = F2.split(/[^a-z0-9+#]+/).find(x => x.length >= 3 && ws.some(v => x.startsWith(v))), i = m ? F2.search(new RegExp("\\b" + m)) : 0;
      proof = {t:l.raw, i:Math.max(0, i), n:m ? m.length : 0, sc:h.length, exp:!!l.exp};
    });
    const pos = O.indexOf(F);
    out.push({k: cap(line.length > 70 ? line.slice(0, 67).replace(/\s\S*$/, "") + "…" : line), type:"x", st, pos: pos < 0 ? 1e6 + idx : pos, prio:weight(Math.max(0, pos)), tk, found:hits(A), offerCtx:line, proof});
    generic++;
  });

  // Mots différents entre CV et offre (ex : CV « caissière », offre « hôte de caisse »)
  out.forEach(r => {
    if (r.st === "no" || !r.cvWord || !r.offerWord || r.type === "s" || r.type === "h" || r.broad) return;
    const a = fold(r.offerWord), b = fold(r.cvWord);
    if (a !== b && !a.includes(b.slice(0, 5)) && !b.includes(a.slice(0, 5))) r.vocab = {offer:r.offerWord, cv:r.cvWord};
  });

  out.sort((a, b) => a.pos - b.pos);
  out.forEach(r => { r.auto = r.st; if (over[r.k] && over[r.k] !== "skip") { r.st = over[r.k]; r.manual = true; } });
  out.forEach(r => {
    const f = fixes[r.k];
    r.fixedNow = f?.state === "accepted";
    if (r.fixedNow) r.st = "ok";
    if (r.type !== "y" && (r.st !== "ok" || r.fixedNow)) r.fix = f?.fix && (f.state === "accepted" || f.state === "skipped") ? f.fix : makeFix(r);
  });
  skipped = out.filter(r => over[r.k] === "skip");
  return out.filter(r => over[r.k] !== "skip");
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
  const phone = /(\+33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/.test(t) || (LANG !== "fr" && /(\+\d{1,3}[\s.-]?)?\(?\d{2,5}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/.test(t));
  return [
    {ok: !img, label: img ? tr("Ton CV est une image", "Your CV is an image") : tr("Ton CV contient du vrai texte", "Your CV contains real text"), help: img ? tr("Beaucoup de logiciels de tri ne lisent pas les images. Envoie plutôt un PDF enregistré depuis Word ou Google Docs.", "Many screening tools cannot read images. Send a PDF saved from Word or Google Docs instead.") : tr("Les logiciels de tri peuvent le lire.", "Screening tools can read it.")},
    {ok: /[\w.+-]+@[\w-]+\.[a-z.]{2,}/i.test(t), label: tr("Adresse email", "Email address"), help: tr("Mets ton email en haut du CV, en texte (pas dans une image).", "Put your email at the top of your CV, as text (not in an image).")},
    {ok: phone, label: tr("Numéro de téléphone", "Phone number"), help: tr("Ajoute ton numéro en haut du CV, au format 06 12 34 56 78.", "Add your phone number at the top of your CV.")},
    {ok: has("exp"), label: tr("Titre « Expériences »", "\"Experience\" heading"), help: tr("Écris un titre clair « Expériences professionnelles » au-dessus de tes postes.", "Write a clear \"Work experience\" heading above your jobs.")},
    {ok: has("skills"), label: tr("Titre « Compétences »", "\"Skills\" heading"), help: tr("Ajoute une rubrique « Compétences » avec les mots de l'offre.", "Add a \"Skills\" section with the words from the offer.")},
    {ok: has("edu"), label: tr("Titre « Formation »", "\"Education\" heading"), help: tr("Ajoute une rubrique « Formation » avec tes diplômes, même s'il n'y en a qu'un.", "Add an \"Education\" section with your qualifications, even if there is only one.")},
    {ok: expDated, label: tr("Dates sur tes expériences", "Dates on your jobs"), help: tr("Mets les années de début et de fin de chaque poste (ex : 2022 - 2025).", "Give the start and end year of each job (e.g. 2022 - 2025).")},
    {ok: w >= 120 && w <= 1000, label: w < 120 ? tr("CV un peu court", "CV a bit short") : w > 1000 ? tr("CV très long", "Very long CV") : tr("Longueur correcte", "Good length"), help: w < 120 ? tr("Détaille un peu plus tes expériences : ce que tu faisais, avec des chiffres.", "Say a bit more about your jobs: what you did, with numbers.") : tr("Garde l'essentiel sur 1 ou 2 pages.", "Keep it to 1 or 2 pages.")},
    {ok: !/[\uf000-\uf8ff]|□|�/.test(t), label: tr("Pas de caractères bizarres", "No odd characters"), help: tr("Certains symboles ou icônes ne sont pas lus. Remplace-les par du texte (ex : « Tél : »).", "Some symbols or icons cannot be read. Replace them with text (e.g. \"Phone:\").")}
  ];
}

/* ---------- Nettoyage d'une annonce copiée depuis un site (France Travail, Indeed, LinkedIn…) ----------
   On retire seulement les lignes courtes qui sont des boutons, menus ou mentions du site. */
const JUNK = new RegExp("^(" + [
  "accueil", "menu", "rechercher?", "recherche avancee", "se connecter", "connexion", "s'inscrire", "inscription", "mon compte", "mon espace",
  "creer (un compte|une alerte|mon cv)", "postuler( maintenant| a cette offre| sur le site de l'entreprise)?", "candidater", "je postule",
  "candidature (simplifiee|facile|rapide)", "postulez (facilement|en 1 clic)", "sauvegarder( l'offre)?", "enregistrer( l'offre)?", "partager( l'offre)?",
  "imprimer( l'offre)?", "signaler( l'offre| cette offre| un probleme)?", "voir (plus|moins|l'offre|toutes les offres|le profil|l'entreprise)",
  "afficher (plus|moins)", "lire la suite", "retour( aux resultats| a la liste)?", "retour en haut", "offres? similaires?", "offres? proches?",
  "vous pourriez aussi aimer", "a propos de (nous|l'entreprise)", "mentions legales", "politique de confidentialite", "conditions generales.*",
  "plan du site", "aide", "faq", "contact", "nous contacter", "telecharger l'application", "suivez-nous.*", "cookies?.*", "(tout )?accepter.*",
  "(tout )?refuser.*", "parametrer.*cookies.*", "gerer (mes|les) (choix|cookies).*", "©.*", "copyright.*", "tous droits reserves.*",
  "publie (il y a|le|aujourd'hui|hier).*", "(mis a jour|actualise) (le|il y a).*", "il y a \\d+ (minutes?|heures?|jours?|mois)", "aujourd'hui", "hier",
  "offre n° ?\\w+", "offre (numero|no) ?\\w+", "reference ?:? ?[\\w-]+", "ref ?:? ?[\\w-]+", "\\d+ candidat(ure)?s?.*", "nouveau", "nouvelle offre", "urgent",
  "france travail", "pole emploi", "indeed", "linkedin", "hellowork", "welcome to the jungle", "apec", "meteojob", "jobteaser", "monster",
  "vous etes (recruteur|employeur).*", "espace (recruteur|employeur|candidat)", "employeurs?", "candidats?", "page \\d+( sur \\d+)?", "suivant", "precedent",
  "\\d+ ?/ ?\\d+", "[^a-z0-9]+",
  // English job sites
  "apply( now)?", "easy apply", "save( job)?", "share", "report( job)?", "sign in", "log in", "show (more|less)", "see more", "similar jobs",
  "posted \\d+ \\w+ ago", "\\d+ applicants?", "accept( all)?( cookies)?", "reject all", "privacy policy", "terms.*"
].concat(L10N?.junk || []).join("|") + ")[ .!:…]*$");
function cleanOffer(text){
  const kept = [], removed = [];
  String(text).replace(/\r/g, "").split("\n").forEach(l => {
    const t = l.trim(), F = fold(t);
    if (t && t.length <= 60 && JUNK.test(F)) removed.push(t); else kept.push(l.replace(/\s+$/, ""));
  });
  return {text: kept.join("\n").replace(/\n{3,}/g, "\n\n").trim(), removed};
}

/* ---------- L'annonce en bref : salaire, contrat, lieu… et signaux douteux ---------- */
const AD_FACTS = [
  ["salary", tr("Salaire", "Salary"), /(\d[\d\s.,]*\s?(k ?€|€|euros?|k£|£|\$)\s?(brut|net|gross)?\s?(\/|par|per|a)?\s?(mois|an|annuel|heure|h|jour|semaine|month|year|annum|hour|day|week)?|(£|\$|€)\s?\d[\d,.]*k?(\s?(-|–|à|to)\s?(£|\$|€)?\s?\d[\d,.]*k?)?(\s?(per|a|\/)\s?(hour|year|annum|month|an|mois))?|\bsmic\b|selon (profil|experience|convention)|a negocier|salaire attractif|competitive salary)/],
  ["contract", tr("Contrat", "Contract"), /\b(cdi|cdd( de \d+ mois)?|interim(aire)?|alternance|apprentissage|contrat pro\w*|stage|freelance|saisonnier|vacation|permanent( role| contract| position)?|fixed[- ]term|temporary|internship|apprenticeship|zero[- ]hours?)\b/],
  ["hours", tr("Temps de travail", "Hours"), /(\d{2}(,\d)? ?h(eures)?( hebdo\w*| ?(\/|par) ?semaine)?\b|temps (plein|partiel)|full[- ]time|part[- ]time|\d{2} hours? (a|per) week)/],
  ["remote", tr("Télétravail", "Remote work"), /(teletravail|full remote|remote|hybride|hybrid|work from home)/],
  ["start", tr("Début", "Start"), /(des que possible|des maintenant|poste a pourvoir (immediatement|des que possible|le [^\n,.]{3,20})|prise de poste (le |en )?[^\n,.]{3,20}|asap|immediate start|start date:? [^\n,.]{3,20})/]
];
const AD_FLAGS = [
  ["pay", "red", tr("On te demande de payer", "You are asked to pay"), tr("Une vraie entreprise ne fait jamais payer pour postuler, pour une formation obligatoire ou pour un « kit ».", "A real employer never charges you to apply, for compulsory training or for a \"kit\"."),
    /((frais|droits?) (d'inscription|de dossier|de formation)|payer (une|des|vos|votre|la|le) (formation|frais|inscription|kit|caution|materiel)|paiement (prealable|d'avance)|kit de demarrage|achat (d'un |du )?kit|caution de|mandat cash|western union|carte (prepayee|pcs)|neosurf|transcash|registration fee|pay (a|an|the|for) (fee|training|kit)|upfront (fee|payment)|starter kit)/],
  ["data", "red", tr("On te demande des données sensibles", "You are asked for sensitive data"), tr("Ne donne pas ton RIB, ta carte Vitale ou une copie de pièce d'identité avant d'avoir signé un contrat.", "Do not give your bank details, social security number or ID copy before signing a contract."),
    /((coordonnees|informations) bancaires|\brib\b|\biban\b|numero de securite sociale|carte vitale|copie (de votre |de la |d'une )?(piece d'identite|carte d'identite|passeport)|bank (details|account number)|social security number|national insurance number|passport copy|copy of your (id|passport))/],
  ["chat", "amber", tr("Contact par messagerie seulement", "Contact through a messaging app only"), tr("Les arnaques passent souvent par WhatsApp ou Telegram. Cherche le site et l'adresse de l'entreprise.", "Scams often go through WhatsApp or Telegram. Look up the company's website and address."),
    /\b(whatsapp|telegram|snapchat|messenger)\b/],
  ["tooGood", "red", tr("Trop beau pour être vrai", "Too good to be true"), tr("Des gains élevés et rapides sans expérience, c'est le signe classique d'une arnaque.", "High, quick earnings with no experience are a classic sign of a scam."),
    /((gagne[rz]?|gains?|revenus?) (jusqu'a |de |plus de )?\d[\d\s]*\s?(€|euros?) (par|\/) ?(jour|semaine)|argent facile|revenus? (illimites|garantis)|earn (up to )?(£|\$|€)?\d[\d,]* (a|per) (day|week)|easy money|guaranteed income)/],
  ["mlm", "amber", tr("Vente à domicile ou parrainage", "Home selling or recruiting others"), tr("Vérifie que tu seras salarié(e) avec un vrai contrat, et pas payé(e) seulement à la commission.", "Check you will be an employee with a real contract, not paid only on commission."),
    /(devenez (votre propre patron|independant|ambassadeur)|marketing de reseau|vente directe|parrain(age|er)|be your own boss|network marketing|commission only)/],
  ["mail", "amber", tr("Adresse email personnelle", "Personal email address"), tr("Une adresse Gmail, Hotmail ou Yahoo pour une entreprise : vérifie qu'elle existe vraiment (site, SIRET, avis).", "A Gmail, Hotmail or Yahoo address for a company: check it really exists (website, company number, reviews)."),
    /[\w.+-]+@(gmail|hotmail|yahoo|outlook|live|aol|laposte|orange|free|sfr|wanadoo)\.[a-z.]+/]
];
function adCheck(text){
  const t = String(text || ""), F = fold(t), facts = [], missing = [], flags = [];
  AD_FACTS.forEach(([id, label, re]) => {
    const m = F.match(LX("ad_" + id, re));
    if (m) facts.push({id, label, v: t.substr(m.index, m[0].length).trim().replace(/\s+/g, " ").replace(/[,.;:]$/, "")});
    else if (id !== "remote" && id !== "start") missing.push({id, label});
  });
  // Lieu : « Lieu : Caen », « Location: Leeds », ou le dernier morceau du titre (« Vendeur – CDI – Caen »)
  const ml = t.match(new RegExp(String.raw`(?:^|\n)\s*(?:lieu(?: de travail)?|localisation|location|ville|based in|bas[ée] [àa]${L10N?.re?.place ? "|" + L10N.re.place : ""})\s*:?\s*([^\n,;]{2,40})`, "i"));
  let place = ml ? ml[1].trim() : "";
  if (!place) {
    const parts = (t.split("\n").find(l => l.trim()) || "").split(/\s+[–—-]\s+|\s+\|\s+/).slice(1).map(x => x.replace(/\s*\([^)]*\)/g, "").trim());
    place = parts.reverse().find(x => /^[A-ZÉÈÀÂ][\p{L}' -]{1,30}$/u.test(x) && !/^(cdi|cdd|stage|alternance|interim|freelance)$/i.test(fold(x)) && !/exemple|sample/i.test(x)) || "";
  }
  if (place) facts.splice(2, 0, {id: "place", label: tr("Lieu", "Location"), v: place}); else missing.push({id: "place", label: tr("Lieu", "Location")});
  AD_FLAGS.forEach(([id, level, label, why, re]) => { const m = F.match(LX("flag_" + id, re)); if (m) flags.push({id, level, label, why, v: t.substr(m.index, m[0].length)}); });
  return {facts, missing, flags};
}

/* ---------- Relecture du CV : fautes fréquentes, verbes faibles, phrases longues, chiffres ---------- */
const TYPOS_FR = {acceuil: "accueil", acceuillir: "accueillir", acceuilli: "accueilli", dévelopement: "développement", dévellopement: "développement", developement: "développement", parmis: "parmi", malgrés: "malgré", courrament: "couramment", professionel: "professionnel", professionelle: "professionnelle", professionels: "professionnels", professionelles: "professionnelles", personel: "personnel", addresse: "adresse", experiance: "expérience", expèrience: "expérience", éxpérience: "expérience", compétance: "compétence", competance: "compétence", compétances: "compétences", responsabilitée: "responsabilité", disponibilitée: "disponibilité", rigeur: "rigueur", comercial: "commercial", comerciale: "commerciale", dévelopeur: "développeur", developpeur: "développeur", reconaissance: "reconnaissance", envirronement: "environnement", environement: "environnement", maintenace: "maintenance", maîtrisse: "maîtrise", maitrisse: "maîtrise", informatiqe: "informatique", coordonées: "coordonnées", quotidient: "quotidien", bureautiqe: "bureautique", éffectué: "effectué", éfficace: "efficace", gestionaire: "gestionnaire", polyvalance: "polyvalence", autonomme: "autonome", dynamiqe: "dynamique", entousiaste: "enthousiaste", vendeure: "vendeuse", magazin: "magasin", ordinnateur: "ordinateur", connaisance: "connaissance", connaisances: "connaissances"};
const TYPOS_EN = {recieve: "receive", recieved: "received", managment: "management", experiance: "experience", responsable: "responsible", acheive: "achieve", acheived: "achieved", seperate: "separate", enviroment: "environment", sucessful: "successful", succesful: "successful", comunication: "communication", communcation: "communication", maintainance: "maintenance", mantain: "maintain", profesional: "professional", proffesional: "professional", knowlege: "knowledge", adress: "address", oportunity: "opportunity", independant: "independent", definately: "definitely", custumer: "customer", costumer: "customer", untill: "until", begining: "beginning", calender: "calendar", occured: "occurred", relevent: "relevant"};
const WEAK_FR = /\b(participer a|participation a|aider a|aide a la|s'occuper de|occupe(e)? de|etre en charge de|en charge de|charge(e)? de|diverses taches|taches diverses|differentes taches|etc\.?)(?=\W|$)/;
const WEAK_EN = /\b(responsible for|helped (to|with)|involved in|worked on|duties included|various tasks|assisted with|etc\.?)(?=\W|$)/;
function cvCheck(text){
  const t = String(text || ""), out = [];
  const words = fold(t).split(/[^a-z']+/), en = words.filter(w => /^(the|and|with|for|of|to|in)$/.test(w)).length > words.filter(w => /^(le|la|les|et|des|du|de|pour)$/.test(w)).length;
  const own = !!L10N && !en, typos = own ? L10N.typos || {} : en ? TYPOS_EN : TYPOS_FR;
  Object.entries(typos).forEach(([bad, good]) => {
    const re = new RegExp(`(^|[^\\p{L}])(${bad})(?=[^\\p{L}]|$)`, "iu"), m = t.match(re);
    if (m) { const w = m[2], to = w[0] === w[0].toUpperCase() ? good.charAt(0).toUpperCase() + good.slice(1) : good; out.push({id: "typo:" + bad, type: "typo", word: w, to, msg: tr(`« ${w} » s'écrit « ${to} »`, `"${w}" is spelt "${to}"`)}); }
  });
  const cv = parseCV(t), weakRe = own ? (L10N.re?.weak ? new RegExp(L10N.re.weak) : /$^/) : en ? WEAK_EN : WEAK_FR;
  let weak = 0, nonum = 0, long = 0;
  cv.filter(l => l.t && !l.name).forEach(l => {
    const F = fold(l.t), mw = F.match(weakRe);
    if (mw && weak < 3) { weak++; out.push({id: "weak:" + l.id, type: "weak", line: l.t, word: l.t.substr(mw.index, mw[0].length), msg: tr(`« ${l.t.substr(mw.index, mw[0].length)} » ne dit pas ce que tu as fait toi-même. Préfère un verbe d'action : « organisé », « géré », « préparé », « vendu »…`, `"${l.t.substr(mw.index, mw[0].length)}" does not say what you did yourself. Use an action verb: "organised", "managed", "prepared", "sold"…`)}); }
    l.t.split(/(?<=[.;!?])\s+/).forEach(sn => { const n = sn.split(/\s+/).length; if (n > 32 && long < 2) { long++; out.push({id: "long:" + l.id + ":" + long, type: "long", line: sn, msg: tr(`Phrase de ${n} mots : coupe-la en deux, un recruteur lit vite.`, `A ${n}-word sentence: split it in two, recruiters read fast.`)}); } });
    if (l.exp && l.t.split(/\s+/).length >= 8 && !/\d/.test(l.t.replace(/\b(19|20)\d\d\b/g, "")) && nonum < 3) { nonum++; out.push({id: "num:" + l.id, type: "nonum", line: l.t, msg: tr("Aucun chiffre ici : ajoute combien (clients, commandes, personnes, euros) ou pendant combien de temps.", "No number here: add how many (customers, orders, people, money) or for how long.")}); }
  });
  const je = (fold(t).match(en ? /\bi\b/g : /\b(je|j')\b/g) || []).length;
  if (!en && !own && LANG === "fr" && je >= 3) out.push({id: "je", type: "style", msg: tr(`« Je » revient ${je} fois. Dans un CV, commence plutôt par le verbe : « Préparé 120 commandes par jour ».`, "")});
  return out;
}
