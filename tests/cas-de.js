// Cas allemands (node tests/run.js de) : personnes et entreprises fictives.
CASES.push(
{
  name: "Lager (Beispiel der App)", lang: "de", offer: I18N.offer, cv: I18N.cv,
  ok: ["Kommissionierung", "Qualitätskontrolle", "Führerschein Klasse B", "Teamfähigkeit", "Pünktlichkeit", "Wareneingang", "2 Jahre Berufserfahrung", "Schichtarbeit"],
  mid: ["Lagerverwaltung", "Excel", "Sorgfalt"], no: ["Staplerschein", "Englisch", "Datenerfassung", "Inventur"],
  absent: ["Teamleitung", "2 Jahre Berufserfahrung im Lager"], minPoints: 12
},
{
  name: "Kassierer/in (Einzelhandel)", lang: "de",
  offer: `Kassierer/in (m/w/d) – Teilzeit – Leipzig
Deine Aufgaben:
- Kassieren und Kassenabrechnung
- Freundliche Beratung unserer Kunden
- Bearbeitung von Reklamationen und Umtausch
- Warenverräumung und Regalpflege
Dein Profil:
- Mindestens 1 Jahr Erfahrung im Einzelhandel
- Freundliches Auftreten und Belastbarkeit
- Bereitschaft zur Arbeit am Samstag
- Sicherer Umgang mit dem PC wünschenswert`,
  cv: `Aylin Demir · Leipzig · aylin.demir@beispiel.de · 0341 555 0101
Berufserfahrung
Kassiererin, Supermarkt Beispielmarkt (2019 - 2024): Kassieren für 250 Kundinnen und Kunden pro Tag, Umtausch und Reklamationen, Ladenöffnung samstags.
Servicekraft, Café am Ring (2016-2019): Bedienung der Gäste, 80 Gedecke.
Kenntnisse
Word, Belastbarkeit, Teamarbeit
Ausbildung
Realschulabschluss (2016)`,
  ok: ["Kassieren", "Kundenservice", "1 Jahr Berufserfahrung", "Schichtarbeit"], mid: ["EDV-Kenntnisse", "Belastbarkeit"], no: ["Regalpflege", "Freundliches Auftreten"],
  absent: ["Service im Restaurant"]
},
{
  name: "Pflegefachkraft", lang: "de",
  offer: `Pflegefachkraft (m/w/d) für unser Seniorenheim – unbefristet – Kassel
Deine Aufgaben:
- Grundpflege und Behandlungspflege unserer Bewohnerinnen und Bewohner
- Betreuung älterer Menschen mit Demenz
- Dokumentation der Pflege
- Zusammenarbeit mit Ärzten und Angehörigen
Dein Profil:
- Abgeschlossene Ausbildung als Pflegefachkraft zwingend erforderlich
- Einfühlungsvermögen und Belastbarkeit
- Bereitschaft zu Schichtdienst und Wochenenddiensten
- Führerschein von Vorteil`,
  cv: `Jonas Becker · Kassel · jonas.becker@beispiel.de · 0561 555 0202
Berufserfahrung
Pflegefachkraft, Seniorenheim Am Park (2018 - 2025): Grundpflege für 12 Bewohner pro Schicht, Betreuung von Menschen mit Demenz, Pflegedokumentation.
Pflegehelfer, Ambulanter Dienst Beispiel (2015 - 2018): Hilfe beim Waschen und Anziehen, Fahrten zu 8 Personen pro Tag.
Ausbildung
Ausbildung zur Pflegefachkraft, Pflegeschule Kassel (2018)
Kenntnisse
Einfühlungsvermögen, Wundversorgung`,
  ok: ["Pflegefachkraft", "Grundpflege", "Betreuung älterer Menschen", "Schichtarbeit", "Abschluss: Ausbildung"], mid: ["Einfühlungsvermögen"], no: ["Teamfähigkeit", "Belastbarkeit", "Führerschein Klasse B"]
},
{
  name: "Systemadministrator/in (IT)", lang: "de",
  offer: `Systemadministrator/in Windows und Linux – unbefristet – Stuttgart
Deine Aufgaben:
- Administration der Windows- und Linux-Server
- Pflege der Benutzerkonten und Berechtigungen im Active Directory
- Überwachung der Systeme und Datensicherung
- 2nd-Level-Support für 400 Anwender
- Technische Dokumentation der Systeme
Dein Profil:
- Mindestens 3 Jahre Berufserfahrung in der Systemadministration
- Kenntnisse in Virtualisierung mit VMware
- Gute Englischkenntnisse
- Selbstständige und strukturierte Arbeitsweise`,
  cv: `Mara Hoffmann · Stuttgart · mara.hoffmann@beispiel.de · 0711 555 0303
Berufserfahrung
Systemadministratorin, Beispiel Maschinenbau GmbH (2020 - 2025): 40 Windows- und Linux-Server, Benutzerverwaltung im Active Directory für 600 Nutzer, Datensicherung mit Veeam, Monitoring mit Zabbix.
IT-Support, Beispiel Systemhaus (2017 - 2020): 1st-Level-Support, 30 Tickets pro Tag, Rollout von 200 Notebooks.
Ausbildung
Ausbildung zur Fachinformatikerin Systemintegration (2017)
Kenntnisse
VMware, PowerShell, Englisch (fließend), Dokumentation`,
  ok: ["Serveradministration", "Benutzerkonten und Zugriffsrechte", "Active Directory", "Monitoring", "Datensicherung und Wiederherstellung", "IT-Support", "3 Jahre Berufserfahrung", "Windows", "Linux"],
  mid: ["Virtualisierung", "Englisch", "Technische Dokumentation"], no: ["Selbstständigkeit", "Organisationstalent"]
},
{
  name: "Koch/Köchin (Gastronomie)", lang: "de",
  offer: `Koch / Köchin (m/w/d) – Vollzeit – Hamburg
Wir suchen Verstärkung für unser Küchenteam.
Deine Aufgaben:
- Zubereitung der Speisen nach Rezept
- Einhaltung der Hygienevorschriften (HACCP)
- Warenannahme und Kontrolle der Lieferungen
- Reinigung der Küche
Dein Profil:
- Abgeschlossene Ausbildung als Koch oder Köchin
- Belastbarkeit und Teamgeist
- Bereitschaft zu Abend- und Wochenendarbeit`,
  cv: `Luca Weber · Hamburg · luca.weber@beispiel.de · 040 555 0404
Berufserfahrung
Jungkoch, Restaurant Beispielhafen (2021 - 2025): Speisenzubereitung für 90 Gedecke am Abend, Annahme der Lieferungen, Wochenenddienst.
Küchenhilfe, Kantine Nord (2019 - 2021): Vorbereitung und Reinigung der Küche.
Ausbildung
Ausbildung zum Koch (2021)
Kenntnisse
Hygieneregeln, Teamarbeit`,
  ok: ["Küche", "Wareneingang", "Reinigung", "Schichtarbeit", "Zubereitung von Mahlzeiten", "Abschluss: Ausbildung", "Hygieneregeln (HACCP)"], mid: ["Teamfähigkeit"], no: ["Belastbarkeit"]
},
{
  name: "Anzeige prüfen und Korrektur (Deutsch)", lang: "de",
  offer: `Verkäufer/in – Teilzeit – Dortmund
13,50 € brutto pro Stunde, 20 Stunden pro Woche, befristet bis Januar.
Verdiene bis zu 500 € am Tag! Zahl eine Bearbeitungsgebühr von 30 € für den Start. Kontakt über Telegram.
Schick uns deine Bankverbindung.`,
  cv: `Robin Beispiel
Berufserfahrung
Verkäufer, Beispielladen (2021 - 2024): zuständig für die Kasse und den Kundenservise, diverse Aufgaben
Kenntnisse
Kommunkation, Teamarbeit`,
  ad: {facts: {salary: "13,50 € brutto pro stunde", hours: "Teilzeit", place: "Dortmund", contract: "befristet"}, flags: ["pay", "tooGood", "chat", "data"]},
  review: {typos: [["Kundenservise", "Kundenservice"], ["Kommunkation", "Kommunikation"]], types: ["weak", "nonum"]}
},
{
  name: "Anzeige von einer Jobbörse (Aufräumen)", lang: "de",
  offer: `Jetzt bewerben
Job speichern
Reinigungskraft (m/w/d) – Minijob – Köln
Vor 3 Tagen
Deine Aufgaben:
- Unterhaltsreinigung von Büros
- Reinigung der Sanitärbereiche
Dein Profil:
- Zuverlässigkeit und Sorgfalt
- Deutschkenntnisse
Ähnliche Jobs
Datenschutz`,
  cv: `Ewa Nowak · Köln · ewa.nowak@beispiel.de · 0221 555 0505
Berufserfahrung
Reinigungskraft, Beispiel Gebäudeservice (2020 - 2025): Unterhaltsreinigung von 900 m² Büros, Ladenöffnung um 6 Uhr.
Kenntnisse
Deutsch, Polnisch, Sorgfalt`,
  clean: {removed: ["Jetzt bewerben", "Job speichern", "Vor 3 Tagen", "Ähnliche Jobs", "Datenschutz"], kept: ["Reinigungskraft (m/w/d) – Minijob – Köln", "Unterhaltsreinigung von Büros"]},
  ok: ["Reinigung", "Pünktlichkeit"], mid: ["Sorgfalt", "Deutsch"], absent: ["Sanitär und Heizung"]
}
);
