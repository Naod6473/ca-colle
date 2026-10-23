// Italien de Ça colle ? (« Calza? ») : textes, lexique de l'analyse, lettre, mails, salaire (Italie). Chargé avant js/lang.js.
// Les clés de « s » sont les textes français exacts passés à tr() ; {0}, {1}… remplacent les valeurs.
const I18N = {
  lang: "it",
  s: {
    // ---------- app.js ----------
    "Offre": "Offerta",
    "offre": "offerta",
    "Retirer cette offre": "Togli questa offerta",
    "Colle le texte de l'annonce, pas son lien.": "Incolla il testo dell'annuncio, non il link.",
    "Colle au moins quelques lignes de l'annonce.": "Incolla almeno qualche riga dell'annuncio.",
    "{0} mots, c'est bon.": "{0} parole, va bene.",
    "{0} mots : colle l'annonce en entier, il en faut au moins {1}.": "{0} parole: incolla tutto l'annuncio, ne servono almeno {1}.",
    "Colle d'abord l'offre": "Prima incolla l'offerta",
    "Ajoute d'abord l'offre et ton CV": "Prima aggiungi l'offerta e il tuo CV",
    "Ajouté à ton CV à l'étape 4.": "Aggiunto al tuo CV al passo 4.",
    "Ton CV montre environ {0} d'expérience.": "Il tuo CV mostra circa {0} di esperienza.",
    "Je ne trouve pas de dates dans ton CV. Ajoute les années de chaque poste (ex : 2022 - 2025) pour qu'on les compte.": "Non trovo date nel tuo CV. Aggiungi gli anni di ogni lavoro (es. 2022 - 2025), così si possono contare.",
    "Ton CV montre environ {0}. Pense à ajouter tes stages, jobs d'été, intérim ou bénévolat.": "Il tuo CV mostra circa {0}. Ricordati di aggiungere tirocini, lavori estivi, lavoro interinale o volontariato.",
    "Prouvé dans ton CV : ": "Dimostrato nel tuo CV: ",
    "C'est dans ton CV.": "È nel tuo CV.",
    " Trouvé ici : ": " Trovato qui: ",
    "Indispensable": "Indispensabile",
    "Un plus": "Un vantaggio",
    "Dans l'offre :": "Nell'offerta:",
    "« ": "«",
    " »": "»",
    "Dans ton CV :": "Nel tuo CV:",
    "je n'ai pas trouvé de dates (ex : 2019 - 2023).": "non ho trovato date (es. 2019 - 2023).",
    "les dates de tes postes font environ {0}.": "le date dei tuoi lavori fanno circa {0}.",
    "<p><b>Mots cherchés :</b> les mots importants de cette ligne et des mots proches. {0} sur {1} trouvés dans ton CV (il en faut 6 sur 10).</p>": "<p><b>Parole cercate:</b> le parole importanti di questa riga e parole simili. Trovate nel tuo CV: {0} su {1} (ne servono 6 su 10).</p>",
    "(pas dans une expérience, donc pas encore prouvé)": "(non in un'esperienza di lavoro, quindi non ancora dimostrato)",
    "aucun mot proche trouvé.": "nessuna parola simile trovata.",
    "<p><b>Tu as corrigé ce tampon.</b> Le calcul disait : {0}.</p>": "<p><b>Hai corretto questo timbro.</b> L'analisi diceva: {0}.</p>",
    "à vérifier": "da verificare",
    "ça colle !": "calza!",
    "ça colle presque": "calza quasi",
    "à retravailler": "da rivedere",
    "Je n'ai reconnu aucun point dans cette offre.": "Non ho riconosciuto nessun punto in questa offerta.",
    "L'offre demande {0}. Ton CV en prouve {1}, en cite {2} sans exemple et n'en parle pas pour {3}.": "L'offerta chiede {0}. Il tuo CV ne dimostra {1}, ne cita {2} senza esempi e non ne nomina {3}.",
    " Attention : {0} points indispensables manquent.": " Attenzione: mancano {0} punti indispensabili.",
    " Attention : un point indispensable manque.": " Attenzione: manca un punto indispensabile.",
    "Rien à corriger pour l'instant.": "Per ora niente da correggere.",
    "absent de ton CV": "assente dal tuo CV",
    "à prouver avec un exemple": "da dimostrare con un esempio",
    " · indispensable": " · indispensabile",
    "Corriger": "Correggi",
    "Améliorer mon CV →": "Migliora il mio CV →",
    "Rien d'urgent.": "Niente di urgente.",
    "Ton CV couvre tout ce que demande l'offre.": "Il tuo CV copre tutto quello che chiede l'offerta.",
    "Préparer ma lettre →": "Prepara la mia lettera →",
    "Je n'ai repéré que {0} dans cette offre. Vérifie que tu as collé l'annonce en entier, avec les missions et le profil recherché.": "In questa offerta ho trovato solo {0}. Controlla di aver incollato tutto l'annuncio, con le mansioni e il profilo richiesto.",
    "Corrigé par toi": "Corretto da te",
    "Ton CV dit « {0} », l'offre dit « {1} ».": "Il tuo CV dice «{0}», l'offerta dice «{1}».",
    "Corriger ce point": "Correggi questo punto",
    "Pourquoi ce tampon ?": "Perché questo timbro?",
    "Ce tampon est faux ?": "Il timbro è sbagliato?",
    "Pas une vraie demande": "Non è una vera richiesta",
    "Revenir au calcul": "Torna all'analisi",
    "Si c'est dans ton CV avec d'autres mots, corrige le tampon. Si ce n'est pas dans ton CV, ajoute-le plutôt à l'étape 4.": "Se è nel tuo CV con altre parole, correggi il timbro. Se non è nel tuo CV, aggiungilo invece al passo 4.",
    "Points retirés": "Punti tolti",
    "Remettre": "Rimetti",
    "Les mots de l'annonce": "Le parole dell'annuncio",
    "Les recruteurs et leurs logiciels cherchent les mots exacts de l'offre. Reprends-les dans ton CV quand c'est vrai.": "Chi seleziona il personale, e i suoi programmi, cerca le parole esatte dell'offerta. Usale nel tuo CV quando sono vere.",
    "Test robot recruteur": "Test del robot selezionatore",
    "sur": "su",
    "Beaucoup d'entreprises trient les CV avec un logiciel avant qu'une personne les lise. Voici ce qui peut le gêner.": "Molte aziende fanno passare i CV da un programma prima che una persona li legga. Ecco cosa può metterlo in difficoltà.",
    " : bon": ": a posto",
    " : à corriger": ": da correggere",
    "L'annonce en bref": "L'annuncio in breve",
    "Attention, cette annonce ressemble à une arnaque.": "Attenzione, questo annuncio sembra una truffa.",
    "Quelques points à vérifier avant de postuler.": "Qualche punto da verificare prima di candidarti.",
    "Ne paie jamais pour postuler et ne donne pas tes papiers avant un contrat signé. En cas de doute, signale l'annonce au site qui la publie.": "Non pagare mai per candidarti e non dare i tuoi documenti prima di un contratto firmato. Nel dubbio, segnala l'annuncio al sito che lo pubblica.",
    "salaire.html": "salary-it.html",
    "Brut → net": "Lordo → netto",
    "pas indiqué": "non indicato",
    "Ce qui n'est pas écrit, demande-le avant ou pendant l'entretien : c'est normal de poser la question.": "Quello che non è scritto, chiedilo prima o durante il colloquio: è normale fare la domanda.",
    "tes compétences": "le tue competenze",
    "ton expérience : ": "la tua esperienza: ",
    "ta formation": "la tua formazione",
    "Prêt.": "Pronto.",
    "Remplis les cases jaunes.": "Riempi le caselle gialle.",
    "Oui": "Sì",
    "Non": "No",
    "Point laissé de côté.": "Punto messo da parte.",
    "Revenir sur ce point": "Torna su questo punto",
    "Dans": "Dove:",
    "Ajouté": "Aggiunto",
    "Retirer": "Togli",
    "Ajouter à mon CV": "Aggiungi al mio CV",
    "Rien à améliorer pour cette offre : ton CV couvre déjà tout ce qu'on sait repérer.": "Niente da migliorare per questa offerta: il tuo CV copre già tutto quello che sappiamo riconoscere.",
    "{0} point{1} sur {2} prouvé{3} dans ton CV.": "Punti dimostrati nel tuo CV: {0} su {2}.",
    "Relecture du CV": "Rilettura del CV",
    "Faute": "Errore",
    "Verbe faible": "Verbo debole",
    "Trop long": "Troppo lunga",
    "Sans chiffre": "Senza numeri",
    "Style": "Stile",
    "Seules les fautes sont corrigées en un clic. Pour le reste, modifie le texte de ton CV à l'étape 2 (« Vérifier le texte lu »).": "Solo gli errori si correggono con un clic. Per il resto, modifica il testo del tuo CV al passo 2 («Controlla il testo letto»).",
    "Rien à signaler : pas de faute courante, de verbe faible ni de phrase trop longue.": "Niente da segnalare: nessun errore comune, verbo debole o frase troppo lunga.",
    "Aucun point fort trouvé pour l'instant : améliore d'abord ton CV à l'étape 4.": "Per ora nessun punto di forza trovato: prima migliora il tuo CV al passo 4.",
    "[intitulé du poste]": "[nome della posizione]",
    "[nom de l'entreprise]": "[nome dell'azienda]",
    " : ": ": ",
    "Page {0} sur {1}": "Pagina {0} di {1}", "{0} page{1}": "{0} pagine", "1 page": "1 pagina", "Mon": "Mio",
    " chez {0}": " presso {0}",
    " [pourquoi ce poste ou cette entreprise]": " [perché questo lavoro o questa azienda]",
    "[ton nom]": "[il tuo nome]",
    "[ton email et ton téléphone]": "[la tua email e il tuo telefono]",
    "À l'attention du service recrutement": "Alla cortese attenzione dell'Ufficio Selezione del Personale",
    "Madame, Monsieur,": "Gentile Responsabile,",
    "Prénom Nom": "Nome Cognome",
    "poste": "posizione",
    "Le nom de l'entreprise et le poste sont écrits dans ta lettre": "Il nome dell'azienda e la posizione sono scritti nella tua lettera",
    "Ton email et ton téléphone sont dans la lettre": "La tua email e il tuo telefono sono nella lettera",
    "Ton CV a encore {0} (étape 4)": "Il tuo CV ha ancora {0} (passo 4)",
    "Pas de faute courante dans ton CV": "Nessun errore comune nel tuo CV",
    "Un point indispensable manque dans ton CV (étape 4)": "Manca un punto indispensabile nel tuo CV (passo 4)",
    "{0} points indispensables manquent dans ton CV (étape 4)": "Mancano {0} punti indispensabili nel tuo CV (passo 4)",
    "{0} dans ton CV (étape 4)": "{0} nel tuo CV (passo 4)",
    "Les points indispensables de l'offre sont dans ton CV": "I punti indispensabili dell'offerta sono nel tuo CV",
    "CV enregistré en PDF, avec un nom clair : {0}_CV.pdf": "CV salvato in PDF, con un nome chiaro: {0}_CV.pdf",
    "Objet du mail clair : « Candidature {0} · {1} »": "Oggetto della mail chiaro: «Candidatura {0} · {1}»",
    "CV et lettre joints au mail (ou collés dans le formulaire du site)": "CV e lettera allegati alla mail (o incollati nel modulo del sito)",
    "Lettre relue une dernière fois, à voix haute": "Lettera riletta un'ultima volta, ad alta voce",
    "Annonce gardée : copie du texte ou lien noté dans ton suivi": "Annuncio conservato: copia del testo o link annotato nelle tue candidature",
    "Avant d'envoyer": "Prima di inviare",
    " : fait": ": fatto",
    " : à faire": ": da fare",
    "C'est envoyé : noter dans mon suivi": "Inviata: segnala nelle mie candidature",
    "Revenir au modèle": "Torna al modello",
    "Modifier le texte": "Modifica il testo",
    "Lettre_": "Lettera_",
    "motivation": "presentazione",
    "Fichier Word téléchargé": "File Word scaricato",
    "Choisis « Enregistrer en PDF »": "Scegli «Salva come PDF»",
    "Texte copié": "Testo copiato",
    "Copie impossible : sélectionne le texte": "Copia non riuscita: seleziona il testo",
    " (indispensable)": " (indispensabile)",
    "Bilan Ça colle ?": "Riepilogo Calza?",
    "fr-FR": "it-IT",
    "Score : {0} % ({1}). {2} point{3} prouvé{4}, {5} à préciser, {6} absent{7} du CV, sur {8}.": "Punteggio: {0}% ({1}). Su {8} punti: dimostrati {2}, da precisare {5}, assenti dal CV {6}.",
    "Suivi : ": "Candidatura: ",
    " · envoyée le ": " · inviata il ",
    "Pas dans le CV": "Non nel CV",
    "À préciser avec un exemple": "Da precisare con un esempio",
    "Ça colle": "Calza",
    "L'annonce": "L'annuncio",
    " : pas indiqué": ": non indicato",
    "Test robot recruteur : à corriger": "Test del robot selezionatore: da correggere",
    "Ajouté au CV avec l'app": "Aggiunto al CV con l'app",
    "Fait avec Ça colle ? (ca-colle.pissits.com) : l'analyse se fait sur l'appareil, rien n'est envoyé.": "Fatto con Calza? (ca-colle.pissits.com): l'analisi avviene sul dispositivo, niente viene inviato.",
    "Bilan_": "Riepilogo_",
    "Mon bilan de candidature": "Il riepilogo della mia candidatura",
    "Bilan copié : colle-le dans un mail": "Riepilogo copiato: incollalo in una mail",
    "Copie impossible": "Copia non riuscita",
    // setCV : deux formes possibles (avec ou sans « aucun titre de rubrique »), la plus longue d'abord
    "{0} lignes · {1} expérience{2} repérée{3} · aucun titre de rubrique trouvé (Expériences, Compétences…)": "Righe: {0} · righe di esperienza trovate: {1} · nessun titolo di sezione trovato (Esperienze, Competenze…)",
    "{0} lignes · {1} expérience{2} repérée{3}": "Righe: {0} · righe di esperienza trovate: {1}",
    " · relis le texte lu, la photo n'était pas très nette": " · rileggi il testo letto, la foto non era molto nitida",
    "CV lu": "CV letto",
    "Je n'ai pas réussi à lire ce fichier. Essaie un PDF.": "Non sono riuscito a leggere questo file. Prova con un PDF.",
    "Offre lue": "Offerta letta",
    "La capture n'était pas très nette : relis le texte de l'offre avant de continuer.": "Lo screenshot non era molto nitido: rileggi il testo dell'offerta prima di continuare.",
    "Je n'ai pas réussi à lire ce fichier.": "Non sono riuscito a leggere questo file.",
    "Ton CV": "Il tuo CV",
    " et ": " e ",
    " sont là.": ": li trovi qui.",
    "Ajouté à ton CV": "Aggiunto al tuo CV",
    "Point retiré du score": "Punto tolto dal punteggio",
    "Tampon corrigé": "Timbro corretto",
    "Revenu au calcul": "Tornato all'analisi",
    "Corrigé : « {0} »": "Corretto: «{0}»",
    "Exemple : CV de Camille Martin": "Esempio: CV di Giulia Rossi",
    "CV fictif pour essayer": "CV inventato per provare l'app",
    "Colle la nouvelle offre : ton CV est gardé": "Incolla la nuova offerta: il tuo CV resta",
    "Ta session restera sur cet appareil": "La tua sessione resterà su questo dispositivo",
    "Plus rien n'est gardé sur cet appareil": "Niente viene più conservato su questo dispositivo",
    "Ton CV et tes offres ne sont plus gardés. Ton suivi reste sur cet appareil.": "Il CV e le offerte non sono più conservati. Il registro resta su questo dispositivo.",
    "Je n'arrive pas à enregistrer sur cet appareil (mémoire du navigateur pleine ?). Pour ne rien perdre, fais une sauvegarde : Mes candidatures, menu Import / Export.": "Non riesco a salvare su questo dispositivo (memoria del browser piena?). Per non perdere niente, fai un backup: Le mie candidature, menu Importa / Esporta.",
    "Sauvegarde ouverte. Ta session est maintenant gardée sur cet appareil : tu peux décocher la case en bas de page.": "Backup aperto. La tua sessione ora è conservata su questo dispositivo: puoi togliere la spunta alla casella in fondo alla pagina.",
    "J'ai retiré {0} du site (boutons, menus, mentions).": "Ho tolto {0} del sito (pulsanti, menu, avvisi).",
    "App installée": "App installata",
    "Annonce reçue": "Annuncio ricevuto",
    "Le site n'a envoyé que le lien : copie le texte de l'annonce": "Il sito ha inviato solo il link: copia il testo dell'annuncio",
    // ---------- confort.js, demo.js ----------
    "À faire en premier : ": "Da fare per primo: ",
    "Mode démo : profil de Maurice MARCEL chargé": "Modalità demo: profilo di Maurice MARCEL caricato",
    // ---------- lecteur.js ----------
    "Lecture de l'image : {0} %": "Lettura dell'immagine: {0}%",
    "Préparation de la lecture d'image (la première fois seulement)…": "Preparo la lettura delle immagini (solo la prima volta)…",
    "Ce fichier Word semble abîmé. Enregistre-le à nouveau ou envoie un PDF.": "Questo file Word sembra danneggiato. Salvalo di nuovo o invia un PDF.",
    "Ce fichier ne contient pas de texte lisible.": "Questo file non contiene testo leggibile.",
    "Fichier trop lourd : 20 Mo maximum.": "File troppo pesante: massimo 20 MB.",
    "Lecture du texte…": "Lettura del testo…",
    "Fichier texte": "File di testo",
    "Ouverture du document Word…": "Apertura del documento Word…",
    "Document Word": "Documento Word",
    "Ouverture du document…": "Apertura del documento…",
    "Document OpenDocument": "Documento OpenDocument",
    "L'ancien format Word (.doc) n'est pas lu. Dans Word, fais « Enregistrer sous » en .docx ou en PDF.": "Il vecchio formato Word (.doc) non si legge. In Word, usa «Salva con nome» in .docx o in PDF.",
    "Chargement du lecteur PDF…": "Caricamento del lettore PDF…",
    "Ce PDF est une image : lecture à l'œil (OCR)…": "Questo PDF è un'immagine: lettura ottica (OCR)…",
    "PDF scanné · {0} · lu à {1} %": "PDF scansionato · {0} · letto al {1}%",
    "Les photos HEIC d'iPhone ne s'ouvrent pas dans le navigateur. Envoie une capture d'écran ou un JPEG.": "Le foto HEIC dell'iPhone non si aprono nel browser. Invia uno screenshot o un JPEG.",
    "Lecture de la photo…": "Lettura della foto…",
    "Photo · lue à {0} %": "Foto · letta al {0}%",
    "Format non reconnu. Envoie un PDF, un Word (.docx), un .odt, un .txt ou une photo.": "Formato non riconosciuto. Invia un PDF, un Word (.docx), un .odt, un .txt o una foto.",
    "Je n'ai presque pas trouvé de texte. Essaie un PDF, ou une photo bien droite et nette.": "Non ho trovato quasi nessun testo. Prova con un PDF, o con una foto dritta e nitida.",
    "C'est lu.": "Letto.",
    // ---------- moteur.js ----------
    "À préciser": "Da dimostrare",
    "Pas dans ton CV": "Non nel tuo CV",
    "Compétences": "Competenze",
    "cette qualité": "questa qualità",
    "ex : …": "es. …",
    "ex : {0}": "es. {0}",
    "Pas grave. Si tu es prêt(e) à apprendre, dis-le dans ta lettre de motivation.": "Non è grave. Se hai voglia di imparare, dillo nella tua lettera di presentazione.",
    "C'est cité, mais aucune expérience ne le montre. Dis où tu l'as fait.": "È citato, ma nessuna esperienza lo mostra. Di' dove l'hai fatto.",
    " {0} : {où et combien ? {1}}.": " {0}: {dove e quanto? {1}}.",
    "As-tu déjà fait ça : {0} ?": "L'hai già fatto: {0}?",
    "Un mot seul ne prouve rien : ajoute un fait concret.": "Una parola da sola non dimostra niente: aggiungi un fatto concreto.",
    "L'offre le demande : prouve-le par un fait, pas par un adjectif.": "L'offerta lo chiede: dimostralo con un fatto, non con un aggettivo.",
    " {un fait qui montre {0} ? {1}}.": " {un fatto che mostra {0}? {1}}.",
    "Dis à quoi il te sert, ça parle plus qu'un nom de logiciel.": "Di' a cosa ti serve: dice di più del nome di un programma.",
    "{0} ({pour quoi faire ? {1}})": "{0} ({per fare cosa? {1}})",
    "Sais-tu utiliser {0} ?": "Sai usare {0}?",
    ", {0} ({ton niveau ou un exemple ? {1}})": ", {0} ({il tuo livello o un esempio? {1}})",
    "Si c'est un « plus », ce n'est pas bloquant. Sinon, une formation courte peut suffire.": "Se è solo «gradito», non è un problema. Altrimenti, può bastare un corso breve.",
    "As-tu : {0} ?": "Hai: {0}?",
    ", {0} ({année ou détail ? ex : {1}})": ", {0} ({anno o dettaglio? es. {1}})",
    ", {0} ({année ou détail ? {1}})": ", {0} ({anno o dettaglio? {1}})",
    "Certaines entreprises financent la formation. Tu peux dire dans ta lettre que tu es prêt(e) à la passer.": "Alcune aziende pagano il corso. Puoi scrivere nella lettera che hai voglia di farlo.",
    "{0} ({ton niveau ? ex : scolaire, courant})": "{0} ({il tuo livello? es. scolastico, fluente})",
    "Tu parles {0} ?": "Parli {0}?",
    ", {0} {ton niveau ? ex : scolaire}": ", {0} {il tuo livello? es. scolastico}",
    "Si l'offre dit « apprécié », ce n'est pas bloquant.": "Se l'offerta dice «gradito», non è un problema.",
    "Acceptes-tu ces horaires ?": "Questi orari ti vanno bene?",
    ", disponible {quand ? ex : en horaires décalés et le week-end}": ", disponibile {quando? es. su turni e nel fine settimana}",
    "Dis-le franchement en entretien : c'est mieux que de mauvaises surprises.": "Dillo con sincerità al colloquio: meglio che brutte sorprese.",
    "As-tu ce diplôme ({0}) ?": "Hai questo titolo di studio ({0})?",
    "{0} {spécialité et année ? ex : Employé de commerce, 2020}": "{0} {indirizzo e anno? es. Servizi commerciali, 2020}",
    "Une expérience équivalente compte souvent autant : mets-la en avant dans ta lettre.": "Un'esperienza simile spesso conta altrettanto: mettila in evidenza nella lettera.",
    "C'est cité, mais sans exemple concret.": "È citato, ma senza un esempio concreto.",
    " {un exemple concret ? ex : où, combien, pendant combien de temps}.": " {un esempio concreto? es. dove, quanto, per quanto tempo}.",
    "As-tu déjà fait ça ?": "L'hai già fatto?",
    " {ce que tu as fait ? ex : où, combien, pendant combien de temps}.": " {cosa hai fatto? es. dove, quanto, per quanto tempo}.",
    "Pas grave : mets en avant ce qui s'en rapproche le plus.": "Non è grave: metti in evidenza quello che ci si avvicina di più.",
    "{0} ans d'expérience": "{0} anni di esperienza",
    "1 an d'expérience": "1 anno di esperienza",
    "Diplôme : {0}": "Titolo di studio: {0}",
    "Ton CV est une image": "Il tuo CV è un'immagine",
    "Ton CV contient du vrai texte": "Il tuo CV contiene vero testo",
    "Beaucoup de logiciels de tri ne lisent pas les images. Envoie plutôt un PDF enregistré depuis Word ou Google Docs.": "Molti programmi di selezione non leggono le immagini. Invia piuttosto un PDF salvato da Word o Google Docs.",
    "Les logiciels de tri peuvent le lire.": "I programmi di selezione possono leggerlo.",
    "Adresse email": "Indirizzo email",
    "Mets ton email en haut du CV, en texte (pas dans une image).": "Metti la tua email in cima al CV, come testo (non in un'immagine).",
    "Numéro de téléphone": "Numero di telefono",
    "Ajoute ton numéro en haut du CV, au format 06 12 34 56 78.": "Aggiungi il tuo numero in cima al CV, per esempio 333 123 4567.",
    "Titre « Expériences »": "Titolo «Esperienze»",
    "Écris un titre clair « Expériences professionnelles » au-dessus de tes postes.": "Scrivi un titolo chiaro «Esperienze professionali» sopra i tuoi lavori.",
    "Titre « Compétences »": "Titolo «Competenze»",
    "Ajoute une rubrique « Compétences » avec les mots de l'offre.": "Aggiungi una sezione «Competenze» con le parole dell'offerta.",
    "Titre « Formation »": "Titolo «Formazione»",
    "Ajoute une rubrique « Formation » avec tes diplômes, même s'il n'y en a qu'un.": "Aggiungi una sezione «Formazione» con i tuoi titoli di studio, anche se ce n'è uno solo.",
    "Dates sur tes expériences": "Date sulle tue esperienze",
    "Mets les années de début et de fin de chaque poste (ex : 2022 - 2025).": "Metti l'anno di inizio e di fine di ogni lavoro (es. 2022 - 2025).",
    "CV un peu court": "CV un po' corto",
    "CV très long": "CV molto lungo",
    "Longueur correcte": "Lunghezza giusta",
    "Détaille un peu plus tes expériences : ce que tu faisais, avec des chiffres.": "Racconta un po' di più le tue esperienze: cosa facevi, con dei numeri.",
    "Garde l'essentiel sur 1 ou 2 pages.": "Tieni l'essenziale in 1 o 2 pagine.",
    "Pas de caractères bizarres": "Nessun carattere strano",
    "Certains symboles ou icônes ne sont pas lus. Remplace-les par du texte (ex : « Tél : »).": "Alcuni simboli o icone non vengono letti. Sostituiscili con del testo (es. «Tel.:»).",
    "Salaire": "Retribuzione",
    "Contrat": "Contratto",
    "Temps de travail": "Orario di lavoro",
    "Télétravail": "Lavoro da remoto",
    "Début": "Inizio",
    "On te demande de payer": "Ti chiedono di pagare",
    "Une vraie entreprise ne fait jamais payer pour postuler, pour une formation obligatoire ou pour un « kit ».": "Una vera azienda non ti fa mai pagare per candidarti, per un corso obbligatorio o per un «kit».",
    "On te demande des données sensibles": "Ti chiedono dati sensibili",
    "Ne donne pas ton RIB, ta carte Vitale ou une copie de pièce d'identité avant d'avoir signé un contrat.": "Non dare il tuo IBAN, la tessera sanitaria o una copia del documento d'identità prima di aver firmato un contratto.",
    "Contact par messagerie seulement": "Contatto solo tramite app di messaggi",
    "Les arnaques passent souvent par WhatsApp ou Telegram. Cherche le site et l'adresse de l'entreprise.": "Le truffe passano spesso da WhatsApp o Telegram. Cerca il sito e l'indirizzo dell'azienda.",
    "Trop beau pour être vrai": "Troppo bello per essere vero",
    "Des gains élevés et rapides sans expérience, c'est le signe classique d'une arnaque.": "Guadagni alti e veloci senza esperienza sono il segnale classico di una truffa.",
    "Vente à domicile ou parrainage": "Vendita porta a porta o reclutamento di altre persone",
    "Vérifie que tu seras salarié(e) avec un vrai contrat, et pas payé(e) seulement à la commission.": "Verifica che ci sia un vero contratto di lavoro, e non solo un pagamento a provvigione.",
    "Adresse email personnelle": "Indirizzo email personale",
    "Une adresse Gmail, Hotmail ou Yahoo pour une entreprise : vérifie qu'elle existe vraiment (site, SIRET, avis).": "Un indirizzo Gmail, Hotmail o Libero per un'azienda: verifica che esista davvero (sito, partita IVA, recensioni).",
    "Lieu": "Luogo",
    "« {0} » s'écrit « {1} »": "«{0}» si scrive «{1}»",
    "« {0} » ne dit pas ce que tu as fait toi-même. Préfère un verbe d'action : « organisé », « géré », « préparé », « vendu »…": "«{0}» non dice cosa hai fatto tu. Usa un verbo d'azione: «organizzato», «gestito», «preparato», «venduto»…",
    "Phrase de {0} mots : coupe-la en deux, un recruteur lit vite.": "Frase di {0} parole: dividila in due, chi seleziona legge in fretta.",
    "Aucun chiffre ici : ajoute combien (clients, commandes, personnes, euros) ou pendant combien de temps.": "Qui non c'è nessun numero: aggiungi quanti (clienti, ordini, persone, euro) o per quanto tempo.",
    "« Je » revient {0} fois. Dans un CV, commence plutôt par le verbe : « Préparé 120 commandes par jour ».": "«Io» compare {0} volte. In un CV, comincia piuttosto con il verbo: «Preparati 120 ordini al giorno».",
    // ---------- outils.js ----------
    "Relance": "Sollecito",
    "Merci après l'entretien": "Grazie dopo il colloquio",
    "Accepter une proposition": "Accettare un'offerta",
    "Refuser poliment": "Rifiutare con gentilezza",
    "Demander un retour après un refus": "Chiedere un riscontro dopo un rifiuto",
    "Bonjour,": "Gentile Responsabile,",
    "Bonjour {0},": "Gentile {0},",
    "Bien cordialement,": "Cordiali saluti,",
    " envoyée le {0}": " inviata il {0}",
    "← Retour au suivi": "← Torna alle candidature",
    "Écrire un mail": "Scrivi una mail",
    "Type de mail": "Tipo di mail",
    "Objet": "Oggetto",
    "Message": "Messaggio",
    "Relis et complète ce qui est entre crochets avant d'envoyer. Le mail part de ta propre messagerie.": "Rileggi e completa quello che è tra parentesi quadre prima di inviare. La mail parte dalla tua casella di posta.",
    " Ajoute l'email du contact dans la fiche pour qu'il soit rempli tout seul.": " Aggiungi l'email del contatto nella scheda: così si compila da sola.",
    "Ouvrir dans ma messagerie": "Apri nella mia app di posta",
    "Copier": "Copia",
    "Noter comme relancée": "Segna come sollecitata",
    "Entretien": "Colloquio",
    "Relancer": "Sollecitare",
    "Candidature": "Candidatura",
    "candidature": "candidatura",
    "Contact : ": "Contatto: ",
    "Ouvre le fichier pour l'ajouter à ton agenda": "Apri il file per aggiungerlo al tuo calendario",
    "Ce qui manque le plus à ton CV": "Cosa manca di più al tuo CV",
    "Sur tes {0} offres, ces points reviennent souvent et ton CV ne les prouve pas encore. Les ajouter aide pour plusieurs candidatures à la fois.": "Nelle tue {0} offerte questi punti tornano spesso e il tuo CV non li dimostra ancora. Aggiungerli aiuta più candidature insieme.",
    "revient dans {0} offres sur {1}": "presente in {0} offerte su {1}",
    " · indispensable dans {0}": " · indispensabile in {0}",
    "pas dans ton CV": "non nel tuo CV",
    "à prouver": "da dimostrare",
    "Aucun point ne manque dans plusieurs offres à la fois : bonne nouvelle.": "Nessun punto manca in più offerte insieme: buona notizia.",
    "Il faut au moins deux offres analysées pour les comparer. Colle une autre offre avec « Comparer avec une autre offre » à l'étape 3.": "Servono almeno due offerte analizzate per confrontarle. Incolla un'altra offerta con «Confronta con un'altra offerta» al passo 3.",
    "Score": "Punteggio",
    "État": "Stato",
    "Absent de ton CV": "Assente dal tuo CV",
    " (dont {0} indispensable{1})": " (di cui indispensabili: {0})",
    "Alertes": "Avvisi",
    "Critère": "Criterio",
    "Seules les offres dont tu as collé le texte apparaissent ici. Clique sur un titre pour revoir son analyse.": "Qui compaiono solo le offerte di cui hai incollato il testo. Clicca su un titolo per rivedere la sua analisi.",
    "Quel est le salaire prévu pour ce poste ?": "Qual è la retribuzione prevista per questa posizione?",
    "Quel type de contrat est proposé, et pour combien de temps ?": "Che tipo di contratto è previsto, e per quanto tempo?",
    "Quels sont les horaires et le temps de travail ?": "Quali sono gli orari e l'orario di lavoro settimanale?",
    "Où se trouve le lieu de travail ? Y a-t-il des déplacements ?": "Dove si trova il luogo di lavoro? Sono previste trasferte?",
    "Le télétravail est-il possible, même en partie ?": "È possibile lavorare da remoto, anche in parte?",
    "Quand le poste commence-t-il ?": "Quando inizia il lavoro?",
    "Pouvez-vous me donner le nom et l'adresse exacts de l'entreprise ?": "Può darmi il nome e l'indirizzo esatti dell'azienda?",
    "À quoi ressemble une journée type sur ce poste ?": "Com'è una giornata tipo in questa posizione?",
    "Comment est composée l'équipe ?": "Com'è composta la squadra?",
    "Comment se passe l'arrivée d'un nouveau salarié (formation, tuteur) ?": "Come funziona l'inserimento di una persona nuova (formazione, tutor)?",
    "Quelles sont les prochaines étapes du recrutement ?": "Quali sono i prossimi passi della selezione?",
    "Questions à poser au recruteur": "Domande da fare a chi ti seleziona",
    "Choisis-en 2 ou 3. Les premières viennent de ce que l'annonce ne dit pas.": "Scegline 2 o 3. Le prime nascono da quello che l'annuncio non dice.",
    "ca-colle-sauvegarde-": "calza-backup-",
    "Fichier enregistré : ouvre-le sur ton autre appareil": "File salvato: aprilo sull'altro dispositivo",
    "Ce fichier n'est pas une sauvegarde de Ça colle ?": "Questo file non è un backup di Calza?",
    "Remplacer ce qui est dans l'app par le contenu de ce fichier ?": "Sostituire quello che c'è nell'app con il contenuto di questo file?",
    "Impossible d'enregistrer sur cet appareil": "Impossibile salvare su questo dispositivo",
    "Mail copié": "Mail copiata",
    "Notée comme relancée, nouveau rappel dans 7 jours": "Segnata come sollecitata, nuovo promemoria tra 7 giorni",
    "Aucune candidature envoyée sur cette période": "Nessuna candidatura inviata in questo periodo",
    "du {0} au {1}": "dal {0} al {1}",
    "Mes démarches de recherche d'emploi": "La mia ricerca di lavoro",
    "Période : ": "Periodo: ",
    "Date": "Data",
    "Entreprise": "Azienda",
    "Poste": "Posizione",
    "Contact ou lien": "Contatto o link",
    "Liste établie le {0} à partir du suivi tenu par la personne avec Ça colle ? (ca-colle.pissits.com).": "Elenco creato il {0} a partire dal registro tenuto dalla persona con Calza? (ca-colle.pissits.com).",
    "Ton tableau de bord se remplira quand tu auras noté des candidatures envoyées.": "Il tuo cruscotto si riempirà quando avrai segnato delle candidature inviate.",
    "candidatures envoyées": "candidature inviate",
    " %": "%",
    "de réponses ({0})": "con risposta ({0})",
    "entretiens obtenus": "colloqui ottenuti",
    "jour": "giorno",
    "avant une réponse, en moyenne": "prima di una risposta, in media",
    "Cette semaine : ": "Questa settimana: ",
    "{0} candidatures sur un objectif de {1}": "{0} candidature su un obiettivo di {1}",
    "Mon objectif par semaine": "Il mio obiettivo settimanale",
    "Objectif atteint, bravo. Pense aussi à te reposer.": "Obiettivo raggiunto, complimenti! Ricordati anche di riposare.",
    "Encore {0} pour atteindre ton objectif. La qualité compte plus que le nombre : une lettre adaptée vaut mieux que trois envois rapides.": "Ancora {0} per raggiungere il tuo obiettivo. La qualità conta più del numero: una lettera su misura vale più di tre invii veloci.",
    "Candidatures par semaine": "Candidature per settimana",
    "Où en sont tes candidatures": "A che punto sono le tue candidature",
    "[ton prénom]": "[il tuo nome]",
    "Remplacer ta réponse actuelle par le pitch ?": "Sostituire la tua risposta attuale con il pitch?",
    "Pitch prêt : complète ce qui est entre crochets": "Pitch pronto: completa quello che è tra parentesi quadre",
    // ---------- suivi.js ----------
    "À postuler": "Da inviare",
    "Candidature envoyée": "Candidatura inviata",
    "Relancée": "Sollecitata",
    "Appel de prise de contact": "Primo contatto telefonico",
    "Entretien prévu": "Colloquio fissato",
    "Entretien passé": "Colloquio fatto",
    "Test ou mise en situation": "Test o prova pratica",
    "Proposition reçue": "Offerta ricevuta",
    "Acceptée": "Accettata",
    "Refusée": "Rifiutata",
    "Sans réponse": "Senza risposta",
    "Abandonnée": "Abbandonata",
    "Rendez-vous": "Appuntamento",
    "À faire": "Da fare",
    "{0} aujourd'hui": "{0}: oggi",
    "{0} prévue il y a {1}": "{0}: previsto {1} fa",
    "{0} demain": "{0}: domani",
    "{0} dans 2 jours": "{0}: tra 2 giorni",
    "Sans nouvelles depuis {0} : relance": "Nessuna notizia da {0}: sollecita",
    "Pas encore postulé": "Candidatura non ancora inviata",
    "Rien d'urgent. Pense à noter chaque réponse.": "Niente di urgente. Ricordati di segnare ogni risposta.",
    "Aucune candidature pour l'instant. Ajoute-en une, ou clique sur « Suivre cette candidature » après une analyse.": "Per ora nessuna candidatura. Aggiungine una, o clicca su «Segui questa candidatura» dopo un'analisi.",
    "Aucune candidature dans ce filtre.": "Nessuna candidatura con questo filtro.",
    "Entreprise à préciser": "Azienda da indicare",
    "Score de l'analyse": "Punteggio dell'analisi",
    "Offre du": "Offerta del",
    "Prochaine étape": "Prossimo passo",
    "Détails et suivi": "Dettagli e storico",
    "Date de l'offre": "Data dell'offerta",
    "Date de candidature": "Data della candidatura",
    "Prochaine étape (relance, entretien…)": "Prossimo passo (sollecito, colloquio…)",
    "Contact": "Contatto",
    "ex : Mme Dupont, RH, 02 31 00 00 00": "es. sig.ra Bianchi, Risorse Umane, 051 000 0000",
    "Lien de l'annonce": "Link dell'annuncio",
    "Notes": "Note",
    "ex : entretien avec le chef d'équipe, questions sur les horaires": "es. colloquio con il capo reparto, domande sugli orari",
    "Voir l'analyse": "Vedi l'analisi",
    "Préparer l'entretien": "Prepara il colloquio",
    "Ajouter à l'agenda": "Aggiungi al calendario",
    "Ouvrir l'annonce": "Apri l'annuncio",
    "Supprimer": "Elimina",
    "Actions": "Azioni",
    "(en retard)": "(in ritardo)",
    "Ouvrir": "Apri",
    "Lien": "Link",
    "mes_candidatures.csv": "le_mie_candidature.csv",
    "Fichier téléchargé : il s'ouvre dans Excel ou LibreOffice": "File scaricato: si apre con Excel o LibreOffice",
    "Présentez-vous en quelques minutes.": "Mi parli di lei in pochi minuti.",
    "Ton parcours en 3 étapes, puis pourquoi ce poste. Une minute ou deux suffisent.": "Il tuo percorso in 3 tappe, poi perché questa posizione. Bastano uno o due minuti.",
    "Pourquoi ce poste et pourquoi notre entreprise ?": "Perché questa posizione e perché la nostra azienda?",
    "Reprends ce que tu as écrit dans ta lettre.": "Riprendi quello che hai scritto nella lettera.",
    "Ces horaires vous conviennent-ils ({0}) ?": "Questi orari le vanno bene ({0})?",
    "Réponds franchement, avec tes contraintes s'il y en a.": "Rispondi con sincerità, con i tuoi vincoli se ce ne sono.",
    "{0} : depuis quand l'avez-vous ?": "{0}: da quando ce l'ha?",
    "Avez-vous : {0} ? Sinon, êtes-vous prêt(e) à le passer ?": "Ha: {0}? Se no, pensa di ottenerlo?",
    "Une date, ou ton plan pour l'obtenir.": "Una data, o il tuo piano per ottenerlo.",
    "Parlez-moi de votre parcours et de votre expérience.": "Mi parli del suo percorso e della sua esperienza.",
    "Commence par le poste le plus proche de cette offre.": "Comincia dal lavoro più vicino a questa offerta.",
    "Donnez un exemple qui montre votre {0}.": "Mi faccia un esempio che mostri questa qualità: {0}.",
    "Un vrai moment, pas un adjectif.": "Un momento vero, non un aggettivo.",
    "Parlez-moi de votre expérience en {0}.": "Mi parli della sua esperienza: {0}.",
    "Appuie-toi sur ton CV : « {0} »": "Appoggiati al tuo CV: «{0}»",
    "Pouvez-vous donner un exemple concret : {0} ?": "Può farmi un esempio concreto: {0}?",
    "Ton CV le cite sans exemple : prépare un fait avec un chiffre.": "Il tuo CV lo cita senza esempi: prepara un fatto con un numero.",
    "L'offre demande : {0}. Comment feriez-vous ?": "L'offerta chiede: {0}. Come farebbe?",
    "N'invente pas d'expérience : dis ce qui s'en rapproche et que tu es prêt(e) à apprendre.": "Non inventare esperienze: di' cosa ci si avvicina e che hai voglia di imparare.",
    "Racontez une situation difficile au travail et ce que vous avez fait.": "Mi racconti una situazione difficile al lavoro e cosa ha fatto.",
    "Choisis une histoire qui finit bien, et ce que tu en as appris.": "Scegli una storia che finisce bene, e cosa hai imparato.",
    "Quelles sont vos qualités, et un point que vous travaillez ?": "Quali sono i suoi punti di forza, e un aspetto su cui sta lavorando?",
    "Une qualité utile pour ce poste, avec un exemple. Un vrai point à améliorer, et ce que tu fais pour.": "Una qualità utile per questo lavoro, con un esempio. Un vero punto da migliorare, e cosa fai per migliorarlo.",
    "Quand êtes-vous disponible, et quelles sont vos attentes de salaire ?": "Quando è disponibile, e quali sono le sue aspettative di retribuzione?",
    "Regarde les salaires du métier avant. Donne une fourchette.": "Prima guarda gli stipendi del mestiere. Indica una forbice.",
    "Avez-vous des questions ?": "Ha delle domande?",
    "Prépare 2 questions : une sur le poste au quotidien, une sur l'équipe.": "Prepara 2 domande: una sul lavoro di tutti i giorni, una sulla squadra.",
    "Méthode simple :": "Metodo semplice:",
    "la situation (où, quand), ce que tu as fait toi, et le résultat (avec un chiffre si possible). Écris seulement des choses vraies : c'est toi qui réponds le jour J.": "la situazione (dove, quando), cosa hai fatto tu, e il risultato (con un numero se puoi). Scrivi solo cose vere: il giorno del colloquio rispondi tu.",
    "Pour avoir des questions sur cette offre, ajoute le texte de l'annonce et ton CV. En attendant, voici les questions classiques.": "Per avere domande su questa offerta, aggiungi il testo dell'annuncio e il tuo CV. Intanto, ecco le domande classiche.",
    "Préparer mon pitch d'une minute": "Prepara il mio pitch di un minuto",
    "Ma réponse": "La mia risposta",
    "Situation": "Situazione",
    "ex : au Drive Super U, un samedi de rush": "es. alla Spesa Facile online, un sabato di punta",
    "Ce que j'ai fait": "Cosa ho fatto",
    "Résultat": "Risultato",
    "ex : 120 commandes prêtes à l'heure": "es. 120 ordini pronti in orario",
    "Télécharger en Word": "Scarica in Word",
    "En PDF": "In PDF",
    "Préparation d'entretien": "Preparazione al colloquio",
    "Situation : ": "Situazione: ",
    "Ce que j'ai fait : ": "Cosa ho fatto: ",
    "Résultat : ": "Risultato: ",
    "Candidature notée comme envoyée": "Candidatura segnata come inviata",
    "Ajoutée à ton suivi": "Aggiunta alle tue candidature",
    "Preparation_entretien_": "Preparazione_colloquio_",
    "Supprimer « {0} » de ton suivi ?": "Eliminare «{0}» dalle tue candidature?",
    // Durées : plural() rend déjà l'italien (« 3 anni »), qui repasse par tr()
    "{0} anni": "{0} anni",
    "{0} anno": "{0} anno",
    // Modèle général en dernier : les modèles plus précis qui commencent par « et finissent par » passent avant
    "« {0} »": "«{0}»"
  },
  w: {"an": "anno", "chose": "cosa", "point": "punto", "faute courante": "errore comune", "ligne": "riga", "jour": "giorno"},
  pl: {"anno": "anni", "cosa": "cose", "punto": "punti", "errore comune": "errori comuni", "riga": "righe", "giorno": "giorni", "offerta": "offerte", "candidatura": "candidature"},

  // ---------- Exemple de l'app (même offre fictive que la française, adaptée à l'Italie) ----------
  offer: `Addetto/a magazzino – tempo indeterminato – Bologna (esempio fittizio)

Nel nostro magazzino prepari gli ordini e partecipi al ricevimento della merce.

Mansioni:
- Preparazione degli ordini e controllo qualità
- Ricevimento della merce e sistemazione delle consegne
- Gestione delle scorte e inventari
- Guida del carrello elevatore (patentino muletto)
- Inserimento dati su Excel

Requisiti:
- 2 anni di esperienza in magazzino
- Patente B indispensabile
- Lavoro di squadra, puntualità, precisione
- Inglese di base gradito
- Disponibilità a lavorare su turni`,
  cv: `Giulia Rossi · Bologna · giulia.rossi@esempio.it · 333 000 0000
Esperienze
Addetta alla preparazione ordini, Spesa Facile online (2022-2025): 120 ordini al giorno, controllo qualità dei prodotti freschi, lavoro in un team di 6.
Commessa, panetteria del centro (2020-2022): apertura alle 6, cassa, sistemazione delle consegne ogni mattina.
Formazione
Qualifica professionale di Operatore ai servizi di vendita (2020)
Competenze
Foglio elettronico, gestione delle scorte, precisione, puntualità
Altro
Patente B, automunita`,

  // ---------- Mode démo (même forme que la version anglaise de js/demo.js) ----------
  demo: {
    file: "CV_Maurice_MARCEL.pdf (demo)", info: "Profilo inventato per i test",
    cv: `MAURICE MARCEL · Ingegnere informatico · 32 anni
Milano · maurice.marcel@example.com · 333 000 0000
Profilo
Ingegnere informatico con 10 anni di esperienza su sistemi, reti e cloud.
Esperienze professionali
Ingegnere di sistemi e reti, Esempio Industria S.p.A. (2019 - 2025): amministrazione di 120 server Windows e Linux, VMware vSphere, Active Directory per 800 utenti, backup Veeam, monitoraggio con Zabbix.
Amministratore di sistemi, Esempio Servizi (2016 - 2019): supporto di secondo livello, installazione di postazioni con SCCM, mi sono occupato di vari progetti e varie attività.
Tecnico di supporto (apprendistato), Esempio Informatica (2014 - 2016): assistenza agli utenti al telefono, gestione efficente dei guasti per le stampanti e la rete.
Formazione
Laurea magistrale in Ingegneria informatica, Politecnico Esempio (2016)
Competenze
Windows Server, Linux, VMware, Active Directory, PowerShell, Ansible, Docker, reti TCP/IP, sicurezza informatica, buona conoscienza dell'inglese tecnico
Altro
Patente B`,
    me: {name: "Maurice MARCEL", contact: "maurice.marcel@example.com · 333 000 0000"},
    letter: {company: "Esempio Industria", why: "il vostro passaggio al cloud è proprio il tipo di progetto che voglio guidare", when: "dal 1° dicembre"},
    offers: [
      {text: `Sistemista Windows e Linux – tempo indeterminato – Milano
Esempio Industria cerca un ingegnere di sistemi e reti per il suo reparto IT (smart working 2 giorni a settimana).
Mansioni:
- Amministrare i server Windows e Linux e la piattaforma VMware
- Gestire gli account utente e i permessi in Active Directory
- Controllare i backup e ripristinare i dati quando serve
- Automatizzare le attività con PowerShell o Ansible
- Redigere la documentazione tecnica
Requisiti:
- Almeno 5 anni di esperienza nell'amministrazione di sistemi
- La conoscenza di Azure è gradita
- Buone capacità comunicative, inglese tecnico
RAL 45.000 € lordi annui, 40 ore settimanali, inserimento immediato.`,
        app: {company: "Esempio Industria", status: "interview", offer: -20, applied: -12, next: 3, contact: "Chiara Bianchi, Risorse Umane · 02 0000 0000", notes: "Secondo colloquio con il responsabile IT. Portare esempi della migrazione Veeam.", hist: [["sent", -12], ["call", -6], ["interview", -2]]}},
      {text: `DevOps Engineer – tempo indeterminato – Torino
Mansioni:
- Costruire e mantenere le pipeline CI/CD con GitLab
- Distribuire container con Docker e Kubernetes
- Gestire l'infrastruttura come codice con Terraform e Ansible
- Monitorare la produzione con Prometheus e Grafana
- Redigere la documentazione tecnica
- L'esperienza con Azure è un plus
Requisiti:
- 3 anni di esperienza come DevOps o sistemista
- Linux, scripting (Python o Bash)
- Lavoro di squadra e autonomia
Lavoro ibrido, RAL 48.000 €.`,
        app: {company: "Esempio Cloud", status: "sent", offer: -15, applied: -9, next: -2, contact: "selezione@example.com", notes: "Candidatura inviata dal sito dell'azienda.", hist: [["sent", -9]]}},
      {text: `Project manager IT – tempo determinato 12 mesi – Bologna
Guiderai la sostituzione del gestionale ERP dell'azienda e coordinerai i fornitori.
Mansioni:
- Pianificare e seguire il budget e i tempi del progetto
- Condurre i comitati di progetto
- Scrivere le specifiche con le funzioni aziendali
- Formare gli utenti
- Redigere la documentazione tecnica
Requisiti: 5 anni di gestione di progetti IT, metodologie Agile, precisione e capacità organizzative.`,
        app: {company: "Esempio Logistica", status: "call", offer: -10, applied: -7, next: 1, contact: "Paolo Verdi · 051 000 0000", notes: "Telefonata fissata per domani alle 10.", hist: [["sent", -7], ["call", -1]]}},
      {text: `Assistente informatico da casa – guadagna fino a 400 € al giorno
Nessuna esperienza richiesta! Quota di iscrizione di 49 € per ricevere il tuo kit di partenza.
Invia il tuo IBAN e una copia del documento d'identità su WhatsApp o a selezione.rapida@gmail.com.
Mansioni: inserimento dati, risposta alle email, piccoli interventi informatici per i nostri clienti, tutto da casa.`,
        app: {company: "", status: "todo", offer: -1, notes: "Sembra una truffa: verificare prima di tutto."}},
      {text: `Sviluppatore back-end Java – partita IVA – Roma
Mansioni:
- Sviluppare API REST in Java con Spring Boot
- Scrivere i test unitari e partecipare alle revisioni del codice
- Lavorare con database PostgreSQL
Requisiti: 4 anni di sviluppo Java, Git, inglese.`,
        app: {company: "Esempio Software", status: "refused", offer: -45, applied: -40, notes: "Rifiuto: volevano più esperienza in Java.", hist: [["sent", -40], ["refused", -25]]}}
    ],
    manual: [
      {job: "Amministratore cloud", company: "Esempio Hosting", status: "offer", offer: -30, applied: -28, contact: "Sara Neri · s.neri@example.com", notes: "Offerta ricevuta: RAL 47.000 €. Rispondere entro venerdì.", hist: [["sent", -28], ["interview", -14], ["offer", -3]]},
      {job: "Responsabile infrastruttura", company: "Esempio Banca", status: "silent", offer: -60, applied: -55, notes: "Sollecitato due volte, nessuna risposta.", hist: [["sent", -55], ["followup", -40], ["silent", -20]]}
    ],
    prep: {g1: "Ingegnere informatico da 10 anni: supporto, poi amministrazione di sistemi, poi 120 server e 800 utenti in Esempio Industria. Ora cerco un ruolo ibrido con più cloud.", g2: "Il vostro passaggio al cloud e la dimensione della piattaforma."},
    star: {s: "Un guasto allo storage bloccava i backup di 300 utenti.", a: "In un fine settimana ho spostato i backup su Veeam con un nuovo NAS e ho provato i ripristini.", r: "Nessun dato perso, backup più veloci del 40%."},
    fill: ["in Esempio Industria, 2 progetti nel 2024"]
  },

  // ---------- Titres de rubriques du CV (texte sans accents, minuscules) ----------
  secs: {
    exp: "esperienz[ae]( professional[ei]| lavorativ[ae])?|esperienze di lavoro|percorso (professionale|lavorativo)|carriera|lavori svolti|impieghi",
    skills: "competenze( (chiave|tecniche|professionali|trasversali|informatiche|linguistiche|personali))?|capacita( e competenze)?( personali)?|abilita|conoscenze( informatiche| linguistiche| tecniche)?|lingue( straniere)?|punti di forza|strumenti",
    edu: "istruzione( e formazione)?|formazione( e istruzione| professionale)?|titoli di studio|titolo di studio|studi|percorso (di studi|formativo|scolastico)|certificazioni|corsi( e certificazioni)?",
    misc: "altro|altre informazioni|ulteriori informazioni|informazioni (aggiuntive|personali)|interessi|hobby|hobby e interessi|profilo( professionale| personale)?|chi sono|su di me|obiettivo professionale|riferimenti|referenze"
  },

  // ---------- Lexique : [nom, motif de l'offre, exemple pour les trous, motif côté CV si plus large] ----------
  lex: {
    "Préparation de commandes": ["Preparazione ordini", "preparazion\\w* (degli |delle |di )?ordini|allestimento (degli )?ordini|evasione (degli )?ordini|prelievo (della )?merce|picking", "120 ordini al giorno", "ordin[ei]\\b|picking|prelievo|preparator\\w* ordini"],
    "Contrôle qualité": ["Controllo qualità", "controll[oi] (della |di )?qualita|verifica (della )?qualita|controllo (dei )?prodotti", "verifica di scadenze e quantità"],
    "Réception des marchandises": ["Ricevimento merce", "ricevimento (della |delle |dei )?(merce|merci|consegne|colli|pallet)|ricezione (della |delle )?(merce|merci)|scarico (della )?merce|merce in arrivo", "30 pallet al giorno", "ricevimento|ricezione|consegne|scarico|merce in arrivo"],
    "Gestion des stocks": ["Gestione delle scorte", "gestione (del |delle |dello |degli )?(magazzino|scorte|stock|giacenze)|controllo (delle )?giacenze|riordino (della )?merce|approvvigionament\\w*", "riordino ogni settimana"],
    "Inventaires": ["Inventari", "inventari\\w*", "inventario annuale di 3.000 articoli"],
    "CACES (chariot élévateur)": ["Patentino muletto (carrello elevatore)", "carrell\\w* elevator\\w*|muletto|mulettista|carrellista|patentino (del |per )?(muletto|carrello)|transpallet\\w*|commissionatore|retrattile", "carrello frontale e retrattile, 2023"],
    "Expédition et emballage": ["Spedizioni e imballaggio", "spedizion\\w*|imballaggi\\w*|imballo|confezionament\\w*|etichettatur\\w*", "200 colli al giorno"],
    "Manutention": ["Movimentazione merci", "movimentazione (della |delle |dei )?(merce|merci|carichi|materiali)|carico e scarico|sollevamento (di )?(carichi|pesi)|carichi pesanti", "carico dei camion"],
    "Encaissement": ["Gestione della cassa", "\\bcassa\\b|cassier[ea]|cassieri|incass\\w*|registratore di cassa|chiusura (di |della )?cassa", "fino a 300 clienti al giorno"],
    "Accueil des clients": ["Accoglienza clienti", "accoglienza (dei |della |del )?(clienti|clientela|pubblico|ospiti|pazienti|visitatori)|accogliere (i |la |il )?(clienti|clientela|pubblico|ospiti)", "80 clienti al giorno", "accoglien\\w*|accogli\\w*"],
    "Conseil client": ["Consulenza ai clienti", "consulenza (alla |ai |al )?(clienti|clientela|cliente)|consigliare (i )?clienti|consulente (di |alle )?vendit\\w*", "consigli sui prodotti freschi", "consig\\w*|consulen\\w*"],
    "Vente": ["Vendita", "vendit[ae]\\b|\\bvendere\\b|commess[oaei]\\b|addett[oaei] (alle |alla )?vendit\\w*|obiettivi (di vendita|commerciali)|fatturato", "obiettivo mensile raggiunto 10 mesi su 12", "vend\\w*|commess\\w*"],
    "Mise en rayon": ["Rifornimento scaffali", "scaffal\\w*|riassortiment\\w*|esposizione (della )?merce|merchandising", "reparto freschi ogni mattina"],
    "Relation client": ["Servizio clienti", "servizio clienti|customer care|customer service|assistenza (alla |ai )?clien\\w*|soddisfazione (del |dei )?client\\w*|fidelizzazion\\w*|reclami|gestione (dei )?resi", "gestione dei reclami"],
    "Prospection": ["Ricerca nuovi clienti", "prospezion\\w*|(ricerca|acquisizione) (di )?nuovi clienti|sviluppo (del )?portafoglio clienti|nuovi clienti", "20 nuovi clienti in un anno"],
    "Négociation": ["Trattativa", "negozia\\w*|trattativ\\w*", "trattative con 15 fornitori"],
    "Accompagnement des personnes âgées": ["Assistenza agli anziani", "anzian\\w*|terza eta|\\brsa\\b|casa di riposo|non autosufficien\\w*", "6 persone seguite ogni settimana"],
    "Aide à domicile": ["Assistenza domiciliare", "assistenza domiciliare|assistente domiciliare|\\bosa\\b|badante|collaborat(ore|rice) domestic\\w*|\\bcolf\\b|servizi domiciliari", "interventi a casa di 6 persone"],
    "Aide à la toilette": ["Igiene della persona", "igiene (della persona|personale)|cura della persona|aiuto (nell'|per l'|nella )?igiene|alzata e messa a letto", "aiuto ad alzarsi e a lavarsi", "igiene|cura della persona|alzata"],
    "Préparation des repas": ["Preparazione dei pasti", "preparazione (dei )?pasti|preparare (i )?pasti|aiuto (ai|nei) pasti|somministrazione (dei )?pasti", "pasti per 4 persone"],
    "Garde d'enfants": ["Cura dei bambini", "baby[- ]?sitt\\w*|asilo nido|scuola dell'infanzia|cura (dei )?bambini|assistenza (ai )?(bambini|minori)|\\bbambini\\b|educat(ore|rice) (di |del )?nido|centri estivi", "3 bambini da 2 a 8 anni", "bambin\\w*|baby[- ]?sitt\\w*|\\bnido\\b|infanzia|minori"],
    "Diplôme d'aide-soignant": ["Qualifica OSS", "\\boss\\b|operat(ore|rice) socio[- ]sanitari[oa]|qualifica (di )?oss", "ottenuta nel 2021"],
    "Soins infirmiers": ["Infermieristica", "infermier[ei]\\b|infermiera|infermieristic\\w*|\\bopi\\b", "laurea e iscrizione OPI, 2019"],
    "Service en salle": ["Servizio in sala", "camerier[eia]\\b|servizio (in |di )?sala|servizio ai tavoli|addett[oa] (alla )?sala|commis di sala", "servizio di 60 coperti"],
    "Cuisine": ["Cucina", "\\bcucina\\b|cuoc[oa]\\b|cuochi|aiuto[- ]cuoco|commis di cucina|capo partita|linea (calda|fredda)|preparazione (dei )?piatti", "mise en place per 80 coperti"],
    "Règles d'hygiène (HACCP)": ["Norme igieniche (HACCP)", "haccp|igiene alimentare|sicurezza alimentare|norme igieniche", "attestato HACCP 2022"],
    "Plonge": ["Lavaggio stoviglie", "lavapiatti|lavaggio (delle )?stoviglie|stoviglie|lavastoviglie", "stoviglie per 100 coperti"],
    "Bar": ["Bar", "\\bbar\\b|barista|barman|caffetteria|cocktail", "preparazione delle bevande calde"],
    "Réception hôtelière": ["Reception d'albergo", "receptionist|ricevimento (ospiti|clienti)|front office|reception|prenotazion\\w*", "accoglienza e prenotazioni, 40 camere"],
    "Entretien et nettoyage": ["Pulizie", "puliz\\w*|sanificazion\\w*|igienizzazion\\w*|riordino (dei )?locali", "pulizia di 800 m² di uffici"],
    "Lecture de plans": ["Lettura del disegno tecnico", "lettura (del |dei |di )?(disegn\\w*|progett\\w*|planimetri\\w*|schem\\w*)|disegno tecnico|leggere (il |i |gli )?(disegn\\w*|progett\\w*|schem\\w*)", "tavole di progetto in cantiere"],
    "Habilitation électrique": ["Abilitazione PES/PAV", "\\bpes\\b|\\bpav\\b|\\bpei\\b|cei 11-27|abilitazion\\w* (ai lavori )?elettric\\w*", "PES e PAV, 2024"],
    "Électricité": ["Impianti elettrici", "elettricist\\w*|impiant\\w* elettric\\w*|cablaggi\\w*|quadri elettrici", "cablaggio di quadri elettrici"],
    "Plomberie et chauffage": ["Idraulica e riscaldamento", "idraulic\\w*|termoidraulic\\w*|impiant\\w* (idraulic|termic|sanitar)\\w*|riscaldamento", "installazione di bagni"],
    "Maçonnerie": ["Muratura", "murator\\w*|muratur\\w*|calcestruzzo|cemento|casseri|carpenteria edile", "casseri e getto di solette"],
    "Peinture": ["Tinteggiatura", "imbianchin\\w*|pittor\\w* edil\\w*|tinteggiatur\\w*|verniciatur\\w*|stuccatur\\w*", "ristrutturazione di 10 appartamenti"],
    "Travail en hauteur": ["Lavori in quota", "lavor[oi] in quota|ponteggi\\w*|piattaform\\w* (di lavoro )?(aere|elevabil)\\w*|\\bple\\b|imbracatura", "patentino PLE, 2023"],
    "Règles de sécurité": ["Sicurezza sul lavoro", "sicurezza sul lavoro|norme di sicurezza|\\bdpi\\b|d\\.? ?lgs\\.? ?81|prevenzione (dei )?rischi|antinfortunistic\\w*", "zero infortuni in 3 anni"],
    "Conduite de machines": ["Conduzione di macchinari", "conduzione (di |dei |delle )?(macchin\\w*|impianti|linee)|operat(ore|rice) (di produzione|di linea|macchine)|addett[oa] (alla )?produzione|controllo numerico", "conduzione di una linea di confezionamento"],
    "Soudure": ["Saldatura", "salda\\w*", "saldatura MIG e TIG"],
    "Maintenance": ["Manutenzione", "manutenzion\\w*|manutentor\\w*|riparazion\\w*|guasti", "manutenzione preventiva di 20 macchine"],
    "Mécanique": ["Meccanica", "meccanic\\w*", "manutenzione di veicoli leggeri"],
    "Accueil téléphonique": ["Accoglienza telefonica", "accoglienza telefonica|centralin\\w*|gestione (delle )?(telefonate|chiamate)|rispondere al telefono|chiamate telefoniche", "50 chiamate al giorno", "telefon\\w*|centralin\\w*|chiamate"],
    "Pack Office": ["Pacchetto Office", "pacchetto office", "lettere in Word, mail in Outlook"],
    "Excel": ["Excel", "foglio? (di calcolo|elettronic\\w*)", "tabella per seguire gli ordini"],
    "Outils informatiques": ["Strumenti informatici", "strumenti informatici|competenze informatiche|conoscenze informatiche|uso del (pc|computer)|informatica di base", "Word, mail, tabelle semplici", "informatic\\w*|computer|\\bpc\\b|office|excel|\\bword\\b|foglio elettronico"],
    "Saisie de données": ["Inserimento dati", "inserimento (dei )?dati|data entry|caricamento (dei )?dati|registrazione (dei )?dati", "inserimento delle bolle di consegna"],
    "Gestion d'agenda": ["Gestione dell'agenda", "gestione (dell'|delle |degli |del )?(agend\\w*|appuntamenti|calendari\\w*)|fissare (gli )?appuntamenti|appuntamenti", "agenda di 3 medici"],
    "Rédaction de courriers": ["Corrispondenza", "corrispondenza|redazione (di |della |delle |dei )?(lettere|documenti|verbali|report)|verbali", "lettere ai clienti"],
    "Facturation": ["Fatturazione", "fatturazion\\w*|fattur[ae]\\b|preventiv\\w*", "100 fatture al mese"],
    "Comptabilité": ["Contabilità", "contabil\\w*|prima nota|riconciliazion\\w* bancari\\w*", "registrazioni in prima nota"],
    "Paie": ["Paghe", "buste paga|elaborazione (delle )?paghe|\\bpaghe\\b|cedolini", "paghe di 40 dipendenti"],
    "Classement et archivage": ["Archiviazione", "archiviazion\\w*|\\barchivio\\b|gestione documentale", "archiviazione delle pratiche"],
    "Logiciel de gestion (ERP)": ["Gestionale (ERP)", "\\bgestional[ei]\\b|software gestionale", "SAP, ordini e magazzino"],
    "Recrutement": ["Selezione del personale", "selezione del personale|reclutamento|risorse umane|recruiting", "20 assunzioni all'anno"],
    "Support utilisateurs": ["Supporto agli utenti", "supporto (tecnico )?(agli |all'|degli )?utent[ei]|assistenza (tecnica )?(agli )?utent[ei]|help ?desk|service desk|(supporto|assistenza) (di )?(primo|secondo|1°|2°) livello|supporto tecnico|supporto informatico", "30 ticket al giorno", "supporto|assistenza (agli )?utenti|help ?desk|service desk|(primo|secondo) livello"],
    "Windows": ["Windows", "windows", "installazione di postazioni Windows 11"],
    "Linux": ["Linux", "linux", "server Debian"],
    "Réseaux informatiques": ["Reti informatiche", "reti (informatiche|aziendali|lan|dati)|apparati di rete|sistemi e reti|reti e sistemi|networking|\\breti\\b", "VLAN e switch di una sede con 50 postazioni"],
    "Active Directory": ["Active Directory", "active directory", "account e permessi di 300 utenti"],
    "Cybersécurité": ["Sicurezza informatica", "sicurezza informatica|sicurezza delle reti", "installazione di un firewall"],
    "Administration des serveurs": ["Amministrazione dei server", "amministra\\w* (dei |i |di )?(server|sistemi)|gestione (dei )?server|sistemist\\w*", "15 server Windows e Linux", "\\bserver\\b|sistemist\\w*|amministrazione (di |dei )?sistemi|vmware|hyper-v"],
    "Virtualisation": ["Virtualizzazione", "virtualizza\\w*", "VMware, 20 macchine virtuali"],
    "Sauvegardes et restauration": ["Backup e ripristino", "\\bbackup\\b|salvataggi\\w*|ripristin\\w*", "backup giornaliero di 10 server"],
    "Supervision": ["Monitoraggio", "zabbix|nagios|centreon|\\bprtg\\b|monitoraggio (dei |delle |della )?(sistemi|reti|infrastruttur\\w*|server)|monitorare (i |la |le )?(sistemi|reti|infrastruttur\\w*|produzione)", "50 apparati monitorati", "monitor\\w*|zabbix|nagios"],
    "Gestion des incidents (ITIL)": ["Gestione degli incidenti (ITIL)", "gestione (degli |dei )?(incident\\w*|ticket|guasti)|ticketing", "30 ticket al giorno", "incident\\w*|ticket\\w*|guasti|supporto"],
    "Comptes et droits d'accès": ["Account e permessi", "account (utente|utenti)|gestione (degli )?(accessi|account|utenti)|permessi|diritti di accesso|utenze", "account e permessi di 300 utenti", "account|accessi|permessi|utenze|active directory"],
    "Déploiement de logiciels": ["Distribuzione del software", "distribu\\w* (di |del |dei )?(software|applicazion\\w*|postazion\\w*|container)|installazion\\w* (di |delle |dei )?(software|postazion\\w*|pc)|rilasci\\w* (di |del )?software", "300 postazioni installate", "deploy\\w*|installazion\\w*|rilasci\\w*|distribu\\w*|sccm|intune"],
    "Gestion de parc": ["Gestione del parco IT", "gestione (del )?parco (macchine|informatico|hardware|pc|dispositivi)|parco informatico|inventario hardware", "parco di 500 postazioni"],
    "Documentation technique": ["Documentazione tecnica", "documentazione tecnica|procedure tecniche|redazione (di |delle )?procedure", "procedure per il team di supporto", "documentazion\\w*|procedur\\w*|wiki"],
    "Veille technologique": ["Aggiornamento tecnologico", "aggiornamento (tecnologico|tecnico|continuo)|tenersi aggiornat\\w*|tecnologie emergenti", "aggiornamento sulla sicurezza ogni settimana"],
    "Relation avec les prestataires": ["Rapporti con i fornitori", "fornitor[ei]|consulenti esterni|partner esterni", "10 fornitori seguiti"],
    "Politique de sécurité (PSSI)": ["Politiche di sicurezza", "politic\\w* di sicurezza|policy di sicurezza", "stesura della policy di sicurezza", "politic\\w* di sicurezza|policy di sicurezza|nis ?2|iso ?27001"],
    "Conformité (RGPD, NIS2…)": ["Conformità (GDPR, NIS2…)", "conformita (normativa|al gdpr|gdpr)|adeguamento (al )?gdpr|normativa privacy", "adeguamento alla NIS2", "\\bgdpr\\b|conformita|nis ?2|iso ?27001|privacy"],
    "Sensibilisation des utilisateurs": ["Sensibilizzazione degli utenti", "sensibilizza\\w*|formazione (degli )?utenti sulla sicurezza", "sensibilizzazione di 300 dipendenti"],
    "Continuité d'activité (PCA/PRA)": ["Continuità operativa (BCP/DR)", "continuita operativa|piano di continuita|business continuity|disaster recovery", "piano di disaster recovery provato ogni anno"],
    "Gestion de crise": ["Gestione delle crisi", "gestione (delle |della |di )?crisi|situazioni di crisi|unita di crisi", "unità di crisi durante un attacco informatico"],
    "Transformation numérique": ["Trasformazione digitale", "trasformazione digitale|digitalizza\\w*|dematerializza\\w*|strumenti digitali", "fatture dematerializzate", "digital\\w*|dematerializz\\w*|modernizz\\w*"],
    "Python": ["Python", "python", "script di automazione"],
    "JavaScript": ["JavaScript", "javascript", "sito web in React"],
    "HTML / CSS": ["HTML / CSS", "\\bhtml\\b", "pagine web responsive"],
    "SQL": ["SQL", "\\bdatabase\\b|basi di dati", "query su un database clienti"],
    "Cloud": ["Cloud", "\\bcloud\\b", "migrazione a Microsoft 365"],
    "Gestion de projet": ["Gestione di progetti", "gestione (di |dei |del )?progett\\w*|project manag\\w*|capo ?progetto|coordinamento (di |dei )?progett\\w*|progetti (it|informatici)", "progetto di 6 mesi, 3 persone", "progett\\w*|project"],
    "Management d'équipe": ["Gestione di una squadra", "gestione (del |di un |di una |della |delle )?(team|squadr[ae]|personale|gruppo|collaboratori)|coordinamento (del |di un |di una |della )?(team|squadra|personale|gruppo)|responsabile di (reparto|squadra|team)|capo ?squadra|capo ?reparto|team leader", "squadra di 5 persone"],
    "Permis B": ["Patente B", "patente b\\b|patente di guida|automunit[oa]|mezzo proprio", "dal 2018", "patente b\\b|patente di guida|automunit[oa]|mezzo proprio|auto propria"],
    "Travail en équipe": ["Lavoro di squadra", "lavoro (di|in) (squadra|team|gruppo)|lavorare (in|di) (squadra|team|gruppo)|spirito di squadra|capacita di lavorare in (team|squadra|gruppo)", "squadra di 6 persone", "squadra|\\bteam\\b|in (un )?gruppo|di gruppo|collabor\\w*"],
    "Autonomie": ["Autonomia", "in autonomia|indipendenza", "da sola all'apertura del negozio"],
    "Rigueur": ["Precisione", "precision\\w*|accuratezza|attenzione ai dettagli|meticolos\\w*|rigor\\w*|scrupolos\\w*", "zero errori negli ordini nel 2024"],
    "Ponctualité": ["Puntualità", "puntual\\w*|affidabil\\w*", "apertura alle 6 per 2 anni", "puntual\\w*|affidabil\\w*|apertura|alle [4-7]\\b"],
    "Sens de l'organisation": ["Capacità organizzative", "capacita organizzativ\\w*|doti organizzative|buona organizzazione|organizzat[oa]\\b|senso dell'organizzazione|gestione (delle priorita|del tempo)", "turni di 4 persone", "organizz\\w*|priorit\\w*|pianific\\w*"],
    "Sens du contact": ["Predisposizione al contatto", "predisposizione (al|ai|per il) (contatto|rapport\\w*|pubblico)|contatto con il pubblico|doti relazionali|capacita relazionali|cordial\\w*|socievol\\w*|sorridente|bella presenza|solare", "80 clienti al giorno"],
    "Polyvalence": ["Polivalenza", "polivalen\\w*|versatil\\w*|multitasking", "cassa, scaffali e ricevimento a seconda dei giorni"],
    "Dynamisme": ["Dinamismo", "dinamismo|proattiv\\w*|entusiasm\\w*|intraprendenza", "il pienone del sabato"],
    "Gestion du stress": ["Gestione dello stress", "sotto pressione|gestione dello stress|resistenza allo stress|ritmi (sostenuti|elevati|intensi)|picchi di lavoro", "servizio del sabato sera"],
    "Écoute": ["Capacità di ascolto", "ascolto|empati\\w*|pazienza|sensibilita", "assistenza a persone anziane"],
    "Discrétion": ["Riservatezza", "riservatezza|discrezion\\w*|riservat[oa]\\b|confidenzial\\w*", "cartelle cliniche"],
    "Adaptabilité": ["Flessibilità", "flessibil\\w*|adattabil\\w*|capacita di adattamento|adattarsi", "cambi di reparto ogni settimana"],
    "Communication": ["Capacità comunicative", "capacita comunicativ\\w*|doti comunicative|competenze comunicative|buona comunicazione|comunicazione (scritta e orale|orale e scritta|efficace)|capacita di comunicazione", "report ogni settimana"],
    "Anglais": ["Inglese", "inglese", "scolastico"],
    "Espagnol": ["Spagnolo", "spagnolo", "scolastico"],
    "Allemand": ["Tedesco", "tedesco", "scolastico"],
    "Horaires décalés": ["Turni e orari variabili", "turn[io]\\b|turnazion\\w*|lavoro notturno|notturn\\w*|fine settimana|festivi|domenic\\w*|reperibilita", "", "turn[io]\\b|turnazion\\w*|nott\\w*|fine settimana|festiv\\w*|domenic\\w*|reperibil\\w*|apertura|chiusura|alle [4-7]\\b"],
    "Premiers secours (SST)": ["Primo soccorso", "primo soccorso|\\bblsd?\\b", "corso di primo soccorso, 2023"],
    "BAFA": ["Attestato di animatore", "attestato (di )?animat(ore|rice)|corso (di )?animat(ore|rice)|animat(ore|rice) (di |per )?(centri estivi|villaggi|campi)", "ottenuto nel 2022"]
  },

  // ---------- Motifs de l'analyse (texte sans accents, minuscules) ----------
  // Points où les motifs français et anglais tombent à tort sur l'italien (« Senior », « supervisione »)
  lexOnly: ["Accompagnement des personnes âgées", "Supervision"],
  ocr: ["ita"],
  re: {
    // Message d'erreur à l'étape de l'offre : « ton CV » devient « l'offre »
    cvWord: "il tuo CV|tuo CV", offerWord: "l'annuncio",
    // Annonce de bureau ou d'informatique : on propose de demander pour le télétravail
    office: "informati|ufficio|software|dati|svilupp|contabil|amministrativ",
    langWords: "il|lo|gli|e|con|per|del|della|di|nel|una|che|sono",
    sample: String.raw`\s*\(esempio fittizio\)`,
    eduWords: "laurea|diploma|maturita|maturità|master|dottorato|\\bits\\b|qualifica",
    gender: String.raw`m\s*\/\s*f|f\s*\/\s*m`,
    to: "al|fino al|fino a|ad",
    now: "oggi|ad oggi|attual\\w*|in corso|tuttora|presente",
    years: "(\\d{1,2})\\+?\\s*ann[oi] (?:di |d'|d’)?esperienza|esperienza (?:[a-z]+ ){0,3}?(?:di |da )?(?:almeno |minim[ao] (?:di )?|superiore a |di almeno )?(\\d{1,2})\\+?\\s*ann[oi]|almeno (\\d{1,2}) ann[oi]",
    yearsWord: "ann[oi]",
    diploma: "\\b(laurea( magistrale| triennale| specialistica| in [a-z]+)?|diploma( di (maturita|scuola superiore|perito|ragioneria|geometra)| tecnico| professionale)?|maturita|qualifica professionale|master)\\b",
    must: "indispensabil\\w*|obbligatori\\w*|richiest[oaie]\\b|necessari\\w*|requisito fondamentale|imprescindibil\\w*|essenzial\\w*",
    nice: "gradit[oaie]\\b|preferibil\\w*|titolo preferenziale|costituira (un )?(titolo|elemento) preferenziale|e un plus|sara considerat\\w*|apprezzat\\w*|costituisce un vantaggio",
    notSkill: "retribuzione|stipendio|\\bral\\b|€|\\beuro\\b|contratto|tempo (pieno|parziale|indeterminato|determinato)|benefit|buoni pasto|welfare|candida\\w*|invia\\w* (il |la )?(cv|candidatura)|sede di lavoro|luogo di lavoro|chi siamo|siamo un\\w*|la nostra (azienda|societa|realta)|inserimento immediato|data di inizio|offriamo|si offre|\\bccnl\\b|mensilita|entrambi i sessi|903\\/77|198\\/2006|dati personali|privacy",
    place: "sede(?: di lavoro)?|luogo di lavoro|localita|zona di lavoro",
    weak: "\\b(mi sono occupat[oa] di|mi occupavo di|occuparsi di|partecipa(re|zione|to) a|aiuta(re|to) a|aiuto (a|nella|nel)|supporto (a|nella|nel) varie|vari[ea] (attivita|mansioni|compiti)|mansioni varie|attivita varie|diverse attivita|ecc\\.?|etc\\.?)(?=\\W|$)",
    ad_salary: "(retribuzione|stipendio|\\bral\\b|compenso|paga)( lord[oaie]| nett[oaie])?( annu[oaie]| mensil[ei]| orari[oa])?( di| da| pari a)?:? ?(€ ?)?\\d[\\d.,]*\\s?(k|mila)?\\s?(€|euro)?( lordi| netti)?( annui| mensili)?( (al|a|per|\\/) ?(mese|anno|ora))?|(?:^|\\s)(fino a |circa |da |oltre )?\\d[\\d.,]*\\s?(k|mila)?\\s?(€|euro)( lordi| netti)?( (al|all'|a|per|ogni|\\/) ?(mese|anno|ora|giorno|settimana))?|retribuzione (commisurata|in linea|competitiva|adeguata|interessante)[^\\n,.]{0,30}|stipendio (commisurato|competitivo)[^\\n,.]{0,30}",
    ad_contract: "\\b(tempo (indeterminato|determinato)( di \\d+ mesi| \\d+ mesi)?|contratto (a tempo (in)?determinato|di somministrazione|di apprendistato|a chiamata|stagionale|a progetto|di collaborazione)|apprendistato|tirocinio( formativo| extracurricolare)?|somministrazione|partita iva|stagionale|interinale)\\b",
    ad_hours: "(\\d{1,2} ?ore (settimanali|a settimana|alla settimana|su \\d giorni)|tempo pieno|tempo parziale)",
    ad_remote: "(smart working|lavoro (da remoto|agile|ibrido)|da remoto|telelavoro|\\bibrido\\b)",
    ad_start: "(inserimento immediato|disponibilita immediata|da subito|data di inizio:? [^\\n,.]{3,20}|inizio (previsto )?(a|da|dal|il|entro) [^\\n,.]{3,20})",
    flag_pay: "(quota (di iscrizione|d'iscrizione|di adesione)|costo (di iscrizione|del corso|del kit)|pagare (una|la|il|un) (quota|corso|kit|cauzione|iscrizione)|kit (di partenza|iniziale)|versamento (anticipato|iniziale)|ricarica postepay|postepay)",
    flag_data: "(coordinate bancarie|dati bancari|tessera sanitaria|copia (della |del |di un |di una )?(carta d'identita|documento( d'identita| di identita)?|passaporto))",
    flag_tooGood: "(guadagn\\w* (fino a |oltre |piu di )?\\d[\\d.\\s]*\\s?(€|euro) (al|a|ogni|per) ?(giorno|settimana)|soldi facili|guadagni? (facili|garantit\\w*|illimitat\\w*)|reddito garantito)",
    flag_mlm: "(diventa (il capo di te stesso|imprenditore di te stesso|ambasciatore)|marketing multilivello|vendita diretta|porta a porta|solo (a )?provvigion\\w*|a provvigione)",
    flag_mail: "[\\w.+-]+@(libero|virgilio|tiscali|alice|tin)\\.[a-z.]+"
  },
  // Mots vides (texte sans accents) : ignorés quand on compare une ligne de l'offre au CV
  stop: "della delle dello degli dell nella nelle nello negli alla alle allo agli dalla dalle dagli sulla sulle sugli come anche oppure ogni tutto tutti tutta tutte molto meno sono essere avere avra sara saranno siamo nostro nostra nostri nostre vostro vostra vostri vostre loro questo questa questi queste quello quella quelli quelle fare svolgere gestire garantire assicurare effettuare occuparsi occupera supportare collaborare attivita mansioni mansione ruolo profilo ricerca ricerchiamo cerchiamo cercasi candidato candidata candidati risorsa figura requisiti requisito richiesti richiesta richiesto offre offriamo esperienza esperienze anni anno minimo massimo preferibilmente gradita gradito titolo conoscenza conoscenze capacita buona buone buon ottima ottime ottimo inoltre presso circa tramite secondo verso dopo prima durante entro azienda aziendale societa lavoro lavorare posto tempo pieno parziale contratto determinato indeterminato tipo ambito settore relativi relative eventuali principali seguenti varie vari diversi diverse insieme",
  syn: [
    "magazz logist deposi", "client client", "cassa cassie incass", "vendit vender commes", "negozi punto superm iperme", "pulizi pulire sanifi igieni",
    "pazien malati ospiti utenti assist", "bambin minori ragazz", "squadr collab colleg team gruppo", "comput inform digita", "consegn spediz corrie",
    "ristor tratto pizzer trattor mensa", "cucina cuoco cuochi chef", "ripara manute guasti", "ordini ordine", "merce merci prodot articoli",
    "scaffa riforn riasso", "anzian senior", "suppor assist", "docume proced", "monito superv", "backup salvat", "instal distri deploy",
    "config parame", "reti networ", "server sistem", "sicure cyber", "incide guasti ticket", "utenti utente user", "proget projec", "gestio coordi",
    "budget costi bilanc", "cantie lavori edili", "puntua affida", "comuni relazi", "pianif agenda calend organi", "prepar confez", "sistem ordina riordi"
  ],
  junk: [
    "home", "menu", "cerca", "ricerca avanzata", "accedi", "registrati", "iscriviti", "il mio (account|profilo)", "area (candidati|personale|aziende)",
    "crea (un )?(account|avviso|alert)", "candidati( ora| subito| adesso)?", "candidatura (semplice|rapida|facile|in un clic)", "invia (la )?(tua )?candidatura",
    "salva( annuncio| offerta)?", "condividi( annuncio| offerta)?", "stampa( annuncio)?", "segnala( annuncio| questo annuncio| un problema)?",
    "mostra (di piu|di meno|altro|tutto)", "leggi (tutto|di piu|altro)", "vedi (tutte le offerte|altre offerte|l'azienda|di piu)", "torna (ai risultati|indietro|all'elenco)",
    "offerte simili", "annunci simili", "potrebbe interessarti anche", "chi siamo", "note legali", "informativa (sulla )?privacy", "privacy policy", "termini e condizioni.*",
    "mappa del sito", "aiuto", "contatti", "contattaci", "scarica l'app", "seguici.*", "cookie.*", "(accetta|rifiuta)( tutti| tutto)?( i cookie)?",
    "gestisci (le )?preferenze.*", "tutti i diritti riservati.*", "pubblicato (\\d+ \\w+ fa|il .*|oggi|ieri)", "aggiornato (il|\\d+ \\w+ fa).*", "\\d+ (minuti|ore|giorni) fa",
    "oggi", "ieri", "annuncio n\\.? ?\\w+", "rif\\.? ?:? ?[\\w-]+", "\\d+ candidat(i|ure).*", "nuovo", "nuova offerta", "urgente",
    "infojobs", "subito\\.it", "indeed", "linkedin", "monster", "jobrapido", "bakeca", "kijiji", "pagina \\d+( di \\d+)?", "successiva", "precedente"
  ],
  // Fautes fréquentes dans les CV en italien (mot fautif : bonne orthographe)
  typos: {efficente: "efficiente", efficenti: "efficienti", sufficente: "sufficiente", propio: "proprio", propia: "propria", conoscienza: "conoscenza", conoscienze: "conoscenze", esperienzia: "esperienza", esperenza: "esperienza", aquisito: "acquisito", aquisita: "acquisita", aquisire: "acquisire", aquisizione: "acquisizione", accellerare: "accelerare", ingegniere: "ingegnere", ingegnieria: "ingegneria", coscenza: "coscienza", pulizzia: "pulizia", pulizzie: "pulizie", magazino: "magazzino", amministazione: "amministrazione", ammministrazione: "amministrazione", organizazione: "organizzazione", organizzazzione: "organizzazione", comunicazzione: "comunicazione", colaborazione: "collaborazione", colaboratore: "collaboratore", colaboratrice: "collaboratrice", inglesse: "inglese", eccelente: "eccellente", ecellente: "eccellente", proffessionale: "professionale", profesionale: "professionale", profesionali: "professionali", disponibilta: "disponibilità", affidabilta: "affidabilità", responsabilta: "responsabilità", areoporto: "aeroporto", metereologico: "meteorologico", competenzze: "competenze", conpetenze: "competenze", gestone: "gestione", inpiegato: "impiegato", inpiegata: "impiegata", conpagnia: "compagnia"},
  help: {
    mid: "È nel tuo CV, ma senza esempi. Aggiungi un fatto concreto: un numero, un luogo, una durata.",
    no: "L'offerta lo chiede. Se l'hai già fatto, anche in un lavoro estivo, in un tirocinio o nel volontariato, aggiungilo.",
    s: "L'offerta lo chiede. Dimostralo con un fatto in una delle tue esperienze, non solo con una parola."
  },

  // ---------- Lettre de motivation : même objet que la version anglaise de js/app.js ----------
  letter({job, at, why, L, gaps}){
    const when = d => L.when ? L.when.trim() : d;
    const close = `Sono disponibile ${when("a breve")} e sarei felice di incontrarvi per parlarne.`;
    return {
      classic: {subj: `Oggetto: candidatura per la posizione di ${job}`, open: `Ho letto con grande interesse il vostro annuncio per la posizione di ${job}${at}.${why}`, intro: "Ecco cosa posso offrirvi:", extra: "", close, bye: "Cordiali saluti,"},
      dynamic: {subj: `Oggetto: candidatura ${job}`, open: `Il vostro annuncio per la posizione di ${job}${at} mi ha fatto venire voglia di scrivervi subito.${why}`, intro: "Cosa porto, in concreto:", extra: "", close: `Sono disponibile ${when("da subito")} e mi farebbe molto piacere raccontarvi di più di persona.`, bye: "Un cordiale saluto,"},
      change: {subj: `Oggetto: candidatura per la posizione di ${job} (cambio di professione)`, open: `Desidero mettere la mia esperienza al servizio di un nuovo mestiere, e il vostro annuncio per la posizione di ${job}${at} corrisponde esattamente a questo progetto.${why}`, intro: "Cosa mi ha insegnato il mio percorso e cosa posso mettere a frutto in questo ruolo:", extra: gaps.length ? `Ho voglia di formarmi su ciò che ancora non conosco, come ${gaps.join(" e ")}.` : "Ho voglia di formarmi su ciò che ancora non conosco.", close, bye: "Cordiali saluti,"},
      study: {subj: `Oggetto: candidatura per apprendistato o tirocinio: ${job}`, open: `Cerco un apprendistato o un tirocinio [di' quale, con le date o l'orario e la tua scuola] come ${job}${at}.${why}`, intro: "Cosa posso già offrirvi:", extra: "Ho voglia di imparare sul campo e di crescere con la vostra squadra.", close, bye: "Cordiali saluti,"}
    };
  },

  // ---------- Modèles de mails (js/outils.js) : [objet, texte] ----------
  mails({job, at, sentOn}){
    return {
      followup: [`Aggiornamento sulla mia candidatura: ${job}`, `Mi permetto di ricontattarvi riguardo alla mia candidatura per la posizione di ${job}${at}${sentOn}. La posizione mi interessa sempre molto e resto disponibile per un colloquio quando preferite.`],
      thanks: [`Grazie per il colloquio: ${job}`, `Grazie per il tempo che mi avete dedicato. Il nostro incontro ha confermato il mio interesse per la posizione di ${job}${at}. [Cosa ti è piaciuto durante il colloquio]\n\nResto a disposizione per qualsiasi informazione.`],
      accept: [`Accettazione della vostra offerta: ${job}`, `Vi ringrazio per la vostra offerta per la posizione di ${job}${at} e sono felice di accettarla. Potete indicarmi i prossimi passi (contratto, data di inizio, documenti da consegnare)?`],
      decline: [`La vostra offerta: ${job}`, `Vi ringrazio sinceramente per la vostra offerta per la posizione di ${job}${at}. Dopo averci pensato bene, ho deciso di non accettarla. Ho apprezzato molto i nostri incontri e spero che le nostre strade si incrocino di nuovo.`],
      feedback: [`Un riscontro sulla mia candidatura: ${job}`, `Grazie per avermi comunicato la vostra decisione per la posizione di ${job}${at}. Per migliorare, avreste qualche minuto per dirmi cosa è mancato alla mia candidatura?`]
    };
  },

  // ---------- Pitch d'une minute (« Mi parli di lei ») ----------
  pitch({name, title, yrs, top, proof, co, job}){
    const low = k => /^.[a-zà-ÿ]/.test(k) ? k.charAt(0).toLowerCase() + k.slice(1) : k;
    return [
      `Mi chiamo ${name}.`,
      title ? `Oggi lavoro come ${low(title)}${yrs ? `, con circa ${yrs} di esperienza` : ""}.` : "[Cosa fai oggi, in una frase.]",
      top.length ? `I miei punti di forza: ${top.map(low).join(" e ")}.` : "[Cosa sai fare meglio.]",
      proof ? `Per esempio: ${low(proof)}.` : "[Un esempio con un numero.]",
      `Oggi vorrei entrare a far parte ${co ? "di " + co : "della vostra azienda"} come ${job} perché [il tuo motivo].`
    ].join(" ");
  },

  // ---------- Lordo → netto, Italia (stima 2025) ----------
  // INPS a carico del dipendente 9,19 % (+1 % oltre 55.448 €), IRPEF 2025 (23 % fino a 28.000 €, 35 % fino a 50.000 €, 43 % oltre),
  // detrazioni per lavoro dipendente (art. 13 TUIR), taglio del cuneo 2025 (somma esente fino a 20.000 €, ulteriore detrazione 20.000-40.000 €),
  // trattamento integrativo fino a 15.000 €, addizionali regionale e comunale come un'unica percentuale regolabile.
  salary({$, $$, num, show, nf, fill, parseSalary, fold}){
    const INPS = .0919, INPS_EXTRA = .01, INPS_CAP = 55448;
    let months = 13, hours = 40, add = 2.5, base = {k: "mb", v: 0};
    const inpsOf = g => g * INPS + Math.max(0, g - INPS_CAP) * INPS_EXTRA;
    const lorda = r => Math.min(r, 28000) * .23 + Math.max(0, Math.min(r, 50000) - 28000) * .35 + Math.max(0, r - 50000) * .43;
    const detr = r => r <= 15000 ? 1955 : r <= 28000 ? 1910 + 1190 * (28000 - r) / 13000 : r <= 50000 ? 1910 * (50000 - r) / 22000 + (r > 25000 && r <= 35000 ? 65 : 0) : 0;
    function year(g){
      const inps = inpsOf(g), r = Math.max(0, g - inps), il = lorda(r), d = detr(r);
      const extra = r > 20000 && r <= 32000 ? 1000 : r > 32000 && r < 40000 ? 1000 * (40000 - r) / 8000 : 0;
      const irpef = Math.max(0, il - d - extra);
      const bonus = (r > 0 && r <= 20000 ? r * (r <= 8500 ? .071 : r <= 15000 ? .053 : .048) : 0) + (r > 0 && r <= 15000 && il > d - 75 ? 1200 : 0);
      const addiz = irpef > 0 ? r * add / 100 : 0;
      return {inps, irpef, addiz, bonus, net: g - inps - irpef - addiz + bonus};
    }
    // Netto → lordo : on cherche le lordo par dichotomie
    const grossOf = n => { let a = 0, b = 2e6; for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (year(m).net < n) a = m; else b = m; } return (a + b) / 2; };
    const perYear = () => 52 * hours;
    function calc(){
      const k = base.k, v = base.v;
      const g = k === "hb" ? v * perYear() : k === "mb" ? v * months : k === "ab" ? v
        : k === "hn" ? grossOf(v * perYear()) : k === "mn" ? grossOf(v * months) : k === "an" ? grossOf(v) : 0;
      const y = g > 0 ? year(g) : {inps: 0, irpef: 0, addiz: 0, bonus: 0, net: 0}, n = y.net;
      const out = {hb: g / perYear(), mb: g / months, ab: g, hn: n / perYear(), mn: n / months, an: n};
      Object.entries(out).forEach(([id, x]) => { if (id !== k || document.activeElement !== $("#" + id)) $("#" + id).value = show(x); });
      $("#inps").textContent = (show(y.inps) || "0") + " €"; $("#irpef").textContent = (show(y.irpef) || "0") + " €";
      $("#addiz").textContent = (show(y.addiz) || "0") + " €"; $("#bonus").textContent = (y.bonus ? "+ " + show(y.bonus) : "0") + " €";
      $("#pmn").textContent = show(n / months) || "0"; $("#pan").textContent = show(n) || "0";
      $("#rate").textContent = g ? `−${Math.round((g - n) / g * 100)} %` : "";
      $("#hoursv").textContent = nf.format(hours) + " h"; $("#addv").textContent = nf.format(add) + " %";
      $("#sum").textContent = g ? `${show(g / months)} € lordi al mese (su ${months} mensilità) sono circa ${show(n / months)} € netti al mese, cioè ${show(n)} € netti all'anno.` : "Riempi una casella: le altre si calcolano da sole.";
    }
    document.addEventListener("input", e => {
      const t = e.target;
      if (t.matches(".money")) { base = {k: t.id, v: num(t.value)}; return calc(); }
      if (t.id === "hours") { hours = +t.value; return calc(); }
      if (t.id === "add") { add = +t.value; return calc(); }
    });
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-mo]"); if (!b) return;
      months = +b.dataset.mo; $$("[data-mo]").forEach(x => x.setAttribute("aria-pressed", x === b)); calc();
    });
    $("#clear").addEventListener("click", () => { base = {k: "mb", v: 0}; $$(".money").forEach(i => i.value = ""); calc(); });
    // ?s= : salaire lu dans l'annonce (« RAL 30.000 € », « 1.500 € netti al mese », « 10 € l'ora »)
    const q = new URLSearchParams(location.search).get("s"), p = q && parseSalary(q);
    if (p) {
      const f = fold(q), u = /\bora\b|orari|l'ora/.test(f) ? "h" : /mese|mensil/.test(f) ? "m" : /\banno\b|annu|\bral\b/.test(f) ? "a" : /settiman/.test(f) ? "w" : p.u;
      let v = p.v * (/\d\s?mila\b/.test(f) ? 1000 : 1), unit = u;
      if (unit === "w") { v *= 52; unit = "a"; }
      const net = /nett/.test(f);
      base = {k: (unit === "h" ? "h" : unit === "a" ? "a" : "m") + (net ? "n" : "b"), v};
    }
    if (q) $("#from").hidden = false, $("#fromv").textContent = q;
    fill(); calc();
  }
};
