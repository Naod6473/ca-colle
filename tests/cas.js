// Banc de test de Ça colle ? : offres et CV fictifs, avec ce que l'analyse doit trouver.
// ok / mid / no : tampon attendu pour ce point. absent : ce point ne doit PAS sortir (faux positif connu).
// Lancer : node tests/run.js, ou ouvrir tests/ dans le navigateur.
const CASES = [
{
  name: "Logistique (exemple de l'app)", lang: "fr", offer: OFFER_FR, cv: SAMPLE_CV_FR,
  ok: ["Préparation de commandes", "Contrôle qualité", "Permis B", "Travail en équipe", "Ponctualité", "Réception des marchandises"],
  mid: ["Gestion des stocks", "Excel", "Rigueur"], no: ["CACES (chariot élévateur)", "Anglais"], minPoints: 12
},
{
  name: "Hôte de caisse", lang: "fr",
  offer: `Hôte / Hôtesse de caisse (H/F) - CDD 6 mois
Missions :
- Tenue de caisse et encaissement
- Accueil de la clientèle et conseil
- Gestion des retours et des litiges clients
- Ouverture et fermeture du magasin
Profil :
- 1 an d'expérience minimum sur un poste similaire
- Bac pro commerce apprécié
- Sens du contact, souriant(e) et dynamique
- Disponible le week-end
- Maîtrise de l'outil informatique`,
  cv: `Sophie Durand · Lyon · sophie@mail.fr · 06 11 22 33 44
Expériences
Caissière, Carrefour Market (2019 - 2024) : accueil et encaissement de 250 clients par jour, ouverture du magasin le samedi, gestion des retours.
Serveuse, Brasserie du Port (2016-2019) : service en salle, 80 couverts.
Compétences
Word, sourire, travail en équipe
Formation
CAP Employé de vente (2016)`,
  ok: ["Encaissement", "Accueil des clients", "1 an d'expérience"], mid: ["Outils informatiques", "Sens du contact"], no: ["Diplôme : BAC PRO"],
  absent: ["Service en salle"]
},
{
  name: "Serveur en restauration",
  offer: `Serveur / Serveuse H/F
Vos missions
Accueillir les clients et prendre les commandes
Assurer le service en salle et en terrasse
Dresser et débarrasser les tables
Encaisser les additions
Profil
Expérience en restauration souhaitée
Travail le week-end et les jours fériés`,
  cv: `Camille Martin · Caen · camille@exemple.fr · 06 00 00 00 00
Expériences
Serveuse, Brasserie Le Central (2018-2022) : service de 60 couverts, mise en place de la salle, encaissement des additions.
Compétences
HACCP, anglais courant`,
  ok: ["Service en salle", "Encaissement", "Expérience en restauration souhaitée"], no: ["Horaires décalés"]
},
{
  name: "Informatique (annonce sans puces)",
  offer: `En lien direct avec la Direction, vous aurez pour principales missions :

Administrer et maintenir les serveurs, postes de travail et équipements réseau
Assurer la disponibilité, la performance et la sécurité des infrastructures informatiques
Installer, configurer et mettre à jour les systèmes et logiciels
Superviser les réseaux et systèmes et intervenir en cas d'incident
Gérer les comptes utilisateurs, les droits d'accès et les politiques de sécurité
Assurer les sauvegardes et participer aux opérations de restauration
Rédiger et maintenir la documentation technique
Assurer une veille technologique sur les systèmes, réseaux et solutions de cybersécurité.

Garantir la performance des infrastructures

Organiser le support utilisateurs et assurer la qualité de service.
Garantir la conformité réglementaire (RGPD, HDS, référentiels ANS.).
Développer et maintenir les dispositifs de continuité et de reprise d'activité (PCA/PRA).
Participer à la gestion des situations de crise.`,
  cv: `Alex Bernard
Rennes - 06 98 76 54 32 - alex.bernard@exemple.fr
COMPÉTENCES TECHNIQUES
Infrastructure : Windows Server, VMware, Microsoft 365.
Réseaux & Sécurité : LAN/WAN, Wi-Fi, EDR, PRA/PCA, Firewall.
EXPÉRIENCES PROFESSIONNELLES
Responsable informatique | Société Exemple
2019 - Présent
Management de 4 techniciens pour le support de 800 utilisateurs sur 12 sites.
Administration de l'Active Directory et du tenant Microsoft 365.
Mise en place de sauvegardes quotidiennes et tests de restauration chaque trimestre.
Veille technologique continue.
Technicien informatique | Exemple Services
2015 - 2019
Support utilisateur à distance et sur site ; administration des serveurs clients.
FORMATION ET CERTIFICATIONS
BTS SIO, 2015`,
  ok: ["Administration des serveurs", "Support utilisateurs", "Sauvegardes et restauration", "Veille technologique", "Comptes et droits d'accès"],
  mid: ["Continuité d'activité (PCA/PRA)"], no: ["Documentation technique", "Supervision", "Gestion de crise"],
  absent: ["Service en salle", "Rédaction de courriers"], minPoints: 12, proof: {"Support utilisateurs": "Support utilisateur"}
},
{
  name: "Aide à domicile",
  offer: `Aide à domicile H/F - CDI temps partiel
Missions :
- Accompagnement des personnes âgées dans les actes de la vie quotidienne
- Aide à la toilette et au lever
- Préparation des repas
- Entretien du logement
Profil :
- Permis B indispensable
- Bienveillance, discrétion et ponctualité
- Diplôme ADVF apprécié`,
  cv: `Nadia Haddad · Alençon · nadia.h@exemple.fr · 07 12 34 56 78
Expériences
Auxiliaire de vie, ADMR (2020 - 2025) : aide au lever et à la toilette de 6 personnes âgées, préparation des repas, ménage.
Compétences
Écoute, ponctualité, permis B`,
  ok: ["Accompagnement des personnes âgées", "Aide à la toilette", "Préparation des repas", "Entretien et nettoyage", "Permis B"],
  mid: ["Ponctualité"], no: ["Discrétion"]
},
{
  name: "Électricien bâtiment",
  offer: `Électricien bâtiment H/F
- Lecture de plans et schémas électriques
- Câblage de tableaux électriques et pose de goulottes
- Travail en hauteur sur nacelle
- Respect des règles de sécurité sur chantier
- Habilitation électrique B1V BR exigée
- Permis B`,
  cv: `Yanis Petit · Saint-Lô · yanis@exemple.fr · 06 55 44 33 22
Expériences
Électricien, Bati Ouest (2018-2025) : câblage de tableaux électriques sur chantier de logements, lecture de plans.
Compétences
Habilitation B1V BR, CACES nacelle R486
Formation
CAP Électricien, 2018`,
  ok: ["Électricité", "Lecture de plans", "Habilitation électrique", "Travail en hauteur"], no: ["Permis B", "Règles de sécurité"]
},
{
  name: "Assistant(e) administratif(ve)",
  offer: `Assistant administratif H/F
Missions :
- Accueil téléphonique et physique
- Gestion des agendas et prise de rendez-vous
- Rédaction de courriers et comptes rendus
- Facturation et relances clients
- Classement et archivage
Profil : maîtrise du Pack Office et d'Excel, sens de l'organisation, discrétion.`,
  cv: `Julie Moreau · Caen · julie@exemple.fr · 06 22 33 44 55
Expériences
Secrétaire médicale, Cabinet Santé Plus (2017-2025) : standard téléphonique de 3 médecins, prise de rendez-vous, rédaction des courriers, archivage des dossiers.
Compétences
Word, Excel, Outlook, organisation`,
  ok: ["Accueil téléphonique", "Gestion d'agenda", "Rédaction de courriers", "Classement et archivage"], mid: ["Excel", "Pack Office", "Sens de l'organisation"], no: ["Facturation", "Discrétion"]
},
{
  name: "Infirmier(e)",
  offer: `Infirmier / Infirmière DE H/F - EHPAD
- Soins infirmiers et suivi des résidents
- Préparation et distribution des traitements
- Travail en équipe pluridisciplinaire
- Horaires en 12h, un week-end sur deux
- Diplôme d'État d'infirmier exigé`,
  cv: `Paul Lefèvre · Caen · paul@exemple.fr · 06 77 88 99 00
Expériences
Infirmier, CHU de Caen (2016-2025) : soins de 15 patients par jour en médecine interne, travail en équipe de nuit.
Formation
Diplôme d'État d'infirmier, IFSI Caen, 2016`,
  ok: ["Soins infirmiers", "Travail en équipe", "Diplôme d'État"], absent: ["Service en salle"]
},
{
  name: "Agent d'entretien (annonce collée d'un site)",
  offer: `Accueil
Se connecter
Offre n° 187QZXW
Publié il y a 3 jours
Agent d'entretien H/F
Postuler
Sauvegarder
Partager
Missions :
- Nettoyage des bureaux et des sanitaires
- Utilisation d'une autolaveuse
- Respect des protocoles d'hygiène
Profil : autonomie, ponctualité, horaires tôt le matin.
Signaler l'offre
Offres similaires
Mentions légales
Accepter les cookies`,
  cv: `Fatou Diallo · Flers · fatou@exemple.fr · 06 10 20 30 40
Expériences
Agent de propreté, Net Service (2019-2025) : entretien de 800 m² de bureaux chaque matin dès 6h, autonome sur le site.`,
  ok: ["Entretien et nettoyage", "Autonomie"], absent: ["Plomberie et chauffage", "Accueil des clients"],
  clean: {removed: ["Se connecter", "Postuler", "Sauvegarder", "Partager", "Signaler l'offre", "Mentions légales", "Accepter les cookies", "Offre n° 187QZXW", "Publié il y a 3 jours", "Offres similaires"], kept: ["Agent d'entretien H/F", "Nettoyage des bureaux"]}
},
{
  name: "Développeur web",
  offer: `Développeur web junior H/F
Vos missions :
- Développement de nouvelles fonctionnalités en JavaScript (React)
- Intégration HTML / CSS responsive
- Requêtes SQL sur la base clients
- Travail en équipe avec méthode agile
Profil : anglais technique apprécié, autonomie.`,
  cv: `Léa Garnier · Nantes · lea@exemple.fr · 06 12 12 12 12
Expériences
Développeuse, Agence Web Ouest (2022-2025) : sites en React et Node.js pour 20 clients, intégration HTML/CSS, travail en équipe agile.
Compétences
JavaScript, SQL, Git, anglais lu`,
  ok: ["JavaScript", "HTML / CSS", "Travail en équipe"], mid: ["SQL", "Anglais"], no: ["Autonomie"]
},
{
  name: "Offre française, CV en anglais", lang: "fr",
  offer: `Préparateur de commandes H/F
- Préparation de commandes
- Contrôle qualité des produits
- Travail en équipe
- Permis B apprécié`,
  cv: `Sam Taylor · Lyon · sam@example.com · +44 7700 900123
Experience
Order picker, FreshMart (2021-2025): order picking, 120 orders a day, quality checks, team of 6.
Skills
Driving licence`,
  ok: ["Préparation de commandes", "Contrôle qualité", "Travail en équipe", "Permis B"]
},
{
  name: "Warehouse (English sample)", lang: "en", offer: OFFER_EN, cv: SAMPLE_CV_EN,
  ok: ["Order picking", "Quality control", "Driving licence", "Teamwork", "Punctuality", "Goods receiving", "2 years of experience", "Shift work"],
  mid: ["Stock management", "Excel", "Attention to detail"], no: ["Forklift licence", "Spanish", "Data entry"], absent: ["Team management", "2 years of experience in a warehouse"], minPoints: 12
},
{
  name: "IT support (English)", lang: "en",
  offer: `IT Support Technician
Responsibilities
- Provide first-line and second-line user support via the service desk
- Manage user accounts and permissions in Active Directory
- Deploy and configure laptops with Intune
- Monitor backups and restore files when needed
- Write and maintain technical documentation
Requirements
- 3+ years of experience in IT support
- Good knowledge of Windows and Microsoft 365
- Excellent communication skills
- Driving licence desirable`,
  cv: `Jordan Lee
London · jordan.lee@example.com · 07700 900456
Professional experience
IT Support Analyst, Example Ltd (2020 - present)
Service desk for 400 users, 2nd line support, Active Directory accounts and permissions, laptop roll-out with Intune.
Helpdesk Technician, Sample Co (2018 - 2020)
First-line support, password resets, printer troubleshooting.
Skills
Windows 11, Microsoft 365, backups with Veeam
Education
BTEC Level 3 IT, 2018`,
  ok: ["User support", "User accounts and access", "Software deployment", "3 years of experience", "Active Directory"],
  mid: ["Backup and restore", "Windows"], absent: ["Excel", "Qualification: Licence"], no: ["Technical documentation", "Communication skills", "Driving licence"]
},
{
  // Revue du 23 octobre 2026 : lignes d'avantages, d'entreprise et « comment postuler » sans compétence
  name: "Annonce avec avantages et présentation de l'entreprise",
  offer: `Magasinier H/F – CDI – Caen
Notre société de 200 salariés, leader du négoce de matériaux, recrute pour son entrepôt.
Missions :
- Réception des marchandises et rangement
- Préparation de commandes
- Vous travaillez sous la supervision du chef d'équipe, en lien avec les infirmiers du site
- Vous rejoignez une équipe de 5 personnes pilotée par un manager bienveillant
Avantages : tickets restaurant, mutuelle, 13e mois, accès bar et salle de sport.
Véhicule de service et téléphone portable fournis.
Vous serez formé(e) en interne sur nos outils.
Envoyez votre CV au service RH : recrutement@exemple-materiaux.fr`,
  cv: `Paul Exemple · Caen · paul@exemple.fr · 06 10 20 30 40
Expériences
Magasinier, Entrepôt Exemple (2018 - 2024) : réception de 30 palettes par jour, préparation de commandes (80 par jour).
Compétences
Excel`,
  ok: ["Réception des marchandises", "Préparation de commandes"],
  absent: ["Gestion des incidents (ITIL)", "Recrutement", "Accueil téléphonique", "Management d'équipe", "Supervision", "Soins infirmiers", "Bar", "Écoute", "Vente", "Vous serez formé(e) en interne sur nos outils"],
  ad: {facts: {place: "Caen"}}
},
{
  name: "Chauffeur livreur (revue)",
  offer: `Chauffeur livreur VL (H/F) – CDD 3 mois – Lille
Missions :
- Livraison de colis chez les particuliers et professionnels (80 à 120 points par jour)
- Chargement du véhicule et vérification de la tournée
- Respect du code de la route et des consignes de sécurité
Profil :
- Permis B depuis plus de 3 ans exigé
- Ponctualité et sens du service
Horaires : 7h - 15h du lundi au samedi. 11,88 € brut de l'heure.`,
  cv: `Karim Exemple · Roubaix · karim@exemple.fr · 07 11 22 33 44
Expérience
Livreur, Colis Exemple (2021 - 2024) : tournées de 100 colis par jour sur la métropole lilloise, scan des colis, chargement du camion le matin.
Préparateur de commandes, Entrepôt Nord Exemple (2019 - 2021) : picking, 150 commandes par jour.
Compétences
Permis B (2016), GPS, ponctuel`,
  ok: ["Livraison", "Conduite de véhicule", "Manutention", "Permis B"], prio: {"Permis B": "must"},
  ad: {facts: {hours: "7h - 15h", salary: "11,88 €", place: "Lille"}}
},
{
  name: "Aide-soignante : diplôme obligatoire cité d'abord dans le titre",
  offer: `Aide-soignant(e) H/F – CDI – EHPAD Les Tilleuls – Angers
Missions :
- Aide à la toilette, à l'habillage et aux repas
- Surveillance de l'état de santé et transmissions à l'équipe infirmière
Profil :
- Diplôme d'État d'aide-soignant (DEAS) obligatoire
- Disponible les week-ends (roulement 1 week-end sur 2)
Salaire : 1 950 € brut mensuel + primes`,
  cv: `Nadia Exemple · Angers · nadia@exemple.fr · 06 12 34 56 78
Expériences professionnelles
Aide-soignante, Clinique Exemple (2020 - aujourd'hui) : soins d'hygiène et de confort pour 12 patients, aide au lever et au coucher.
Agent de service hospitalier, EHPAD Exemple (2017 - 2020) : bionettoyage des chambres, aide aux repas des résidents.
Formation
DEAS, IFAS Exemple (2020)`,
  ok: ["Diplôme d'aide-soignant", "Aide à la toilette", "Préparation des repas"], prio: {"Diplôme d'aide-soignant": "must"}, absent: ["Soins infirmiers"],
  ad: {facts: {company: "EHPAD Les Tilleuls", place: "Angers", salary: "1 950 €"}}
},
{
  name: "Développeur : sigles courts, langue avec niveau",
  offer: `Développeur web (H/F) – CDI – Nantes
Vos missions :
- Développer de nouvelles fonctionnalités en React et Node.js
- Participer aux revues de code et aux cérémonies agiles
Profil :
- Maîtrise de TypeScript, PostgreSQL et Git
- Docker serait un plus
- Anglais technique
Salaire : 42-50 k€, télétravail hybride.`,
  cv: `Thomas Exemple · Nantes · thomas@exemple.fr · 06 55 44 33 22
Expériences
Développeur front-end, Agence Exemple (2021 - 2024) : applications React et TypeScript pour 15 clients, revues de code avec Git.
Compétences
JavaScript, Scrum, Docker
Langues
Anglais courant (TOEIC 900)`,
  ok: ["JavaScript", "Git", "Anglais"], mid: ["Docker", "Participer aux revues de code et aux cérémonies agiles"],
  ad: {facts: {salary: "42-50 k€"}}
},
{
  name: "Comptable : fourchette de salaire, ajouts sans parenthèse au milieu d'un nom",
  offer: `Comptable général H/F – CDI – Bordeaux
- La saisie et la révision des écritures comptables
Profil :
- Maîtrise de Sage et d'Excel (tableaux croisés dynamiques)
- Rigueur
Rémunération : 32 à 36 k€ selon profil.`,
  cv: `Julie Exemple · Bordeaux · julie@exemple.fr · 06 98 76 54 32
Expériences professionnelles
Assistante comptable, Cabinet Exemple (2019 - 2024) : tenue de 40 dossiers clients, saisie des achats et des ventes.
Compétences
Sage 100, Excel (RECHERCHEV, TCD), rigueur`,
  mid: ["Logiciel de gestion (ERP)", "Excel", "Rigueur"],
  ad: {facts: {salary: "32 à 36 k€", place: "Bordeaux"}},
  fills: [["Logiciel de gestion (ERP)", {0: "saisie des écritures"}], ["Excel", {0: "rapprochements"}], ["Rigueur", {0: "zéro erreur de TVA en 2023"}]],
  cvHas: ["Sage 100 (saisie des écritures)", "Excel (RECHERCHEV, TCD, rapprochements)", "Rigueur : zéro erreur de TVA en 2023."], cvNot: ["Sage (", ") 100"]
},
{
  name: "Caissière : poste sur plusieurs lignes, choix du poste, disponibilités",
  offer: `Employé(e) libre-service H/F - Supermarché Les Halles du Bocage
Saint-Lô (50) - CDI - 35 h / semaine
Missions :
- Mise en rayon des produits frais
- Encaissement en caisse et en caisse automatique
- Réception des livraisons et gestion des stocks
Profil :
- Disponible le samedi, travail en coupure
- Permis B indispensable
Salaire : 1 850 € brut mensuel + 13e mois + tickets restaurant.
Envoyer CV et lettre à recrutement@halles-exemple.fr`,
  cv: `Sylvie Exemple
12 rue des Lilas, 50000 Saint-Lô
06 12 34 56 78 - sylvie@exemple.fr

EXPÉRIENCES
2016 - 2025 : Hôtesse de caisse, Supermarché Exemple Plus, Saint-Lô
- Encaissement des clients, tenue de caisse, rendu de monnaie
- Mise en rayon le matin

2012 - 2016 : Employée de ménage, Société Exemple Net, Coutances
- Entretien des bureaux

COMPÉTENCES
Caisse, ponctualité

FORMATION
CAP Employé de vente spécialisé, 2011

Permis B, véhicule personnel`,
  ok: ["Mise en rayon", "Encaissement", "Permis B"], no: ["Horaires décalés", "Réception des marchandises"],
  absent: ["Disponible le samedi, travail en coupure", "Gestion des incidents (ITIL)", "Recrutement"],
  proof: {"Encaissement": "Encaissement des clients"},
  ad: {facts: {company: "Supermarché Les Halles du Bocage", place: "Saint-Lô", hours: "35 h / semaine"}},
  review: {notOn: ["2016 - 2025", "2012 - 2016"]},
  fills: [["Réception des marchandises", {0: "livraisons du matin, 20 palettes"}, 0], ["Gestion des stocks", {0: "inventaire de fin d'année"}, 1]],
  cvHas: ["Réception des marchandises : livraisons du matin, 20 palettes.", "Gestion des stocks : inventaire de fin d'année."],
  cvNot: ["Saint-Lô Réception", "matin Réception"]
},
{
  name: "Annonce arnaque (vérif annonce)",
  offer: `Agent de saisie à domicile – Lyon
Travail depuis chez vous, sans expérience. Gagnez 300 € par jour !
Frais d'inscription de 49 € pour recevoir votre kit de démarrage.
Envoyez votre RIB et une copie de votre pièce d'identité sur WhatsApp ou à recrutement.express@gmail.com`,
  cv: `Alex Exemple
Expériences
Agent d'accueil (2021 - 2023) : accueil de 80 visiteurs par jour`,
  ad: {facts: {place: "Lyon"}, missing: ["contract", "hours"], flags: ["pay", "data", "chat", "tooGood", "mail"]}
},
{
  name: "Annonce complète (vérif annonce)",
  offer: `Vendeur / Vendeuse en boulangerie – CDD de 6 mois – Rouen
Lieu de travail : Rouen centre
Salaire : 1 850 € brut par mois, 35 h par semaine, poste à pourvoir dès que possible.
Vos missions : accueil et conseil des clients, encaissement, mise en rayon.
Candidature par mail à recrutement@exemple.fr`,
  cv: `Alex Exemple
Expériences
Vendeur (2021 - 2023) : encaissement de 150 clients par jour, mise en rayon`,
  ad: {facts: {contract: "CDD de 6 mois", place: "Rouen centre", salary: "1 850 € brut par mois", hours: "35 h par semaine", start: "dès que possible"}, missing: [], noFlags: true}
},
{
  name: "Relecture : fautes et verbes faibles",
  offer: `Employé(e) de magasin
Accueil des clients, mise en rayon`,
  cv: `Alex Exemple
Expériences professionelles
Employée polyvalente, Magasin Exemple (2020 - 2023) : participer à l'acceuil des clients et diverses tâches en magasin
Compétences
Rigeur, polyvalance, travail en équipe`,
  review: {typos: [["professionelles", "professionnelles"], ["acceuil", "accueil"], ["Rigeur", "Rigueur"], ["polyvalance", "polyvalence"]], types: ["weak", "nonum"]}
},
{
  name: "Relecture : CV propre",
  offer: `Préparateur de commandes
Préparation des commandes`,
  cv: `Alex Exemple
Expériences
Préparateur de commandes, Entrepôt Exemple (2019 - 2024) : préparé 180 commandes par jour, contrôlé 40 palettes
Compétences
CACES 1, rigueur, accueil`,
  review: {notTypes: ["typo", "weak", "nonum", "long", "style"]}
},
{
  name: "Ad check and proofreading (English)", lang: "en",
  offer: `Retail Assistant – part-time – Bristol
£11.50 per hour, 20 hours a week, fixed-term contract until January.
Earn up to £500 a day! Pay a registration fee to get started. Contact us on Telegram.`,
  cv: `Robin Sample
Experience
Sales Assistant, Sample Shop (2021 - 2024): responsible for the till and custumer service, various tasks
Skills
Communcation, teamwork`,
  ad: {facts: {salary: "£11.50 per hour", hours: "part-time", place: "Bristol", contract: "fixed-term"}, flags: ["pay", "tooGood", "chat"]},
  review: {typos: [["custumer", "customer"], ["Communcation", "Communication"]], types: ["weak", "nonum"]}
},
];
if (typeof module !== "undefined") module.exports = CASES;
