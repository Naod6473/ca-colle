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
];
if (typeof module !== "undefined") module.exports = CASES;
