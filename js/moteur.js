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
const LX = (k, base) => L10N?.re?.[k] ? new RegExp(`(?:${L10N.re[k]})|(?:${base.source})`, base.flags) : base;

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
  "Livraison": ["Delivery", "parcel deliver\\w*|deliver(ing|y of) (parcels|goods|orders)|delivery driver|multi-drop", "100 parcels a day", "deliver\\w*|parcels?|multi-drop|rounds?"],
  "Conduite de véhicule": ["Driving", "\\bdriver\\b|driving (a |the )?(van|vehicle|lorry|truck)|\\bhgv\\b|van driver", "daily rounds across the city", "driv\\w*|deliver\\w*|\\bvan\\b|lorry|truck"],
  "Machines de nettoyage": ["Cleaning machines", "scrubber[- ]dryers?|floor (scrubbers?|polishers?|machines?)|rotary (scrubbers?|machines?)", "scrubber-dryer on 2,000 m²"],
  "CRM": ["CRM", "\\bcrm\\b", "tracking 150 clients in Salesforce"],
  "Git": ["Git", "\\bgit\\b", "branches and code reviews in a team"],
  "Docker": ["Docker", "containers?", "containers for 3 applications"],
  "Manutention": ["Manual handling", "manual handling|heavy lifting|loading and unloading|loading (the )?(van|vehicle|lorry|truck)s?", "loading trucks"],
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
  "Accueil téléphonique": ["Phone handling", "(answering|handling) (the )?(phone|telephone|calls)|switchboard|telephone (answering|enquiries|duties)|phone calls", "50 calls a day", "phone|calls|switchboard|telephone"],
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
  "Recrutement": ["Recruitment", "(?<![@.\\w-])recruit(ing|ment)\\b(?![@.\\w-]*\\.[a-z])(?! (agency|consultancy|firm|for (our|a|an) client))|hiring (managers|process)|talent acquisition", "20 hires a year"],
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
  "Gestion des incidents (ITIL)": ["Incident management (ITIL)", "incident management|service desk|\\btickets?\\b(?! (restaurants?|resto|repas|cheques?))", "30 tickets a day", "incidents?|tickets?|service desk|support"],
  "Comptes et droits d'accès": ["User accounts and access", "user accounts?|access (rights|control|management)|permissions|identity management", "accounts and rights for 300 users", "accounts?|access|permissions|active directory|entra|\\bmfa\\b"],
  "Déploiement de logiciels": ["Software deployment", "deploy\\w* (software|applications|devices|laptops)|software (deployment|rollout)|roll-?out|imaging", "300 laptops deployed", "deploy\\w*|roll-?out|intune|imaging"],
  "Gestion de parc": ["IT asset management", "(it )?asset management|hardware inventory|device fleet", "fleet of 500 devices"],
  "Documentation technique": ["Technical documentation", "(technical )?documentation|knowledge base", "procedures for the support team", "documentation|procedures?|knowledge base|wiki"],
  "Veille technologique": ["Technology watch", "technology watch|tech watch|keep(ing)? up to date with (new )?(technolog\\w*|tools|trends|security)", "weekly security watch"],
  "Relation avec les prestataires": ["Vendor management", "vendors?|suppliers?|contractors?|third[- ]part(y|ies)|service providers?", "10 suppliers managed"],
  "Politique de sécurité (PSSI)": ["Security policy", "(information )?security polic(y|ies)|\\bisms\\b", "wrote the security policy", "security polic(y|ies)|\\bisms\\b|nis ?2"],
  "Conformité (RGPD, NIS2…)": ["Compliance (GDPR, NIS2…)", "\\bgdpr\\b|compliance|soc ?2", "NIS2 compliance", "\\bgdpr\\b|compliance|nis ?2|iso ?27001|soc ?2"],
  "Sensibilisation des utilisateurs": ["Security awareness", "(security|cyber|user) awareness|awareness (training|sessions?|campaigns?)|phishing (training|simulations?)", "awareness training for 300 staff"],
  "Continuité d'activité (PCA/PRA)": ["Business continuity (BCP/DRP)", "business continuity|disaster recovery|\\bbcp\\b|\\bdrp\\b", "DRP tested every year"],
  "Gestion de crise": ["Crisis management", "crisis (management|situations?)|incident response", "crisis unit during a cyberattack"],
  "Transformation numérique": ["Digital transformation", "digital (transformation|tools)|digiti[sz]\\w*|digitali[sz]\\w*", "paperless invoicing", "digital|digiti[sz]\\w*|moderni[sz]\\w*"],
  "Python": ["Python", "python", "automation scripts"],
  "JavaScript": ["JavaScript", "javascript", "React website"],
  "HTML / CSS": ["HTML / CSS", "\\bhtml\\b", "responsive pages"],
  "SQL": ["SQL", "databases?", "queries on a customer database"],
  "Cloud": ["Cloud", "\\bcloud\\b", "move to Microsoft 365"],
  "Gestion de projet": ["Project management", "project (management|manager|lead\\w*)|manag(e|ing) projects|lead(ing)? projects", "6-month project, 3 people", "projects?"],
  "Management d'équipe": ["Team management", "team (lead\\w*|manag\\w*)|managing (a team|staff)|supervis(e|ing) (staff|a team)|line manag\\w*|(?<!\\b(the|a|an|your|our|to|by|with|un|une|par|du|le|la|votre|au|son|sa|notre) )\\bmanager\\b", "team of 5"],
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
  ["Manutention", "manutention|port de charges|charges lourdes|chargement|dechargement", "t", "chargement des camions"],
  ["Livraison", "livraisons? (de |des |aux |chez )?(colis|marchandises|clients|particuliers|repas|produits|commandes|plis)|\\blivreu(r|se)s?\\b|tournees? de livraison", "t", "tournées de 100 colis par jour", "livr\\w*|tournees?|\\bcolis\\b"],
  ["Conduite de véhicule", "chauffeur|conduct(eur|rice)|conduite (de |d'un |d'une |du |des )?(vehicules?|camions?|poids lourds?|utilitaires?|bus|cars?|fourgons?)|\\bvl\\b|\\bspl\\b", "t", "tournées sur la métropole", "chauff\\w*|conduc\\w*|conduite|livr\\w*|tournees?|camion|fourgon"],
  // Vente, commerce
  ["Encaissement", "encaiss\\w*|tenue de (la )?caisse|caissier|caissiere|hote(sse)? de caisse|\\bcaisse\\b", "t", "jusqu'à 300 clients par jour"],
  ["Accueil des clients", "accueil (des |de la )?(clients?|clientele|public|patients|visiteurs)|accueillir (les |la )?(clients?|clientele|public)|accueil physique", "t", "accueil de 80 clients par jour", "accueil|accueill"],
  ["Conseil client", "conseil(ler)? (les |la )?(clients?|clientele)|conseil clientele|vendeu(r|se) conseil|conseill(er|ere) de vente", "t", "conseil sur les produits frais", "conseil"],
  ["Vente", "\\bvente\\b|\\bvendre\\b|vendeu(r|se)|objectifs (de vente|commerciaux)|(developper|augmenter|realiser|atteindre) (le |son |un |du |votre )?chiffre d'affaires", "t", "objectif mensuel atteint 10 mois sur 12", "vente|vendu|vendeu|vendre"],
  ["Mise en rayon", "mise en rayon|mettre en rayon|reassort|facing|balisage|merchandising", "t", "rayon frais chaque matin"],
  ["Relation client", "relation client|service client|satisfaction client|fidelis\\w*|reclamations?|litiges?|retours? clients?", "t", "traitement des réclamations"],
  ["Prospection", "prospection|prospecter|demarchage|nouveaux clients", "t", "20 nouveaux clients en un an"],
  ["Négociation", "negoci\\w*", "t", "négociation avec 15 fournisseurs"],
  ["CRM", "\\bcrm\\b|salesforce|hubspot|zoho", "o", "suivi de 150 clients dans Salesforce"],
  // Aide à la personne, santé, enfance
  ["Accompagnement des personnes âgées", "personnes? agees|seniors?|ehpad|personnes? dependantes|perte d'autonomie", "t", "6 personnes suivies chaque semaine"],
  ["Aide à domicile", "aide a domicile|auxiliaire de vie|aide menager\\w*|\\badvf\\b|\\bdeavs\\b|\\baes\\b", "t", "interventions chez 6 personnes"],
  ["Aide à la toilette", "aide a la toilette|\\btoilette\\b|soins d'hygiene|aide au lever|aide au coucher", "t", "aide au lever et à la toilette"],
  ["Préparation des repas", "preparation des repas|aide (aux|au) repas|confection des repas|\\b(aux|des|les) repas\\b", "t", "repas pour 4 personnes"],
  ["Garde d'enfants", "garde d'enfants|petite enfance|creche|periscolaire|assistante? maternelle|cap aepe|animat(eur|rice)", "t", "garde de 3 enfants de 2 à 8 ans"],
  ["Diplôme d'aide-soignant", "(?<!\\b(les|des|aux|avec|equipe|l'equipe|d'un|d'une|un|une|du|le|la|l')\\s?)aides?[- ]soignant\\w*|\\bdeas\\b", "l", "obtenu en 2021"],
  ["Soins infirmiers", "soins infirmiers|(?<!\\b(les|des|aux|avec|equipe|l'equipe|d'un|d'une|un|une|du|le|la|cadre) )infirmi(er|ere)s?\\b|\\bide\\b", "l", "diplôme d'État 2019"],
  // Restauration, hôtellerie, propreté
  ["Service en salle", "service en salle|\\bserveuse\\b|\\bserveur ?(\\/|\\()|serveur de restaurant|serveur en (salle|restauration)|prise de commandes? en salle|service au plateau|chef de rang|\\brunner\\b", "t", "service de 60 couverts"],
  ["Cuisine", "\\bcuisine\\b|cuisinier|cuisiniere|\\bcommis\\b|mise en place (en cuisine|des plats)|preparation culinaire|(preparation|realisation) (des |de )?(entrees|plats|desserts)", "t", "mise en place pour 80 couverts"],
  ["Règles d'hygiène (HACCP)", "haccp|hygiene alimentaire|normes d'hygiene|regles d'hygiene", "l", "formation HACCP 2022"],
  ["Plonge", "\\bplonge\\b|plongeu(r|se)|vaisselle", "t", "plonge pour 100 couverts"],
  ["Bar", "\\bbar\\b(?! et salle| a disposition)|barman|barmaid|barista|cocktails?", "t", "préparation des boissons chaudes"],
  ["Réception hôtelière", "reception hoteliere|receptionniste|check[- ]?in|reservations?", "t", "accueil et réservations, 40 chambres"],
  ["Entretien et nettoyage", "menage|nettoyage|entretien (des locaux|du logement|de la maison|du domicile|du linge|des bureaux)|agent d'entretien|proprete|bionettoyage", "t", "entretien de 800 m² de bureaux"],
  ["Machines de nettoyage", "auto-?laveuses?|monobrosses?|injecteurs?[- ]extracteurs?|machines? de nettoyage", "o", "autolaveuse sur 2 000 m²"],
  // BTP, industrie, technique
  ["Lecture de plans", "lecture (de |des )?plans?|lire (un |des |les )?plans?|plans techniques", "o", "plans d'exécution sur chantier"],
  ["Habilitation électrique", "habilitations? electriques?|\\bb0\\b|\\bh0v?\\b|\\bbr\\b|\\bb1v?\\b|\\bb2v?\\b", "l", "B1V, 2024"],
  ["Électricité", "electricit\\w*|electricien|cablage|tableaux? electriques?|installations? electriques?", "t", "câblage de tableaux électriques"],
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
  ["Accueil téléphonique", "accueil (physique et )?telephonique|standard telephonique|standardiste|appels? telephoniques?|au telephone", "t", "50 appels par jour", "telephon|standard|appels?"],
  ["Pack Office", "pack office|microsoft office|suite office|office 365|microsoft 365|\\bword\\b|powerpoint|outlook", "o", "courriers sur Word, mails sur Outlook"],
  ["Excel", "\\bexcel\\b|tableur", "o", "tableau de suivi des commandes"],
  ["Outils informatiques", "outils? informatiques?|bureautique|maitrise de l'informatique", "o", "Word, mails, tableaux simples", "informatique|bureautique|\\bword\\b|excel|tableur|office|ordinateur|logiciels?"],
  ["Saisie de données", "saisie|encodage", "t", "saisie des bons de livraison"],
  ["Gestion d'agenda", "gestion (de l'|d'|des |du )?(agendas?|plannings?)|prise de rendez-vous|rendez-vous", "t", "agenda de 3 médecins"],
  ["Rédaction de courriers", "courriers?|redaction de (courriers|lettres|comptes? rendus)|comptes? rendus?", "t", "courriers aux clients"],
  ["Facturation", "factur\\w*|devis|relances? (des |de )?(clients?|impayes|paiements?)", "t", "100 factures par mois"],
  ["Comptabilité", "comptab\\w*|rapprochement bancaire|ecritures comptables", "t", "saisie des écritures"],
  ["Paie", "\\bpaie\\b|bulletins? de salaire", "t", "paie de 40 salariés"],
  ["Classement et archivage", "classement|archiv\\w*|gestion documentaire", "t", "archivage des dossiers"],
  ["Logiciel de gestion (ERP)", "\\bsap\\b|\\berp\\b|\\bsage\\b|cegid|\\bebp\\b", "o", "SAP, commandes et stocks"],
  ["Recrutement", "(?<![@.\\w-])recrutements?\\b(?![@.\\w-]*\\.[a-z])(?! (pour|de notre client))(?<!(cabinet|agence|service|charge\\w*|responsable|equipe) (de |du )?recrutements?)|\\brecruter (les |des |de nouveaux |vos )?(collaborateurs|candidats|profils|salaries|interimaires|saisonniers|equipes?)|(?<!(service|direction|departement) (des )?)ressources humaines|entretiens? d'embauche", "t", "20 recrutements par an"],
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
  ["Supervision", "supervision (des |du |de la |de l')?(reseaux?|systemes?|infra\\w*|serveurs?|equipements?|parc|sauvegardes?|si\\b)|supervis\\w* (les |des |l')?(reseaux?|systemes?|infra\\w*|serveurs?|equipements?)|outils? de supervision|monitoring|zabbix|centreon|nagios|\\bprtg\\b", "t", "supervision de 50 équipements"],
  ["Gestion des incidents (ITIL)", "\\bitil\\b|\\bitsm\\b|gestion des incidents|incidents? (materiels|systemes|reseaux|informatiques)|\\btickets?\\b(?! (restaurants?|resto|repas|cheques?|de caisse))", "t", "30 tickets par jour", "\\bitil\\b|\\bitsm\\b|incidents?|tickets?|glpi|support"],
  ["Comptes et droits d'accès", "comptes? utilisateurs?|droits d'acces|controle d'acces|gestion des acces|habilitations? (informatiques|utilisateurs)", "t", "comptes et droits de 300 utilisateurs", "comptes? utilisateurs?|droits d'acces|controle d'acces|active directory|entra|\\bgpo\\b|\\bmfa\\b"],
  ["Déploiement de logiciels", "deploi\\w* (et faire evoluer )?(des |de |les )?(logiciels?|applications?|postes?|solutions?)|deployer (et faire evoluer )?(les |des )?(logiciels?|applications?)|intune|\\bsccm\\b|masteris\\w*", "t", "déploiement de 300 postes", "deploi\\w*|deployer|intune|\\bsccm\\b|masteris\\w*"],
  ["Gestion de parc", "gestion (de |du )?parc|parc informatique|\\bglpi\\b", "t", "parc de 500 postes"],
  ["Documentation technique", "documentation (technique|informatique)|redig\\w* (et maintenir )?(la )?documentation|procedures? techniques?", "t", "procédures pour l'équipe support", "documentation|procedures?|wiki"],
  ["Veille technologique", "veille (technologique|technique|informatique|securite|cyber\\w*|reglementaire)", "t", "veille sécurité chaque semaine"],
  ["Relation avec les prestataires", "prestataires?|editeurs? (de logiciels)?|fournisseurs?|sous-traitants?", "t", "suivi de 10 prestataires"],
  ["Politique de sécurité (PSSI)", "politique de (cyber)?securite|politiques de securite|\\bpssi\\b", "t", "rédaction de la PSSI", "politique de (cyber)?securite|politiques de securite|\\bpssi\\b|nis ?2|\\banssi\\b"],
  ["Conformité (RGPD, NIS2…)", "\\brgpd\\b|conformite (reglementaire|rgpd)|\\bhds\\b|nis ?2|iso ?27001", "l", "mise en conformité NIS2", "\\brgpd\\b|conformite|\\bhds\\b|nis ?2|iso ?27001"],
  ["Sensibilisation des utilisateurs", "sensibilis\\w* (des |les |aux |a la |de l'|l')?(utilisateurs|salaries|agents|collaborateurs|equipes|personnels?|securite|cyber\\w*|risques? (cyber|informatiques?)|phishing|hameconnage)", "t", "sensibilisation de 300 agents"],
  ["Continuité d'activité (PCA/PRA)", "\\bpca\\b|\\bpra\\b|continuite d'activite|reprise d'activite|plan de continuite", "t", "PRA testé chaque année"],
  ["Gestion de crise", "gestion (de |des )?(la )?crises?|situations? de crise|cellule de crise", "t", "cellule de crise lors d'une cyberattaque"],
  ["Transformation numérique", "transformation (numerique|digitale)|digitalisation|dematerialis\\w*|outils numeriques", "t", "dématérialisation des factures", "transformation (numerique|digitale)|digitalis\\w*|dematerialis\\w*|numerique|modernisation"],
  ["Python", "python", "o", "scripts d'automatisation"],
  ["JavaScript", "javascript|typescript|\\breact\\b|node\\.?js", "o", "site web en React"],
  ["HTML / CSS", "\\bhtml\\d?\\b|\\bcss\\d?\\b", "o", "pages web responsive"],
  ["SQL", "\\bsql\\b|mysql|postgre\\w*|bases? de donnees", "o", "requêtes sur une base clients"],
  ["Cloud", "\\bcloud\\b|\\bazure\\b|\\baws\\b", "o", "migration vers Microsoft 365"],
  ["Git", "\\bgit\\b|github|gitlab", "o", "branches et revues de code en équipe"],
  ["Docker", "docker|kubernetes|\\bk8s\\b|conteneur\\w*", "o", "conteneurs pour 3 applications"],
  ["Gestion de projet", "gestion de projets?|chefs? de projets?|pilot\\w* (de |des )?projets?|conduite de projets?|participer (aux|au) (deploiement des )?projets?|projets? informatiques?", "t", "projet de 6 mois, 3 personnes", "gestion de projets?|chefs? de projets?|pilot\\w* (de |des )?projets?|conduite de projets?|projets?"],
  ["Management d'équipe", "(?<!(stock|project|risk|asset|incident|identity|access|diary|calendar|time|crisis|server|change|records?|document|vendor|supplier|account|data|quality|des stocks|de projets?|de crise|de parc) )\\bmanagement\\b(?! (de|des|du) (stocks?|projets?|crise|parc|la qualite))|(?<!\\b(par|du|au|un|une|le|la|votre|son|sa|notre|avec|aupres du|rattache\\w* (au|a)) )(\\bmanag(er|eur)s?\\b|chef d'equipe|responsable d'equipe)|encadr(er|ement|ez)\\b|animer (une |l')equipe", "t", "équipe de 5 personnes"],
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
  ["Écoute", "ecoute|empathi\\w*|(?<!(manager|manageur|responsable|equipe|ambiance|cadre|environnement|accueil) )bienveillan\\w*", "s", "accompagnement de personnes âgées"],
  ["Discrétion", "discretion|discret(e)?\\b|confidentialite", "s", "dossiers médicaux"],
  ["Adaptabilité", "adaptabilite|capacite d'adaptation|s'adapter|flexibilite|flexible", "s", "changements de poste chaque semaine"],
  ["Communication", "qualites? de communication|bonne communication|aisance (a l'oral|orale)|expression ecrite|orthographe", "s", "compte rendu chaque semaine"],
  ["Anglais", "anglais|english|toeic|toefl", "g", "scolaire"],
  ["Espagnol", "espagnol", "g", "scolaire"],
  ["Allemand", "allemand", "g", "scolaire"],
  ["Horaires décalés", "horaires decales|2x8|3x8|travail de nuit|de nuit\\b|week-?ends?|dimanches?|samedis?|jours feries|astreintes?|en coupures?|travail en coupure|horaires coupes|roulement|repos (consecutifs|tournants?)|\\bdisponib\\w* (le |les |en |pour )?(soirs?|soirees?|matins?|nuits?|vacances)", "h", "", "horaires decales|2x8|3x8|nuit|week-?end|dimanche|samedi|coupure|soirs?\\b|ouverture|fermeture|[4-7] ?h\\b"],
  ["Premiers secours (SST)", "\\bsst\\b|sauveteur secouriste|premiers secours|\\bpsc ?1\\b", "l", "SST, 2023"],
  ["BAFA", "\\bbafa\\b|\\bbafd\\b", "l", "obtenu en 2022"]
].map(([k, o, type, ex, c]) => {
  const [ek, eo, eex, ec] = LEX_EN[k] || [k, "", ex];
  // Autre langue : [nom, motif, exemple, motif côté CV] dans L10N.lex, ajoutés aux motifs français et anglais
  const [xk, xo, xex, xc] = L10N?.lex?.[k] || [];
  let O2 = eo ? o + "|" + eo : o, C2 = (c || o) + (ec || eo ? "|" + (ec || eo) : "");
  if (xo) { O2 += "|" + xo; C2 += "|" + (xc || xo); }
  // L10N.lexOnly : points où les motifs français et anglais tombent à tort sur l'autre langue (« senior », « supervisione »)
  if (xo && L10N.lexOnly?.includes(k)) { O2 = xo; C2 = xc || xo; }
  return {k: LANG === "fr" ? k : xk || ek, id: k, o: new RegExp(O2), c: new RegExp(C2), type, ex: LANG === "fr" ? ex : xk ? xex : eex, broad: !!(c || ec || xc)};
});

