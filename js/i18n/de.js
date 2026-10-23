// Allemand de Ça colle ? (« Passt das? ») : textes, lexique de l'analyse, lettre, mails, salaire (Allemagne). Chargé avant js/lang.js.
const I18N = {
  lang: "de",
  /* ---------- Textes de l'interface : clé = texte français exact (ou modèle avec {0}, {1}…) ---------- */
  s: {
    "fr-FR": "de-DE",
    // app.js
    "Offre": "Stellenangebot",
    "offre": "Stellenangebot",
    "Retirer cette offre": "Dieses Stellenangebot entfernen",
    "Colle le texte de l'annonce, pas son lien.": "Füg den Text der Anzeige ein, nicht den Link.",
    "Colle au moins quelques lignes de l'annonce.": "Füg mindestens ein paar Zeilen der Anzeige ein.",
    "{0} mots, c'est bon.": "{0} Wörter, das passt.",
    "{0} mots : colle l'annonce en entier, il en faut au moins {1}.": "{0} Wörter: Füg die ganze Anzeige ein, es braucht mindestens {1}.",
    "Colle d'abord l'offre": "Füg zuerst das Stellenangebot ein",
    "Ajoute d'abord l'offre et ton CV": "Füg zuerst das Stellenangebot und deinen Lebenslauf hinzu",
    "Ajouté à ton CV à l'étape 4.": "In Schritt 4 zu deinem Lebenslauf hinzugefügt.",
    "Ton CV montre environ {0} d'expérience.": "Dein Lebenslauf zeigt etwa {0} Berufserfahrung.",
    "Je ne trouve pas de dates dans ton CV. Ajoute les années de chaque poste (ex : 2022 - 2025) pour qu'on les compte.": "Ich finde keine Jahreszahlen in deinem Lebenslauf. Schreib zu jeder Stelle die Jahre dazu (z. B. 2022 - 2025), damit sie gezählt werden.",
    "Ton CV montre environ {0}. Pense à ajouter tes stages, jobs d'été, intérim ou bénévolat.": "Dein Lebenslauf zeigt etwa {0}. Denk auch an Praktika, Ferienjobs, Zeitarbeit oder Ehrenamt.",
    "« {0} »": "„{0}“",
    "Prouvé dans ton CV : ": "Belegt in deinem Lebenslauf: ",
    "C'est dans ton CV.": "Das steht in deinem Lebenslauf.",
    " Trouvé ici : ": " Gefunden hier: ",
    "Indispensable": "Pflicht",
    "Un plus": "Ein Plus",
    "Dans l'offre :": "In der Anzeige:",
    "« ": "„",
    " »": "“",
    "Dans ton CV :": "In deinem Lebenslauf:",
    "je n'ai pas trouvé de dates (ex : 2019 - 2023).": "keine Jahreszahlen gefunden (z. B. 2019 - 2023).",
    "les dates de tes postes font environ {0}.": "deine Stellen ergeben zusammen etwa {0}.",
    "<p><b>Mots cherchés :</b> les mots importants de cette ligne et des mots proches. {0} sur {1} trouvés dans ton CV (il en faut 6 sur 10).</p>": "<p><b>Gesuchte Wörter:</b> die wichtigen Wörter dieser Zeile und ähnliche Wörter. {0} von {1} in deinem Lebenslauf gefunden (nötig sind 6 von 10).</p>",
    "(pas dans une expérience, donc pas encore prouvé)": "(nicht bei einer Stelle, also noch nicht belegt)",
    "aucun mot proche trouvé.": "kein ähnliches Wort gefunden.",
    "<p><b>Tu as corrigé ce tampon.</b> Le calcul disait : {0}.</p>": "<p><b>Du hast diesen Stempel geändert.</b> Die Auswertung sagte: {0}.</p>",
    "à vérifier": "bitte prüfen",
    "ça colle !": "das passt!",
    "ça colle presque": "passt fast",
    "à retravailler": "da geht noch was",
    "Je n'ai reconnu aucun point dans cette offre.": "Ich habe in diesem Stellenangebot keinen Punkt erkannt.",
    "L'offre demande {0}. Ton CV en prouve {1}, en cite {2} sans exemple et n'en parle pas pour {3}.": "Die Anzeige verlangt {0}. Dein Lebenslauf belegt {1}, nennt {2} ohne Beispiel und sagt nichts zu {3}.",
    " Attention : {0} points indispensables manquent.": " Achtung: {0} Pflichtpunkte fehlen.",
    " Attention : un point indispensable manque.": " Achtung: Ein Pflichtpunkt fehlt.",
    "Rien à corriger pour l'instant.": "Im Moment gibt es nichts zu verbessern.",
    "absent de ton CV": "fehlt im Lebenslauf",
    "à prouver avec un exemple": "mit einem Beispiel belegen",
    " · indispensable": " · Pflicht",
    "Corriger": "Verbessern",
    "Améliorer mon CV →": "Lebenslauf verbessern →",
    "Rien d'urgent.": "Nichts Dringendes.",
    "Ton CV couvre tout ce que demande l'offre.": "Dein Lebenslauf deckt alles ab, was die Anzeige verlangt.",
    "Préparer ma lettre →": "Anschreiben vorbereiten →",
    "Je n'ai repéré que {0} dans cette offre. Vérifie que tu as collé l'annonce en entier, avec les missions et le profil recherché.": "Ich habe nur {0} in diesem Stellenangebot erkannt. Prüf, ob du die ganze Anzeige eingefügt hast, mit Aufgaben und gesuchtem Profil.",
    "Corrigé par toi": "Von dir geändert",
    "Ton CV dit « {0} », l'offre dit « {1} ».": "Dein Lebenslauf sagt „{0}“, die Anzeige sagt „{1}“.",
    "Corriger ce point": "Diesen Punkt verbessern",
    "Pourquoi ce tampon ?": "Warum dieser Stempel?",
    "Ce tampon est faux ?": "Stempel falsch?",
    "Pas une vraie demande": "Keine echte Anforderung",
    "Revenir au calcul": "Zurück zur Auswertung",
    "Si c'est dans ton CV avec d'autres mots, corrige le tampon. Si ce n'est pas dans ton CV, ajoute-le plutôt à l'étape 4.": "Wenn es mit anderen Worten in deinem Lebenslauf steht, änder den Stempel. Wenn es nicht drinsteht, füg es lieber in Schritt 4 hinzu.",
    "Points retirés": "Entfernte Punkte",
    "Remettre": "Wieder aufnehmen",
    "Les mots de l'annonce": "Die Wörter der Anzeige",
    "Les recruteurs et leurs logiciels cherchent les mots exacts de l'offre. Reprends-les dans ton CV quand c'est vrai.": "Personalverantwortliche und ihre Software suchen nach den genauen Wörtern der Anzeige. Übernimm sie in deinen Lebenslauf, wenn sie stimmen.",
    "Test robot recruteur": "Roboter-Check",
    "sur": "von",
    "Beaucoup d'entreprises trient les CV avec un logiciel avant qu'une personne les lise. Voici ce qui peut le gêner.": "Viele Firmen sortieren Bewerbungen mit einer Software, bevor ein Mensch sie liest. Das hier kann sie stören.",
    " : bon": ": gut",
    " : à corriger": ": verbessern",
    "L'annonce en bref": "Die Anzeige auf einen Blick",
    "Attention, cette annonce ressemble à une arnaque.": "Vorsicht, diese Anzeige sieht nach Betrug aus.",
    "Quelques points à vérifier avant de postuler.": "Ein paar Dinge solltest du vor der Bewerbung prüfen.",
    "Ne paie jamais pour postuler et ne donne pas tes papiers avant un contrat signé. En cas de doute, signale l'annonce au site qui la publie.": "Zahl nie Geld für eine Bewerbung und gib deine Unterlagen erst nach einem unterschriebenen Vertrag heraus. Im Zweifel meldest du die Anzeige bei der Seite, die sie veröffentlicht.",
    "salaire.html": "salary-de.html",
    "Brut → net": "Brutto → Netto",
    "pas indiqué": "nicht angegeben",
    "Ce qui n'est pas écrit, demande-le avant ou pendant l'entretien : c'est normal de poser la question.": "Was nicht drinsteht, fragst du vor oder im Vorstellungsgespräch nach: Das ist ganz normal.",
    "tes compétences": "deinen Kenntnissen",
    "ton expérience : ": "deiner Stelle: ",
    "ta formation": "deiner Ausbildung",
    "Prêt.": "Fertig.",
    "Remplis les cases jaunes.": "Füll die gelben Felder aus.",
    "Oui": "Ja",
    "Non": "Nein",
    "Point laissé de côté.": "Punkt beiseitegelegt.",
    "Revenir sur ce point": "Zurück zu diesem Punkt",
    "Dans": "In",
    "Ajouté": "Hinzugefügt",
    "Retirer": "Entfernen",
    "Ajouter à mon CV": "Zum Lebenslauf hinzufügen",
    "Rien à améliorer pour cette offre : ton CV couvre déjà tout ce qu'on sait repérer.": "Für dieses Stellenangebot gibt es nichts zu verbessern: Dein Lebenslauf deckt schon alles ab, was wir erkennen können.",
    "{0} point{1} sur {2} prouvé{3} dans ton CV.": "{0} von {2} Punkten in deinem Lebenslauf belegt.",
    "Relecture du CV": "Korrektur des Lebenslaufs",
    "Faute": "Fehler",
    "Verbe faible": "Schwaches Verb",
    "Trop long": "Zu lang",
    "Sans chiffre": "Ohne Zahl",
    "Style": "Stil",
    "Seules les fautes sont corrigées en un clic. Pour le reste, modifie le texte de ton CV à l'étape 2 (« Vérifier le texte lu »).": "Nur Tippfehler werden mit einem Klick korrigiert. Den Rest änderst du im Text deines Lebenslaufs in Schritt 2 („Gelesenen Text prüfen“).",
    "Rien à signaler : pas de faute courante, de verbe faible ni de phrase trop longue.": "Alles in Ordnung: kein häufiger Fehler, kein schwaches Verb, kein zu langer Satz.",
    "Aucun point fort trouvé pour l'instant : améliore d'abord ton CV à l'étape 4.": "Noch keine Stärken gefunden: Verbessere zuerst deinen Lebenslauf in Schritt 4.",
    "[intitulé du poste]": "[Stellenbezeichnung]",
    "[nom de l'entreprise]": "[Name des Unternehmens]",
    " : ": ": ",
    " chez {0}": " bei {0}",
    " [pourquoi ce poste ou cette entreprise]": " [warum diese Stelle oder dieses Unternehmen]",
    "[ton nom]": "[dein Name]",
    "[ton email et ton téléphone]": "[deine E-Mail und Telefonnummer]",
    "À l'attention du service recrutement": "Personalabteilung",
    "Madame, Monsieur,": "Sehr geehrte Damen und Herren,",
    "Prénom Nom": "Vorname Nachname",
    "poste": "Stelle",
    "Le nom de l'entreprise et le poste sont écrits dans ta lettre": "Firmenname und Stelle stehen in deinem Anschreiben",
    "Ton email et ton téléphone sont dans la lettre": "Deine E-Mail und Telefonnummer stehen im Anschreiben",
    "Ton CV a encore {0} (étape 4)": "Dein Lebenslauf hat noch {0} (Schritt 4)",
    "Pas de faute courante dans ton CV": "Kein häufiger Fehler im Lebenslauf",
    "Un point indispensable manque dans ton CV (étape 4)": "Ein Pflichtpunkt fehlt noch im Lebenslauf (Schritt 4)",
    "{0} points indispensables manquent dans ton CV (étape 4)": "{0} Pflichtpunkte fehlen noch im Lebenslauf (Schritt 4)",
    "{0} dans ton CV (étape 4)": "{0} im Lebenslauf (Schritt 4)",
    "Les points indispensables de l'offre sont dans ton CV": "Die Pflichtpunkte der Anzeige stehen im Lebenslauf",
    "CV enregistré en PDF, avec un nom clair : {0}_CV.pdf": "Lebenslauf als PDF gespeichert, mit klarem Namen: {0}_Lebenslauf.pdf",
    "Objet du mail clair : « Candidature {0} · {1} »": "Klarer Betreff der E-Mail: „Bewerbung {0} · {1}“",
    "CV et lettre joints au mail (ou collés dans le formulaire du site)": "Lebenslauf und Anschreiben an der E-Mail (oder ins Formular der Seite eingefügt)",
    "Lettre relue une dernière fois, à voix haute": "Anschreiben ein letztes Mal laut gelesen",
    "Annonce gardée : copie du texte ou lien noté dans ton suivi": "Anzeige gesichert: Text kopiert oder Link in deiner Übersicht notiert",
    "Avant d'envoyer": "Vor dem Absenden",
    " : fait": ": erledigt",
    " : à faire": ": offen",
    "C'est envoyé : noter dans mon suivi": "Abgeschickt: in meiner Übersicht notieren",
    "Revenir au modèle": "Zurück zur Vorlage",
    "Modifier le texte": "Text bearbeiten",
    "Lettre_": "Anschreiben_",
    "motivation": "Bewerbung",
    "Fichier Word téléchargé": "Word-Datei heruntergeladen",
    "Choisis « Enregistrer en PDF »": "Wähle „Als PDF speichern“",
    "Texte copié": "Text kopiert",
    "Copie impossible : sélectionne le texte": "Kopieren nicht möglich: Markier den Text",
    " (indispensable)": " (Pflicht)",
    "Bilan Ça colle ?": "Auswertung Passt das?",
    "Score : {0} % ({1}). {2} point{3} prouvé{4}, {5} à préciser, {6} absent{7} du CV, sur {8}.": "Ergebnis: {0} % ({1}). Von {8} Punkten: {2} belegt, {5} ohne Beleg, {6} fehlen im Lebenslauf.",
    "Suivi : ": "Stand: ",
    " · envoyée le ": " · abgeschickt am ",
    "Pas dans le CV": "Nicht im Lebenslauf",
    "À préciser avec un exemple": "Mit einem Beispiel belegen",
    "Ça colle": "Passt",
    "L'annonce": "Die Anzeige",
    " : pas indiqué": ": nicht angegeben",
    "Test robot recruteur : à corriger": "Roboter-Check: zu verbessern",
    "Ajouté au CV avec l'app": "Mit der App zum Lebenslauf hinzugefügt",
    "Fait avec Ça colle ? (ca-colle.pissits.com) : l'analyse se fait sur l'appareil, rien n'est envoyé.": "Erstellt mit Passt das? (ca-colle.pissits.com): Die Auswertung läuft auf dem Gerät, nichts wird verschickt.",
    "Bilan_": "Auswertung_",
    "Mon bilan de candidature": "Meine Bewerbungsauswertung",
    "Bilan copié : colle-le dans un mail": "Auswertung kopiert: Füg sie in eine E-Mail ein",
    "Copie impossible": "Kopieren nicht möglich",
    "{0} lignes · {1} expérience{2} repérée{3} · aucun titre de rubrique trouvé (Expériences, Compétences…)": "{0} Zeilen · davon {1} zur Berufserfahrung · keine Überschrift gefunden (Berufserfahrung, Kenntnisse…)",
    "{0} lignes · {1} expérience{2} repérée{3}{4}": "{0} Zeilen · davon {1} zur Berufserfahrung",
    " · relis le texte lu, la photo n'était pas très nette": " · prüf den gelesenen Text, das Foto war nicht ganz scharf",
    "CV lu": "Lebenslauf gelesen",
    "Je n'ai pas réussi à lire ce fichier. Essaie un PDF.": "Ich konnte diese Datei nicht lesen. Versuch es mit einem PDF.",
    "Offre lue": "Stellenangebot gelesen",
    "La capture n'était pas très nette : relis le texte de l'offre avant de continuer.": "Der Screenshot war nicht ganz scharf: Prüf den Text des Stellenangebots, bevor du weitermachst.",
    "Je n'ai pas réussi à lire ce fichier.": "Ich konnte diese Datei nicht lesen.",
    "Ton CV": "Dein Lebenslauf",
    " et ": " und ",
    " sont là.": ": alles wieder da.",
    "Ajouté à ton CV": "Zum Lebenslauf hinzugefügt",
    "Point retiré du score": "Punkt aus dem Ergebnis entfernt",
    "Tampon corrigé": "Stempel geändert",
    "Revenu au calcul": "Zurück zur Auswertung",
    "Corrigé : « {0} »": "Korrigiert: „{0}“",
    "Exemple : CV de Camille Martin": "Beispiel: Lebenslauf von Lena Schneider",
    "CV fictif pour essayer": "Erfundener Lebenslauf zum Ausprobieren",
    "Colle la nouvelle offre : ton CV est gardé": "Füg das neue Stellenangebot ein: Dein Lebenslauf bleibt",
    "Ta session restera sur cet appareil": "Deine Sitzung bleibt auf diesem Gerät",
    "Plus rien n'est gardé sur cet appareil": "Auf diesem Gerät wird nichts mehr gespeichert",
    "Ton CV et tes offres ne sont plus gardés. Ton suivi reste sur cet appareil.": "Dein Lebenslauf und deine Stellenangebote werden nicht mehr gespeichert. Deine Übersicht bleibt auf diesem Gerät.",
    "Je n'arrive pas à enregistrer sur cet appareil (mémoire du navigateur pleine ?). Pour ne rien perdre, fais une sauvegarde : Mes candidatures, menu Import / Export.": "Speichern auf diesem Gerät klappt nicht (Browserspeicher voll?). Damit nichts verloren geht, mach eine Sicherung: Meine Bewerbungen, Menü Import / Export.",
    "Sauvegarde ouverte. Ta session est maintenant gardée sur cet appareil : tu peux décocher la case en bas de page.": "Sicherung geöffnet. Deine Sitzung wird jetzt auf diesem Gerät gespeichert: Du kannst das Kästchen unten auf der Seite abwählen.",
    "J'ai retiré {0} du site (boutons, menus, mentions).": "Ich habe {0} der Website entfernt (Buttons, Menüs, Hinweise).",
    "App installée": "App installiert",
    "Annonce reçue": "Anzeige empfangen",
    "Le site n'a envoyé que le lien : copie le texte de l'annonce": "Die Seite hat nur den Link geschickt: Kopier den Text der Anzeige",
    // Y(n) : le pluriel est déjà allemand (« 3 Jahre »), on le garde tel quel
    "{0} Jahre": "{0} Jahre",
    "{0} Jahr": "{0} Jahr",
    // moteur.js
    "À préciser": "Beleg fehlt",
    "Pas dans ton CV": "Fehlt im Lebenslauf",
    "Compétences": "Kenntnisse",
    "cette qualité": "diese Stärke",
    "ex : {0}": "z. B. {0}",
    "ex : …": "z. B. …",
    "Pas grave. Si tu es prêt(e) à apprendre, dis-le dans ta lettre de motivation.": "Kein Problem. Wenn du bereit bist, es zu lernen, schreib das in dein Anschreiben.",
    "C'est cité, mais aucune expérience ne le montre. Dis où tu l'as fait.": "Es wird genannt, aber keine Stelle zeigt es. Schreib, wo du es gemacht hast.",
    " {0} : {où et combien ? {1}}.": " {0}: {wo und wie viel? {1}}.",
    "As-tu déjà fait ça : {0} ?": "Hast du das schon gemacht: {0}?",
    "Un mot seul ne prouve rien : ajoute un fait concret.": "Ein Wort allein beweist nichts: Füg ein konkretes Beispiel hinzu.",
    "L'offre le demande : prouve-le par un fait, pas par un adjectif.": "Die Anzeige verlangt es: Zeig es mit einem Beispiel, nicht mit einem Adjektiv.",
    " {un fait qui montre {0} ? {1}}.": " {ein Beispiel, das {0} zeigt? {1}}.",
    "Dis à quoi il te sert, ça parle plus qu'un nom de logiciel.": "Schreib, wofür du es nutzt: Das sagt mehr als ein Programmname.",
    "{0} ({pour quoi faire ? {1}})": "{0} ({wofür? {1}})",
    "Sais-tu utiliser {0} ?": "Kannst du mit {0} umgehen?",
    ", {0} ({ton niveau ou un exemple ? {1}})": ", {0} ({dein Niveau oder ein Beispiel? {1}})",
    "Si c'est un « plus », ce n'est pas bloquant. Sinon, une formation courte peut suffire.": "Wenn es nur ein Plus ist, ist es kein Ausschlussgrund. Sonst reicht oft ein kurzer Kurs.",
    "As-tu : {0} ?": "Hast du: {0}?",
    ", {0} ({année ou détail ? ex : {1}})": ", {0} ({Jahr oder Detail? z. B. {1}})",
    ", {0} ({année ou détail ? {1}})": ", {0} ({Jahr oder Detail? {1}})",
    "Certaines entreprises financent la formation. Tu peux dire dans ta lettre que tu es prêt(e) à la passer.": "Manche Firmen bezahlen die Schulung. Du kannst im Anschreiben sagen, dass du bereit bist, sie zu machen.",
    "{0} ({ton niveau ? ex : scolaire, courant})": "{0} ({dein Niveau? z. B. Grundkenntnisse, fließend})",
    "Tu parles {0} ?": "Sprichst du {0}?",
    ", {0} {ton niveau ? ex : scolaire}": ", {0} {dein Niveau? z. B. Grundkenntnisse}",
    "Si l'offre dit « apprécié », ce n'est pas bloquant.": "Wenn die Anzeige „von Vorteil“ sagt, ist es kein Ausschlussgrund.",
    "Acceptes-tu ces horaires ?": "Passen dir diese Arbeitszeiten?",
    ", disponible {quand ? ex : en horaires décalés et le week-end}": ", verfügbar {wann? z. B. im Schichtdienst und am Wochenende}",
    "Dis-le franchement en entretien : c'est mieux que de mauvaises surprises.": "Sag es im Vorstellungsgespräch ehrlich: Das ist besser als böse Überraschungen.",
    "As-tu ce diplôme ({0}) ?": "Hast du diesen Abschluss ({0})?",
    "{0} {spécialité et année ? ex : Employé de commerce, 2020}": "{0} {Fachrichtung und Jahr? z. B. Verkäuferin, 2020}",
    "Une expérience équivalente compte souvent autant : mets-la en avant dans ta lettre.": "Vergleichbare Erfahrung zählt oft genauso viel: Stell sie im Anschreiben heraus.",
    "C'est cité, mais sans exemple concret.": "Es wird genannt, aber ohne konkretes Beispiel.",
    " {un exemple concret ? ex : où, combien, pendant combien de temps}.": " {ein konkretes Beispiel? z. B. wo, wie viel, wie lange}.",
    "As-tu déjà fait ça ?": "Hast du das schon gemacht?",
    " {ce que tu as fait ? ex : où, combien, pendant combien de temps}.": " {was du gemacht hast? z. B. wo, wie viel, wie lange}.",
    "Pas grave : mets en avant ce qui s'en rapproche le plus.": "Kein Problem: Stell heraus, was dem am nächsten kommt.",
    "{0} ans d'expérience": "{0} Jahre Berufserfahrung",
    "1 an d'expérience": "1 Jahr Berufserfahrung",
    "Diplôme : {0}": "Abschluss: {0}",
    "Ton CV est une image": "Dein Lebenslauf ist ein Bild",
    "Ton CV contient du vrai texte": "Dein Lebenslauf enthält echten Text",
    "Beaucoup de logiciels de tri ne lisent pas les images. Envoie plutôt un PDF enregistré depuis Word ou Google Docs.": "Viele Bewerbungsprogramme können keine Bilder lesen. Schick lieber ein PDF, das du aus Word oder Google Docs gespeichert hast.",
    "Les logiciels de tri peuvent le lire.": "Bewerbungsprogramme können ihn lesen.",
    "Adresse email": "E-Mail-Adresse",
    "Mets ton email en haut du CV, en texte (pas dans une image).": "Schreib deine E-Mail oben in den Lebenslauf, als Text (nicht in einem Bild).",
    "Numéro de téléphone": "Telefonnummer",
    "Ajoute ton numéro en haut du CV, au format 06 12 34 56 78.": "Schreib deine Nummer oben in den Lebenslauf, zum Beispiel 0151 23456789.",
    "Titre « Expériences »": "Überschrift „Berufserfahrung“",
    "Écris un titre clair « Expériences professionnelles » au-dessus de tes postes.": "Schreib eine klare Überschrift „Berufserfahrung“ über deine Stellen.",
    "Titre « Compétences »": "Überschrift „Kenntnisse“",
    "Ajoute une rubrique « Compétences » avec les mots de l'offre.": "Füg einen Abschnitt „Kenntnisse“ mit den Wörtern der Anzeige hinzu.",
    "Titre « Formation »": "Überschrift „Ausbildung“",
    "Ajoute une rubrique « Formation » avec tes diplômes, même s'il n'y en a qu'un.": "Füg einen Abschnitt „Ausbildung“ mit deinen Abschlüssen hinzu, auch wenn es nur einer ist.",
    "Dates sur tes expériences": "Jahreszahlen bei deinen Stellen",
    "Mets les années de début et de fin de chaque poste (ex : 2022 - 2025).": "Schreib zu jeder Stelle Anfangs- und Endjahr (z. B. 2022 - 2025).",
    "CV un peu court": "Lebenslauf etwas kurz",
    "CV très long": "Lebenslauf sehr lang",
    "Longueur correcte": "Gute Länge",
    "Détaille un peu plus tes expériences : ce que tu faisais, avec des chiffres.": "Beschreib deine Stellen etwas genauer: was du gemacht hast, mit Zahlen.",
    "Garde l'essentiel sur 1 ou 2 pages.": "Bleib beim Wichtigsten, auf 1 oder 2 Seiten.",
    "Pas de caractères bizarres": "Keine seltsamen Zeichen",
    "Certains symboles ou icônes ne sont pas lus. Remplace-les par du texte (ex : « Tél : »).": "Manche Symbole oder Icons werden nicht gelesen. Ersetz sie durch Text (z. B. „Tel.:“).",
    "Salaire": "Gehalt",
    "Contrat": "Vertrag",
    "Temps de travail": "Arbeitszeit",
    "Télétravail": "Homeoffice",
    "Début": "Beginn",
    "On te demande de payer": "Du sollst etwas bezahlen",
    "Une vraie entreprise ne fait jamais payer pour postuler, pour une formation obligatoire ou pour un « kit ».": "Ein echtes Unternehmen verlangt nie Geld für eine Bewerbung, eine Pflichtschulung oder ein „Starterpaket“.",
    "On te demande des données sensibles": "Du sollst sensible Daten schicken",
    "Ne donne pas ton RIB, ta carte Vitale ou une copie de pièce d'identité avant d'avoir signé un contrat.": "Gib deine Bankdaten, deine Steuer-ID oder eine Kopie deines Ausweises erst heraus, wenn du einen Vertrag unterschrieben hast.",
    "Contact par messagerie seulement": "Kontakt nur per Messenger",
    "Les arnaques passent souvent par WhatsApp ou Telegram. Cherche le site et l'adresse de l'entreprise.": "Betrug läuft oft über WhatsApp oder Telegram. Such die Website und die Adresse des Unternehmens.",
    "Trop beau pour être vrai": "Zu schön, um wahr zu sein",
    "Des gains élevés et rapides sans expérience, c'est le signe classique d'une arnaque.": "Hoher, schneller Verdienst ohne Erfahrung ist ein typisches Zeichen für Betrug.",
    "Vente à domicile ou parrainage": "Haustürverkauf oder Anwerben anderer",
    "Vérifie que tu seras salarié(e) avec un vrai contrat, et pas payé(e) seulement à la commission.": "Prüf, ob du mit einem echten Arbeitsvertrag angestellt wirst und nicht nur auf Provision arbeitest.",
    "Adresse email personnelle": "Private E-Mail-Adresse",
    "Une adresse Gmail, Hotmail ou Yahoo pour une entreprise : vérifie qu'elle existe vraiment (site, SIRET, avis).": "Eine Gmail-, GMX- oder Web.de-Adresse für ein Unternehmen: Prüf, ob es die Firma wirklich gibt (Website, Impressum, Handelsregister, Bewertungen).",
    "Lieu": "Ort",
    "« {0} » s'écrit « {1} »": "„{0}“ schreibt man „{1}“",
    "« {0} » ne dit pas ce que tu as fait toi-même. Préfère un verbe d'action : « organisé », « géré », « préparé », « vendu »…": "„{0}“ sagt nicht, was du selbst gemacht hast. Nimm lieber ein Tätigkeitsverb: „organisiert“, „geleitet“, „vorbereitet“, „verkauft“…",
    "Phrase de {0} mots : coupe-la en deux, un recruteur lit vite.": "Satz mit {0} Wörtern: Teil ihn in zwei, Personaler lesen schnell.",
    "Aucun chiffre ici : ajoute combien (clients, commandes, personnes, euros) ou pendant combien de temps.": "Hier steht keine Zahl: Schreib dazu, wie viele (Kunden, Bestellungen, Personen, Euro) oder wie lange.",
    "« Je » revient {0} fois. Dans un CV, commence plutôt par le verbe : « Préparé 120 commandes par jour ».": "„Ich“ kommt {0}-mal vor. Im Lebenslauf fängst du besser mit der Tätigkeit an: „120 Bestellungen pro Tag kommissioniert“.",
    // outils.js
    "Relance": "Nachfassen",
    "Merci après l'entretien": "Danke nach dem Gespräch",
    "Accepter une proposition": "Ein Angebot annehmen",
    "Refuser poliment": "Höflich absagen",
    "Demander un retour après un refus": "Nach einer Absage um Rückmeldung bitten",
    "Bonjour {0},": "Guten Tag {0},",
    "Bonjour,": "Sehr geehrte Damen und Herren,",
    "Bien cordialement,": "Mit freundlichen Grüßen",
    " envoyée le {0}": " vom {0}",
    "← Retour au suivi": "← Zurück zur Übersicht",
    "Écrire un mail": "E-Mail schreiben",
    "Type de mail": "Art der E-Mail",
    "Objet": "Betreff",
    "Message": "Nachricht",
    "Relis et complète ce qui est entre crochets avant d'envoyer. Le mail part de ta propre messagerie.": "Lies sie durch und ergänze, was in eckigen Klammern steht, bevor du sie abschickst. Die E-Mail geht von deinem eigenen Postfach aus.",
    " Ajoute l'email du contact dans la fiche pour qu'il soit rempli tout seul.": " Trag die E-Mail des Kontakts in die Karte ein, dann wird sie automatisch ausgefüllt.",
    "Ouvrir dans ma messagerie": "In meinem E-Mail-Programm öffnen",
    "Copier": "Kopieren",
    "Noter comme relancée": "Als nachgefasst markieren",
    "Entretien": "Vorstellungsgespräch",
    "Relancer": "Nachfassen",
    "Candidature": "Bewerbung",
    "candidature": "Bewerbung",
    "Contact : ": "Kontakt: ",
    "Ouvre le fichier pour l'ajouter à ton agenda": "Öffne die Datei, um den Termin in deinen Kalender einzutragen",
    "Ce qui manque le plus à ton CV": "Was deinem Lebenslauf am meisten fehlt",
    "Sur tes {0} offres, ces points reviennent souvent et ton CV ne les prouve pas encore. Les ajouter aide pour plusieurs candidatures à la fois.": "In deinen {0} Stellenangeboten kommen diese Punkte oft vor, und dein Lebenslauf belegt sie noch nicht. Wenn du sie ergänzt, hilft das mehreren Bewerbungen gleichzeitig.",
    "revient dans {0} offres sur {1}": "in {0} von {1} Stellenangeboten gefragt",
    " · indispensable dans {0}": " · Pflicht in {0}",
    "pas dans ton CV": "nicht im Lebenslauf",
    "à prouver": "zu belegen",
    "Aucun point ne manque dans plusieurs offres à la fois : bonne nouvelle.": "Kein Punkt fehlt in mehreren Stellenangeboten gleichzeitig: gute Nachricht.",
    "Il faut au moins deux offres analysées pour les comparer. Colle une autre offre avec « Comparer avec une autre offre » à l'étape 3.": "Zum Vergleichen brauchst du mindestens zwei ausgewertete Stellenangebote. Füg mit „Mit einem anderen Angebot vergleichen“ in Schritt 3 ein weiteres ein.",
    "Score": "Ergebnis",
    "État": "Stand",
    "Absent de ton CV": "Fehlt im Lebenslauf",
    " (dont {0} indispensable{1})": " (davon {0} Pflicht)",
    "Alertes": "Warnungen",
    "Critère": "Kriterium",
    "Seules les offres dont tu as collé le texte apparaissent ici. Clique sur un titre pour revoir son analyse.": "Hier erscheinen nur Stellenangebote, deren Text du eingefügt hast. Klick auf einen Titel, um die Auswertung wieder zu sehen.",
    "Quel est le salaire prévu pour ce poste ?": "Welches Gehalt ist für diese Stelle vorgesehen?",
    "Quel type de contrat est proposé, et pour combien de temps ?": "Welche Art von Vertrag wird angeboten, und für wie lange?",
    "Quels sont les horaires et le temps de travail ?": "Wie sind die Arbeitszeiten und wie viele Stunden pro Woche?",
    "Où se trouve le lieu de travail ? Y a-t-il des déplacements ?": "Wo ist der Arbeitsort? Gibt es Dienstreisen?",
    "Le télétravail est-il possible, même en partie ?": "Ist Homeoffice möglich, auch teilweise?",
    "Quand le poste commence-t-il ?": "Wann beginnt die Stelle?",
    "Pouvez-vous me donner le nom et l'adresse exacts de l'entreprise ?": "Können Sie mir den genauen Namen und die Adresse des Unternehmens nennen?",
    "À quoi ressemble une journée type sur ce poste ?": "Wie sieht ein typischer Arbeitstag auf dieser Stelle aus?",
    "Comment est composée l'équipe ?": "Wie ist das Team zusammengesetzt?",
    "Comment se passe l'arrivée d'un nouveau salarié (formation, tuteur) ?": "Wie läuft die Einarbeitung neuer Mitarbeitender ab (Schulung, feste Ansprechperson)?",
    "Quelles sont les prochaines étapes du recrutement ?": "Wie geht es im Bewerbungsprozess weiter?",
    "Questions à poser au recruteur": "Fragen an die Personalverantwortlichen",
    "Choisis-en 2 ou 3. Les premières viennent de ce que l'annonce ne dit pas.": "Such dir 2 oder 3 aus. Die ersten kommen aus dem, was die Anzeige nicht sagt.",
    "ca-colle-sauvegarde-": "passt-das-sicherung-",
    "Fichier enregistré : ouvre-le sur ton autre appareil": "Datei gespeichert: Öffne sie auf deinem anderen Gerät",
    "Ce fichier n'est pas une sauvegarde de Ça colle ?": "Diese Datei ist keine Sicherung von Passt das?",
    "Remplacer ce qui est dans l'app par le contenu de ce fichier ?": "Den Inhalt der App durch den Inhalt dieser Datei ersetzen?",
    "Impossible d'enregistrer sur cet appareil": "Speichern auf diesem Gerät nicht möglich",
    "Mail copié": "E-Mail kopiert",
    "Notée comme relancée, nouveau rappel dans 7 jours": "Als nachgefasst markiert, neue Erinnerung in 7 Tagen",
    "Aucune candidature envoyée sur cette période": "In diesem Zeitraum keine Bewerbung abgeschickt",
    "du {0} au {1}": "vom {0} bis {1}",
    "Mes démarches de recherche d'emploi": "Meine Eigenbemühungen bei der Jobsuche",
    "Période : ": "Zeitraum: ",
    "Date": "Datum",
    "Entreprise": "Unternehmen",
    "Poste": "Stelle",
    "Contact ou lien": "Kontakt oder Link",
    "Liste établie le {0} à partir du suivi tenu par la personne avec Ça colle ? (ca-colle.pissits.com).": "Liste erstellt am {0} aus der eigenen Bewerbungsübersicht der Person mit Passt das? (ca-colle.pissits.com).",
    "Ton tableau de bord se remplira quand tu auras noté des candidatures envoyées.": "Deine Statistik füllt sich, sobald du abgeschickte Bewerbungen notiert hast.",
    "candidatures envoyées": "Bewerbungen abgeschickt",
    " %": " %",
    "de réponses ({0})": "mit Antwort ({0})",
    "entretiens obtenus": "Vorstellungsgespräche",
    "jour": "Tag",
    "avant une réponse, en moyenne": "bis zur Antwort, im Schnitt",
    "Cette semaine : ": "Diese Woche: ",
    "{0} candidatures sur un objectif de {1}": "{0} Bewerbungen bei einem Ziel von {1}",
    "Mon objectif par semaine": "Mein Ziel pro Woche",
    "Objectif atteint, bravo. Pense aussi à te reposer.": "Ziel erreicht, super. Denk auch an Pausen.",
    "Encore {0} pour atteindre ton objectif. La qualité compte plus que le nombre : une lettre adaptée vaut mieux que trois envois rapides.": "Noch {0} bis zu deinem Ziel. Qualität zählt mehr als Menge: Ein passendes Anschreiben ist besser als drei schnelle Bewerbungen.",
    "Candidatures par semaine": "Bewerbungen pro Woche",
    "Où en sont tes candidatures": "Wo deine Bewerbungen stehen",
    "[ton prénom]": "[dein Vorname]",
    "Remplacer ta réponse actuelle par le pitch ?": "Deine jetzige Antwort durch den Pitch ersetzen?",
    "Pitch prêt : complète ce qui est entre crochets": "Pitch fertig: Ergänze, was in eckigen Klammern steht",
    // suivi.js
    "À postuler": "Noch bewerben",
    "Candidature envoyée": "Bewerbung abgeschickt",
    "Relancée": "Nachgefasst",
    "Appel de prise de contact": "Erstes Telefonat",
    "Entretien prévu": "Gespräch geplant",
    "Entretien passé": "Gespräch geführt",
    "Test ou mise en situation": "Test oder Probearbeiten",
    "Proposition reçue": "Angebot erhalten",
    "Acceptée": "Angenommen",
    "Refusée": "Absage",
    "Sans réponse": "Keine Antwort",
    "Abandonnée": "Aufgegeben",
    "Rendez-vous": "Termin",
    "À faire": "Zu erledigen",
    "{0} aujourd'hui": "{0}: heute",
    "{0} prévue il y a {1}": "{0}: {1} überfällig",
    "{0} demain": "{0}: morgen",
    "{0} dans 2 jours": "{0}: in 2 Tagen",
    "Sans nouvelles depuis {0} : relance": "{0} ohne Antwort: nachfassen",
    "Pas encore postulé": "Noch nicht beworben",
    "Rien d'urgent. Pense à noter chaque réponse.": "Nichts Dringendes. Denk daran, jede Antwort zu notieren.",
    "Aucune candidature pour l'instant. Ajoute-en une, ou clique sur « Suivre cette candidature » après une analyse.": "Noch keine Bewerbung. Füg eine hinzu oder klick nach einer Auswertung auf „Diese Bewerbung verfolgen“.",
    "Aucune candidature dans ce filtre.": "Keine Bewerbung in diesem Filter.",
    "Entreprise à préciser": "Unternehmen noch offen",
    "Score de l'analyse": "Ergebnis der Auswertung",
    "Offre du": "Anzeige vom",
    "Prochaine étape": "Nächster Schritt",
    "Détails et suivi": "Details und Verlauf",
    "Date de l'offre": "Datum der Anzeige",
    "Date de candidature": "Bewerbungsdatum",
    "Prochaine étape (relance, entretien…)": "Nächster Schritt (Nachfassen, Gespräch…)",
    "Contact": "Kontakt",
    "ex : Mme Dupont, RH, 02 31 00 00 00": "z. B. Frau Krause, Personal, 0521 000000",
    "Lien de l'annonce": "Link zur Anzeige",
    "Notes": "Notizen",
    "ex : entretien avec le chef d'équipe, questions sur les horaires": "z. B. Gespräch mit der Teamleitung, Fragen zu den Arbeitszeiten",
    "Voir l'analyse": "Auswertung ansehen",
    "Préparer l'entretien": "Gespräch vorbereiten",
    "Ajouter à l'agenda": "In den Kalender",
    "Ouvrir l'annonce": "Anzeige öffnen",
    "Supprimer": "Löschen",
    "Actions": "Aktionen",
    "(en retard)": "(überfällig)",
    "Ouvrir": "Öffnen",
    "Lien": "Link",
    "mes_candidatures.csv": "meine_bewerbungen.csv",
    "Fichier téléchargé : il s'ouvre dans Excel ou LibreOffice": "Datei heruntergeladen: Sie öffnet sich in Excel oder LibreOffice",
    "Présentez-vous en quelques minutes.": "Stellen Sie sich bitte kurz vor.",
    "Ton parcours en 3 étapes, puis pourquoi ce poste. Une minute ou deux suffisent.": "Dein Werdegang in 3 Schritten, dann warum diese Stelle. Ein bis zwei Minuten reichen.",
    "Pourquoi ce poste et pourquoi notre entreprise ?": "Warum diese Stelle und warum unser Unternehmen?",
    "Reprends ce que tu as écrit dans ta lettre.": "Greif auf, was du im Anschreiben geschrieben hast.",
    "Ces horaires vous conviennent-ils ({0}) ?": "Passen Ihnen diese Arbeitszeiten ({0})?",
    "Réponds franchement, avec tes contraintes s'il y en a.": "Antworte ehrlich, mit deinen Einschränkungen, falls es welche gibt.",
    "{0} : depuis quand l'avez-vous ?": "{0}: Seit wann haben Sie das?",
    "Avez-vous : {0} ? Sinon, êtes-vous prêt(e) à le passer ?": "Haben Sie das: {0}? Wenn nicht, wären Sie bereit, es nachzuholen?",
    "Une date, ou ton plan pour l'obtenir.": "Ein Datum oder dein Plan, wie du es bekommst.",
    "Parlez-moi de votre parcours et de votre expérience.": "Erzählen Sie mir von Ihrem Werdegang und Ihrer Erfahrung.",
    "Commence par le poste le plus proche de cette offre.": "Fang mit der Stelle an, die diesem Angebot am nächsten kommt.",
    "Donnez un exemple qui montre votre {0}.": "Nennen Sie ein Beispiel, das das zeigt: {0}.",
    "Un vrai moment, pas un adjectif.": "Eine echte Situation, kein Adjektiv.",
    "Parlez-moi de votre expérience en {0}.": "Erzählen Sie mir von Ihrer Erfahrung damit: {0}.",
    "Appuie-toi sur ton CV : « {0} »": "Stütz dich auf deinen Lebenslauf: „{0}“",
    "Pouvez-vous donner un exemple concret : {0} ?": "Können Sie ein konkretes Beispiel nennen: {0}?",
    "Ton CV le cite sans exemple : prépare un fait avec un chiffre.": "Dein Lebenslauf nennt es ohne Beispiel: Bereite ein Beispiel mit einer Zahl vor.",
    "L'offre demande : {0}. Comment feriez-vous ?": "Die Anzeige verlangt: {0}. Wie würden Sie das angehen?",
    "N'invente pas d'expérience : dis ce qui s'en rapproche et que tu es prêt(e) à apprendre.": "Erfinde keine Erfahrung: Sag, was dem am nächsten kommt und dass du bereit bist zu lernen.",
    "Racontez une situation difficile au travail et ce que vous avez fait.": "Erzählen Sie von einer schwierigen Situation bei der Arbeit und was Sie getan haben.",
    "Choisis une histoire qui finit bien, et ce que tu en as appris.": "Wähl eine Geschichte, die gut ausgeht, und was du daraus gelernt hast.",
    "Quelles sont vos qualités, et un point que vous travaillez ?": "Was sind Ihre Stärken, und woran arbeiten Sie noch?",
    "Une qualité utile pour ce poste, avec un exemple. Un vrai point à améliorer, et ce que tu fais pour.": "Eine Stärke, die für diese Stelle nützt, mit Beispiel. Eine echte Schwäche, und was du dagegen tust.",
    "Quand êtes-vous disponible, et quelles sont vos attentes de salaire ?": "Ab wann können Sie anfangen, und was sind Ihre Gehaltsvorstellungen?",
    "Regarde les salaires du métier avant. Donne une fourchette.": "Informier dich vorher über die Gehälter im Beruf. Nenn eine Spanne.",
    "Avez-vous des questions ?": "Haben Sie noch Fragen?",
    "Prépare 2 questions : une sur le poste au quotidien, une sur l'équipe.": "Bereite 2 Fragen vor: eine zum Arbeitsalltag, eine zum Team.",
    "Méthode simple :": "Einfache Methode:",
    "la situation (où, quand), ce que tu as fait toi, et le résultat (avec un chiffre si possible). Écris seulement des choses vraies : c'est toi qui réponds le jour J.": "die Situation (wo, wann), was du selbst gemacht hast, und das Ergebnis (mit einer Zahl, wenn möglich). Schreib nur, was stimmt: Im Gespräch antwortest du selbst.",
    "Pour avoir des questions sur cette offre, ajoute le texte de l'annonce et ton CV. En attendant, voici les questions classiques.": "Für Fragen zu diesem Stellenangebot füg den Text der Anzeige und deinen Lebenslauf hinzu. Bis dahin hier die klassischen Fragen.",
    "Préparer mon pitch d'une minute": "Meinen Ein-Minuten-Pitch vorbereiten",
    "Ma réponse": "Meine Antwort",
    "Situation": "Situation",
    "ex : au Drive Super U, un samedi de rush": "z. B. im Supermarkt, an einem vollen Samstag",
    "Ce que j'ai fait": "Was ich gemacht habe",
    "Résultat": "Ergebnis",
    "ex : 120 commandes prêtes à l'heure": "z. B. 120 Bestellungen pünktlich fertig",
    "Télécharger en Word": "Als Word herunterladen",
    "En PDF": "Als PDF",
    "Préparation d'entretien": "Vorbereitung Vorstellungsgespräch",
    "Situation : ": "Situation: ",
    "Ce que j'ai fait : ": "Was ich gemacht habe: ",
    "Résultat : ": "Ergebnis: ",
    "Candidature notée comme envoyée": "Bewerbung als abgeschickt notiert",
    "Ajoutée à ton suivi": "Zu deiner Übersicht hinzugefügt",
    "Preparation_entretien_": "Vorbereitung_Gespraech_",
    "Supprimer « {0} » de ton suivi ?": "„{0}“ aus deiner Übersicht löschen?",
    // confort.js
    "À faire en premier : ": "Zuerst erledigen: ",
    // lecteur.js
    "Lecture de l'image : {0} %": "Bild wird gelesen: {0} %",
    "Préparation de la lecture d'image (la première fois seulement)…": "Bilderkennung wird vorbereitet (nur beim ersten Mal)…",
    "Ce fichier Word semble abîmé. Enregistre-le à nouveau ou envoie un PDF.": "Diese Word-Datei scheint beschädigt. Speicher sie neu oder schick ein PDF.",
    "Ce fichier ne contient pas de texte lisible.": "Diese Datei enthält keinen lesbaren Text.",
    "Fichier trop lourd : 20 Mo maximum.": "Datei zu groß: höchstens 20 MB.",
    "Lecture du texte…": "Text wird gelesen…",
    "Fichier texte": "Textdatei",
    "Ouverture du document Word…": "Word-Dokument wird geöffnet…",
    "Document Word": "Word-Dokument",
    "Ouverture du document…": "Dokument wird geöffnet…",
    "Document OpenDocument": "OpenDocument-Datei",
    "L'ancien format Word (.doc) n'est pas lu. Dans Word, fais « Enregistrer sous » en .docx ou en PDF.": "Das alte Word-Format (.doc) wird nicht gelesen. Wähle in Word „Speichern unter“ als .docx oder PDF.",
    "Chargement du lecteur PDF…": "PDF-Leser wird geladen…",
    "Ce PDF est une image : lecture à l'œil (OCR)…": "Dieses PDF ist ein Bild: Texterkennung (OCR) läuft…",
    "PDF scanné · {0} · lu à {1} %": "Gescanntes PDF · {0} · zu {1} % gelesen",
    "Les photos HEIC d'iPhone ne s'ouvrent pas dans le navigateur. Envoie une capture d'écran ou un JPEG.": "HEIC-Fotos vom iPhone öffnen sich nicht im Browser. Schick einen Screenshot oder ein JPEG.",
    "Lecture de la photo…": "Foto wird gelesen…",
    "Photo · lue à {0} %": "Foto · zu {0} % gelesen",
    "Format non reconnu. Envoie un PDF, un Word (.docx), un .odt, un .txt ou une photo.": "Unbekanntes Format. Schick ein PDF, eine Word-Datei (.docx), eine .odt, eine .txt oder ein Foto.",
    "Je n'ai presque pas trouvé de texte. Essaie un PDF, ou une photo bien droite et nette.": "Ich habe fast keinen Text gefunden. Versuch es mit einem PDF oder einem geraden, scharfen Foto.",
    "C'est lu.": "Fertig gelesen.",
    "Mon": "Mein",
    "Page {0} sur {1}": "Seite {0} von {1}",
    "{0} page{1}": "{0} Seite(n)",
    // demo.js
    "Mode démo : profil de Maurice MARCEL chargé": "Demo-Modus: Profil von Maurice MARCEL geladen"
  },
  ocr: "deu",
  /* ---------- plural(n, mot) : mot français → mot allemand, puis pluriel ---------- */
  w: {an: "Jahr", year: "Jahr", chose: "Punkt", point: "Punkt", "faute courante": "häufiger Fehler", ligne: "Zeile", jour: "Tag"},
  pl: {"Jahr": "Jahre", "Punkt": "Punkte", "häufiger Fehler": "häufige Fehler", "Zeile": "Zeilen", "Tag": "Tage", "Stellenangebot": "Stellenangebote", "Bewerbung": "Bewerbungen"},

  /* ---------- Exemple de l'app (mêmes faits que l'exemple français, en Allemagne) ---------- */
  offer: `Lagermitarbeiter/in – unbefristet – Bielefeld (fiktives Beispiel)

In unserem Lager stellst du Bestellungen zusammen und hilfst beim Wareneingang.

Deine Aufgaben:
- Kommissionierung von Bestellungen und Qualitätskontrolle
- Warenannahme und Einlagerung der Lieferungen
- Lagerverwaltung und Inventur
- Fahren von Gabelstaplern (Staplerschein)
- Datenerfassung mit Excel

Dein Profil:
- 2 Jahre Berufserfahrung im Lager
- Führerschein Klasse B zwingend erforderlich
- Teamfähigkeit, Pünktlichkeit, Sorgfalt
- Englischkenntnisse von Vorteil
- Schichtarbeit (Früh- und Spätschicht)`,
  cv: `Lena Schneider · Bielefeld · lena.schneider@beispiel.de · 0521 123 4567
Berufserfahrung
Kommissioniererin, Online-Supermarkt FrischMarkt (2022-2025): 120 Bestellungen pro Tag, Qualitätskontrolle der Frischeprodukte, Teamarbeit mit 6 Kolleginnen und Kollegen.
Verkäuferin, Bäckerei am Markt (2020-2022): Ladenöffnung um 6 Uhr, Kasse, Einräumen der Lieferungen jeden Morgen.
Ausbildung
Ausbildung zur Verkäuferin (Abschluss 2020)
Kenntnisse
Tabellenkalkulation, Lagerverwaltung, Sorgfalt, Pünktlichkeit
Sonstiges
Führerschein Klasse B, eigenes Auto`,

  /* ---------- Mode démo (même forme que js/demo.js) ---------- */
  demo: {
    file: "Lebenslauf_Maurice_MARCEL.pdf (Demo)", info: "Erfundenes Profil zum Testen",
    cv: `MAURICE MARCEL · Informatik-Ingenieur · 32 Jahre
Bielefeld · maurice.marcel@example.com · 0521 000 0000
Profil
Ingenieur für Informatik mit 10 Jahren Erfahrung: Systeme, Netzwerke und Cloud.
Berufserfahrung
Ingenieur für Systeme und Netzwerke, Beispiel Industrie GmbH (2019 - 2025): Administration von 120 Windows- und Linux-Servern, VMware vSphere, Active Directory für 800 Nutzer, Datensicherung mit Veeam, Monitoring mit Zabbix.
Systemadministrator, Beispiel Services GmbH (2016 - 2019): 2nd-Level-Support, Rollout von Notebooks mit SCCM, zuständig für diverse Projekte und diverse Aufgaben.
IT-Support (Ausbildung), Beispiel Computer GmbH (2014 - 2016): Anwenderbetreuung und Kundenservise, Störungsbehebung bei Druckern.
Ausbildung
Master Informatik, Beispiel Hochschule (2016)
Kenntnisse
Windows Server, Linux, VMware, Active Directory, PowerShell, Ansible, Docker, TCP/IP-Netzwerke, IT-Sicherheit, Kommunkation
Sonstiges
Führerschein Klasse B`,
    me: {name: "Maurice MARCEL", contact: "maurice.marcel@example.com · 0521 000 0000"},
    letter: {company: "Beispiel Industrie", why: "Ihr Umzug in die Cloud ist genau die Art von Projekt, die ich leiten möchte", when: "ab dem 1. Dezember"},
    offers: [
      {text: `Systemingenieur/in Netzwerke – unbefristet – Bielefeld
Die Beispiel Industrie GmbH sucht Verstärkung für ihr IT-Team (hybrid, 2 Tage Homeoffice pro Woche).
Deine Aufgaben:
- Administration der Windows- und Linux-Server und der VMware-Plattform
- Verwaltung von Benutzerkonten und Berechtigungen im Active Directory
- Überwachung der Datensicherung und Wiederherstellung bei Bedarf
- Automatisierung mit PowerShell oder Ansible
- Technische Dokumentation
Dein Profil:
- Mindestens 5 Jahre Berufserfahrung in der Systemadministration
- Kenntnisse mit Azure von Vorteil
- Kommunikationsstärke, sehr gute Englischkenntnisse
58.000 € brutto im Jahr, Vollzeit, 40 Stunden pro Woche. Start ab sofort.`,
        app: {company: "Beispiel Industrie", status: "interview", offer: -20, applied: -12, next: 3, contact: "Julia Krause, Personal · 0521 000 0001", notes: "Zweites Gespräch mit der IT-Leitung. Beispiele zur Veeam-Migration mitbringen.", hist: [["sent", -12], ["call", -6], ["interview", -2]]}},
      {text: `DevOps Engineer – unbefristet – Hannover
Deine Aufgaben:
- Aufbau und Pflege von CI/CD-Pipelines mit GitLab
- Bereitstellung von Containern mit Docker und Kubernetes
- Infrastructure as Code mit Terraform und Ansible
- Monitoring der Produktion mit Prometheus und Grafana
- Technische Dokumentation
- Erfahrung mit Azure ist ein Plus
Dein Profil:
- Mindestens 3 Jahre Berufserfahrung als DevOps oder Systemingenieur
- Linux, Skripte (Python oder Bash)
- Teamfähigkeit und Selbstständigkeit
Hybrides Arbeiten, 62.000 € brutto im Jahr.`,
        app: {company: "Beispiel Cloud GmbH", status: "sent", offer: -15, applied: -9, next: -2, contact: "jobs@example.com", notes: "Über die Karriereseite beworben.", hist: [["sent", -9]]}},
      {text: `IT-Projektleiter/in – befristet auf 12 Monate – Münster
Du leitest die Ablösung des ERP-Systems und koordinierst die Dienstleister.
Deine Aufgaben:
- Planung und Steuerung von Budget und Zeitplan
- Leitung der Lenkungsausschüsse
- Lastenhefte mit den Fachabteilungen schreiben
- Schulung der Anwender
- Technische Dokumentation
Dein Profil: 5 Jahre Projektmanagement in der IT, agile Methoden, Sorgfalt und Organisationstalent.`,
        app: {company: "Beispiel Logistik", status: "call", offer: -10, applied: -7, next: 1, contact: "Paul Wagner · 0251 000 0000", notes: "Telefonat morgen um 10 Uhr.", hist: [["sent", -7], ["call", -1]]}},
      {text: `IT-Assistent/in im Homeoffice – verdiene bis zu 400 € am Tag
Keine Erfahrung nötig! Bearbeitungsgebühr von 49 € für dein Starterpaket.
Schick deine Bankverbindung und eine Kopie deines Personalausweises per WhatsApp oder an schnell.job@gmail.com.
Aufgaben: Datenerfassung, E-Mails beantworten, kleine IT-Hilfen für unsere Kunden, alles von zu Hause.`,
        app: {company: "", status: "todo", offer: -1, notes: "Sieht nach Betrug aus: vorher alles prüfen."}},
      {text: `Java-Backend-Entwickler/in – freiberuflich – Berlin
Deine Aufgaben:
- REST-APIs mit Java und Spring Boot entwickeln
- Unit-Tests schreiben und an Code-Reviews teilnehmen
- Arbeit mit PostgreSQL-Datenbanken
Dein Profil: 4 Jahre Java-Entwicklung, Git, Englisch.`,
        app: {company: "Beispiel Software", status: "refused", offer: -45, applied: -40, notes: "Absage: Sie wollten mehr Erfahrung mit Java.", hist: [["sent", -40], ["refused", -25]]}}
    ],
    manual: [
      {job: "Cloud-Administrator", company: "Beispiel Hosting", status: "offer", offer: -30, applied: -28, contact: "Sarah Lehmann · s.lehmann@example.com", notes: "Angebot erhalten: 60.000 €. Bis Freitag antworten.", hist: [["sent", -28], ["interview", -14], ["offer", -3]]},
      {job: "Leitung Infrastruktur", company: "Beispiel Bank", status: "silent", offer: -60, applied: -55, notes: "Zweimal nachgefasst, keine Antwort.", hist: [["sent", -55], ["followup", -40], ["silent", -20]]}
    ],
    prep: {g1: "Seit 10 Jahren Informatik-Ingenieur: erst Support, dann Systemadministration, dann 120 Server und 800 Nutzer bei der Beispiel Industrie. Jetzt suche ich eine hybride Stelle mit mehr Cloud.", g2: "Ihr Umzug in die Cloud und die Größe der Plattform."},
    star: {s: "Ein Speicherausfall blockierte die Datensicherung von 300 Nutzern.", a: "Ich habe die Sicherung an einem Wochenende auf Veeam mit einem neuen NAS umgestellt und die Wiederherstellung getestet.", r: "Keine Daten verloren, Sicherung 40 % schneller."},
    fill: ["bei der Beispiel Industrie, 2 Projekte 2024"]
  },

  /* ---------- Analyse (js/moteur.js) : motifs sur le texte sans accents ni majuscules (ä→a, ö→o, ü→u, ß reste ß) ---------- */
  secs: {
    exp: "berufserfahrung(en)?|berufliche erfahrung(en)?|berufliche stationen|beruflicher werdegang|werdegang|berufspraxis|praxiserfahrung|erfahrung(en)?|tatigkeiten|beschaftigungen|arbeitserfahrung",
    skills: "kenntnisse|fahigkeiten|kompetenzen|fahigkeiten und kenntnisse|kenntnisse und fahigkeiten|besondere kenntnisse|fachkenntnisse|edv-kenntnisse|it-kenntnisse|sprachkenntnisse|sprachen|starken|qualifikationen und kenntnisse|skills",
    edu: "ausbildung|schulbildung|schulische ausbildung|bildungsweg|bildung|studium|aus- und weiterbildung|ausbildung und studium|schule und ausbildung|weiterbildung(en)?|fortbildung(en)?|qualifikationen|abschlusse|zertifikate",
    misc: "sonstiges|weitere angaben|interessen|hobbys|hobbies|freizeit|personliches|personliche daten|zur person|uber mich|profil|kurzprofil|ehrenamt|ehrenamtliches engagement|engagement|referenzen"
  },
  // clé = clé française du lexique (LEX dans moteur.js) : [nom allemand, motif dans l'offre, exemple, motif côté CV]
  lex: {
    "Préparation de commandes": ["Kommissionierung", "kommissionier\\w*|auftragszusammenstellung|bestellungen (zusammenstellen|vorbereiten)|stellst du bestellungen zusammen", "120 Bestellungen pro Tag", "kommissionier\\w*|bestellungen|auftrage"],
    "Contrôle qualité": ["Qualitätskontrolle", "qualitatskontroll\\w*|qualitatsprufung\\w*|qualitatssicherung|warenprufung|(prufung|kontrolle) der (ware|waren|produkte|qualitat)", "Prüfung von Haltbarkeit und Menge", "qualitat\\w*|warenprufung|kontrolle der|prufung der"],
    "Réception des marchandises": ["Wareneingang", "wareneingang\\w*|warenannahme|annahme (der |von )?(ware|waren|lieferungen)|einlagerung|entladen der", "30 Paletten pro Tag", "wareneingang\\w*|warenannahme|lieferungen|entlad\\w*|einlager\\w*|einraum\\w*"],
    "Gestion des stocks": ["Lagerverwaltung", "lagerverwaltung|bestandsfuhrung|bestandsverwaltung|bestandskontrolle|bestandsmanagement|lagerbestand\\w*|nachschub\\w*|warendisposition", "wöchentliche Nachbestellung"],
    "Inventaires": ["Inventur", "inventur\\w*", "Jahresinventur mit 3.000 Artikeln"],
    "CACES (chariot élévateur)": ["Staplerschein", "staplerschein|gabelstapler\\w*|\\bstapler\\w*|flurforderzeug\\w*|hubwagen|stapler(fahrer|fuhrer)\\w*", "Gabelstapler, Schein seit 2023"],
    "Expédition et emballage": ["Versand und Verpackung", "versand\\w*|verpack\\w*|warenausgang", "200 Pakete pro Tag"],
    "Manutention": ["Heben und Tragen", "korperlich\\w* (arbeit|tatigkeit)|korperliche belastbarkeit|schweres heben|heben und tragen|be- und entladen|\\blasten\\b", "Beladen der Lkw"],
    "Encaissement": ["Kassieren", "kassier\\w*|kassentatigkeit|\\bkasse\\b|kassenbereich|kassenabrechnung", "bis zu 300 Kundinnen und Kunden pro Tag", "kass\\w*"],
    "Accueil des clients": ["Kundenempfang", "(empfang|begrussung) (der |von )?(kunden|kundinnen|gaste|besucher|patienten)|kunden (empfangen|begrussen)|gaste (empfangen|begrussen)|empfangsbereich", "80 Kundinnen und Kunden pro Tag", "empfang\\w*|begruss\\w*"],
    "Conseil client": ["Kundenberatung", "kundenberatung|beratung (der |von |unserer )?(kunden|kundinnen)|kunden (beraten|beratung)|fachberatung|verkaufsberatung", "Beratung zu Frischeprodukten", "berat\\w*"],
    "Vente": ["Verkauf", "\\bverkauf\\w*|umsatzziel\\w*|\\bvertrieb\\w*", "Monatsziel in 10 von 12 Monaten erreicht", "verkauf\\w*|verkauft|vertrieb\\w*"],
    "Mise en rayon": ["Regalpflege", "regalpflege|regale (auffullen|einraumen|bestucken)|warenverraumung|ware (einraumen|verraumen)|warenprasentation|visual merchandising", "Frischeabteilung jeden Morgen", "regal\\w*|einraum\\w*|verraum\\w*|auffull\\w*"],
    "Relation client": ["Kundenservice", "kundenservice|kundendienst|kundenbetreuung|kundenzufriedenheit|reklamation\\w*|beschwerde\\w*|kundenbindung|umtausch", "Bearbeitung von Reklamationen"],
    "Prospection": ["Kundenakquise", "akquise|akquisition|neukunden\\w*|kaltakquise", "20 Neukunden in einem Jahr"],
    "Négociation": ["Verhandlung", "verhandl\\w*", "Verhandlungen mit 15 Lieferanten"],
    "Accompagnement des personnes âgées": ["Betreuung älterer Menschen", "senior\\w*|altere[nr]? menschen|altenpflege|altenheim|pflegeheim|seniorenheim|pflegebedurftig\\w*", "6 Personen pro Woche"],
    "Aide à domicile": ["Häusliche Hilfe", "haushaltshilfe|hauswirtschaft\\w*|ambulante[nr]? (pflege|dienst)|alltagsbegleit\\w*|alltagshilfe|hausliche (pflege|hilfe|betreuung)", "Einsätze bei 6 Personen"],
    "Aide à la toilette": ["Grundpflege", "grundpflege|korperpflege|hilfe beim (waschen|anziehen|aufstehen)|waschen und anziehen", "Hilfe beim Aufstehen und Waschen"],
    "Préparation des repas": ["Zubereitung von Mahlzeiten", "zubereitung (der |von )?(mahlzeiten|speisen|essen)|mahlzeiten (zubereiten|vorbereiten)|essen zubereiten", "Mahlzeiten für 4 Personen", "zubereit\\w*|speisenzubereitung|kochen"],
    "Garde d'enfants": ["Kinderbetreuung", "kinderbetreuung|\\bkita\\b|kindertagesstatte|kindergarten|tagesmutter|tagesvater|erzieher\\w*|kinderpfleger\\w*|babysit\\w*", "3 Kinder von 2 bis 8 Jahren"],
    "Diplôme d'aide-soignant": ["Pflegehelfer-Abschluss", "pflegehelfer\\w*|pflegeassistent\\w*|altenpflegehelfer\\w*", "Abschluss 2021"],
    "Soins infirmiers": ["Pflegefachkraft", "pflegefachkraft|pflegefachfrau|pflegefachmann|krankenpfleger\\w*|krankenschwester|gesundheits- und krankenpfleg\\w*|examiniert\\w*", "examiniert seit 2019"],
    "Service en salle": ["Service im Restaurant", "servicekraft|servicemitarbeiter\\w*|kellner\\w*|bedienung der gaste|gaste bedienen|restaurantfach\\w*|servicekrafte", "60 Gedecke pro Abend"],
    "Cuisine": ["Küche", "\\bkoch\\b|\\bkochin\\b|jungkoch|beikoch|kuchenhilfe|kuchenchef|kuchenteam|\\bkuche\\b|speisenzubereitung", "Vorbereitung für 80 Gedecke"],
    "Règles d'hygiène (HACCP)": ["Hygieneregeln (HACCP)", "hygienevorschriften|hygieneregeln|hygienestandards|lebensmittelhygiene|infektionsschutz\\w*|gesundheitszeugnis", "Schulung 2022"],
    "Plonge": ["Spülen", "spulkraft|spulhilfe|spuler\\w*|geschirr spulen|spulkuche", "Spülküche für 100 Gedecke"],
    "Bar": ["Bar", "barkeeper\\w*|barkraft|theke|tresen|ausschank|getranke zubereiten", "Zubereitung von Heißgetränken"],
    "Réception hôtelière": ["Hotelrezeption", "rezeption\\w*|empfangsmitarbeiter\\w*|front office|zimmerreservierung\\w*|reservierung\\w*", "Empfang und Reservierungen, 40 Zimmer"],
    "Entretien et nettoyage": ["Reinigung", "reinigung\\w*|reinigungskraft|gebaudereinig\\w*|\\bputzen\\b|putzkraft|unterhaltsreinigung|sauberkeit", "Reinigung von 800 m² Büroflächen"],
    "Lecture de plans": ["Pläne lesen", "zeichnungen (lesen|verstehen)|plane lesen|lesen von (planen|zeichnungen)|technische zeichnungen|bauplane", "Ausführungspläne auf der Baustelle"],
    "Habilitation électrique": ["Elektrofachkraft", "elektrofachkraft|elektrotechnisch unterwiesene person|\\beup\\b", "EUP, 2024"],
    "Électricité": ["Elektroarbeiten", "elektriker\\w*|elektroinstall\\w*|verkabel\\w*|schaltschrank\\w*|schaltschranke", "Verkabelung von Schaltschränken"],
    "Plomberie et chauffage": ["Sanitär und Heizung", "sanitarinstall\\w*|sanitar- und heizung\\w*|sanitar und heizung\\w*|installateur\\w*|heizungsbau\\w*|heizungsinstall\\w*|klempner\\w*|\\bshk\\b|anlagenmechaniker\\w*", "Badinstallation"],
    "Maçonnerie": ["Mauerarbeiten", "maurer\\w*|mauerarbeit\\w*|betonier\\w*|\\bbeton\\w*|schalung\\w*|rohbau", "Schalung und Betonieren von Decken"],
    "Peinture": ["Malerarbeiten", "\\bmaler\\w*|lackier\\w*|anstrich\\w*|tapezier\\w*|spachtel\\w*", "10 Wohnungen renoviert"],
    "Travail en hauteur": ["Arbeiten in der Höhe", "arbeiten in (der )?hohe|hohentauglich\\w*|schwindelfrei\\w*|gerustbau|hubarbeitsbuhne\\w*", "Hubarbeitsbühne, 2023"],
    "Règles de sécurité": ["Arbeitssicherheit", "arbeitssicherheit|arbeitsschutz|sicherheitsvorschriften|sicherheitsregeln|\\bpsa\\b|unfallverhutung\\w*|gefahrdungsbeurteilung\\w*", "3 Jahre ohne Unfall"],
    "Conduite de machines": ["Maschinenbedienung", "maschinenbedien\\w*|maschinenfuhr\\w*|anlagenbedien\\w*|anlagenfuhr\\w*|bedienung (von |der )?(maschinen|anlagen)|maschinen (bedienen|einrichten|fuhren)|produktionshelfer\\w*|produktionsmitarbeiter\\w*|maschinen- und anlagenfuhr\\w*", "Bedienung einer Verpackungslinie"],
    "Soudure": ["Schweißen", "schwei(ß|ss)\\w*|\\bmag\\b|\\bwig\\b", "MAG und WIG"],
    "Maintenance": ["Wartung", "wartung\\w*|instandhaltung\\w*|instandsetzung\\w*|reparatur\\w*|storungsbehebung|fehlersuche", "vorbeugende Wartung von 20 Maschinen"],
    "Mécanique": ["Mechanik", "mechanik\\w*|mechatronik\\w*|\\bkfz\\b|kraftfahrzeug\\w*", "Wartung von Pkw"],
    "Accueil téléphonique": ["Telefonservice", "telefon\\w*|anrufe|anrufannahme|am telefon", "50 Anrufe pro Tag", "telefon\\w*|anruf\\w*"],
    "Pack Office": ["MS Office", "ms-?office|office-?(paket|anwendungen|programme)", "Briefe mit Word, E-Mails mit Outlook"],
    "Excel": ["Excel", "tabellenkalkulation", "Tabelle zur Auftragsverfolgung"],
    "Outils informatiques": ["EDV-Kenntnisse", "edv\\w*|pc-kenntnisse|computerkenntnisse|it-kenntnisse|umgang mit (dem )?(pc|computer)", "Word, E-Mails, einfache Tabellen", "edv|\\bpc\\b|computer|software|\\bword\\b|excel|office|tabellenkalkulation|programme?"],
    "Saisie de données": ["Datenerfassung", "datenerfassung|dateneingabe|daten (erfassen|eingeben|pflegen)|datenpflege", "Erfassung der Lieferscheine"],
    "Gestion d'agenda": ["Terminplanung", "terminplanung|terminvergabe|terminkoordination|termine (vereinbaren|koordinieren|planen)|kalenderfuhrung|terminverwaltung", "Kalender von 3 Ärzten"],
    "Rédaction de courriers": ["Korrespondenz", "korrespondenz|schriftverkehr|briefe (schreiben|verfassen)|protokollfuhrung|protokolle (schreiben|fuhren)|berichte (schreiben|verfassen)", "Briefe an Kunden"],
    "Facturation": ["Rechnungsstellung", "rechnungsstellung|rechnungswesen|rechnungsprufung|fakturier\\w*|\\brechnungen\\b|mahnwesen|angebote erstellen", "100 Rechnungen pro Monat"],
    "Comptabilité": ["Buchhaltung", "buchhalt\\w*|buchfuhrung|kreditoren\\w*|debitoren\\w*|kontenabstimmung", "Buchung der Belege"],
    "Paie": ["Lohnabrechnung", "lohnabrechnung\\w*|gehaltsabrechnung\\w*|lohnbuchhaltung|entgeltabrechnung|personalabrechnung", "Abrechnung für 40 Beschäftigte"],
    "Classement et archivage": ["Ablage und Archivierung", "\\bablage\\b|archivier\\w*|dokumentenverwaltung|aktenfuhrung|dokumentenmanagement", "Archivierung der Akten"],
    "Logiciel de gestion (ERP)": ["ERP-Software", "warenwirtschaft\\w*|\\bdatev\\b|lexware", "SAP, Bestellungen und Bestände"],
    "Recrutement": ["Personalgewinnung", "personalgewinnung|recruiting|rekrutierung|personalbeschaffung|bewerbermanagement", "20 Einstellungen pro Jahr"],
    "Support utilisateurs": ["IT-Support", "it-support|anwenderbetreuung|anwendersupport|benutzerbetreuung|benutzersupport|1st[- ]level|2nd[- ]level|first[- ]level|second[- ]level|service ?desk", "30 Tickets pro Tag", "support|helpdesk|service ?desk|anwender\\w*|benutzerbetreuung|level"],
    "Windows": ["Windows", "windows", "Einrichtung von Windows-11-Arbeitsplätzen"],
    "Linux": ["Linux", "linux", "Debian-Server"],
    "Réseaux informatiques": ["Netzwerke", "netzwerk\\w*|\\brouter\\b|\\bwlan\\b", "VLANs und Switches für 50 Arbeitsplätze"],
    "Active Directory": ["Active Directory", "active directory", "Konten und Rechte für 300 Nutzer"],
    "Cybersécurité": ["IT-Sicherheit", "it-sicherheit|informationssicherheit|cybersicherheit|virenschutz", "Einführung einer Firewall"],
    "Administration des serveurs": ["Serveradministration", "serveradministration|systemadministration|server (administrieren|betreuen|verwalten)|administration (von |der )?(den )?(windows- und linux-)?(servern?|systemen)|systemadministrator\\w*|administrieren (der |von )?(server|systeme)", "15 Windows- und Linux-Server", "server\\w*|systemadministr\\w*|vmware|hyper-v"],
    "Virtualisation": ["Virtualisierung", "virtualisier\\w*", "VMware, 20 virtuelle Maschinen"],
    "Sauvegardes et restauration": ["Datensicherung und Wiederherstellung", "datensicherung\\w*|wiederherstell\\w*", "tägliche Sicherung von 10 Servern", "datensicherung\\w*|backup\\w*|sicherung\\w*|wiederherstell\\w*|veeam"],
    "Supervision": ["Monitoring", "systemuberwachung|uberwachung (der |von )?(systeme|netzwerke|server|infrastruktur|it)", "Überwachung von 50 Geräten", "monitor\\w*|uberwach\\w*|zabbix"],
    "Gestion des incidents (ITIL)": ["Störungsmanagement (ITIL)", "storungsmanagement|incident[- ]management|storungsbearbeitung|storungen (beheben|bearbeiten)|ticketsystem", "30 Tickets pro Tag", "storung\\w*|incident\\w*|tickets?|support"],
    "Comptes et droits d'accès": ["Benutzerkonten und Zugriffsrechte", "benutzerkonten|benutzerverwaltung|zugriffsrechte|berechtigung\\w*|rechteverwaltung|zugangsverwaltung", "Konten und Rechte für 300 Nutzer", "konten|benutzer\\w*|rechte\\w*|berechtigung\\w*|active directory|entra|\\bmfa\\b"],
    "Déploiement de logiciels": ["Softwareverteilung", "softwareverteilung|\\brollout\\w*|ausrollen|bereitstellung von (software|geraten|clients|notebooks)|client-?verteilung", "300 Arbeitsplätze ausgerollt", "rollout|roll-out|ausgerollt|ausroll\\w*|verteil\\w*|deploy\\w*|intune|sccm"],
    "Gestion de parc": ["IT-Asset-Management", "asset[- ]management|inventarisierung|hardwareverwaltung|geratebestand|it-inventar", "500 Geräte"],
    "Documentation technique": ["Technische Dokumentation", "technische dokumentation|dokumentation (der |von )?(systeme|prozesse|ablaufe)|dokumentier\\w*|wissensdatenbank", "Anleitungen für das Support-Team", "dokument\\w*|anleitung\\w*|wiki|wissensdatenbank"],
    "Veille technologique": ["Technologie-Trends verfolgen", "neue technologien|technologietrends|auf dem neuesten stand", "wöchentliche Sicherheitsrecherche"],
    "Relation avec les prestataires": ["Dienstleistersteuerung", "dienstleister\\w*|externe partner|zulieferer\\w*", "10 Dienstleister betreut"],
    "Politique de sécurité (PSSI)": ["Sicherheitsrichtlinie", "sicherheitsrichtlinie\\w*|sicherheitskonzept\\w*|sicherheitsleitlinie\\w*", "Sicherheitsrichtlinie verfasst"],
    "Conformité (RGPD, NIS2…)": ["Compliance (DSGVO, NIS2…)", "\\bdsgvo\\b|bsi[- ]grundschutz", "NIS2-Umsetzung", "\\bdsgvo\\b|datenschutz\\w*|compliance|nis ?2|iso ?27001|grundschutz"],
    "Sensibilisation des utilisateurs": ["Sicherheitsschulungen", "sensibilisier\\w*|security-schulung\\w*|phishing", "Schulung für 300 Beschäftigte"],
    "Continuité d'activité (PCA/PRA)": ["Notfallplanung (BCM)", "notfallplan\\w*|notfallmanagement|\\bbcm\\b|wiederanlauf\\w*", "Notfallplan jedes Jahr getestet"],
    "Gestion de crise": ["Krisenmanagement", "krisenmanagement|krisenstab|krisensituation\\w*", "Krisenstab bei einem Cyberangriff"],
    "Transformation numérique": ["Digitalisierung", "digitalisier\\w*|digitale transformation|papierlos\\w*", "papierlose Rechnungen", "digital\\w*|modernisier\\w*|papierlos\\w*"],
    "Python": ["Python", "python", "Automatisierungsskripte"],
    "JavaScript": ["JavaScript", "javascript", "Website mit React"],
    "HTML / CSS": ["HTML / CSS", "\\bhtml\\b", "responsive Webseiten"],
    "SQL": ["SQL", "datenbank\\w*", "Abfragen auf einer Kundendatenbank"],
    "Cloud": ["Cloud", "\\bcloud\\b", "Umzug zu Microsoft 365"],
    "Gestion de projet": ["Projektmanagement", "projektmanagement|projektleit\\w*|projekte (leiten|steuern|betreuen|begleiten)|projektsteuerung|it-projekte?\\b", "Projekt über 6 Monate, 3 Personen", "projekt\\w*"],
    "Management d'équipe": ["Teamleitung", "teamleit\\w*|fuhrungserfahrung|personalverantwortung|schichtleit\\w*|vorarbeiter\\w*|mitarbeiterfuhrung|fuhrung (eines|von) (teams?|mitarbeitenden|mitarbeitern)", "Team mit 5 Personen"],
    "Permis B": ["Führerschein Klasse B", "fuhrerschein\\w*|fahrerlaubnis|klasse b\\b", "seit 2018", "fuhrerschein\\w*|fahrerlaubnis|klasse b\\b|eigene[rs]? (pkw|auto)"],
    "Travail en équipe": ["Teamfähigkeit", "teamfahig\\w*|teamarbeit|teamplayer|\\bim team\\b|teamgeist|zusammenarbeit", "Team mit 6 Personen", "team\\w*|zusammenarbeit|kolleg\\w*"],
    "Autonomie": ["Selbstständigkeit", "selbststandig\\w*|selbstandig\\w*|eigenverantwortlich\\w*|eigenstandig\\w*", "allein bei der Ladenöffnung"],
    "Rigueur": ["Sorgfalt", "sorgfalt\\w*|genauigkeit|gewissenhaft\\w*|prazise|prazision|akribisch\\w*", "keine Fehler bei Bestellungen 2024"],
    "Ponctualité": ["Pünktlichkeit", "punktlich\\w*|zuverlassig\\w*", "Ladenöffnung um 6 Uhr seit 2 Jahren", "punktlich|zuverlassig|offnung|fruhschicht|[4-7](:00)? uhr"],
    "Sens de l'organisation": ["Organisationstalent", "organisationstalent|organisationsfahig\\w*|organisationsgeschick|organisationsvermogen|strukturiert\\w*|zeitmanagement", "Schichtplan für 4 Personen", "organis\\w*|strukturiert\\w*"],
    "Sens du contact": ["Freundliches Auftreten", "\\bfreundlich\\w*|kontaktfreud\\w*|aufgeschlossen\\w*|kundenorientier\\w*|serviceorientier\\w*|gepflegtes erscheinungsbild|sicheres auftreten|freude am umgang mit menschen", "80 Kundinnen und Kunden pro Tag"],
    "Polyvalence": ["Vielseitigkeit", "vielseitig\\w*|flexibel einsetzbar|allround\\w*", "Kasse, Regal und Wareneingang je nach Tag"],
    "Dynamisme": ["Engagement", "engagiert\\w*|motiviert\\w*|\\bengagement\\b|tatkraft\\w*|einsatzbereit\\w*|anpacken", "Andrang am Samstag"],
    "Gestion du stress": ["Belastbarkeit", "belastbar\\w*|stressresisten\\w*|unter druck|hektik|ruhe bewahren", "Samstagabend-Service"],
    "Écoute": ["Einfühlungsvermögen", "einfuhlungsvermogen|empathi\\w*|empathisch|zuhoren|geduld\\w*|herzlich\\w*", "Begleitung älterer Menschen"],
    "Discrétion": ["Diskretion", "diskret\\w*|verschwiegen\\w*|vertraulich\\w*", "Patientenakten"],
    "Adaptabilité": ["Flexibilität", "flexib\\w*|anpassungsfahig\\w*", "jede Woche andere Aufgaben"],
    "Communication": ["Kommunikationsstärke", "kommunikationsstark\\w*|kommunikationsfahig\\w*|kommunikativ\\w*|ausdrucksvermogen|ausdrucksstark\\w*", "wöchentlicher Bericht"],
    "Anglais": ["Englisch", "englisch\\w*", "Grundkenntnisse"],
    "Espagnol": ["Spanisch", "spanisch\\w*", "Grundkenntnisse"],
    "Allemand": ["Deutsch", "deutschkenntnisse|\\bdeutsch\\b|deutsch in wort und schrift", "fließend"],
    "Horaires décalés": ["Schichtarbeit", "schicht(arbeit|dienst|betrieb|system|en)\\w*|\\w*schicht\\b|wochenend\\w*|nachtarbeit|nachtdienst\\w*|feiertag\\w*|rufbereitschaft|samstag\\w*|sonntag\\w*", "", "schicht\\w*|nacht\\w*|wochenend\\w*|samstag\\w*|sonntag\\w*|bereitschaft|[4-7](:00)? uhr|offnung"],
    "Premiers secours (SST)": ["Erste Hilfe", "erste[- ]hilfe|ersthelfer\\w*|betriebssanitater\\w*", "Erste-Hilfe-Kurs, 2023"],
    "BAFA": ["Jugendleiter-Card (Juleica)", "juleica|jugendleiter\\w*|jugendgruppenleiter\\w*", "2022"]
  },
  re: {
    // Message d'erreur à l'étape de l'offre : « ton CV » devient « l'offre »
    cvWord: "deinen Lebenslauf|dein Lebenslauf|deines Lebenslaufs", offerWord: "die Anzeige",
    // Annonce de bureau ou d'informatique : on propose de demander pour le télétravail
    office: "informati|buro|software|daten|entwickl|buchhalt|verwaltung|sachbearbeit|\\bit-",
    to: "bis",
    // mots très courants (reconnaître un CV allemand), marqueur de l'exemple, mots de diplôme, mention de genre
    langWords: "der|die|das|und|mit|fur|von|bei|zur|zum|ein|eine|einer|im|auf|ich|als|seit",
    sample: "\\s*\\((?:fiktives )?beispiel\\)",
    eduWords: "ausbildung|abschluss|abitur|fachabitur|realschul|hauptschul|bachelor|master|diplom|meister|studium|examen|examiniert|pflegehelfer",
    gender: "m\\s*\\/\\s*w\\s*\\/\\s*d|w\\s*\\/\\s*m\\s*\\/\\s*d|m\\s*\\/\\s*w|w\\s*\\/\\s*m|d\\s*\\/\\s*w\\s*\\/\\s*m",
    now: "heute|jetzt|aktuell|derzeit|laufend|dato|gegenwart",
    years: "(\\d{1,2})\\+?\\s*(?:-\\s*\\d{1,2}\\s*)?jahre?n?\\s+(?:[a-zß-]+\\s+){0,3}?(?:berufserfahrung|erfahrung|praxiserfahrung|berufspraxis)|(?:berufserfahrung|erfahrung|berufspraxis)\\s+(?:von\\s+)?(?:mindestens\\s+|mind\\.\\s*)?(\\d{1,2})\\+?\\s*jahre?n?",
    yearsWord: "jahre?n?",
    diploma: "\\b(berufsausbildung|ausbildung|abitur|fachabitur|fachhochschulreife|realschulabschluss|mittlere reife|hauptschulabschluss|bachelor|master|meisterbrief|meister|studium|hochschulabschluss|diplom)\\b",
    must: "zwingend|unbedingt|erforderlich|vorausgesetzt|voraussetzung|setzen wir voraus|unabdingbar|notwendig|pflicht",
    nice: "wunschenswert|von vorteil|vorteilhaft|idealerweise|ein plus|ist ein plus|nice to have|willkommen|erwunscht|optional",
    notSkill: "gehalt|vergutung|stundenlohn|\\blohn\\b|brutto|urlaub|unbefristet|befristet|vollzeit|teilzeit|festanstellung|wir bieten|was wir bieten|unser angebot|bewerb\\w*|lebenslauf|ansprechpartner|ansprechperson|standort|arbeitsort|einsatzort|eintrittsdatum|ab sofort|uber uns|wir sind|unser unternehmen|altersvorsorge|zuschuss|jobrad|tarif\\w*|mitarbeiterrabatt|kantine|weihnachtsgeld|urlaubsgeld|homeoffice|home-office|mobiles arbeiten|freuen uns",
    place: "arbeitsort|einsatzort|standort|dienstort|ort",
    weak: "\\b(zustandig fur|verantwortlich fur|mitwirkung (an|bei)|mithilfe bei|unterstutzung (bei|von)|beteiligt an|diverse aufgaben|verschiedene aufgaben|sonstige aufgaben|usw\\.?|etc\\.?)(?=\\W|$)",
    ad_salary: "(?:^|\\s)(?:ab |bis zu |ca\\.? )?\\d[\\d.,]*(?:\\s?(?:-|–|bis)\\s?\\d[\\d.,]*)?\\s?(?:€|euro)(?:\\s?(?:brutto|netto))?(?:\\s?(?:\\/|pro|im|je|in der)\\s?(?:stunde|std\\.?|monat|jahr|woche))?|nach tarif\\w*|tarifliche (?:bezahlung|vergutung)|attraktive vergutung|leistungsgerechte vergutung|mindestlohn",
    ad_contract: "\\b(?:unbefristet\\w*|befristet\\w*(?: auf \\d+ monate)?|festanstellung|minijob|werkstudent\\w*|praktikum|ausbildungsplatz|zeitarbeit|arbeitnehmeruberlassung|aushilfe|saisonarbeit|freiberuflich\\w*)",
    ad_hours: "\\d{2}(?:,\\d)?[ -]?(?:stunden|std\\.?|h)(?:\\s?(?:\\/|pro|in der|je)\\s?woche|-woche)?|vollzeit|teilzeit",
    ad_remote: "homeoffice|home-office|home office|mobiles arbeiten|mobile arbeit|von zu hause",
    ad_start: "ab sofort|zum nachstmoglichen zeitpunkt|zum \\d{1,2}\\.\\s?\\d{1,2}\\.(?:\\d{2,4})?|eintritt(?:sdatum)?:? [^\\n,.]{3,20}|baldmoglichst|schnellstmoglich",
    flag_pay: "(?:bearbeitungs|anmelde|vermittlungs|schulungs|start)gebuhr\\w*|(?:start|einsteiger)paket (?:kaufen|bezahlen|erwerben)|vorkasse|vorab (?:zahlen|bezahlen|uberweisen)|gebuhr von \\d+|paysafecard",
    flag_data: "bankverbindung|kontodaten|kontonummer|\\biban\\b|kopie (?:ihres|deines|des) (?:ausweises|personalausweises|reisepasses)|ausweiskopie|steuer-?id|sozialversicherungsnummer|kreditkartendaten",
    flag_tooGood: "(?:verdien\\w*|einkommen|gewinn\\w*)\\s(?:[a-z]+\\s){0,3}?\\d[\\d.]*\\s?(?:€|euro)\\s(?:pro|am|im|je|in der|die|\\/)\\s?(?:tag|woche)|schnelles geld|leicht verdientes geld|garantiertes einkommen",
    flag_mlm: "eigener chef|eigene chefin|network ?marketing|empfehlungsmarketing|direktvertrieb|strukturvertrieb|nur auf provision|reine provision|provisionsbasis",
    flag_mail: "[\\w.+-]+@(?:web|gmx|t-online|freenet|googlemail)\\.[a-z.]+"
  },
  stop: "eine einer eines einem einen sind sein seine seiner wird werden wurde wurden haben habe hast oder aber auch sowie mit ohne nach durch beim uber unter zwischen sich ihre ihrer ihren ihnen unsere unser unseren unserem unserer deine dein deinen deiner deinem dich wenn dass dies diese dieser dieses diesem jede jeder jedes alle allem allen aller bitte gerne gern sehr mehr viel viele vielen bereich bereichen aufgaben aufgabe profil stelle stellen position mitarbeiter mitarbeiterin mitarbeitende kenntnisse kenntnis erfahrung erfahrungen berufserfahrung jahre jahren idealerweise wunschenswert vorteil bieten bietest bietet suchen suchst sucht mindestens bzw usw m/w/d euch mich mein meine gute guter gutes guten ausgepragte ausgepragt sicher sicherer sicheres sicheren hohe hoher hohes hohen erste ersten bereits sowohl verfugst verfugen bringst bringen mitbringen arbeitest arbeiten unterstutzt unterstutzen ubernimmst ubernehmen durchfuhrung durchfuhren sorgst sorgen kummerst kummern selbst eigene eigenen eigener sowie welche welcher dabei damit dort hier immer neue neuen neuer",
  syn: [
    "lager logist kommis versan", "kunde kundin kundsc klient", "verkau handel einzel", "kasse kassie", "reinig putzen sauber", "pflege pfleg betreu",
    "kinder kita kinderg", "team kolleg zusamm", "kuche koch gastro", "fahrze fahrer fuhrer", "kommun gespra", "planun termin kalend",
    "rechne comput edv", "dokume anleit", "liefer ware waren", "repara wartun instan", "patien bewohn", "baust handwe", "server system", "netzwe netz"
  ],
  junk: [
    "jetzt bewerben", "bewerben", "schnellbewerbung", "direkt bewerben", "job speichern", "speichern", "merken", "teilen", "drucken", "anzeige melden", "job melden",
    "mehr anzeigen", "weniger anzeigen", "weiterlesen", "mehr lesen", "zuruck( zur (suche|ubersicht|trefferliste))?", "ahnliche (jobs|stellen|stellenangebote)",
    "anmelden", "einloggen", "registrieren", "datenschutz(erklarung)?", "impressum", "agb", "cookie-?einstellungen", "alle akzeptieren", "alle ablehnen", "akzeptieren", "ablehnen",
    "stepstone", "xing", "arbeitsagentur", "bundesagentur fur arbeit", "jobborse", "kununu", "meinestadt\\.de", "veroffentlicht( am| vor)?.*", "vor \\d+ (tagen|stunden|minuten)",
    "heute", "gestern", "neu", "top-?job", "\\d+ bewerbungen?.*", "job-?alarm.*", "referenznummer:? ?[\\w-]+", "ref\\.?-?nr\\.?:? ?[\\w-]+", "hilfe"
  ],
  typos: {
    standart: "Standard", vorraussetzung: "Voraussetzung", vorraussetzungen: "Voraussetzungen", seperat: "separat", addresse: "Adresse", rythmus: "Rhythmus", reperatur: "Reparatur",
    komissionierung: "Kommissionierung", kommisionierung: "Kommissionierung", komissionierer: "Kommissionierer", ingeneur: "Ingenieur", kentnisse: "Kenntnisse", kenntnise: "Kenntnisse",
    erfarung: "Erfahrung", berufserfarung: "Berufserfahrung", lebenlauf: "Lebenslauf", interresse: "Interesse", interressiert: "interessiert", zuverläsig: "zuverlässig",
    zuverläsigkeit: "Zuverlässigkeit", pünklich: "pünktlich", pünklichkeit: "Pünktlichkeit", kundenservise: "Kundenservice", kommunkation: "Kommunikation", komunikation: "Kommunikation",
    teamfähikeit: "Teamfähigkeit", selbstständikeit: "Selbstständigkeit", verantwortungsbewusst: "verantwortungsbewusst", tatsächlich: "tatsächlich", entgültig: "endgültig", wiederspiegeln: "widerspiegeln",
    organisatonstalent: "Organisationstalent", flexiebel: "flexibel", maschiene: "Maschine", maschienen: "Maschinen", projeckt: "Projekt"
  },
  /* ---------- Textes longs ---------- */
  help: {
    mid: "Das steht in deinem Lebenslauf, aber ohne Beispiel. Füg etwas Konkretes hinzu: eine Zahl, einen Ort, eine Dauer.",
    no: "Die Anzeige verlangt es. Wenn du es schon gemacht hast, auch im Ferienjob, Praktikum oder Ehrenamt, füg es hinzu.",
    s: "Die Anzeige verlangt es. Zeig es mit einem Beispiel aus einer Stelle, nicht nur mit einem Wort."
  },
  // Anschreiben : « Sehr geehrte Damen und Herren, » puis la phrase suivante commence en minuscule
  letter({job, at, why, L, gaps}){
    const when = d => L.when ? L.when.trim() : d;
    const close = `Ich stehe Ihnen ${when("kurzfristig")} zur Verfügung und freue mich auf ein persönliches Gespräch.`;
    return {
      classic: {subj: `Bewerbung als ${job}`, open: `mit großem Interesse habe ich Ihre Stellenanzeige für die Position „${job}“${at} gelesen.${why}`, intro: "Das kann ich Ihnen bieten:", extra: "", close, bye: "Mit freundlichen Grüßen"},
      dynamic: {subj: `Bewerbung: ${job}`, open: `Ihre Anzeige für die Stelle „${job}“${at} hat mich sofort angesprochen.${why}`, intro: "Was ich konkret mitbringe:", extra: "", close: `Ich bin ${when("ab sofort")} verfügbar und erzähle Ihnen gern persönlich mehr.`, bye: "Beste Grüße"},
      change: {subj: `Bewerbung als ${job} (beruflicher Neustart)`, open: `ich möchte beruflich neu durchstarten, und Ihre Stelle „${job}“${at} passt genau zu diesem Plan.${why}`, intro: "Was ich aus meinem bisherigen Weg mitbringe:", extra: gaps.length ? `Was ich noch nicht kenne, lerne ich gern, zum Beispiel ${gaps.join(" und ")}.` : "Was ich noch nicht kenne, lerne ich gern.", close, bye: "Mit freundlichen Grüßen"},
      study: {subj: `Bewerbung um eine Ausbildungsstelle oder ein Praktikum: ${job}`, open: `ich suche eine Ausbildungsstelle oder ein Praktikum [sag, was genau, mit Zeitraum und deiner Schule] als ${job}${at}.${why}`, intro: "Das kann ich schon mitbringen:", extra: "Ich möchte in der Praxis lernen und mit Ihrem Team wachsen.", close, bye: "Mit freundlichen Grüßen"}
    };
  },
  // E-Mails : après « Guten Tag …, » ou « Sehr geehrte Damen und Herren, », le texte commence en minuscule
  mails({job, at, sentOn}){
    return {
      followup: [`Nachfrage zu meiner Bewerbung: ${job}`, `ich möchte mich nach dem Stand meiner Bewerbung als ${job}${at}${sentOn} erkundigen. Die Stelle interessiert mich weiterhin sehr, und ich stehe gern für ein Gespräch zur Verfügung.`],
      thanks: [`Vielen Dank für das Gespräch: ${job}`, `vielen Dank, dass Sie sich Zeit für mich genommen haben. Unser Gespräch hat mein Interesse an der Stelle als ${job}${at} noch verstärkt. [Was dir im Gespräch gefallen hat]\n\nFür weitere Fragen stehe ich Ihnen gern zur Verfügung.`],
      accept: [`Zusage: ${job}`, `vielen Dank für Ihr Angebot für die Stelle als ${job}${at}. Ich nehme es sehr gern an. Können Sie mir die nächsten Schritte nennen (Vertrag, Starttermin, Unterlagen)?`],
      decline: [`Ihr Angebot: ${job}`, `vielen Dank für Ihr Angebot für die Stelle als ${job}${at}. Nach reiflicher Überlegung habe ich mich entschieden, es nicht anzunehmen. Die Gespräche mit Ihnen haben mir sehr gefallen, und ich hoffe, dass sich unsere Wege wieder kreuzen.`],
      feedback: [`Rückmeldung zu meiner Bewerbung: ${job}`, `vielen Dank für Ihre Rückmeldung zur Stelle als ${job}${at}. Damit ich mich verbessern kann: Hätten Sie ein paar Minuten, um mir zu sagen, was meiner Bewerbung gefehlt hat?`]
    };
  },
  // Ein-Minuten-Pitch (« Stellen Sie sich bitte kurz vor »)
  pitch({name, title, yrs, top, proof, co, job}){
    return [
      `Ich heiße ${name}.`,
      title ? `Zurzeit arbeite ich als ${title}${yrs ? ` (Berufserfahrung: etwa ${yrs})` : ""}.` : "[Was du heute machst, in einem Satz.]",
      top.length ? `Meine Stärken: ${top.join(" und ")}.` : "[Was du am besten kannst.]",
      proof ? `Zum Beispiel: ${proof}.` : "[Ein Beispiel mit einer Zahl.]",
      `Jetzt möchte ich bei ${co || "Ihrem Unternehmen"} als ${job} anfangen, weil [dein Grund].`
    ].join(" ");
  },

  /* ---------- Brutto → Netto (Deutschland, 2025) : appelé par js/salaire.js ---------- */
  salary(h){
    const {$, $$, num, show, fill, parseSalary, fold} = h;
    const BBG_RV = 96600, BBG_KV = 66150, KL = ["", "I", "II", "III", "IV"];
    let kl = 1, kist = 0, kids = false, hours = 40, zb = 2.5, base = {k: "mb", v: 0};
    // Einkommensteuer-Grundtarif 2025 (§ 32a EStG)
    const est = x => {
      x = Math.floor(Math.max(0, x));
      if (x <= 12096) return 0;
      if (x <= 17443) { const y = (x - 12096) / 1e4; return Math.floor((932.3 * y + 1400) * y); }
      if (x <= 68480) { const z = (x - 17443) / 1e4; return Math.floor((176.64 * z + 2397) * z + 1015.13); }
      if (x <= 277825) return Math.floor(.42 * x - 10911.92);
      return Math.floor(.45 * x - 19246.67);
    };
    // Abzüge pro Jahr für ein Jahresbrutto
    function parts(gy){
      const rvb = Math.min(gy, BBG_RV), kvb = Math.min(gy, BBG_KV);
      const rv = rvb * .093, av = rvb * .013, kv = kvb * (.073 + zb / 200), pv = kvb * (.018 + (kids ? 0 : .006));
      // Vorsorgepauschale (vereinfacht) : Rente + Kranken- und Pflegeversicherung, mindestens 12 % (höchstens 1 900 €, Klasse III 3 000 €)
      const kvpv = kvb * (.07 + zb / 200) + pv, vp = rv + Math.max(kvpv, Math.min(gy * .12, kl === 3 ? 3000 : 1900));
      const zve = Math.max(0, gy - 1230 - 36 - vp - (kl === 2 ? 4260 : 0));
      const lst = kl === 3 ? 2 * est(zve / 2) : est(zve);
      const frei = kl === 3 ? 39900 : 19950, soli = lst <= frei ? 0 : Math.min(lst * .055, (lst - frei) * .119);
      const ki = lst * kist / 100, net = gy - lst - soli - ki - rv - av - kv - pv;
      return {lst, soli, ki, rv, av, kv, pv, net: Math.max(0, net)};
    }
    // Netto → Brutto : Suche nach dem Brutto, das dieses Netto ergibt
    const grossFor = ny => { let a = 0, b = 2e6; for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (parts(m).net < ny) a = m; else b = m; } return (a + b) / 2; };
    const hm = () => hours * 52 / 12;
    const eur = x => (show(x) || "0") + "\u00a0€";
    function calc(){
      const {k, v} = base, per = {h: hm() * 12, m: 12, a: 1}[k[0]];
      const gy = k[1] === "b" ? v * per : grossFor(v * per), p = parts(gy);
      const out = {hb: gy / 12 / hm(), mb: gy / 12, ab: gy, hn: p.net / 12 / hm(), mn: p.net / 12, an: p.net};
      Object.entries(out).forEach(([id, x]) => { if (id !== k || document.activeElement !== $("#" + id)) $("#" + id).value = gy ? show(x) : ""; });
      [["lst", p.lst], ["soli", p.soli], ["kist", p.ki], ["rv", p.rv], ["av", p.av], ["kv", p.kv], ["pv", p.pv], ["abz", gy - p.net]].forEach(([id, x]) => $("#" + id).textContent = eur(gy ? x / 12 : 0));
      $("#pmn").textContent = show(p.net / 12) || "0"; $("#pan").textContent = show(p.net) || "0";
      $("#hoursv").textContent = show(hours) + " Std."; $("#zbv").textContent = show(zb) + " %";
      $("#sum").textContent = gy ? `${show(gy / 12)} € brutto im Monat sind etwa ${show(p.net / 12)} € netto (Steuerklasse ${KL[kl]}${kist ? `, Kirchensteuer ${kist} %` : ", ohne Kirchensteuer"}).` : "Füll ein beliebiges Feld aus: Die anderen rechnen sich von selbst aus.";
      fill();
    }
    document.addEventListener("input", e => {
      const t = e.target;
      if (t.matches(".money")) { base = {k: t.id, v: num(t.value)}; return calc(); }
      if (t.id === "hours") { hours = +t.value; return calc(); }
      if (t.id === "zb") { zb = +t.value; return calc(); }
    });
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-kl], [data-ki], [data-kid]"); if (!b) return;
      if (b.dataset.kl) { kl = +b.dataset.kl; $$("[data-kl]").forEach(x => x.setAttribute("aria-pressed", x === b)); stat("salaire-statut", {st: "kl" + kl}); }
      if (b.dataset.ki) { kist = +b.dataset.ki; $$("[data-ki]").forEach(x => x.setAttribute("aria-pressed", x === b)); }
      if (b.dataset.kid) { kids = b.dataset.kid === "1"; $$("[data-kid]").forEach(x => x.setAttribute("aria-pressed", x === b)); }
      calc();
    });
    $("#clear").addEventListener("click", () => { base = {k: "mb", v: 0}; $$(".money").forEach(i => i.value = ""); calc(); });
    // ?s=… : Gehalt aus der Anzeige (« 13,50 € brutto pro Stunde », « 3.200 € im Monat », « 45.000 € im Jahr »)
    const q = new URLSearchParams(location.search).get("s"), p = q && parseSalary(q);
    if (p) {
      const f = fold(q);
      let u = /stunde|std\b|\/ ?h\b|stundenlohn/.test(f) ? "h" : /monat/.test(f) ? "m" : /jahr|jahrlich|p\. ?a\./.test(f) ? "a" : p.u, v = p.v;
      if (u === "w") { u = "m"; v = v * 52 / 12; }
      base = {k: u + (/netto/.test(f) ? "n" : "b"), v};
    }
    if (q) $("#from").hidden = false, $("#fromv").textContent = q;
    calc();
  }
};
