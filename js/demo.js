// MODE DÉMO (temporaire, pour les tests) : taper « démo » (ou « demo ») hors d'un champ de saisie,
// l'écrire seul dans la case de l'offre, ou ouvrir la page avec ?demo, remplit toute l'app avec un profil fictif : Maurice MARCEL, 32 ans,
// ingénieur en informatique. Pour le retirer : supprimer ce fichier, sa ligne <script> et son entrée dans sw.js.
(() => {
const D = EN ? {
  file: "CV_Maurice_MARCEL.pdf (demo)", info: "Made-up profile for testing",
  cv: `MAURICE MARCEL · Software and IT engineer · 32 years old
Caen, France · maurice.marcel@example.com · 07700 900123
Profile
IT engineer with 10 years of experience in systems, networks and cloud.
Experience
Systems and network engineer, Example Industries Ltd (2019 - 2025): ran 120 Windows and Linux servers, VMware vSphere, Active Directory for 800 users, Veeam backups, monitoring with Zabbix.
Systems administrator, Example Services (2016 - 2019): 2nd line support, laptop roll-out with SCCM, worked on various projects and various tasks.
IT support technician (apprenticeship), Example Computing (2014 - 2016): user support and custumer service, printer troubleshooting.
Education
Master's degree in computer engineering, Example School of Engineering (2016)
Skills
Windows Server, Linux, VMware, Active Directory, PowerShell, Ansible, Docker, TCP/IP networks, cybersecurity, Communcation
Other
Driving licence`,
  me: {name: "Maurice MARCEL", contact: "maurice.marcel@example.com · 07700 900123"},
  letter: {company: "Example Industries", why: "your move to the cloud is exactly the kind of project I want to lead", when: "from 1 December"},
  offers: [
    {text: `Systems and Network Engineer – permanent – Manchester
Example Industries is looking for a systems and network engineer to join its IT team (hybrid, 2 days remote).
Your tasks:
- Administer Windows and Linux servers and the VMware platform
- Manage Active Directory accounts and permissions
- Monitor backups and restore data when needed
- Automate tasks with PowerShell or Ansible
- Write technical documentation
Your profile:
- 5+ years of experience in systems administration
- Knowledge of Azure is a plus
- Good communication skills, fluent English
£48,000 per year, full-time, 37.5 hours a week. Immediate start.`,
      app: {company: "Example Industries", status: "interview", offer: -20, applied: -12, next: 3, contact: "Claire Dupont, HR · 0161 000 0000", notes: "Second interview with the IT manager. Bring examples of the Veeam migration.", hist: [["sent", -12], ["call", -6], ["interview", -2]]}},
    {text: `DevOps Engineer – permanent – Leeds
Your tasks:
- Build and maintain CI/CD pipelines with GitLab
- Deploy containers with Docker and Kubernetes
- Manage infrastructure as code with Terraform and Ansible
- Monitor production with Prometheus and Grafana
- Write technical documentation
- Experience with Azure is a plus
Your profile:
- 3+ years of experience as a DevOps or systems engineer
- Linux, scripting (Python or Bash)
- Team spirit and autonomy
Hybrid work, £52,000 per year.`,
      app: {company: "Example Cloud Ltd", status: "sent", offer: -15, applied: -9, next: -2, contact: "jobs@example.com", notes: "Applied through the careers page.", hist: [["sent", -9]]}},
    {text: `IT Project Manager – fixed-term contract 12 months – Bristol
You will lead the replacement of the company's ERP and coordinate suppliers.
Your tasks:
- Plan and follow the project budget and schedule
- Run steering committees
- Write specifications with business teams
- Train users
- Write technical documentation
Your profile: 5 years of IT project management, Agile methods, rigorous and organised.`,
      app: {company: "Example Logistics", status: "call", offer: -10, applied: -7, next: 1, contact: "Paul Martin · 0117 000 0000", notes: "Phone call booked for tomorrow 10 am.", hist: [["sent", -7], ["call", -1]]}},
    {text: `Home IT assistant – work from home – earn up to £400 a day
No experience needed! Pay a registration fee of £49 to receive your starter kit.
Send your bank details and a copy of your passport on WhatsApp or to fast.recruit@gmail.com.
Tasks: data entry, answering emails, small IT jobs for our clients, all from home.`,
      app: {company: "", status: "todo", offer: -1, notes: "Looks like a scam: check before doing anything."}},
    {text: `Back-end Java Developer – freelance – London
Your tasks:
- Develop REST APIs in Java with Spring Boot
- Write unit tests and take part in code reviews
- Work with PostgreSQL databases
Your profile: 4 years of Java development, Git, English.`,
      app: {company: "Example Software", status: "refused", offer: -45, applied: -40, notes: "Rejected: they wanted more Java experience.", hist: [["sent", -40], ["refused", -25]]}}
  ],
  manual: [
    {job: "Cloud administrator", company: "Example Hosting", status: "offer", offer: -30, applied: -28, contact: "Sarah Lee · s.lee@example.com", notes: "Offer received: £50,000. Answer before Friday.", hist: [["sent", -28], ["interview", -14], ["offer", -3]]},
    {job: "Infrastructure manager", company: "Example Bank", status: "silent", offer: -60, applied: -55, notes: "Followed up twice, no answer.", hist: [["sent", -55], ["followup", -40], ["silent", -20]]}
  ],
  prep: {g1: "IT engineer for 10 years: support, then systems administration, then 120 servers and 800 users at Example Industries. I am now looking for a hybrid role with more cloud.", g2: "Your move to the cloud and the size of the platform."},
  star: {s: "A storage failure stopped backups for 300 users.", a: "I moved the backups to Veeam on a new NAS over a weekend and tested restores.", r: "No data lost, backups 40% faster."},
  fill: ["at Example Industries, 2 projects in 2024"]
} : {
  file: "CV_Maurice_MARCEL.pdf (démo)", info: "Profil fictif pour les tests",
  cv: `MAURICE MARCEL · Ingénieur en informatique · 32 ans
Caen · maurice.marcel@example.com · 06 00 00 00 00
Profil
Ingénieur informatique, 10 ans d'expérience en systèmes, réseaux et cloud.
Expériences professionelles
Ingénieur systèmes et réseaux, Exemple Industrie SA (2019 - 2025) : administration de 120 serveurs Windows et Linux, VMware vSphere, Active Directory pour 800 utilisateurs, sauvegardes Veeam, supervision Zabbix.
Administrateur systèmes, Exemple Services (2016 - 2019) : support niveau 2, déploiement de postes avec SCCM, participer à divers projets et diverses tâches.
Technicien support (alternance), Exemple Informatique (2014 - 2016) : acceuil des utilisateurs au téléphone, dépannage des imprimantes.
Formation
Diplôme d'ingénieur en informatique, École Exemple (2016)
Compétences
Windows Server, Linux, VMware, Active Directory, PowerShell, Ansible, Docker, réseaux TCP/IP, cybersécurité, anglais technique
Divers
Permis B`,
  me: {name: "Maurice MARCEL", contact: "maurice.marcel@example.com · 06 00 00 00 00"},
  letter: {company: "Exemple Industrie", why: "votre passage au cloud est exactement le type de projet que je veux mener", when: "à partir du 1er décembre"},
  offers: [
    {text: `Ingénieur systèmes et réseaux (H/F) – CDI – Caen
Exemple Industrie recherche un ingénieur systèmes et réseaux pour rejoindre sa DSI (télétravail 2 jours par semaine).
Vos missions :
- Administrer les serveurs Windows et Linux et la plateforme VMware
- Gérer les comptes et les droits dans l'Active Directory
- Superviser les sauvegardes et restaurer les données si besoin
- Automatiser les tâches avec PowerShell ou Ansible
- Rédiger la documentation technique
Votre profil :
- 5 ans d'expérience minimum en administration systèmes
- La connaissance d'Azure est un plus
- Bon relationnel, anglais technique
Salaire : 45 000 € brut par an, 39 h par semaine, poste à pourvoir dès que possible.`,
      app: {company: "Exemple Industrie", status: "interview", offer: -20, applied: -12, next: 3, contact: "Claire Dupont, RH · 02 31 00 00 00", notes: "Deuxième entretien avec le DSI. Apporter des exemples de la migration Veeam.", hist: [["sent", -12], ["call", -6], ["interview", -2]]}},
    {text: `Ingénieur DevOps (H/F) – CDI – Rennes
Vos missions :
- Construire et maintenir les chaînes CI/CD avec GitLab
- Déployer les conteneurs avec Docker et Kubernetes
- Gérer l'infrastructure as code avec Terraform et Ansible
- Superviser la production avec Prometheus et Grafana
- Rédiger la documentation technique
- Une expérience sur Azure est appréciée
Votre profil :
- 3 ans d'expérience comme DevOps ou ingénieur systèmes
- Linux, scripts (Python ou Bash)
- Esprit d'équipe et autonomie
Télétravail partiel, 48 k€ brut annuel.`,
      app: {company: "Exemple Cloud", status: "sent", offer: -15, applied: -9, next: -2, contact: "recrutement@exemple.fr", notes: "Candidature via le site carrières.", hist: [["sent", -9]]}},
    {text: `Chef de projet informatique (H/F) – CDD de 12 mois – Rouen
Vous pilotez le remplacement de l'ERP de l'entreprise et coordonnez les prestataires.
Vos missions :
- Planifier et suivre le budget et le planning du projet
- Animer les comités de pilotage
- Rédiger les cahiers des charges avec les métiers
- Former les utilisateurs
- Rédiger la documentation technique
Votre profil : 5 ans en gestion de projet informatique, méthodes agiles, rigueur et organisation.`,
      app: {company: "Exemple Logistique", status: "call", offer: -10, applied: -7, next: 1, contact: "Paul Martin · 02 35 00 00 00", notes: "Appel prévu demain à 10 h.", hist: [["sent", -7], ["call", -1]]}},
    {text: `Assistant informatique à domicile – Gagnez 400 € par jour
Aucune expérience demandée ! Frais d'inscription de 49 € pour recevoir votre kit de démarrage.
Envoyez votre RIB et une copie de votre pièce d'identité sur WhatsApp ou à recrutement.rapide@gmail.com.
Missions : saisie de données, réponse aux mails, petits dépannages pour nos clients, le tout depuis chez vous.`,
      app: {company: "", status: "todo", offer: -1, notes: "Ressemble à une arnaque : à vérifier avant tout."}},
    {text: `Développeur back-end Java (H/F) – Freelance – Paris
Vos missions :
- Développer des API REST en Java avec Spring Boot
- Écrire les tests unitaires et participer aux revues de code
- Travailler avec des bases PostgreSQL
Votre profil : 4 ans de développement Java, Git, anglais.`,
      app: {company: "Exemple Logiciel", status: "refused", offer: -45, applied: -40, notes: "Refus : ils voulaient plus d'expérience en Java.", hist: [["sent", -40], ["refused", -25]]}}
  ],
  manual: [
    {job: "Administrateur cloud", company: "Exemple Hébergement", status: "offer", offer: -30, applied: -28, contact: "Sarah Leroy · s.leroy@exemple.fr", notes: "Proposition reçue : 47 k€. Répondre avant vendredi.", hist: [["sent", -28], ["interview", -14], ["offer", -3]]},
    {job: "Responsable infrastructure", company: "Exemple Banque", status: "silent", offer: -60, applied: -55, notes: "Relancé deux fois, pas de réponse.", hist: [["sent", -55], ["followup", -40], ["silent", -20]]}
  ],
  prep: {g1: "Ingénieur informatique depuis 10 ans : support, puis administration systèmes, puis 120 serveurs et 800 utilisateurs chez Exemple Industrie. Je cherche maintenant un poste hybride avec plus de cloud.", g2: "Votre passage au cloud et la taille de la plateforme."},
  star: {s: "Une panne du stockage bloquait les sauvegardes de 300 utilisateurs.", a: "J'ai migré les sauvegardes sur Veeam avec un nouveau NAS en un week-end et testé les restaurations.", r: "Aucune donnée perdue, sauvegardes 40 % plus rapides."},
  fill: ["chez Exemple Industrie, 2 projets en 2024"]
};
const link = (t, i) => `https://exemple.fr/offres/${fold(titleOf(t)).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40)}-${1000 + i}`;
const day = n => n == null ? "" : addDays(today(), n);
function fillApp(o, a, i){
  ensureApp(o);
  Object.assign(o.app, {company: a.company || "", offerDate: day(a.offer), appliedDate: day(a.applied), status: a.status, next: day(a.next), contact: a.contact || "", link: link(o.text || a.job, i), notes: a.notes || ""});
  if (a.job) o.app.job = a.job;
  o.app.history = [{d: day(a.offer != null ? a.offer + 1 : 0), s: "todo"}, ...(a.hist || []).map(([s, n]) => ({d: day(n), s}))];
}
function populate(){
  offers = []; cur = null;
  cvFile = {name: D.file, info: D.info, conf: 0}; me = {...D.me};
  setCV(D.cv); showFile(cvFile.name, cvFile.info);
  D.offers.forEach((d, i) => { newOffer(d.text); cur.title = titleOf(d.text); cur.score = scoreOf(analyse(d.text)); fillApp(cur, d.app, i); });
  D.manual.forEach((m, i) => { const o = {id: newId(), text: "", fixes: {}, over: {}, letter: {}}; offers.push(o); fillApp(o, m, 10 + i); });
  // Offre principale : la première, avec une lettre, un ajout au CV et une préparation d'entretien
  cur = offers[0]; fixes = cur.fixes; over = cur.over; $("#offer").value = cur.text;
  Object.assign(cur.letter, D.letter);
  const r = analyse(cur.text).find(r => r.fix && !r.fix.ask && r.st !== "ok" && (r.fix.tpl.match(/\{/g) || []).length === 1);
  if (r) { fixes[r.k] = {vals: {0: D.fill[0]}, state: "accepted", fix: r.fix}; }
  cur.score = scoreOf(analyse(cur.text));
  const qs = interviewQs(cur), star = qs.find(q => !q.one);
  cur.prep = {g1: {t: D.prep.g1}, g2: {t: D.prep.g2}, ...(star ? {[star.id]: {...D.star}} : {})};
  gates(); go(3); renderBadge(); save();
  toast(tr("Mode démo : profil de Maurice MARCEL chargé", "Demo mode: Maurice MARCEL's profile loaded"));
  stat("mode-demo");
}
let buf = "";
document.addEventListener("keydown", e => {
  const t = e.target;
  if (e.ctrlKey || e.metaKey || e.altKey || t.closest("input, textarea, select, [contenteditable]")) return;
  if (e.key.length !== 1) return;
  buf = (buf + e.key).slice(-5);
  if (fold(buf).endsWith("demo")) { buf = ""; populate(); }
});
// Sur téléphone (pas de clavier hors des champs) : écrire seulement « démo » dans la case de l'offre
document.addEventListener("input", e => { if (e.target.id === "offer" && /^\s*d[eé]mo\s*$/i.test(e.target.value)) populate(); });
if (/[?&]demo\b/.test(location.search)) populate();
})();