/* ---------- Réécritures à trous, selon le type de point ---------- */
const ART = {s: tr("cette qualité", "this quality")};
function makeFix(r){
  // Ligne de l'offre reprise en entier (le nom affiché peut être coupé par « … »)
  const ex = r.ex ? tr(`ex : ${r.ex}`, `e.g. ${r.ex}`) : tr("ex : …", "e.g. …"), K = r.type === "x" && r.offerCtx ? cap(r.offerCtx) : r.k, k = KEEPCASE ? r.k : r.k.toLowerCase();
  const learn = tr("Pas grave. Si tu es prêt(e) à apprendre, dis-le dans ta lettre de motivation.", "No problem. If you are ready to learn, say so in your cover letter.");
  switch (r.type) {
    case "t": return r.st === "mid"
      ? {line:"exp", why:tr("C'est cité, mais aucune expérience ne le montre. Dis où tu l'as fait.", "It is mentioned, but no job shows it. Say where you did it."), tpl:tr(` ${K} : {où et combien ? ${ex}}.`, ` ${K}: {where and how much? ${ex}}.`)}
      : {line:"exp", ask:tr(`As-tu déjà fait ça : ${k} ?`, `Have you done this before: ${k}?`), tpl:tr(` ${K} : {où et combien ? ${ex}}.`, ` ${K}: {where and how much? ${ex}}.`), nope:learn};
    case "s": return {line:"exp", why: r.st === "mid" ? tr("Un mot seul ne prouve rien : ajoute un fait concret.", "A word alone proves nothing: add a real example.") : tr("L'offre le demande : prouve-le par un fait, pas par un adjectif.", "The offer asks for it: prove it with a fact, not an adjective."), tpl:tr(` ${K} : {un fait qui montre ${ART.s} ? ${ex}}.`, ` ${K}: {a fact that shows ${ART.s}? ${ex}}.`)};
    case "o": return r.st === "mid" && r.cvWord
      ? {line:"skills", find:r.cvWord, why:tr("Dis à quoi il te sert, ça parle plus qu'un nom de logiciel.", "Say what you use it for: it says more than a software name."), tpl:tr(`${r.cvWord} ({pour quoi faire ? ${ex}})`, `${r.cvWord} ({what for? ${ex}})`)}
      : {line:"skills", ask:tr(`Sais-tu utiliser ${K} ?`, `Can you use ${K}?`), tpl:tr(`, ${K} ({ton niveau ou un exemple ? ${ex}})`, `, ${K} ({your level or an example? ${ex}})`), nope:tr("Si c'est un « plus », ce n'est pas bloquant. Sinon, une formation courte peut suffire.", "If it is only a plus, it is not a deal-breaker. Otherwise, a short course may be enough.")};
    case "l": return {line: (/dipl|cap|bac|bts|licence|master|degree|qualif/i.test(K) || (L10N?.re?.eduWords && new RegExp(L10N.re.eduWords, "i").test(K))) ? "edu" : "skills", ask:tr(`As-tu : ${K} ?`, `Do you have: ${K}?`), tpl:tr(`, ${K} ({année ou détail ? ${r.ex ? "ex : " + r.ex : "ex : 2023"}})`, `, ${K} ({year or detail? ${r.ex ? "e.g. " + r.ex : "e.g. 2023"}})`), nope:tr("Certaines entreprises financent la formation. Tu peux dire dans ta lettre que tu es prêt(e) à la passer.", "Some employers pay for the training. You can say in your letter that you are ready to take it.")};
    case "g": return r.st === "mid" && r.cvWord
      ? {line:"skills", find:r.cvWord, tpl:tr(`${r.cvWord} ({ton niveau ? ex : scolaire, courant})`, `${r.cvWord} ({your level? e.g. basic, fluent})`)}
      : {line:"skills", ask:tr(`Tu parles ${k} ?`, `Do you speak ${k}?`), tpl:tr(`, ${k} {ton niveau ? ex : scolaire}`, `, ${k} {your level? e.g. basic}`), nope:tr("Si l'offre dit « apprécié », ce n'est pas bloquant.", "If the offer says \"a plus\", it is not a deal-breaker.")};
    case "h": return {line:"skills", ask:tr("Acceptes-tu ces horaires ?", "Are you OK with these hours?"), tpl:tr(", disponible {quand ? ex : en horaires décalés et le week-end}", ", available {when? e.g. shifts and weekends}"), nope:tr("Dis-le franchement en entretien : c'est mieux que de mauvaises surprises.", "Say it honestly at the interview: better than bad surprises.")};
    case "d": return {line:"edu", ask:tr(`As-tu ce diplôme (${r.word}) ?`, `Do you have this qualification (${r.word})?`), tpl:tr(`${LANG === "fr" ? r.word.toUpperCase() : r.word} {spécialité et année ? ex : Employé de commerce, 2020}`, `${r.word} {subject and year? e.g. Business, 2020}`), nope:tr("Une expérience équivalente compte souvent autant : mets-la en avant dans ta lettre.", "Similar experience often counts as much: highlight it in your letter.")};
    default: return r.st === "mid"
      ? {line:"exp", why:tr("C'est cité, mais sans exemple concret.", "It is mentioned, but with no real example."), tpl:tr(` ${K} : {un exemple concret ? ex : où, combien, pendant combien de temps}.`, ` ${K}: {a real example? e.g. where, how many, for how long}.`)}
      : {line:"exp", ask:tr("As-tu déjà fait ça ?", "Have you done this before?"), tpl:tr(` ${K} : {ce que tu as fait ? ex : où, combien, pendant combien de temps}.`, ` ${K}: {what you did? e.g. where, how many, for how long}.`), nope:tr("Pas grave : mets en avant ce qui s'en rapproche le plus.", "No problem: highlight what comes closest.")};
  }
}

let over = {}, skipped = [];  // nom du point -> "ok" | "mid" | "no" | "skip" : tampon corrigé à la main
let fixes = {}; // nom du point -> {vals:{}, state:"open"|"yes"|"accepted"|"skipped", fix}
const blanksOf = tpl => [...tpl.matchAll(/\{([^}]+)\}/g)].map(m => m[1]);
const filled = k => { const f = fixes[k]; return blanksOf(f.fix.tpl).every((b, i) => (f.vals[i] || "").trim()); };
const fillTpl = (fix, vals) => { let i = 0; return fix.tpl.replace(/\{[^}]+\}/g, () => vals[i++] || ""); };

/* ---------- Postes du CV ----------
   Une ligne avec des années ouvre un poste ; les lignes sans année qui suivent (tâches à puces) en font partie.
   Un intitulé seul suivi d'une ligne de dates (« Vendeuse | Kiabi » puis « 2019 - 2024 ») ouvre aussi un poste. */
const YEAR = /\b(19|20)\d\d\b/;
const RANGE = new RegExp(String.raw`\(?\s*(?:(?:depuis|since|de|from)\s+)?\b(?:19|20)\d\d\b(?:\s*(?:-|–|—|à|a|au|to|\/${L10N?.re?.to ? "|" + L10N.re.to : ""})\s*(?:\b(?:19|20)\d\d\b|aujourd'hui|auj\.?|pr[ée]sent|actuel\w*|maintenant|en cours|ce jour|current\w*|now|today|ongoing|date${L10N?.re?.now ? "|" + L10N.re.now : ""}))?\s*\)?`, "gi");
const dateOnly = t => fold(t.replace(RANGE, "")).replace(/\b(janv\w*|fev\w*|mars|avr\w*|mai|juin|juil\w*|aout|sept\w*|oct\w*|nov\w*|dec\w*|jan|feb|mar|apr|may|jun|jul|aug|sep|depuis|since)\b/g, "").replace(/[^a-z\u00df-\u00ff]/g, "").length < 3;
function jobsOf(cv = CV){
  const jobs = []; let cur = null;
  cv.forEach((l, i) => {
    if (!l.exp || !l.t) { cur = null; return; }
    const y = YEAR.test(l.t), next = cv[i + 1], title = !y && next?.exp && next.t && dateOnly(next.t);
    if (!cur || title || (y && !(cur.ids.length === 1 && !cur.y))) { cur = {id: l.id, ids: [l.id], y, lines: [l]}; jobs.push(cur); }
    else { cur.ids.push(l.id); cur.lines.push(l); if (y) cur.y = true; }
  });
  jobs.forEach(j => {
    // Intitulé : les lignes du début jusqu'aux dates, sans les dates ni ce qui suit « : »
    const head = j.lines.slice(0, j.lines.findIndex(l => YEAR.test(l.t)) + 1 || 1).map(l => l.t.replace(RANGE, " ").replace(/^[\s:–—|,-]+/, "").split(/\s:\s|:\s/)[0]).join(" ").replace(/\s+([,|])/g, "$1").replace(/[\s:–—|,-]+$/, "").replace(/\s+/g, " ").trim();
    const m = head.match(/^(.+?)(?:\s*[,|]\s*|\s+[–—-]\s+|\s+(?:chez|at|bei|en|presso)\s+)(.+)$/);
    j.role = (m ? m[1] : head).trim(); j.company = m ? m[2].split(/\s*[,|]\s*/)[0].trim() : "";
    j.title = j.role + (j.company ? ", " + j.company : "");
    j.multi = j.ids.length > 1;
  });
  return jobs;
}
const jobOf = (id, cv = CV) => jobsOf(cv).find(j => j.ids.includes(id));

/* Ligne du CV où va une réécriture : celle qui contient le mot à remplacer, sinon le poste choisi (le premier par défaut), la formation ou les compétences */
function targetId(fix, to){
  const body = CV.filter(l => l.t !== undefined && !l.name && !l.sec);
  if (fix.find) { const l = body.find(l => fold(l.t).includes(fold(fix.find))); if (l) return l.id; }
  const skills = body.find(l => l.kind === "skills" && l.t) || CV.find(l => l.id === "kAuto");
  if (fix.line === "exp") { const jobs = jobsOf(), j = jobs.find(j => j.id === to) || jobs[0]; return j ? j.ids[j.ids.length - 1] : (body.find(l => l.exp) || skills).id; }
  if (fix.line === "edu") return (body.find(l => l.kind === "edu") || skills).id;
  return skills.id;
}
const put = (s, a) => !s ? a.replace(/^[,.\s]+/, "").replace(/^./, c => c.toUpperCase()) : s.endsWith(".") && a.startsWith(",") ? s.slice(0, -1) + a + "." : s + a;
// « Sage 100 », « Office 365 » : le nom continue sur un mot en majuscule ou un nombre (2 au plus)
const nameEnd = (raw, i, n) => { let e = i + n; for (let k = 0; k < 2; k++) { const m = raw.slice(e).match(/^ ([\p{Lu}0-9][\p{L}0-9.+#-]*)/u); if (!m || /[.,;:]$/.test(m[1])) break; e += m[0].length; } return e; };

function cvLines(withIns){
  const acc = Object.values(fixes).filter(f => f.state === "accepted" && f.fix), jobs = jobsOf();
  const wrap = x => withIns ? `<ins>${esc(x)}</ins>` : esc(x);
  const lines = CV.flatMap(l => {
    if (l.sec || l.name) return [{...l}];
    let t = esc(l.t), raw = l.t;
    const extra = [], job = l.exp && jobs.find(j => j.ids[j.ids.length - 1] === l.id);
    acc.filter(f => targetId(f.fix, f.to) === l.id).forEach(f => {
      const add = fillTpl(f.fix, f.vals);
      const i = f.fix.find ? fold(raw).indexOf(fold(f.fix.find)) : -1;
      if (i >= 0) {
        // « Excel (RECHERCHEV, TCD) » + « Excel (factures) » → « Excel (RECHERCHEV, TCD, factures) » ; « Sage 100 » reste entier
        const e = nameEnd(raw, i, f.fix.find.length), name = raw.slice(i, e), par = raw.slice(e).match(/^\s*\(([^)]*)\)/);
        const m = add.match(/^(.*?)\s*\((.*)\)$/), inner = m && fold(m[1]) === fold(f.fix.find) ? m[2] : null;
        const word = name + (par && inner !== null ? par[0] : ""), now = inner === null ? add + raw.slice(i + f.fix.find.length, e) : name + " (" + (par ? par[1] + ", " : "") + inner + ")";
        t = t.replace(esc(word), wrap(now)); raw = raw.replace(word, now);
      }
      // Poste en plusieurs lignes (dates, puis tâches à puces) : l'ajout fait une ligne de plus
      else if (f.fix.line === "exp" && job?.multi && !f.fix.find) { const a = add.replace(/^[,.\s]+/, ""); extra.push({id: l.id + "+" + extra.length, t: a, raw: a, html: wrap(a), exp: true, kind: l.kind, added: true}); }
      else {
        let a2 = f.fix.find || (f.fix.line === "edu" && raw && !/^[,.\s]/.test(add)) ? ", " + add : add;
        // Ligne sans point final et ajout qui commence par une majuscule : on ferme la phrase
        if (raw && /^\s+\p{Lu}/u.test(a2) && !/[.!?;:,]\s*$/.test(raw)) { raw += "."; t += "."; }
        const before = raw.endsWith(".") && a2.startsWith(",");
        t = !raw ? wrap(put("", a2)) : before ? t.slice(0, -1) + wrap(a2) + "." : t + wrap(a2);
        raw = put(raw, a2);
      }
    });
    return [{...l, html:t, raw}, ...extra];
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
const STOP = new Set(("le la les un une des du de d l au aux et ou en a dans sur pour par avec sans sous chez vers entre ce cet cette ces son sa ses leur leurs votre vos notre nos vous nous il elle ils elles on qui que quoi dont est sont etre avoir sera serez etes avez ont fait faire tout tous toute toutes tres plus moins bien bon bonne bonnes bons poste postes missions mission profil recherche recherchons recherche h f h/f cdi cdd temps plein partiel salaire experience experiences ans annee annees minimum maximum souhaite souhaitee apprecie appreciee requis requise exige exigee indispensable obligatoire capacite capacites savoir connaissance connaissances maitrise maitriser assurer assurez participer participez realiser realisez effectuer effectuez gerer gerez etc ainsi selon afin lors utilisation utiliser realisation participation concevoir ecrire respect respecter application appliquer nouvelles nouveaux nouvelle nouveau hebdomadaire mensuel mensuelle quotidien quotidienne type idealement equivalent similaire premiere premier divers diverses ensemble differentes differents garantir mettre oeuvre intervenir contribuer veiller cadre the and with for from your you our will that this have has are can able ability must should strong excellent good great knowledge including such other within across into well role job position responsibilities requirements required preferred desired years year experience working work ensure using use help").split(" ").concat(L10N?.stop ? L10N.stop.split(" ") : []));
// Sigles courts gardés (API, SQL, CRM) : écrits en majuscules dans l'offre, ou noms d'outils connus
const SHORTW = new Set("api sql crm erp git php aws gcp seo sea vba sap ux ui b2b b2c qa bi hse qse c++ c# iot".split(" "));
const tokens = s => [...new Set(String(s).split(/[^\p{L}0-9+#]+/u).filter(w => { const f = fold(w); return !STOP.has(f) && (f.length >= 4 || SHORTW.has(f) || (/^[A-Z0-9+#]{2,3}$/.test(w) && /[A-Z]{2}/.test(w))); }).map(w => fold(w).slice(0, 6)))];
/* Familles de mots proches : un mot de l'offre est retrouvé dans le CV par un mot de la même famille.
   Racines de 6 lettres au plus, sans accents (comme les mots importants ci-dessus). */
const SYN = [
  "restau brasse bistro cafete pizzer snack traite hotel cantin", "vente vendre vendeu commer", "encais caisse caissi",
  "magasi boutiq superm hyperm enseig", "entrep logist platef", "client cliente", "livrai livreu livrer", "conduc chauff",
  "nettoy entret menage propre", "patien malade reside usager benefi", "enfant jeune eleve", "equipe collab collegu",
  "ordina inform numeri digita", "docume proced wiki", "superv monito", "sauveg backup", "instal deploi deploy",
  "config parame", "reseau networ", "serveu server", "securi cyber", "incide panne depann ticket", "utilis usager user",
  "projet project", "manage encadr", "agile scrum kanban sprint cerem", "budget financ couts", "crise crisis", "chanti travau batime", "ponctu assidu",
  "commun relati", "accomp suivi", "repara depann", "prepar confec", "rangem range ordonn", "plann agenda calend", "wareho entrep logist", "custom client", "deliv livrai", "cleani nettoy entret", "repair repara", "kitche cuisin cook", "childr enfant", "colleag equipe team staff", "sales vente selling retail", "shop magasi store", "patien resident", "elderl agees senior"
].concat(L10N?.syn || []).map(g => g.split(" "));
const synOf = w => [w, ...SYN.filter(g => g.some(x => w.startsWith(x) || x.startsWith(w))).flat()];
const NOT_SKILL = LX("notSkill", /salaire|remuneration|€|euros?|\bcdi\b|\bcdd\b|contrat|temps (plein|partiel)|avantages|mutuelle|tickets? resto|primes?|postuler|candidature|envoy|\bcv\b|lieu de travail|poste base|prise de poste|date de debut|horaires? :|rejoignez|nous sommes|notre (entreprise|societe|groupe)|entreprise de|leader|\bdes que possible\b|vous aurez|principales missions|en lien direct|en lien avec|sous la (supervision|responsabilite|direction)|rattache\w* (a|au)\b|vous serez forme|formation (assuree|interne|en interne|offerte)|nous vous formons|^disponib\w* (immediate|rapidement|des)|salary|£|\$|per (hour|annum|year)|benefits|pension|holidays?|apply now|how to apply|application process|full[- ]time|part[- ]time|permanent (contract|role|position)|about us|we are|our (company|team is)|equal opportunit|start date|location/);

/* Morceaux de l'annonce où l'on ne cherche pas de compétences : avantages, présentation de l'entreprise, salaire, adresse mail, comment postuler.
   Autre langue : L10N.re.noiseLabel (début de ligne) et L10N.re.noise (morceau de phrase), ajoutés aux motifs français et anglais. */
const NOISE_LABEL = LX("noiseLabel", /^\s*[-•●▪◦*–·✓✔>]*\s*(avantages?( sociaux)?|nous (vous )?(offrons|proposons)|ce que nous (offrons|proposons)|salaire|remuneration|package|pour postuler|comment postuler|candidatures?|benefits|perks|what we offer|we offer|salary|how to apply|to apply)\s*:/);
const NOISE = LX("noise", /\b(mutuelle|tickets? (restaurant|resto|repas)|cheques? (vacances|cadeaux|dejeuner)|paniers? repas|13e mois|treizieme mois|primes? (de |d')?(precision|vacances|fin d'annee|interessement|participation|transport|anciennete)|interessement|comite d'entreprise|salle de sport|carte (carburant|essence)|fourni(e|s|es)?|mis(e|es)? a (votre |ta )?disposition|pris en charge|remboursement (de |des )?(\d+ ?%|frais|transport|titre)|envoy\w* (votre|ton|vos|tes|nous|un|le|cv)|adress\w* (votre|ton|vos) (cv|candidature)|postul\w*|(votre|ta|vos|tes) candidatures?|nous sommes|notre (entreprise|societe|groupe|cabinet|enseigne|reseau)|(entreprise|societe|groupe|pme|structure|enseigne) (familiale |independante )?de \d+|fonde(e)? en|cree(e)? en (19|20)\d\d|chiffre d'affaires de|cabinet de recrutement|recrute pour|pour (le compte de )?(son|notre) client|leader (du|de la|des|sur|en|europeen|francais|mondial|national)|salaire (de |brut|net|selon|attractif|motivant|fixe|mensuel|annuel|\d)|remuneration (de |brute?|nette?|selon|attractive|motivante|fixe|\d)|we offer|company (car|phone|pension)|pension scheme|apply (now|by|via|online)|send (your|us) (cv|application)|about us|we are (a|an|the)|on behalf of our client|market leader)\b|\d ?(k ?€|€|k£|£)/);
const maskNoise = O => O.split("\n").map(l => NOISE_LABEL.test(l) ? " ".repeat(l.length)
  : l.replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, m => " ".repeat(m.length)).split(/(,(?!\d)|[;:()!?]|\.(?=\s|$))/).map(c => NOISE.test(c) ? " ".repeat(c.length) : c).join("")).join("\n");
// Niveau écrit à côté d'une langue : « Anglais courant », « TOEIC 900 », « B2 » (autre langue : L10N.re.langLevel)
const LEVEL = LX("langLevel", /\b(courant|bilingue|natif|native|langue maternelle|maternelle|lu,? (ecrit|parle)|ecrit et parle|parle et ecrit|professionnel|intermediaire|avance|notions?|scolaire|debutant|toeic|toefl|ielts|cambridge|[abc][12]|fluent|fluency|basic|intermediate|advanced|proficient|conversational|working knowledge|mother tongue)\b/);

const DIPLOMA = L10N?.re?.diploma ? new RegExp(L10N.re.diploma) : EN ? /\b(bachelor'?s degree|master'?s degree|degree|phd|high school diploma|gcses?|a[- ]levels?|nvq level \d|hnd|hnc|bac ?\+ ?\d|bts)\b/ : /\b(cap|bep|bac ?\+ ?\d|bac pro|bac|bts|dut|but|licence|master|titre professionnel|diplome d'etat)\b/;

/* ---------- Analyse : chaque point de l'offre reçoit ok (prouvé par une expérience), mid (cité sans preuve) ou no (absent) ---------- */
function analyse(offer){
  const lines = cvLines(false), O = fold(offer), OM = maskNoise(O);
  const expTxt = lines.filter(l => l.exp).map(l => l.raw).join("\n"), allTxt = lines.filter(l => l.raw).map(l => l.raw).join("\n");
  const E = fold(expTxt), A = fold(allTxt);
  const body = lines.filter(l => l.raw && !l.sec);
  // Intitulé d'un poste en plusieurs lignes : la preuve se prend plutôt dans les tâches en dessous
  const heads = new Set(jobsOf().filter(j => j.multi).map(j => j.id));
  // Meilleure ligne du CV pour un point : le motif exact de l'offre vaut plus que le motif large, une ligne longue (avec du détail) plus qu'un mot seul
  const bestLine = (ls, d) => {
    let best = null;
    ls.forEach(l => {
      const F = fold(l.raw), m = F.match(d.o) || F.match(d.c); if (!m) return;
      const sc = (d.o.test(F) ? 4 : 0) + (l.exp ? 2 : 0) + Math.min(2, l.raw.length / 80) - (heads.has(l.id) ? 1.5 : 0);
      if (!best || sc > best.sc) best = {t:l.raw, id:l.id, i:m.index, n:m[0].length, word:l.raw.substr(m.index, m[0].length), sc, exp:!!l.exp};
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
    // Toutes les occurrences : « obligatoire » peut suivre la deuxième (la première est souvent dans le titre)
    const all = [...OM.matchAll(d.og || (d.og = new RegExp(d.o.source, "g")))]; if (!all.length) return;
    // (« CAP Cuisine exigé » rend le diplôme indispensable, pas le point « Cuisine »)
    const mo = all.find(m => weight(m.index) === "must" && (d.type === "l" || !DIPLOMA.test(clauseAt(m.index)))) || all[0];
    const offerWord = offer.substr(mo.index, mo[0].length);
    let st = "no", cvWord = "";
    const pe = bestLine(body.filter(l => l.exp), d), pa = pe || bestLine(body, d);
    if (pe) st = "ok"; else if (pa) st = (d.type === "l" || d.type === "h") ? "ok" : "mid";
    // Une langue écrite avec son niveau (« Anglais courant », « B2 ») suffit
    if (st === "mid" && d.type === "g" && LEVEL.test(fold(pa.t).slice(pa.i).split(/[,;\n]/)[0])) st = "ok";
    if (pa) cvWord = pa.word;
    out.push({k:d.k, id:d.id, type:d.type, ex:d.ex, st, pos:all[0].index, prio:weight(mo.index), offerWord, offerCtx:ctxAt(mo.index), cvWord, proof:pa, re:d.c, broad:d.broad});
  });

  // Années d'expérience demandées
  const my = OM.match(L10N?.re?.years ? new RegExp(L10N.re.years) : /(\d{1,2})\s*(?:a|à)?\s*\d{0,2}\s*ans? (?:minimum )?(?:d'|d’|de )?experience|experience (?:de |d'au moins |minimum (?:de )?)?(\d{1,2}) ans?|(\d{1,2})\+?\s*(?:years?|yrs?)(?:'|’)?\s*(?:of\s+)?(?:[a-z-]+\s+){0,3}?experience|at least (\d{1,2}) years?|experience of (\d{1,2})\+? years?/);
  if (my) {
    const need = +(my[1] || my[2] || my[3] || my[4] || my[5]), have = cvYears(allTxt);
    out.push({k: need > 1 ? tr(`${need} ans d'expérience`, `${need} years of experience`) : tr("1 an d'expérience", "1 year of experience"), type:"y", st: have === null ? "mid" : have >= need ? "ok" : "no", pos:my.index, prio:weight(my.index), need, have, offerCtx:ctxAt(my.index)});
  }

  // Diplôme demandé
  const md = OM.match(DIPLOMA);
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
  const title = rows.findIndex(l => l.trim());
  rows.forEach((raw, idx) => {
    if (generic >= 15 || idx === title || !(useBullets ? BUL.test(raw) : listy(idx))) return;
    const line = raw.replace(/^\s*[-•●▪◦*–·✓✔>]+\s*/, "").replace(/[.;]+$/, "").trim(), F = fold(line);
    if (line.length < 6 || line.length > 120 || NOT_SKILL.test(F) || NOISE_LABEL.test(F) || NOISE.test(F) || LEX.some(d => d.o.test(F)) || (L10N?.re?.yearsWord ? new RegExp(String.raw`\d+\+?\s*(ans?|years?|${L10N.re.yearsWord})\b`) : /\d+\+?\s*(ans?|years?)\b/).test(F) || DIPLOMA.test(F)) return;
    const tk = tokens(line); if (tk.length < 1) return;
    const hits = T => { const ws = T.split(/[^a-zß0-9+#]+/); return tk.filter(w => w.length < 4 ? ws.includes(w) : synOf(w).some(v => ws.some(x => x.startsWith(v)))); };
    const se = hits(E).length / tk.length, sa = hits(A).length / tk.length;
    const st = se >= .6 ? "ok" : sa >= .6 ? "mid" : "no";
    // Preuve : la ligne du CV qui partage le plus de mots avec cette ligne de l'offre
    let proof = null;
    if (st !== "no") body.filter(l => st !== "ok" || l.exp).forEach(l => {
      const F2 = fold(l.raw), h = hits(F2); if (!h.length || (proof && h.length <= proof.sc)) return;
      const ws = h.flatMap(synOf), m = F2.split(/[^a-zß0-9+#]+/).find(x => x.length >= 3 && ws.some(v => x.startsWith(v))), i = m ? F2.search(new RegExp("\\b" + m)) : 0;
      proof = {t:l.raw, id:l.id, i:Math.max(0, i), n:m ? m.length : 0, sc:h.length, exp:!!l.exp};
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
  // Fourchettes d'abord : « 32 à 36 k€ », « 42-50 k€ »
  ["salary", tr("Salaire", "Salary"), /(\d[\d\s.,]*?\s?(k ?€|€|euros?|k£|£)?\s?(-|–|a|to)\s?\d[\d\s.,]*\s?(k ?€|€|euros?|k£|£|\$)\s?(brut|net|gross)?\s?(\/|par|per|a)?\s?(mois|an|annuel|heure|h|jour|semaine|month|year|annum|hour|day|week)?|\d[\d\s.,]*\s?(k ?€|€|euros?|k£|£|\$)\s?(brut|net|gross)?\s?(\/|par|per|a)?\s?(mois|an|annuel|heure|h|jour|semaine|month|year|annum|hour|day|week)?|(£|\$|€)\s?\d[\d,.]*k?(\s?(-|–|à|to)\s?(£|\$|€)?\s?\d[\d,.]*k?)?(\s?(per|a|\/)\s?(hour|year|annum|month|an|mois))?|\bsmic\b|selon (profil|experience|convention)|a negocier|salaire attractif|competitive salary)/],
  ["contract", tr("Contrat", "Contract"), /\b(cdi|cdd( de \d+ mois)?|interim(aire)?|alternance|apprentissage|contrat pro\w*|stage|freelance|saisonnier|vacation|permanent( role| contract| position)?|fixed[- ]term|temporary|internship|apprenticeship|zero[- ]hours?)\b/],
  // Plages horaires d'abord : « 7h - 15h », « 6h - 9h et 17h - 20h »
  ["hours", tr("Temps de travail", "Hours"), /(\d{1,2} ?h ?\d{0,2} ?(-|–|a) ?\d{1,2} ?h ?\d{0,2}((,| et) ?\d{1,2} ?h ?\d{0,2} ?(-|–|a) ?\d{1,2} ?h ?\d{0,2})?|\d{2}(,\d)? ?h(eures)?( hebdo\w*| ?(\/|par) ?semaine)?\b|temps (plein|partiel)|full[- ]time|part[- ]time|\d{2} hours? (a|per) week)/],
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
  let place = ml ? ml[1].trim() : "", company = "";
  // Sinon : les morceaux du titre et des 2 lignes suivantes (« Vendeur – CDI – Caen », « Saint-Lô (50) - CDI - 35 h »).
  // Un morceau de 2 mots ou plus avec des majuscules, ou un mot comme « Restaurant », est le nom de l'entreprise.
  const heads = t.split("\n").filter(l => l.trim()).slice(0, 3);
  const CO = LX("company", /^(supermarche|hypermarche|magasin|restaurant|brasserie|hotel|ehpad|clinique|hopital|cabinet|societe|groupe|agence|boulangerie|entreprise|mairie|association|ecole|garage|laboratoire|pharmacie|banque|residence|institut|atelier|usine|cafe)\b|\b(sas|sarl|sa|ltd|limited|plc|inc|gmbh|srl|spa|sl)\.?$/);
  const cands = [];
  heads.forEach((l, n) => {
    if (l.length > 100) return;
    const parts = l.split(/\s+[–—-]\s+|\s+\|\s+|\s+·\s+/);
    if (n && parts.length < 2 && !/\(\d{2,3}\)|\b\d{5}\b/.test(l)) return;
    parts.slice(n ? 0 : 1).forEach(x => {
      const dept = /\(\d{2,3}\)|\b\d{5}\b/.test(x), y = x.replace(/\s*\([^)]*\)/g, "").replace(/\b\d{5}\b/, "").trim(), f = fold(y);
      if (!y || /exemple|sample|ejemplo|esempio|beispiel/i.test(y) || /^(cdi|cdd|stage|alternance|interim|freelance|temps|contrat|full|part|permanent|fixed)/.test(f) || /\d/.test(y) || (L10N?.re?.ad_contract && new RegExp(L10N.re.ad_contract).test(f)) || (L10N?.re?.ad_hours && new RegExp(L10N.re.ad_hours).test(f))) return;
      if (CO.test(f) || (y.split(/\s+/).filter(w => /^\p{Lu}/u.test(w)).length >= 2 && !dept)) { if (!company && y.length <= 50) company = y; return; }
      if (/^\p{Lu}[\p{L}' -]{1,30}$/u.test(y)) cands.push({y, dept});
    });
  });
  if (!place) place = (cands.find(c => c.dept) || cands[0] || {}).y || "";
  const mc = t.match(/(?:^|\n)\s*(?:entreprise|soci[ée]t[ée]|employeur|company|employer)\s*:\s*([^\n,;]{2,50})/i);
  if (mc) company = mc[1].trim();
  if (company) facts.unshift({id: "company", label: tr("Entreprise", "Company"), v: company});
  if (place) facts.splice(company ? 3 : 2, 0, {id: "place", label: tr("Lieu", "Location"), v: place}); else missing.push({id: "place", label: tr("Lieu", "Location")});
  AD_FLAGS.forEach(([id, level, label, why, re]) => { const m = F.match(LX("flag_" + id, re)); if (m) flags.push({id, level, label, why, v: t.substr(m.index, m[0].length)}); });
  // Adresse mail de l'annonce : reprise comme contact dans le suivi
  const email = (t.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/) || [""])[0];
  return {facts, missing, flags, company, email};
}

/* ---------- Relecture du CV : fautes fréquentes, verbes faibles, phrases longues, chiffres ---------- */
const TYPOS_FR = {acceuil: "accueil", acceuillir: "accueillir", acceuilli: "accueilli", dévelopement: "développement", dévellopement: "développement", developement: "développement", parmis: "parmi", malgrés: "malgré", courrament: "couramment", professionel: "professionnel", professionelle: "professionnelle", professionels: "professionnels", professionelles: "professionnelles", personel: "personnel", addresse: "adresse", experiance: "expérience", expèrience: "expérience", éxpérience: "expérience", compétance: "compétence", competance: "compétence", compétances: "compétences", responsabilitée: "responsabilité", disponibilitée: "disponibilité", rigeur: "rigueur", comercial: "commercial", comerciale: "commerciale", dévelopeur: "développeur", developpeur: "développeur", reconaissance: "reconnaissance", envirronement: "environnement", environement: "environnement", maintenace: "maintenance", maîtrisse: "maîtrise", maitrisse: "maîtrise", informatiqe: "informatique", coordonées: "coordonnées", quotidient: "quotidien", bureautiqe: "bureautique", éffectué: "effectué", éfficace: "efficace", gestionaire: "gestionnaire", polyvalance: "polyvalence", autonomme: "autonome", dynamiqe: "dynamique", entousiaste: "enthousiaste", vendeure: "vendeuse", magazin: "magasin", ordinnateur: "ordinateur", connaisance: "connaissance", connaisances: "connaissances"};
const TYPOS_EN = {recieve: "receive", recieved: "received", managment: "management", experiance: "experience", responsable: "responsible", acheive: "achieve", acheived: "achieved", seperate: "separate", enviroment: "environment", sucessful: "successful", succesful: "successful", comunication: "communication", communcation: "communication", maintainance: "maintenance", mantain: "maintain", profesional: "professional", proffesional: "professional", knowlege: "knowledge", adress: "address", oportunity: "opportunity", independant: "independent", definately: "definitely", custumer: "customer", costumer: "customer", untill: "until", begining: "beginning", calender: "calendar", occured: "occurred", relevent: "relevant"};
const WEAK_FR = /\b(participer a|participation a|aider a|aide a la|s'occuper de|occupe(e)? de|etre en charge de|en charge de|charge(e)? de|diverses taches|taches diverses|differentes taches|etc\.?)(?=\W|$)/;
const WEAK_EN = /\b(responsible for|helped (to|with)|involved in|worked on|duties included|various tasks|assisted with|etc\.?)(?=\W|$)/;
function cvCheck(text){
  const t = String(text || ""), out = [];
  const words = fold(t).split(/[^a-z']+/), count = re => words.filter(w => re.test(w)).length, nEn = count(/^(the|and|with|for|of|to|in)$/);
  // Autre langue : ses mots courants (L10N.re.langWords) l'emportent sur l'anglais (« in » est aussi italien, allemand)
  const nOwn = L10N?.re?.langWords ? count(new RegExp(`^(${L10N.re.langWords})$`)) : 0;
  const en = !nOwn && nEn > count(/^(le|la|les|et|des|du|de|pour)$/) || nOwn > 0 && nEn > nOwn * 2;
  const own = !!L10N && !en, typos = own ? L10N.typos || {} : en ? TYPOS_EN : TYPOS_FR;
  Object.entries(typos).forEach(([bad, good]) => {
    const re = new RegExp(`(^|[^\\p{L}])(${bad})(?=[^\\p{L}]|$)`, "iu"), m = t.match(re);
    if (m) { const w = m[2], to = w[0] === w[0].toUpperCase() ? good.charAt(0).toUpperCase() + good.slice(1) : good; out.push({id: "typo:" + bad, type: "typo", word: w, to, msg: tr(`« ${w} » s'écrit « ${to} »`, `"${w}" is spelt "${to}"`)}); }
  });
  const cv = parseCV(t), weakRe = own ? (L10N.re?.weak ? new RegExp(L10N.re.weak) : /$^/) : en ? WEAK_EN : WEAK_FR;
  let weak = 0, nonum = 0, long = 0;
  // Intitulé ou dates d'un poste écrit sur plusieurs lignes : les chiffres vont dans les tâches en dessous
  const heads = new Set(jobsOf(cv).filter(j => j.multi).flatMap(j => j.lines.filter((l, n) => n === 0 || dateOnly(l.t)).map(l => l.id)));
  cv.filter(l => l.t && !l.name).forEach(l => {
    const F = fold(l.t), mw = F.match(weakRe);
    if (mw && weak < 3) { weak++; out.push({id: "weak:" + l.id, type: "weak", line: l.t, word: l.t.substr(mw.index, mw[0].length), msg: tr(`« ${l.t.substr(mw.index, mw[0].length)} » ne dit pas ce que tu as fait toi-même. Préfère un verbe d'action : « organisé », « géré », « préparé », « vendu »…`, `"${l.t.substr(mw.index, mw[0].length)}" does not say what you did yourself. Use an action verb: "organised", "managed", "prepared", "sold"…`)}); }
    l.t.split(/(?<=[.;!?])\s+/).forEach(sn => { const n = sn.split(/\s+/).length; if (n > 32 && long < 2) { long++; out.push({id: "long:" + l.id + ":" + long, type: "long", line: sn, msg: tr(`Phrase de ${n} mots : coupe-la en deux, un recruteur lit vite.`, `A ${n}-word sentence: split it in two, recruiters read fast.`)}); } });
    if (l.exp && !heads.has(l.id) && l.t.split(/\s+/).length >= 8 && !/\d/.test(l.t.replace(/\b(19|20)\d\d\b/g, "")) && nonum < 3) { nonum++; out.push({id: "num:" + l.id, type: "nonum", line: l.t, msg: tr("Aucun chiffre ici : ajoute combien (clients, commandes, personnes, euros) ou pendant combien de temps.", "No number here: add how many (customers, orders, people, money) or for how long.")}); }
  });
  const je = (fold(t).match(en ? /\bi\b/g : /\b(je|j')\b/g) || []).length;
  if (!en && !own && LANG === "fr" && je >= 3) out.push({id: "je", type: "style", msg: tr(`« Je » revient ${je} fois. Dans un CV, commence plutôt par le verbe : « Préparé 120 commandes par jour ».`, "")});
  return out;
}
