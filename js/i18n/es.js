// Espagnol de Ça colle ? (« ¿Encaja? ») : textes, lexique de l'analyse, lettre, mails, salaire (Espagne). Chargé avant js/lang.js.
const I18N = {
  lang: "es",
  // Points où les motifs français et anglais tombent à tort sur l'espagnol (« senior », « supervisar », « horario flexible »)
  lexOnly: ["Accompagnement des personnes âgées", "Supervision", "Adaptabilité"],
  ocr: "spa", // langue de tesseract pour lire les photos
  // Textes : clé = texte français exact passé à tr(). Les modèles ({0}, {1}…) les plus longs passent en premier,
  // pour qu'un modèle court (« {0} ») n'attrape pas une phrase qui a son propre modèle.
  s: (o => Object.fromEntries(Object.entries(o).sort(([a], [b]) => {
    const t = k => /\{\d\}/.test(k) ? k.replace(/\{\d\}/g, "").length : 1e4;
    return t(b) - t(a);
  })))({
    "Mon": "Mi", " : ": ": ",
    "fr-FR": "es-ES",
    // app.js
    "Offre": "Oferta",
    "Retirer cette offre": "Quitar esta oferta",
    "Colle le texte de l'annonce, pas son lien.": "Pega el texto del anuncio, no su enlace.",
    "Colle au moins quelques lignes de l'annonce.": "Pega al menos unas líneas del anuncio.",
    "{0} mots, c'est bon.": "{0} palabras, perfecto.",
    "{0} mots : colle l'annonce en entier, il en faut au moins {1}.": "{0} palabras: pega el anuncio entero, hacen falta al menos {1}.",
    "Colle d'abord l'offre": "Primero pega la oferta",
    "Ajoute d'abord l'offre et ton CV": "Primero añade la oferta y tu CV",
    "Ajouté à ton CV à l'étape 4.": "Añadido a tu CV en el paso 4.",
    "Ton CV montre environ {0} d'expérience.": "Tu CV muestra unos {0} de experiencia.",
    "Je ne trouve pas de dates dans ton CV. Ajoute les années de chaque poste (ex : 2022 - 2025) pour qu'on les compte.": "No encuentro fechas en tu CV. Añade los años de cada puesto (p. ej.: 2022 - 2025) para poder contarlos.",
    "Ton CV montre environ {0}. Pense à ajouter tes stages, jobs d'été, intérim ou bénévolat.": "Tu CV muestra unos {0}. Acuérdate de añadir tus prácticas, trabajos de verano, ETT o voluntariado.",
    "« {0} »": "«{0}»",
    "Prouvé dans ton CV : ": "Probado en tu CV: ",
    "C'est dans ton CV.": "Está en tu CV.",
    " Trouvé ici : ": " Encontrado aquí: ",
    "Indispensable": "Imprescindible",
    "Un plus": "Se valora",
    "Dans l'offre :": "En la oferta:",
    "« ": "«",
    " »": "»",
    "Dans ton CV :": "En tu CV:",
    "je n'ai pas trouvé de dates (ex : 2019 - 2023).": "no he encontrado fechas (p. ej.: 2019 - 2023).",
    "les dates de tes postes font environ {0}.": "las fechas de tus puestos suman unos {0}.",
    "<p><b>Mots cherchés :</b> les mots importants de cette ligne et des mots proches. {0} sur {1} trouvés dans ton CV (il en faut 6 sur 10).</p>": "<p><b>Palabras buscadas:</b> las palabras clave de esta línea y otras parecidas. {0} de {1} encontradas en tu CV (hacen falta 6 de cada 10).</p>",
    "(pas dans une expérience, donc pas encore prouvé)": "(no está en una experiencia, así que aún no está probado)",
    "aucun mot proche trouvé.": "no he encontrado ninguna palabra parecida.",
    "<p><b>Tu as corrigé ce tampon.</b> Le calcul disait : {0}.</p>": "<p><b>Has corregido este sello.</b> El análisis decía: {0}.</p>",
    "à vérifier": "por revisar",
    "ça colle !": "¡encaja!",
    "ça colle presque": "casi encaja",
    "à retravailler": "hay que mejorarlo",
    "Je n'ai reconnu aucun point dans cette offre.": "No he reconocido ningún punto en esta oferta.",
    "L'offre demande {0}. Ton CV en prouve {1}, en cite {2} sans exemple et n'en parle pas pour {3}.": "La oferta pide {0}. Tu CV prueba {1}, menciona {2} sin ejemplo y no dice nada de {3}.",
    " Attention : {0} points indispensables manquent.": " Ojo: faltan {0} puntos imprescindibles.",
    " Attention : un point indispensable manque.": " Ojo: falta un punto imprescindible.",
    "Rien à corriger pour l'instant.": "Nada que corregir por ahora.",
    "absent de ton CV": "no está en tu CV",
    "à prouver avec un exemple": "falta un ejemplo que lo pruebe",
    " · indispensable": " · imprescindible",
    "Corriger": "Corregir",
    "Améliorer mon CV →": "Mejorar mi CV →",
    "Rien d'urgent.": "Nada urgente.",
    "Ton CV couvre tout ce que demande l'offre.": "Tu CV cubre todo lo que pide la oferta.",
    "Préparer ma lettre →": "Preparar mi carta →",
    "Je n'ai repéré que {0} dans cette offre. Vérifie que tu as collé l'annonce en entier, avec les missions et le profil recherché.": "Solo he encontrado {0} en esta oferta. Comprueba que has pegado el anuncio entero, con las funciones y el perfil que buscan.",
    "Corrigé par toi": "Corregido por ti",
    "Ton CV dit « {0} », l'offre dit « {1} ».": "Tu CV dice «{0}», la oferta dice «{1}».",
    "Corriger ce point": "Corregir este punto",
    "Pourquoi ce tampon ?": "¿Por qué este sello?",
    "Ce tampon est faux ?": "¿Este sello está mal?",
    "Pas une vraie demande": "No es un requisito real",
    "Revenir au calcul": "Volver al análisis",
    "Si c'est dans ton CV avec d'autres mots, corrige le tampon. Si ce n'est pas dans ton CV, ajoute-le plutôt à l'étape 4.": "Si está en tu CV con otras palabras, corrige el sello. Si no está en tu CV, mejor añádelo en el paso 4.",
    "Points retirés": "Puntos quitados",
    "Remettre": "Volver a poner",
    "Les mots de l'annonce": "Las palabras del anuncio",
    "Les recruteurs et leurs logiciels cherchent les mots exacts de l'offre. Reprends-les dans ton CV quand c'est vrai.": "Los reclutadores y sus programas buscan las palabras exactas de la oferta. Úsalas en tu CV cuando sean verdad.",
    "Test robot recruteur": "Test del robot reclutador",
    "sur": "de",
    "Beaucoup d'entreprises trient les CV avec un logiciel avant qu'une personne les lise. Voici ce qui peut le gêner.": "Muchas empresas filtran los CV con un programa antes de que los lea una persona. Esto es lo que le puede dar problemas.",
    " : bon": ": bien",
    " : à corriger": ": por corregir",
    "L'annonce en bref": "El anuncio en resumen",
    "Attention, cette annonce ressemble à une arnaque.": "Cuidado, este anuncio parece una estafa.",
    "Quelques points à vérifier avant de postuler.": "Algunas cosas que comprobar antes de presentarte.",
    "Ne paie jamais pour postuler et ne donne pas tes papiers avant un contrat signé. En cas de doute, signale l'annonce au site qui la publie.": "No pagues nunca por presentarte a una oferta y no des tus documentos antes de firmar un contrato. Si tienes dudas, denuncia el anuncio en la web que lo publica.",
    "salaire.html": "salary-es.html",
    "Brut → net": "Bruto → neto",
    "pas indiqué": "no indicado",
    "Ce qui n'est pas écrit, demande-le avant ou pendant l'entretien : c'est normal de poser la question.": "Lo que no está escrito, pregúntalo antes o durante la entrevista: es normal preguntar.",
    "tes compétences": "tus competencias",
    "ton expérience : ": "tu experiencia: ",
    "ta formation": "tu formación",
    "Prêt.": "Listo.",
    "Remplis les cases jaunes.": "Rellena las casillas amarillas.",
    "Oui": "Sí",
    "Non": "No",
    "Point laissé de côté.": "Punto dejado de lado.",
    "Revenir sur ce point": "Volver a este punto",
    "Dans": "En",
    "Ajouté": "Añadido",
    "Retirer": "Quitar",
    "Ajouter à mon CV": "Añadir a mi CV",
    "Rien à améliorer pour cette offre : ton CV couvre déjà tout ce qu'on sait repérer.": "Nada que mejorar para esta oferta: tu CV ya cubre todo lo que sabemos detectar.",
    "{0} point{1} sur {2} prouvé{3} dans ton CV.": "{0} de {2} puntos probados en tu CV.",
    "Relecture du CV": "Revisión del CV",
    "Faute": "Error",
    "Verbe faible": "Verbo débil",
    "Trop long": "Demasiado largo",
    "Sans chiffre": "Sin cifras",
    "Style": "Estilo",
    "Seules les fautes sont corrigées en un clic. Pour le reste, modifie le texte de ton CV à l'étape 2 (« Vérifier le texte lu »).": "Solo los errores se corrigen con un clic. Para lo demás, cambia el texto de tu CV en el paso 2 («Revisar el texto leído»).",
    "Rien à signaler : pas de faute courante, de verbe faible ni de phrase trop longue.": "Nada que señalar: ningún error frecuente, verbo débil ni frase demasiado larga.",
    "Aucun point fort trouvé pour l'instant : améliore d'abord ton CV à l'étape 4.": "Todavía no hay puntos fuertes: primero mejora tu CV en el paso 4.",
    "[intitulé du poste]": "[nombre del puesto]",
    "[nom de l'entreprise]": "[nombre de la empresa]",
    " : ": ": ",
    " [pourquoi ce poste ou cette entreprise]": " [por qué este puesto o esta empresa]",
    "[ton nom]": "[tu nombre]",
    "[ton email et ton téléphone]": "[tu email y tu teléfono]",
    "À l'attention du service recrutement": "A la atención del departamento de selección",
    "Madame, Monsieur,": "Estimado/a responsable de selección:",
    "Prénom Nom": "Nombre Apellido",
    "poste": "puesto",
    "Le nom de l'entreprise et le poste sont écrits dans ta lettre": "El nombre de la empresa y el puesto están en tu carta",
    "Ton email et ton téléphone sont dans la lettre": "Tu email y tu teléfono están en la carta",
    "Ton CV a encore {0} (étape 4)": "Tu CV todavía tiene {0} (paso 4)",
    "Pas de faute courante dans ton CV": "Ningún error frecuente en tu CV",
    "Un point indispensable manque dans ton CV (étape 4)": "Falta un punto imprescindible en tu CV (paso 4)",
    "{0} points indispensables manquent dans ton CV (étape 4)": "Faltan {0} puntos imprescindibles en tu CV (paso 4)",
    "Les points indispensables de l'offre sont dans ton CV": "Los puntos imprescindibles de la oferta están en tu CV",
    "CV enregistré en PDF, avec un nom clair : {0}_CV.pdf": "CV guardado en PDF, con un nombre claro: {0}_CV.pdf",
    "Objet du mail clair : « Candidature {0} · {1} »": "Asunto del correo claro: «Candidatura {0} · {1}»",
    "CV et lettre joints au mail (ou collés dans le formulaire du site)": "CV y carta adjuntos al correo (o pegados en el formulario de la web)",
    "Lettre relue une dernière fois, à voix haute": "Carta releída una última vez, en voz alta",
    "Annonce gardée : copie du texte ou lien noté dans ton suivi": "Anuncio guardado: copia del texto o enlace anotado en tu seguimiento",
    "Avant d'envoyer": "Antes de enviar",
    " : fait": ": hecho",
    " : à faire": ": por hacer",
    "C'est envoyé : noter dans mon suivi": "Enviada: anotarla en mi seguimiento",
    "Revenir au modèle": "Volver a la plantilla",
    "Modifier le texte": "Editar el texto",
    "Lettre_": "Carta_",
    "motivation": "presentacion",
    "Fichier Word téléchargé": "Archivo Word descargado",
    "Choisis « Enregistrer en PDF »": "Elige «Guardar como PDF»",
    "Texte copié": "Texto copiado",
    "Copie impossible : sélectionne le texte": "No se ha podido copiar: selecciona el texto",
    " (indispensable)": " (imprescindible)",
    "Bilan Ça colle ?": "Resumen ¿Encaja?",
    "Score : {0} % ({1}). {2} point{3} prouvé{4}, {5} à préciser, {6} absent{7} du CV, sur {8}.": "Puntuación: {0} % ({1}). {2} probados, {5} por concretar y {6} que no están en el CV, de {8}.",
    "Suivi : ": "Seguimiento: ",
    " · envoyée le ": " · enviada el ",
    "Pas dans le CV": "No está en el CV",
    "À préciser avec un exemple": "Falta un ejemplo",
    "Ça colle": "Encaja",
    "L'annonce": "El anuncio",
    " : pas indiqué": ": no indicado",
    "Test robot recruteur : à corriger": "Test del robot reclutador: por corregir",
    "Ajouté au CV avec l'app": "Añadido al CV con la app",
    "Fait avec Ça colle ? (ca-colle.pissits.com) : l'analyse se fait sur l'appareil, rien n'est envoyé.": "Hecho con ¿Encaja? (ca-colle.pissits.com): el análisis se hace en el dispositivo, no se envía nada.",
    "Bilan_": "Resumen_",
    "Mon bilan de candidature": "El resumen de mi candidatura",
    "Bilan copié : colle-le dans un mail": "Resumen copiado: pégalo en un correo",
    "Copie impossible": "No se ha podido copiar",
    " · relis le texte lu, la photo n'était pas très nette": " · revisa el texto leído, la foto no era muy nítida",
    "CV lu": "CV leído",
    "Je n'ai pas réussi à lire ce fichier. Essaie un PDF.": "No he podido leer este archivo. Prueba con un PDF.",
    "Offre lue": "Oferta leída",
    "La capture n'était pas très nette : relis le texte de l'offre avant de continuer.": "La captura no era muy nítida: revisa el texto de la oferta antes de seguir.",
    "Je n'ai pas réussi à lire ce fichier.": "No he podido leer este archivo.",
    "Ton CV": "Tu CV",
    "offre": "oferta",
    " et ": " y ",
    " sont là.": ": todo sigue aquí.",
    "Ajouté à ton CV": "Añadido a tu CV",
    "Point retiré du score": "Punto quitado de la puntuación",
    "Tampon corrigé": "Sello corregido",
    "Revenu au calcul": "De vuelta al análisis",
    "Corrigé : « {0} »": "Corregido: «{0}»",
    "Exemple : CV de Camille Martin": "Ejemplo: CV de Lucía Romero",
    "CV fictif pour essayer": "CV inventado para probar",
    "Colle la nouvelle offre : ton CV est gardé": "Pega la nueva oferta: tu CV se mantiene",
    "Ta session restera sur cet appareil": "Tu sesión se quedará en este dispositivo",
    "Plus rien n'est gardé sur cet appareil": "Ya no se guarda nada en este dispositivo",
    "J'ai retiré {0} du site (boutons, menus, mentions).": "He quitado {0} de la web (botones, menús, avisos).",
    "App installée": "App instalada",
    "Annonce reçue": "Anuncio recibido",
    "Texte collé": "Texto pegado",
    "Cette annonce semble écrite en {0}.": "Este anuncio parece estar escrito en {0}.",
    "L'analyse et la lettre marchent mieux dans la langue de l'annonce.": "El análisis y la carta funcionan mejor en el idioma del anuncio.",
    "Préparation de la lecture d'image : téléchargement d'environ {0} Mo, une seule fois…": "Preparando la lectura de imagen: unos {0} MB que se descargan una sola vez…",
    "Préparation de la lecture d'image…": "Preparando la lectura de imagen…",
    "Le site n'a envoyé que le lien : copie le texte de l'annonce": "La web solo ha enviado el enlace: copia el texto del anuncio",
    "{0} lignes · {1} expérience{2} repérée{3} · aucun titre de rubrique trouvé (Expériences, Compétences…)": "{0} líneas · experiencias encontradas: {1} · ningún título de apartado encontrado (Experiencia, Competencias…)",
    "{0} lignes · {1} expérience{2} repérée{3}": "{0} líneas · experiencias encontradas: {1}",
    " chez {0}": " en {0}",
    // années (plural() rend déjà l'espagnol, tr() le garde tel quel)
    "{0} año": "{0} año",
    "{0} años": "{0} años",
    // moteur.js
    "À préciser": "Por concretar",
    "Pas dans ton CV": "No está en tu CV",
    "Compétences": "Competencias",
    "cette qualité": "esta cualidad",
    "ex : {0}": "p. ej.: {0}",
    "ex : …": "p. ej.: …",
    "Pas grave. Si tu es prêt(e) à apprendre, dis-le dans ta lettre de motivation.": "No pasa nada. Si estás dispuesto/a a aprender, dilo en tu carta de presentación.",
    "C'est cité, mais aucune expérience ne le montre. Dis où tu l'as fait.": "Lo mencionas, pero ninguna experiencia lo demuestra. Di dónde lo hiciste.",
    " {0} : {où et combien ? {1}}.": " {0}: {¿dónde y cuánto? {1}}.",
    "As-tu déjà fait ça : {0} ?": "¿Ya has hecho esto: {0}?",
    "Un mot seul ne prouve rien : ajoute un fait concret.": "Una palabra sola no prueba nada: añade un hecho concreto.",
    "L'offre le demande : prouve-le par un fait, pas par un adjectif.": "La oferta lo pide: pruébalo con un hecho, no con un adjetivo.",
    " {un fait qui montre {0} ? {1}}.": " {¿un hecho que muestre {0}? {1}}.",
    "Dis à quoi il te sert, ça parle plus qu'un nom de logiciel.": "Di para qué lo usas: dice más que el nombre de un programa.",
    "{0} ({pour quoi faire ? {1}})": "{0} ({¿para qué? {1}})",
    "Sais-tu utiliser {0} ?": "¿Sabes usar {0}?",
    ", {0} ({ton niveau ou un exemple ? {1}})": ", {0} ({¿tu nivel o un ejemplo? {1}})",
    "Si c'est un « plus », ce n'est pas bloquant. Sinon, une formation courte peut suffire.": "Si solo «se valora», no es un obstáculo. Si no, puede bastar un curso corto.",
    "As-tu : {0} ?": "¿Tienes: {0}?",
    ", {0} ({année ou détail ? ex : {1}})": ", {0} ({¿año o detalle? p. ej.: {1}})",
    "Certaines entreprises financent la formation. Tu peux dire dans ta lettre que tu es prêt(e) à la passer.": "Algunas empresas pagan la formación. Puedes decir en tu carta que estás dispuesto/a a hacerla.",
    "{0} ({ton niveau ? ex : scolaire, courant})": "{0} ({¿tu nivel? p. ej.: básico, fluido})",
    "Tu parles {0} ?": "¿Hablas {0}?",
    ", {0} {ton niveau ? ex : scolaire}": ", {0} {¿tu nivel? p. ej.: básico}",
    "Si l'offre dit « apprécié », ce n'est pas bloquant.": "Si la oferta dice «se valora», no es un obstáculo.",
    "Acceptes-tu ces horaires ?": "¿Aceptas estos horarios?",
    ", disponible {quand ? ex : en horaires décalés et le week-end}": ", disponible {¿cuándo? p. ej.: a turnos y fines de semana}",
    "Dis-le franchement en entretien : c'est mieux que de mauvaises surprises.": "Dilo con franqueza en la entrevista: mejor eso que las malas sorpresas.",
    "As-tu ce diplôme ({0}) ?": "¿Tienes este título ({0})?",
    "{0} {spécialité et année ? ex : Employé de commerce, 2020}": "{0} {¿especialidad y año? p. ej.: Actividades Comerciales, 2020}",
    "Une expérience équivalente compte souvent autant : mets-la en avant dans ta lettre.": "Una experiencia equivalente suele contar lo mismo: destácala en tu carta.",
    "C'est cité, mais sans exemple concret.": "Lo mencionas, pero sin un ejemplo concreto.",
    " {un exemple concret ? ex : où, combien, pendant combien de temps}.": " {¿un ejemplo concreto? p. ej.: dónde, cuánto, durante cuánto tiempo}.",
    "As-tu déjà fait ça ?": "¿Ya has hecho esto?",
    " {ce que tu as fait ? ex : où, combien, pendant combien de temps}.": " {¿qué hiciste? p. ej.: dónde, cuánto, durante cuánto tiempo}.",
    "Pas grave : mets en avant ce qui s'en rapproche le plus.": "No pasa nada: destaca lo que más se parezca.",
    "{0} ans d'expérience": "{0} años de experiencia",
    "1 an d'expérience": "1 año de experiencia",
    "Diplôme : {0}": "Título: {0}",
    "Ton CV est une image": "Tu CV es una imagen",
    "Ton CV contient du vrai texte": "Tu CV tiene texto de verdad",
    "Beaucoup de logiciels de tri ne lisent pas les images. Envoie plutôt un PDF enregistré depuis Word ou Google Docs.": "Muchos programas de selección no leen imágenes. Mejor envía un PDF guardado desde Word o Google Docs.",
    "Les logiciels de tri peuvent le lire.": "Los programas de selección pueden leerlo.",
    "Adresse email": "Dirección de email",
    "Mets ton email en haut du CV, en texte (pas dans une image).": "Pon tu email arriba del CV, como texto (no dentro de una imagen).",
    "Numéro de téléphone": "Número de teléfono",
    "Ajoute ton numéro en haut du CV, au format 06 12 34 56 78.": "Añade tu número arriba del CV, por ejemplo 600 123 456.",
    "Titre « Expériences »": "Título «Experiencia»",
    "Écris un titre clair « Expériences professionnelles » au-dessus de tes postes.": "Escribe un título claro, «Experiencia profesional», encima de tus puestos.",
    "Titre « Compétences »": "Título «Competencias»",
    "Ajoute une rubrique « Compétences » avec les mots de l'offre.": "Añade un apartado «Competencias» con las palabras de la oferta.",
    "Titre « Formation »": "Título «Formación»",
    "Ajoute une rubrique « Formation » avec tes diplômes, même s'il n'y en a qu'un.": "Añade un apartado «Formación» con tus títulos, aunque solo tengas uno.",
    "Dates sur tes expériences": "Fechas en tus experiencias",
    "Mets les années de début et de fin de chaque poste (ex : 2022 - 2025).": "Pon el año de inicio y de fin de cada puesto (p. ej.: 2022 - 2025).",
    "CV un peu court": "CV un poco corto",
    "CV très long": "CV muy largo",
    "Longueur correcte": "Longitud correcta",
    "Détaille un peu plus tes expériences : ce que tu faisais, avec des chiffres.": "Explica un poco más tus experiencias: lo que hacías, con cifras.",
    "Garde l'essentiel sur 1 ou 2 pages.": "Quédate con lo esencial en 1 o 2 páginas.",
    "Pas de caractères bizarres": "Sin caracteres raros",
    "Certains symboles ou icônes ne sont pas lus. Remplace-les par du texte (ex : « Tél : »).": "Algunos símbolos o iconos no se leen. Cámbialos por texto (p. ej.: «Tel.:»).",
    "Salaire": "Salario",
    "Contrat": "Contrato",
    "Temps de travail": "Jornada",
    "Télétravail": "Teletrabajo",
    "Début": "Incorporación",
    "On te demande de payer": "Te piden que pagues",
    "Une vraie entreprise ne fait jamais payer pour postuler, pour une formation obligatoire ou pour un « kit ».": "Una empresa de verdad nunca cobra por presentarse a una oferta, por una formación obligatoria ni por un «kit».",
    "On te demande des données sensibles": "Te piden datos sensibles",
    "Ne donne pas ton RIB, ta carte Vitale ou une copie de pièce d'identité avant d'avoir signé un contrat.": "No des tus datos bancarios, tu número de la Seguridad Social ni una copia de tu DNI antes de firmar un contrato.",
    "Contact par messagerie seulement": "Contacto solo por mensajería",
    "Les arnaques passent souvent par WhatsApp ou Telegram. Cherche le site et l'adresse de l'entreprise.": "Las estafas suelen ir por WhatsApp o Telegram. Busca la web y la dirección de la empresa.",
    "Trop beau pour être vrai": "Demasiado bonito para ser verdad",
    "Des gains élevés et rapides sans expérience, c'est le signe classique d'une arnaque.": "Ganar mucho y rápido sin experiencia es la señal típica de una estafa.",
    "Vente à domicile ou parrainage": "Venta a domicilio o captar a otros",
    "Vérifie que tu seras salarié(e) avec un vrai contrat, et pas payé(e) seulement à la commission.": "Comprueba que tendrás un contrato de trabajo de verdad y que no cobrarás solo a comisión.",
    "Adresse email personnelle": "Email personal",
    "Une adresse Gmail, Hotmail ou Yahoo pour une entreprise : vérifie qu'elle existe vraiment (site, SIRET, avis).": "Un email de Gmail, Hotmail o Yahoo para una empresa: comprueba que existe de verdad (web, CIF, opiniones).",
    "Lieu": "Lugar",
    "« {0} » s'écrit « {1} »": "«{0}» se escribe «{1}»",
    "« {0} » ne dit pas ce que tu as fait toi-même. Préfère un verbe d'action : « organisé », « géré », « préparé », « vendu »…": "«{0}» no dice lo que hiciste tú. Mejor un verbo de acción: «organicé», «gestioné», «preparé», «vendí»…",
    "Phrase de {0} mots : coupe-la en deux, un recruteur lit vite.": "Frase de {0} palabras: pártela en dos, quien selecciona lee rápido.",
    "Aucun chiffre ici : ajoute combien (clients, commandes, personnes, euros) ou pendant combien de temps.": "Aquí no hay cifras: añade cuántos (clientes, pedidos, personas, euros) o durante cuánto tiempo.",
    "« Je » revient {0} fois. Dans un CV, commence plutôt par le verbe : « Préparé 120 commandes par jour ».": "«Yo» aparece {0} veces. En un CV, mejor empieza por el verbo: «Preparé 120 pedidos al día».",
    // outils.js
    "Bonjour {0},": "Hola, {0}:",
    "Bonjour,": "Buenos días:",
    "Bien cordialement,": "Un saludo cordial,",
    " envoyée le {0}": " enviada el {0}",
    "← Retour au suivi": "← Volver al seguimiento",
    "Écrire un mail": "Escribir un correo",
    "Type de mail": "Tipo de correo",
    "Objet": "Asunto",
    "Message": "Mensaje",
    "Relis et complète ce qui est entre crochets avant d'envoyer. Le mail part de ta propre messagerie.": "Repásalo y completa lo que está entre corchetes antes de enviar. El correo sale de tu propio email.",
    " Ajoute l'email du contact dans la fiche pour qu'il soit rempli tout seul.": " Añade el email del contacto en la ficha para que se rellene solo.",
    "Ouvrir dans ma messagerie": "Abrir en mi correo",
    "Copier": "Copiar",
    "Noter comme relancée": "Marcar como recordada",
    "Entretien": "Entrevista",
    "Relancer": "Recordar candidatura",
    "Candidature": "Candidatura",
    "Contact : ": "Contacto: ",
    "Ouvre le fichier pour l'ajouter à ton agenda": "Abre el archivo para añadirlo a tu calendario",
    "Ce qui manque le plus à ton CV": "Lo que más le falta a tu CV",
    "Sur tes {0} offres, ces points reviennent souvent et ton CV ne les prouve pas encore. Les ajouter aide pour plusieurs candidatures à la fois.": "En tus {0} ofertas, estos puntos salen a menudo y tu CV aún no los prueba. Añadirlos ayuda en varias candidaturas a la vez.",
    "revient dans {0} offres sur {1}": "sale en {0} de {1} ofertas",
    " · indispensable dans {0}": " · imprescindible en {0}",
    "pas dans ton CV": "no está en tu CV",
    "à prouver": "por probar",
    "Aucun point ne manque dans plusieurs offres à la fois : bonne nouvelle.": "No falta ningún punto en varias ofertas a la vez: buena noticia.",
    "Il faut au moins deux offres analysées pour les comparer. Colle une autre offre avec « Comparer avec une autre offre » à l'étape 3.": "Hacen falta al menos dos ofertas analizadas para compararlas. Pega otra oferta con «Comparar con otra oferta» en el paso 3.",
    "Score": "Puntuación",
    "État": "Estado",
    "Absent de ton CV": "No está en tu CV",
    " (dont {0} indispensable{1})": " ({0} imprescindibles)",
    "Alertes": "Alertas",
    "Critère": "Criterio",
    "Seules les offres dont tu as collé le texte apparaissent ici. Clique sur un titre pour revoir son analyse.": "Aquí solo salen las ofertas cuyo texto has pegado. Haz clic en un título para volver a ver su análisis.",
    "Quel est le salaire prévu pour ce poste ?": "¿Qué salario tiene este puesto?",
    "Quel type de contrat est proposé, et pour combien de temps ?": "¿Qué tipo de contrato ofrecen y por cuánto tiempo?",
    "Quels sont les horaires et le temps de travail ?": "¿Cuál es el horario y la jornada?",
    "Où se trouve le lieu de travail ? Y a-t-il des déplacements ?": "¿Dónde está el lugar de trabajo? ¿Hay que viajar?",
    "Le télétravail est-il possible, même en partie ?": "¿Se puede teletrabajar, aunque sea en parte?",
    "Quand le poste commence-t-il ?": "¿Cuándo empieza el puesto?",
    "Pouvez-vous me donner le nom et l'adresse exacts de l'entreprise ?": "¿Me pueden dar el nombre y la dirección exactos de la empresa?",
    "À quoi ressemble une journée type sur ce poste ?": "¿Cómo es un día normal en este puesto?",
    "Comment est composée l'équipe ?": "¿Cómo es el equipo?",
    "Comment se passe l'arrivée d'un nouveau salarié (formation, tuteur) ?": "¿Cómo es la acogida de una persona nueva (formación, tutor)?",
    "Quelles sont les prochaines étapes du recrutement ?": "¿Cuáles son los siguientes pasos del proceso?",
    "Questions à poser au recruteur": "Preguntas para quien te entrevista",
    "Choisis-en 2 ou 3. Les premières viennent de ce que l'annonce ne dit pas.": "Elige 2 o 3. Las primeras salen de lo que el anuncio no dice.",
    "ca-colle-sauvegarde-": "encaja-copia-",
    "Fichier enregistré : ouvre-le sur ton autre appareil": "Archivo guardado: ábrelo en tu otro dispositivo",
    "Ce fichier n'est pas une sauvegarde de Ça colle ?": "Este archivo no es una copia de seguridad de ¿Encaja?",
    "Remplacer ce qui est dans l'app par le contenu de ce fichier ?": "¿Cambiar lo que hay en la app por el contenido de este archivo?",
    "Impossible d'enregistrer sur cet appareil": "No se puede guardar en este dispositivo",
    "Mail copié": "Correo copiado",
    "Notée comme relancée, nouveau rappel dans 7 jours": "Marcada como recordada, nuevo aviso dentro de 7 días",
    "Aucune candidature envoyée sur cette période": "Ninguna candidatura enviada en este periodo",
    "du {0} au {1}": "del {0} al {1}",
    "Mes démarches de recherche d'emploi": "Mis acciones de búsqueda de empleo",
    "Période : ": "Periodo: ",
    "candidature": "candidatura",
    "Date": "Fecha",
    "Entreprise": "Empresa",
    "Poste": "Puesto",
    "Contact ou lien": "Contacto o enlace",
    "Liste établie le {0} à partir du suivi tenu par la personne avec Ça colle ? (ca-colle.pissits.com).": "Lista hecha el {0} a partir del seguimiento que lleva la propia persona con ¿Encaja? (ca-colle.pissits.com).",
    "Ton tableau de bord se remplira quand tu auras noté des candidatures envoyées.": "Tu panel se llenará cuando hayas anotado candidaturas enviadas.",
    "candidatures envoyées": "candidaturas enviadas",
    " %": " %",
    "de réponses ({0})": "con respuesta ({0})",
    "entretiens obtenus": "entrevistas conseguidas",
    "jour": "día",
    "avant une réponse, en moyenne": "hasta una respuesta, de media",
    "Cette semaine : ": "Esta semana: ",
    "{0} candidatures sur un objectif de {1}": "{0} candidaturas de un objetivo de {1}",
    "Mon objectif par semaine": "Mi objetivo semanal",
    "Objectif atteint, bravo. Pense aussi à te reposer.": "Objetivo cumplido, enhorabuena. Acuérdate también de descansar.",
    "Encore {0} pour atteindre ton objectif. La qualité compte plus que le nombre : une lettre adaptée vaut mieux que trois envois rapides.": "Te faltan {0} para tu objetivo. La calidad cuenta más que la cantidad: una carta adaptada vale más que tres envíos rápidos.",
    "Candidatures par semaine": "Candidaturas por semana",
    "Où en sont tes candidatures": "Cómo van tus candidaturas",
    "[ton prénom]": "[tu nombre]",
    "Remplacer ta réponse actuelle par le pitch ?": "¿Cambiar tu respuesta actual por la presentación?",
    "Pitch prêt : complète ce qui est entre crochets": "Presentación lista: completa lo que está entre corchetes",
    "Relance": "Recordatorio",
    "Merci après l'entretien": "Gracias tras la entrevista",
    "Accepter une proposition": "Aceptar una oferta",
    "Refuser poliment": "Rechazar con educación",
    "Demander un retour après un refus": "Pedir una valoración tras un rechazo",
    // suivi.js
    "Rendez-vous": "Cita",
    "À faire": "Tarea",
    "{0} aujourd'hui": "{0}: hoy",
    "{0} prévue il y a {1}": "{0}: era hace {1}",
    "{0} demain": "{0}: mañana",
    "{0} dans 2 jours": "{0}: dentro de 2 días",
    "Sans nouvelles depuis {0} : relance": "Sin noticias desde hace {0}: recuérdales tu candidatura",
    "Pas encore postulé": "Aún no te has presentado",
    "Rien d'urgent. Pense à noter chaque réponse.": "Nada urgente. Acuérdate de anotar cada respuesta.",
    "Aucune candidature pour l'instant. Ajoute-en une, ou clique sur « Suivre cette candidature » après une analyse.": "Todavía no hay candidaturas. Añade una o haz clic en «Seguir esta candidatura» después de un análisis.",
    "Aucune candidature dans ce filtre.": "Ninguna candidatura en este filtro.",
    "Entreprise à préciser": "Empresa sin indicar",
    "Score de l'analyse": "Puntuación del análisis",
    "Offre du": "Oferta del",
    "Prochaine étape": "Siguiente paso",
    "Détails et suivi": "Detalles e historial",
    "Date de l'offre": "Fecha de la oferta",
    "Date de candidature": "Fecha de la candidatura",
    "Prochaine étape (relance, entretien…)": "Siguiente paso (recordatorio, entrevista…)",
    "Contact": "Contacto",
    "ex : Mme Dupont, RH, 02 31 00 00 00": "p. ej.: Ana López, RR. HH., 910 000 000",
    "Lien de l'annonce": "Enlace del anuncio",
    "Notes": "Notas",
    "ex : entretien avec le chef d'équipe, questions sur les horaires": "p. ej.: entrevista con la jefa de equipo, preguntas sobre el horario",
    "Voir l'analyse": "Ver el análisis",
    "Préparer l'entretien": "Preparar la entrevista",
    "Ajouter à l'agenda": "Añadir al calendario",
    "Ouvrir l'annonce": "Abrir el anuncio",
    "Supprimer": "Borrar",
    "Actions": "Acciones",
    "(en retard)": "(con retraso)",
    "Ouvrir": "Abrir",
    "Lien": "Enlace",
    "mes_candidatures.csv": "mis_candidaturas.csv",
    "Fichier téléchargé : il s'ouvre dans Excel ou LibreOffice": "Archivo descargado: se abre con Excel o LibreOffice",
    "Présentez-vous en quelques minutes.": "Preséntese en unos minutos.",
    "Ton parcours en 3 étapes, puis pourquoi ce poste. Une minute ou deux suffisent.": "Tu trayectoria en 3 etapas y luego por qué este puesto. Basta con uno o dos minutos.",
    "Pourquoi ce poste et pourquoi notre entreprise ?": "¿Por qué este puesto y por qué nuestra empresa?",
    "Reprends ce que tu as écrit dans ta lettre.": "Retoma lo que escribiste en tu carta.",
    "Ces horaires vous conviennent-ils ({0}) ?": "¿Le vienen bien estos horarios ({0})?",
    "Réponds franchement, avec tes contraintes s'il y en a.": "Responde con franqueza, con tus limitaciones si las tienes.",
    "{0} : depuis quand l'avez-vous ?": "{0}: ¿desde cuándo lo tiene?",
    "Avez-vous : {0} ? Sinon, êtes-vous prêt(e) à le passer ?": "¿Tiene: {0}? Si no, ¿está dispuesto/a a sacarlo?",
    "Une date, ou ton plan pour l'obtenir.": "Una fecha, o tu plan para conseguirlo.",
    "Parlez-moi de votre parcours et de votre expérience.": "Hábleme de su trayectoria y de su experiencia.",
    "Commence par le poste le plus proche de cette offre.": "Empieza por el puesto más parecido a esta oferta.",
    "Donnez un exemple qui montre votre {0}.": "Deme un ejemplo que muestre su {0}.",
    "Un vrai moment, pas un adjectif.": "Un momento real, no un adjetivo.",
    "Parlez-moi de votre expérience en {0}.": "Hábleme de su experiencia en {0}.",
    "Appuie-toi sur ton CV : « {0} »": "Apóyate en tu CV: «{0}»",
    "Pouvez-vous donner un exemple concret : {0} ?": "¿Puede dar un ejemplo concreto: {0}?",
    "Ton CV le cite sans exemple : prépare un fait avec un chiffre.": "Tu CV lo menciona sin ejemplo: prepara un hecho con una cifra.",
    "L'offre demande : {0}. Comment feriez-vous ?": "La oferta pide: {0}. ¿Cómo lo haría?",
    "N'invente pas d'expérience : dis ce qui s'en rapproche et que tu es prêt(e) à apprendre.": "No te inventes experiencia: di lo que más se parece y que estás dispuesto/a a aprender.",
    "Racontez une situation difficile au travail et ce que vous avez fait.": "Cuénteme una situación difícil en el trabajo y qué hizo.",
    "Choisis une histoire qui finit bien, et ce que tu en as appris.": "Elige una historia que acabe bien, y lo que aprendiste.",
    "Quelles sont vos qualités, et un point que vous travaillez ?": "¿Cuáles son sus cualidades, y un punto que esté mejorando?",
    "Une qualité utile pour ce poste, avec un exemple. Un vrai point à améliorer, et ce que tu fais pour.": "Una cualidad útil para este puesto, con un ejemplo. Un punto real que mejorar, y lo que haces para ello.",
    "Quand êtes-vous disponible, et quelles sont vos attentes de salaire ?": "¿Cuándo está disponible y qué salario espera?",
    "Regarde les salaires du métier avant. Donne une fourchette.": "Mira antes los salarios de la profesión. Da una horquilla.",
    "Avez-vous des questions ?": "¿Tiene alguna pregunta?",
    "Prépare 2 questions : une sur le poste au quotidien, une sur l'équipe.": "Prepara 2 preguntas: una sobre el día a día del puesto y otra sobre el equipo.",
    "Méthode simple :": "Método sencillo:",
    "la situation (où, quand), ce que tu as fait toi, et le résultat (avec un chiffre si possible). Écris seulement des choses vraies : c'est toi qui réponds le jour J.": "la situación (dónde, cuándo), lo que hiciste tú y el resultado (con una cifra si puedes). Escribe solo cosas verdaderas: el día de la entrevista respondes tú.",
    "Pour avoir des questions sur cette offre, ajoute le texte de l'annonce et ton CV. En attendant, voici les questions classiques.": "Para tener preguntas sobre esta oferta, añade el texto del anuncio y tu CV. Mientras tanto, aquí tienes las preguntas clásicas.",
    "Préparer mon pitch d'une minute": "Preparar mi presentación de un minuto",
    "Ma réponse": "Mi respuesta",
    "Situation": "Situación",
    "ex : au Drive Super U, un samedi de rush": "p. ej.: en el supermercado, un sábado de mucho lío",
    "Ce que j'ai fait": "Lo que hice",
    "Résultat": "Resultado",
    "ex : 120 commandes prêtes à l'heure": "p. ej.: 120 pedidos listos a tiempo",
    "Télécharger en Word": "Descargar en Word",
    "En PDF": "En PDF",
    "Préparation d'entretien": "Preparación de la entrevista",
    "Situation : ": "Situación: ",
    "Ce que j'ai fait : ": "Lo que hice: ",
    "Résultat : ": "Resultado: ",
    "Candidature notée comme envoyée": "Candidatura anotada como enviada",
    "Ajoutée à ton suivi": "Añadida a tu seguimiento",
    "Preparation_entretien_": "Preparacion_entrevista_",
    "Supprimer « {0} » de ton suivi ?": "¿Borrar «{0}» de tu seguimiento?",
    "À postuler": "Por presentar",
    "Candidature envoyée": "Candidatura enviada",
    "Relancée": "Recordada",
    "Appel de prise de contact": "Primera llamada",
    "Entretien prévu": "Entrevista prevista",
    "Entretien passé": "Entrevista hecha",
    "Test ou mise en situation": "Prueba o caso práctico",
    "Proposition reçue": "Oferta recibida",
    "Acceptée": "Aceptada",
    "Refusée": "Rechazada",
    "Sans réponse": "Sin respuesta",
    "Abandonnée": "Abandonada",
    // confort.js
    "À faire en premier : ": "Lo primero que hacer: ",
    // lecteur.js
    "Lecture de l'image : {0} %": "Leyendo la imagen: {0} %",
    "Préparation de la lecture d'image (la première fois seulement)…": "Preparando la lectura de imágenes (solo la primera vez)…",
    "Ce fichier Word semble abîmé. Enregistre-le à nouveau ou envoie un PDF.": "Este archivo Word parece dañado. Guárdalo de nuevo o envía un PDF.",
    "Ce fichier ne contient pas de texte lisible.": "Este archivo no tiene texto legible.",
    "Fichier trop lourd : 20 Mo maximum.": "Archivo demasiado pesado: 20 MB como máximo.",
    "Lecture du texte…": "Leyendo el texto…",
    "Fichier texte": "Archivo de texto",
    "Ouverture du document Word…": "Abriendo el documento Word…",
    "Document Word": "Documento Word",
    "Ouverture du document…": "Abriendo el documento…",
    "Document OpenDocument": "Documento OpenDocument",
    "L'ancien format Word (.doc) n'est pas lu. Dans Word, fais « Enregistrer sous » en .docx ou en PDF.": "El formato antiguo de Word (.doc) no se puede leer. En Word, usa «Guardar como» en .docx o en PDF.",
    "Chargement du lecteur PDF…": "Cargando el lector de PDF…",
    "Ce PDF est une image : lecture à l'œil (OCR)…": "Este PDF es una imagen: leyéndolo como una foto (OCR)…",
    "PDF scanné · {0} · lu à {1} %": "PDF escaneado · {0} · leído al {1} %",
    "Les photos HEIC d'iPhone ne s'ouvrent pas dans le navigateur. Envoie une capture d'écran ou un JPEG.": "Las fotos HEIC del iPhone no se abren en el navegador. Envía una captura de pantalla o un JPEG.",
    "Lecture de la photo…": "Leyendo la foto…",
    "Photo · lue à {0} %": "Foto · leída al {0} %",
    "Format non reconnu. Envoie un PDF, un Word (.docx), un .odt, un .txt ou une photo.": "Formato no reconocido. Envía un PDF, un Word (.docx), un .odt, un .txt o una foto.",
    "Je n'ai presque pas trouvé de texte. Essaie un PDF, ou une photo bien droite et nette.": "Casi no he encontrado texto. Prueba con un PDF o con una foto bien recta y nítida.",
    "C'est lu.": "Leído.",
    // demo.js
    "Mode démo : profil de Maurice MARCEL chargé": "Modo demo: perfil de Maurice MARCEL cargado",
    "Page {0} sur {1}": "Página {0} de {1}",
    "1 page": "1 página",
    "{0} page{1}": "{0} páginas"
  }),
  // plural(n, mot) : mot français → mot espagnol, puis pluriel
  w: {"an": "año", "chose": "cosa", "point": "punto", "faute courante": "error frecuente", "ligne": "línea", "jour": "día"},
  pl: {"año": "años", "cosa": "cosas", "punto": "puntos", "error frecuente": "errores frecuentes", "línea": "líneas", "día": "días", "oferta": "ofertas", "candidatura": "candidaturas"},

  offer: `Mozo/a de almacén – Indefinido – Zaragoza (ejemplo ficticio)

En nuestro almacén, preparas pedidos y participas en la recepción de mercancías.

Tus funciones:
- Preparación de pedidos y control de calidad
- Recepción y colocación de la mercancía
- Gestión de stock e inventarios
- Manejo de carretilla elevadora (carné de carretillero)
- Introducción de datos en Excel

Qué buscamos:
- 2 años de experiencia en almacén
- Carné de conducir B imprescindible
- Trabajo en equipo, puntualidad, rigor
- Inglés básico valorable
- Turnos rotativos de mañana y tarde`,
  cv: `Lucía Romero · Zaragoza · lucia.romero@ejemplo.es · 600 123 456
Experiencia
Preparadora de pedidos, Supermercado Ejemplo online (2022-2025): 120 pedidos al día, control de calidad de productos frescos, trabajo en equipo de 6.
Dependienta, panadería del centro (2020-2022): apertura a las 6 h, caja, colocación de la mercancía cada mañana.
Formación
Técnico en Actividades Comerciales, FP de grado medio (2020)
Competencias
Hoja de cálculo, gestión de stock, rigor, puntualidad
Otros
Carné de conducir B, vehículo propio`,

  // Profil de démo (js/demo.js) : Maurice MARCEL, ingénieur informatique, version Espagne
  demo: {
    file: "CV_Maurice_MARCEL.pdf (demo)", info: "Perfil inventado para las pruebas",
    cv: `MAURICE MARCEL · Ingeniero informático · 32 años
Valladolid · maurice.marcel@example.com · 600 000 000
Perfil
Ingeniero informático con 10 años de experiencia en sistemas, redes y cloud.
Experiencia profesional
Ingeniero de sistemas y redes, Ejemplo Industria SA (2019 - 2025): administración de 120 servidores Windows y Linux, VMware vSphere, Active Directory para 800 usuarios, copias de seguridad con Veeam, monitorización con Zabbix.
Administrador de sistemas, Ejemplo Servicios (2016 - 2019): soporte de nivel 2, despliegue de equipos con SCCM, participar en diversos proyectos y tareas varias.
Técnico de soporte (FP dual), Ejemplo Informática (2014 - 2016): atencion a usuarios por teléfono, reparación de impresoras.
Formacion
Grado en Ingeniería Informática, Escuela Ejemplo (2016)
Competencias
Windows Server, Linux, VMware, Active Directory, PowerShell, Ansible, Docker, redes TCP/IP, ciberseguridad, inglés técnico
Otros
Carné de conducir B`,
    me: {name: "Maurice MARCEL", contact: "maurice.marcel@example.com · 600 000 000"},
    letter: {company: "Ejemplo Industria", why: "su paso a la nube es justo el tipo de proyecto que quiero liderar", when: "a partir del 1 de diciembre"},
    offers: [
      {text: `Ingeniero/a de sistemas y redes – Indefinido – Valladolid
Ejemplo Industria busca un ingeniero/a de sistemas y redes para su departamento de informática (teletrabajo 2 días por semana).
Tus funciones:
- Administrar los servidores Windows y Linux y la plataforma VMware
- Gestionar las cuentas y los permisos de acceso en el Active Directory
- Supervisar las copias de seguridad y restaurar los datos si hace falta
- Automatizar tareas con PowerShell o Ansible
- Redactar la documentación técnica
Tu perfil:
- Experiencia mínima de 5 años en administración de sistemas
- Se valorarán conocimientos de Azure
- Buena comunicación, inglés técnico
Salario: 42.000 € brutos al año, 40 horas semanales, incorporación inmediata.`,
        app: {company: "Ejemplo Industria", status: "interview", offer: -20, applied: -12, next: 3, contact: "Claire Dupont, RR. HH. · 983 000 000", notes: "Segunda entrevista con el responsable de informática. Llevar ejemplos de la migración a Veeam.", hist: [["sent", -12], ["call", -6], ["interview", -2]]}},
      {text: `Ingeniero/a DevOps – Indefinido – Bilbao
Tus funciones:
- Construir y mantener las cadenas CI/CD con GitLab
- Desplegar contenedores con Docker y Kubernetes
- Gestionar la infraestructura como código con Terraform y Ansible
- Monitorizar la producción con Prometheus y Grafana
- Redactar la documentación técnica
- Se valora experiencia con Azure
Tu perfil:
- 3 años de experiencia como DevOps o ingeniero de sistemas
- Linux, scripts (Python o Bash)
- Trabajo en equipo y autonomía
Teletrabajo parcial, 45.000 € brutos anuales.`,
        app: {company: "Ejemplo Cloud", status: "sent", offer: -15, applied: -9, next: -2, contact: "empleo@example.com", notes: "Candidatura enviada desde la web de empleo de la empresa.", hist: [["sent", -9]]}},
      {text: `Jefe/a de proyectos informáticos – Temporal 12 meses – Sevilla
Diriges el cambio del ERP de la empresa y coordinas a los proveedores.
Tus funciones:
- Planificar y seguir el presupuesto y el calendario del proyecto
- Dirigir los comités de seguimiento
- Redactar los pliegos de requisitos con los departamentos
- Formar a los usuarios
- Redactar la documentación técnica
Tu perfil: 5 años en gestión de proyectos informáticos, metodologías ágiles, rigor y organización.`,
        app: {company: "Ejemplo Logística", status: "call", offer: -10, applied: -7, next: 1, contact: "Pablo Martín · 954 000 000", notes: "Llamada prevista mañana a las 10 h.", hist: [["sent", -7], ["call", -1]]}},
      {text: `Asistente informático desde casa – Gana hasta 400 € al día
¡No hace falta experiencia! Paga una cuota de inscripción de 49 € para recibir tu kit de inicio.
Envía tus datos bancarios y una copia de tu DNI por WhatsApp o a seleccion.rapida@gmail.com.
Funciones: introducción de datos, responder correos, pequeñas reparaciones para nuestros clientes, todo desde casa.`,
        app: {company: "", status: "todo", offer: -1, notes: "Parece una estafa: comprobarlo antes de hacer nada."}},
      {text: `Desarrollador/a back-end Java – Autónomo – Madrid
Tus funciones:
- Desarrollar API REST en Java con Spring Boot
- Escribir las pruebas unitarias y participar en las revisiones de código
- Trabajar con bases de datos PostgreSQL
Tu perfil: 4 años de desarrollo en Java, Git, inglés.`,
        app: {company: "Ejemplo Software", status: "refused", offer: -45, applied: -40, notes: "Rechazada: querían más experiencia en Java.", hist: [["sent", -40], ["refused", -25]]}}
    ],
    manual: [
      {job: "Administrador cloud", company: "Ejemplo Hosting", status: "offer", offer: -30, applied: -28, contact: "Sara Lorenzo · s.lorenzo@example.com", notes: "Oferta recibida: 44.000 €. Responder antes del viernes.", hist: [["sent", -28], ["interview", -14], ["offer", -3]]},
      {job: "Responsable de infraestructura", company: "Ejemplo Banco", status: "silent", offer: -60, applied: -55, notes: "Les he recordado la candidatura dos veces, sin respuesta.", hist: [["sent", -55], ["followup", -40], ["silent", -20]]}
    ],
    prep: {g1: "Ingeniero informático desde hace 10 años: soporte, luego administración de sistemas y después 120 servidores y 800 usuarios en Ejemplo Industria. Ahora busco un puesto híbrido con más cloud.", g2: "Su paso a la nube y el tamaño de la plataforma."},
    star: {s: "Una avería del almacenamiento bloqueaba las copias de seguridad de 300 usuarios.", a: "Migré las copias a Veeam con un NAS nuevo en un fin de semana y probé las restauraciones.", r: "Ningún dato perdido, copias un 40 % más rápidas."},
    fill: ["en Ejemplo Industria, 2 proyectos en 2024"]
  },

  // Titres de rubriques du CV (texte sans accents, en minuscules)
  secs: {
    exp: "experiencias?( profesional(es)?| laboral(es)?)?|trayectoria( profesional| laboral)?|historial (laboral|profesional)|empleos?|puestos? (ocupados|desempenados)",
    skills: "competencias( clave| tecnicas| profesionales| personales)?|habilidades( tecnicas| personales| profesionales)?|aptitudes|conocimientos( tecnicos| informaticos)?|capacidades|idiomas|informatica|herramientas",
    edu: "formacion( academica| profesional| complementaria| reglada)?|educacion|estudios|titulacion(es)?|titulos|formacion y (certificaciones|cursos)|cursos( y certificaciones)?|certificaciones",
    misc: "otros( datos)?|otros datos de interes|datos de interes|informacion adicional|intereses|aficiones|perfil( profesional)?|sobre mi|resumen( profesional)?|datos personales|referencias|objetivo( profesional)?|carne de conducir|permisos?"
  },

  // Lexique : clé = point du moteur ; [nom, motif dans l'offre, exemple pour les trous, motif côté CV si plus large]
  lex: {
    // Logística, almacén
    "Préparation de commandes": ["Preparación de pedidos", "prepara\\w* (de |los )?pedidos?|preparador\\w* de pedidos|picking", "120 pedidos al día", "pedidos?|picking|prepar\\w* de pedidos"],
    "Contrôle qualité": ["Control de calidad", "control(es)? (de )?(la )?calidad|control de (los )?productos", "comprobación de fechas y cantidades"],
    "Réception des marchandises": ["Recepción de mercancías", "recepcion (de )?(la |las |los )?(mercancias?|pedidos|material|paquetes|palets|entregas)|recepcion y (colocacion|ubicacion|almacenaje)|descarga de (camiones|mercancias?)", "30 palés al día", "recepcion|descarga|colocacion de (la )?mercancia|mercancias?"],
    "Gestion des stocks": ["Gestión de stock", "gestion (de(l)? )?(stocks?|existencias)|control (de(l)? )?(stocks?|existencias)|reposicion de (stock|existencias)|reaprovisionamiento", "pedido a proveedores cada semana"],
    "Inventaires": ["Inventarios", "inventarios?|recuentos? de (stock|existencias)", "inventario anual de 3.000 referencias"],
    "CACES (chariot élévateur)": ["Carné de carretillero", "carretiller\\w*|carretillas? elevadoras?|toro mecanico|transpaletas?|apiladoras?", "carretilla frontal y retráctil, 2023"],
    "Expédition et emballage": ["Expedición y embalaje", "expedicion(es)?|embala\\w*|empaquet\\w*|envasado", "200 paquetes al día"],
    "Manutention": ["Manipulación de cargas", "manipulacion de (cargas|mercancias?)|carga y descarga|cargas pesadas|mozo de carga", "carga de camiones"],
    // Venta, comercio
    "Encaissement": ["Cobro en caja", "cajer[oa]s?|\\bcobros? en caja|\\bcobrar\\b|manejo de caja|\\bcaja\\b|\\btpv\\b", "hasta 300 clientes al día", "cajer\\w*|\\bcobr\\w*|\\bcaja\\b|\\btpv\\b"],
    "Accueil des clients": ["Atención al público", "atencion al publico|acogida de (clientes|pacientes|visitantes)|recib\\w* a (los )?(clientes|visitantes|pacientes)|dar la bienvenida", "80 clientes al día", "atencion|atend\\w*|recib\\w*"],
    "Conseil client": ["Asesoramiento al cliente", "asesora\\w* (a )?(los )?clientes|asesoramiento (al cliente|comercial|de producto)|aconsejar (a )?(los )?clientes", "consejos sobre productos frescos", "asesor\\w*|aconsej\\w*"],
    "Vente": ["Venta", "\\bventas?\\b|\\bvender\\b|vendedor\\w*|(?<!persona |personas |mayores y )dependient[ea]s?\\b|objetivos (de venta|comerciales)", "objetivo mensual cumplido 10 meses de 12", "venta|vend\\w*|(?<!persona |personas |mayores y )dependient"],
    "Mise en rayon": ["Reposición", "reponedor\\w*|reposicion (de|en) (los )?lineales|colocacion (de|en) (los )?lineales|\\blineales\\b|merchandising", "lineal de frescos cada mañana", "reposi\\w*|reponedor\\w*|lineales?"],
    "Relation client": ["Atención al cliente", "atencion al cliente|servicio al cliente|satisfaccion del cliente|fidelizacion|reclamaciones|quejas|devoluciones|postventa", "gestión de reclamaciones"],
    "Prospection": ["Prospección", "prospecci\\w*|captacion de (nuevos )?clientes|nuevos clientes|puerta fria", "20 clientes nuevos en un año"],
    "Négociation": ["Negociación", "negocia\\w*", "negociación con 15 proveedores"],
    // Cuidados, salud, infancia
    "Accompagnement des personnes âgées": ["Atención a personas mayores", "personas mayores|tercera edad|geriatri\\w*|residencias? de mayores|personas dependientes|(situacion|grado|ley) de dependencia", "6 personas atendidas cada semana"],
    "Aide à domicile": ["Ayuda a domicilio", "ayuda a domicilio|auxiliar de ayuda a domicilio|\\bsad\\b|atencion domiciliaria|cuidador\\w*|atencion sociosanitaria", "visitas a 6 personas"],
    "Aide à la toilette": ["Higiene personal", "higiene personal|\\baseo( personal)?\\b|ayuda (para|en) (el aseo|levantarse|acostarse)", "ayuda para levantarse y asearse"],
    "Préparation des repas": ["Preparación de comidas", "preparacion de (las )?comidas|preparar (las )?comidas|elaboracion de comidas|dar de comer", "comidas para 4 personas"],
    "Garde d'enfants": ["Cuidado de niños", "cuidado de (los )?ninos|educacion infantil|guarderia|escuela infantil|canguro|ninera|monitor\\w* de comedor", "3 niños de 2 a 8 años"],
    "Diplôme d'aide-soignant": ["Título de TCAE (auxiliar de enfermería)", "\\btcae\\b|auxiliar(es)? de enfermeria|cuidados auxiliares de enfermeria", "obtenido en 2021"],
    "Soins infirmiers": ["Enfermería", "(?<!auxiliar de |auxiliares de |cuidados auxiliares de )enfermer(o|a|os|as|ia)\\b|grado en enfermeria", "colegiada desde 2019"],
    // Hostelería, limpieza
    "Service en salle": ["Servicio en sala", "servicio (en|de) (sala|mesas|terraza)|camarer[oa]s?\\b(?! de pisos)|jefe de rango|toma de comandas", "60 cubiertos por noche"],
    "Cuisine": ["Cocina", "\\bcocina\\b|cociner[oa]s?|ayudante de cocina|\\bpinche\\b|elaboracion de platos", "mise en place para 80 cubiertos"],
    "Règles d'hygiène (HACCP)": ["Higiene alimentaria (APPCC)", "\\bappcc\\b|manipulador(a)? de alimentos|higiene alimentaria|seguridad alimentaria", "carné de manipulador de alimentos, 2022"],
    "Plonge": ["Friegaplatos", "friega\\w*|lavaplatos|limpieza de (la )?vajilla", "100 cubiertos"],
    "Bar": ["Barra", "\\bbarra\\b|barista|cocteler\\w*|cocteles", "bebidas calientes"],
    "Réception hôtelière": ["Recepción de hotel", "recepcionista|recepcion (de hotel|hotelera)|check-?in|\\breservas\\b", "recepción y reservas, 40 habitaciones"],
    "Entretien et nettoyage": ["Limpieza", "limpieza|limpiador\\w*|camarer[oa]s? de pisos", "limpieza de 800 m² de oficinas"],
    // Construcción, industria, técnica
    "Lecture de plans": ["Lectura de planos", "lectura de planos|leer (e interpretar )?planos|interpretacion de planos|planos tecnicos", "planos de obra"],
    "Habilitation électrique": ["Habilitación eléctrica", "habilitacion electrica|riesgo electrico|trabajos en tension|instalador autorizado", "2024"],
    "Électricité": ["Electricidad", "electricist\\w*|instalaciones electricas|cableado|cuadros electricos|electricidad", "cableado de cuadros eléctricos"],
    "Plomberie et chauffage": ["Fontanería y calefacción", "fontaner\\w*|calefaccion|climatizacion|instalaciones sanitarias", "instalación de baños"],
    "Maçonnerie": ["Albañilería", "albanil\\w*|encofrad\\w*|hormigon\\w*", "encofrado y hormigonado de forjados"],
    "Peinture": ["Pintura", "pintor\\w*|pintura", "10 pisos reformados"],
    "Travail en hauteur": ["Trabajos en altura", "trabajos? en altura|plataformas? elevadoras?|andamios?|\\barnes\\b", "PEMP, 2023"],
    "Règles de sécurité": ["Prevención de riesgos laborales", "prevencion de riesgos( laborales)?|\\bprl\\b|normas de seguridad|seguridad laboral|\\bepis\\b", "cero accidentes en 3 años"],
    "Conduite de machines": ["Manejo de maquinaria", "manejo de maquinaria|operari[oa]s? de (produccion|maquinas?|linea)|lineas? de produccion|maquinas? de produccion", "línea de envasado"],
    "Soudure": ["Soldadura", "soldad\\w*|soldar", "soldadura MIG y TIG"],
    "Maintenance": ["Mantenimiento", "mantenimiento|\\breparacion(es)?\\b|\\baverias\\b", "mantenimiento preventivo de 20 máquinas"],
    "Mécanique": ["Mecánica", "mecanic[oa]s?|mecanica|electromecanic\\w*", "mantenimiento de vehículos ligeros"],
    // Oficina, administración
    "Accueil téléphonique": ["Atención telefónica", "atencion telefonica|centralita|llamadas( telefonicas)?|telefonista|por telefono", "50 llamadas al día", "telefon\\w*|centralita|llamadas?"],
    "Pack Office": ["Paquete Office", "paquete office|ofimatica avanzada", "cartas en Word, correos en Outlook"],
    "Excel": ["Excel", "hojas? de calculo", "hoja de seguimiento de pedidos"],
    "Outils informatiques": ["Herramientas informáticas", "ofimatica|herramientas informaticas|conocimientos (de )?informatica|manejo (del |de )?(ordenador|pc)|informatica a nivel usuario", "Word, correo, tablas sencillas", "informatica|ofimatica|\\bword\\b|excel|hojas? de calculo|office|ordenador|programas?"],
    "Saisie de données": ["Introducción de datos", "introduccion de datos|grabacion de datos|entrada de datos|mecanografia", "albaranes de entrega"],
    "Gestion d'agenda": ["Gestión de agendas", "gestion de (la )?agendas?|\\bagendas?\\b|concertar citas|gestion de citas", "agenda de 3 médicos"],
    "Rédaction de courriers": ["Redacción de cartas", "redaccion de (cartas|correos|informes|actas)|correspondencia|\\bactas\\b", "cartas a clientes"],
    "Facturation": ["Facturación", "factur\\w*|presupuestos", "100 facturas al mes"],
    "Comptabilité": ["Contabilidad", "contab\\w*|conciliacion bancaria|asientos contables", "asientos contables"],
    "Paie": ["Nóminas", "\\bnominas?\\b|seguros sociales", "nóminas de 40 personas"],
    "Classement et archivage": ["Archivo y clasificación", "archiv\\w*|clasificacion de documentos|gestion documental", "archivo de expedientes"],
    "Logiciel de gestion (ERP)": ["Software de gestión (ERP)", "software de gestion|\\ba3\\b|navision", "SAP, pedidos y stock"],
    "Recrutement": ["Selección de personal", "seleccion de personal|reclutamiento|recursos humanos|\\brrhh\\b", "20 contrataciones al año"],
    // Informática
    "Support utilisateurs": ["Soporte a usuarios", "soporte (a |al )?(usuarios?|tecnico|informatico)|atencion a usuarios|\\bcau\\b|nivel [12]\\b|primer nivel|segundo nivel", "30 tickets al día", "soporte|help ?desk|\\bcau\\b|nivel [12]\\b|atencion a usuarios"],
    "Windows": ["Windows", "windows", "instalación de equipos con Windows 11"],
    "Linux": ["Linux", "linux", "servidores Debian"],
    "Réseaux informatiques": ["Redes informáticas", "\\bredes\\b(?! sociales)|routers?|cortafuegos de red", "VLAN y switches de una sede de 50 equipos"],
    "Active Directory": ["Active Directory", "directorio activo", "cuentas y permisos de 300 usuarios"],
    "Cybersécurité": ["Ciberseguridad", "ciber\\w*|seguridad informatica|cortafuegos|antivirus", "puesta en marcha de un cortafuegos"],
    "Administration des serveurs": ["Administración de servidores", "administra\\w* (de )?(los )?(servidores|sistemas)|administracion de sistemas|servidores (windows|linux)", "15 servidores Windows y Linux", "servidores?|windows server|administracion de sistemas|vmware|hyper-v|proxmox"],
    "Virtualisation": ["Virtualización", "virtualiza\\w*", "VMware, 20 máquinas virtuales"],
    "Sauvegardes et restauration": ["Copias de seguridad", "copias? de seguridad|respaldos?|restaura\\w* (de )?(los )?datos|recuperacion de datos", "copia diaria de 10 servidores", "copias? de seguridad|backups?|restaura\\w*|veeam"],
    "Supervision": ["Monitorización", "zabbix|nagios|centreon|\\bprtg\\b|monitoriza\\w*|supervisi\\w* de (sistemas|redes|la infraestructura)", "50 equipos monitorizados", "monitoriz\\w*|supervis\\w*|zabbix|nagios|prtg"],
    "Gestion des incidents (ITIL)": ["Gestión de incidencias (ITIL)", "gestion de incidencias|incidencias", "30 tickets al día", "incidencias?|tickets?|\\bitil\\b|soporte"],
    "Comptes et droits d'accès": ["Cuentas y permisos de acceso", "cuentas (de )?(los )?usuarios?|permisos de acceso|control de accesos?|gestion de (accesos|identidades)|cuentas y (los )?permisos", "cuentas y permisos de 300 usuarios", "cuentas|permisos|accesos?|active directory|directorio activo|entra|\\bmfa\\b"],
    "Déploiement de logiciels": ["Despliegue de software", "despliegues? (de )?(software|aplicaciones|equipos|puestos)|desplegar (el |los )?(software|aplicaciones|equipos)|implantacion de (software|aplicaciones)|maquetacion de equipos", "300 equipos desplegados", "despleg\\w*|desplieg\\w*|implant\\w*|intune|sccm|maquet\\w*"],
    "Gestion de parc": ["Gestión del parque informático", "parque informatico|inventario de equipos|gestion de activos", "parque de 500 equipos"],
    "Documentation technique": ["Documentación técnica", "documentacion tecnica|redact\\w* (la )?documentacion|procedimientos tecnicos|base de conocimiento", "procedimientos para el equipo de soporte", "documentacion|procedimientos?|wiki"],
    "Veille technologique": ["Vigilancia tecnológica", "vigilancia tecnologica|estar al dia|actualizacion tecnologica", "revisión semanal de seguridad"],
    "Relation avec les prestataires": ["Relación con proveedores", "proveedores|subcontrat\\w*|empresas externas", "seguimiento de 10 proveedores"],
    "Politique de sécurité (PSSI)": ["Política de seguridad", "politicas? de seguridad( de la informacion)?|\\bsgsi\\b|esquema nacional de seguridad", "redacción de la política de seguridad", "politicas? de seguridad|\\bsgsi\\b|\\bens\\b|nis ?2"],
    "Conformité (RGPD, NIS2…)": ["Cumplimiento normativo (RGPD, NIS2…)", "cumplimiento normativo|\\blopd(gdd)?\\b|proteccion de datos", "adaptación a NIS2", "\\brgpd\\b|\\blopd\\w*|cumplimiento|nis ?2|iso ?27001|proteccion de datos"],
    "Sensibilisation des utilisateurs": ["Concienciación de usuarios", "concienciacion|sensibilizacion|formacion en ciberseguridad", "formación a 300 empleados"],
    "Continuité d'activité (PCA/PRA)": ["Continuidad de negocio", "continuidad de negocio|plan de continuidad|recuperacion ante desastres|plan de contingencia", "plan de recuperación probado cada año"],
    "Gestion de crise": ["Gestión de crisis", "gestion de crisis|situaciones de crisis|comite de crisis", "comité de crisis durante un ciberataque"],
    "Transformation numérique": ["Transformación digital", "transformacion digital|digitaliza\\w*|herramientas digitales", "facturación sin papel", "transformacion digital|digitaliz\\w*|digital|moderniz\\w*"],
    "Python": ["Python", "python", "scripts de automatización"],
    "JavaScript": ["JavaScript", "javascript", "web en React"],
    "HTML / CSS": ["HTML / CSS", "\\bhtml\\b", "páginas web adaptables"],
    "SQL": ["SQL", "bases? de datos", "consultas a una base de clientes"],
    "Cloud": ["Nube (cloud)", "\\bnube\\b", "migración a Microsoft 365"],
    "Gestion de projet": ["Gestión de proyectos", "gestion de proyectos?|jefe de proyectos?|direccion de proyectos?|liderar (los )?proyectos?|project manager", "proyecto de 6 meses, 3 personas", "gestion de proyectos?|jefe de proyectos?|proyectos?"],
    "Management d'équipe": ["Gestión de equipos", "gestion de equipos?\\b(?! informaticos)|liderazgo de equipos?|dirigir (un |el )?equipo|coordinar (un |el )?equipo|jefe de equipo|responsable de equipo|encargad[oa] de tienda", "equipo de 5 personas"],
    // Cualidades y condiciones, todas las profesiones
    "Permis B": ["Carné de conducir B", "carne de conducir|carnet de conducir|permiso de conducir|\\bcarne b\\b|\\bcarnet b\\b|\\bpermiso b\\b|vehiculo propio", "desde 2018", "carne|carnet|permiso de conducir|vehiculo propio"],
    "Travail en équipe": ["Trabajo en equipo", "trabajo en equipo|trabajar en equipo|espiritu de equipo", "equipo de 6 personas", "en equipo|equipo de|espiritu de equipo"],
    "Autonomie": ["Autonomía", "autonomia|capacidad de trabajar sol[oa]|iniciativa propia|por tu cuenta", "sola en la apertura de la tienda"],
    "Rigueur": ["Rigor", "\\brigor\\b|riguros\\w*|meticulos\\w*|minucios\\w*|atencion al detalle|exactitud", "cero errores de pedido en 2024"],
    "Ponctualité": ["Puntualidad", "puntual\\w*|asiduidad", "apertura a las 6 h durante 2 años", "puntual|apertura|[4-7] ?h\\b|a las [4-7]\\b"],
    "Sens de l'organisation": ["Organización", "capacidad de organizacion|organizad[oa]s?\\b|buena organizacion|metodic[oa]s?\\b|\\borganizacion\\b", "horario de 4 personas", "organiz\\w*|planific\\w*|metodic\\w*"],
    "Sens du contact": ["Don de gentes", "don de gentes|trato (con el )?(cliente|publico)|habilidades sociales|\\bsociable\\b|\\bamable\\b|sonrisa|buena presencia", "80 clientes al día"],
    "Polyvalence": ["Polivalencia", "polivalen\\w*|versatil\\w*", "caja, reposición y recepción según el día"],
    "Dynamisme": ["Dinamismo", "dinamismo|dinamic[oa]s?\\b|proactiv\\w*", "hora punta del sábado"],
    "Gestion du stress": ["Trabajo bajo presión", "bajo presion|\\bestres\\b|picos de trabajo|alta afluencia|resistencia a la presion", "servicio del sábado noche"],
    "Écoute": ["Escucha y empatía", "escucha\\w*|empati\\w*|paciencia|vocacion de servicio", "atención a personas mayores"],
    "Discrétion": ["Discreción", "discrecion|discret[oa]s?\\b|confidencialidad", "historias clínicas"],
    "Adaptabilité": ["Adaptabilidad", "adaptabilidad|capacidad de adaptacion|adaptarse|flexibilidad", "cambios de puesto cada semana"],
    "Communication": ["Comunicación", "habilidades (de comunicacion|comunicativas)|capacidad de comunicacion|buena comunicacion|expresion (oral|escrita)|ortografia", "informe semanal"],
    "Anglais": ["Inglés", "\\bingles\\b", "nivel B1"],
    "Espagnol": ["Español", "\\bespanol\\b|castellano", "nativo"],
    "Allemand": ["Alemán", "\\baleman\\b", "básico"],
    "Horaires décalés": ["Horarios por turnos", "turnos?\\b|nocturn\\w*|fines? de semana|festivos|domingos|\\bguardias\\b|disponibilidad horaria|horario partido", "", "turnos?|noches?|fines? de semana|festivos|domingos|apertura|cierre|[4-7] ?h\\b|a las [4-7]\\b"],
    "Premiers secours (SST)": ["Primeros auxilios", "primeros auxilios|socorrista|soporte vital basico", "curso de primeros auxilios, 2023"],
    "BAFA": ["Título de monitor de tiempo libre", "monitor\\w* de (ocio y )?tiempo libre|director\\w* de (ocio y )?tiempo libre", "obtenido en 2022"]
  },

  // Motifs de l'analyse (texte sans accents, en minuscules)
  re: {
    // Message d'erreur à l'étape de l'offre : « ton CV » devient « l'offre »
    cvWord: "tu CV", offerWord: "la oferta",
    // Annonce de bureau ou d'informatique : on propose de demander pour le télétravail
    office: "informati|oficina|software|datos|desarroll|contab|administrativ",
    to: "hasta|al",
    now: "actualidad|actualmente|actual|hoy|la fecha",
    years: "(\\d{1,2})\\+?\\s*(?:a\\s*\\d{1,2}\\s*)?anos? (?:de )?experiencia|experiencia (?:minima |demostrable |previa )?(?:de )?(?:al menos )?(\\d{1,2})\\+? anos?|(\\d{1,2})\\+?\\s*(?:years?|yrs?)\\s*(?:of\\s+)?(?:[a-z-]+\\s+){0,3}?experience|al menos (\\d{1,2}) anos?|(\\d{1,2}) ans? (?:d'|de )?experience",
    yearsWord: "anos?",
    // Mots très courants de l'espagnol (un mot par alternative) : reconnaître la langue du CV
    langWords: "el|los|las|y|con|para|del|por|una|un|en",
    // Marqueur de l'offre d'exemple, retiré des titres
    sample: "\\s*\\(ejemplo ficticio\\)",
    // Mots de diplôme : le point va sous « Formación »
    eduWords: "t[ií]tulo|grado|bachillerato|\\bfp\\b|ciclo formativo|m[aá]ster|licenciatura|diplomatura|doctorado|certificado de profesionalidad|\\btcae\\b",
    // Mention de genre dans les titres d'annonce : (H/M), (M/F)
    gender: "\\(?\\s*(h\\s*\\/\\s*m|m\\s*\\/\\s*h|m\\s*\\/\\s*f|f\\s*\\/\\s*m)\\s*\\)?",
    diploma: "\\b(graduado (?:escolar|en eso)|titulo de (?:la )?eso|bachillerato|fp (?:basica|de grado (?:medio|superior)|dual)|ciclo formativo(?: de grado (?:medio|superior))?|grado (?:medio|superior)|tecnico superior|grado universitario|grado en [a-z]+|licenciatura|diplomatura|master|doctorado|certificado de profesionalidad)\\b",
    must: "imprescindible|obligatori[oa]|requisito|necesari[oa]|indispensable|se requiere",
    nice: "se valora\\w*|valorable|deseable|sera un plus|preferiblemente|idealmente",
    notSkill: "salario|sueldo|retribucion|remuneracion|€|\\bcontrato\\b|jornada|beneficios|seguro medico|ofrecemos|envia\\w* (tu|el) (cv|curriculum)|curriculum|incorporacion|ubicacion|lugar de trabajo|somos (una|un|la|el)|nuestra (empresa|compania)|buscamos|tipo de contrato|horario:",
    place: "ubicaci[oó]n|lugar de trabajo|localidad|ciudad|provincia",
    weak: "\\b(participar en|participacion en|ayudar a|ayuda en|encargad[oa] de|responsable de|tareas varias|diversas tareas|varias tareas|colaborar en|etc\\.?)(?=\\W|$)",
    ad_salary: "(?:^|\\s)\\d[\\d.]*(?:,\\d{1,2})?\\s?(?:k ?€|€|euros?)(?:\\s?(?:brut|net)[oa]s?)?(?:\\s?(?:(?:al|por|a la|\\/)\\s?(?:mes|ano|hora|semana|dia)|anuales|mensuales|la hora))?|salario minimo interprofesional|\\bsmi\\b|segun (?:valia|experiencia|convenio)|a convenir|salario competitivo|segun tablas salariales",
    ad_contract: "\\b(?:contrato )?(?:indefinido|temporal|fijo discontinuo|de practicas|en practicas|de formacion|por obra|de relevo|eventual|de interinidad)\\b(?: de \\d+ meses| \\d+ meses)?|\\bett\\b|\\bautonomo\\b|\\bbeca\\b",
    ad_hours: "\\b\\d{2}(?:,\\d)? ?horas(?: (?:semanales|a la semana|por semana|\\/semana))?|jornada (?:completa|parcial|intensiva|continua)|media jornada|tiempo (?:completo|parcial)",
    ad_remote: "teletrabajo(?: (?:\\d+ dias(?: (?:a|por) (?:la )?semana)?|parcial|total|flexible))?|en remoto|\\bremoto\\b|hibrid[oa]|desde casa",
    ad_start: "incorporacion (?:inmediata|en [^\\n,.]{3,20}|el [^\\n,.]{3,20})|lo antes posible|cuanto antes|a la mayor brevedad",
    flag_pay: "(?:cuota|tasa|gastos|pago) (?:de )?(?:inscripcion|alta|formacion|matricula)|pagar (?:una|la|el|los|tu|su) (?:cuota|formacion|kit|matricula|fianza|material|inscripcion)|kit de (?:inicio|bienvenida)|pago (?:previo|por adelantado|anticipado)|fianza de|\\bbizum\\b|paysafecard",
    flag_data: "datos bancarios|numero de cuenta|copia (?:de )?(?:tu |su |del )?(?:dni|nie|pasaporte)|numero de (?:la )?seguridad social|tarjeta sanitaria|foto (?:de tu|del) dni",
    flag_tooGood: "(?:gana|ganar|ganaras|ingresos de|cobra) (?:hasta |mas de )?\\d[\\d.]*\\s?(?:€|euros?) (?:al|por|a la|\\/) ?(?:dia|semana)|dinero facil|ingresos (?:garantizados|ilimitados)",
    flag_mlm: "se tu propi[oa] jef[ea]|marketing multinivel|multinivel|venta directa|solo (?:a )?comision",
    flag_mail: "[\\w.+-]+@(?:telefonica|movistar|terra|ya)\\.[a-z.]+"
  },

  // Mots vides (une chaîne : le moteur la coupe aux espaces)
  stop: "para como con los las del una unos unas por que este esta estos estas sobre entre desde hasta tambien muy mas menos sera eres tiene tienen tener hacer todo todos toda todas cada otros otras otro otra nuestro nuestra nuestros nuestras tus sus puesto puestos funcion funciones tareas perfil buscamos busca buscando requisitos requisito experiencia anos minimo minima maximo deseable valorable imprescindible necesario necesaria conocimiento conocimientos capacidad dominio valora valorar realizar llevar cabo gestionar asegurar participar garantizar segun dentro ofrecemos incorporacion contrato jornada salario empresa tanto bien buen buena buenas buenos nivel area zona forma cualquier donde cuando mientras hacia",
  // Familles de mots proches (racines de 6 lettres au plus, sans accents)
  syn: [
    "almace logist bodega", "client consum usuari", "entreg repart", "conduc chofer", "limpie limpia", "pacien enferm reside",
    "ninos menore alumno infant", "equipo compan colabo", "inform digita ordena", "docume proced", "monito superv", "respal copias backup",
    "instal despli despl", "config parame", "redes networ", "servid server", "seguri ciber", "incide averia ticket",
    "proyec project", "venta vender vended comerc", "cajero cobro", "tienda superm establ", "cocina cocine", "camare servic",
    "pedido comand", "hostel restau bar cafete hotel camare", "repara manten averia", "planif agenda calend", "atenci atende", "coloca reposi ubicac"
  ],
  // Lignes de sites d'emploi à retirer (texte sans accents)
  junk: [
    "inscribirme( en (esta|la) oferta)?", "inscribirse", "inscribete", "aplicar( ahora)?", "postular(me)?", "enviar (cv|candidatura|curriculum)",
    "guardar( oferta)?", "compartir( oferta)?", "denunciar( (oferta|anuncio))?", "ver (mas|menos|la oferta|todas las ofertas|empresa|perfil)",
    "mostrar (mas|menos)", "leer mas", "volver( a los resultados| al listado)?", "volver arriba", "ofertas similares", "empleos similares",
    "iniciar sesion", "acceder", "registrarse", "registrate", "crear (cuenta|alerta|mi cv)", "aceptar( todas)?( las cookies)?.*", "rechazar( todas)?.*",
    "configurar.*cookies.*", "politica de privacidad", "aviso legal", "terminos y condiciones.*", "publicada (hace|el|hoy|ayer).*",
    "actualizada (hace|el).*", "hace \\d+ (minutos?|horas?|dias?|semanas?|meses)", "hoy", "ayer", "\\d+ inscritos?.*", "\\d+ candidatos?.*",
    "infojobs", "infoempleo", "tecnoempleo", "jobandtalent", "sepe", "empleate", "urgente", "nueva oferta", "inicio", "buscar", "ayuda",
    "siguiente", "anterior", "pagina \\d+( de \\d+)?"
  ],
  // Fautes fréquentes dans un CV espagnol (surtout les accents oubliés)
  typos: {
    formacion: "formación", informacion: "información", atencion: "atención", gestion: "gestión", comunicacion: "comunicación",
    organizacion: "organización", educacion: "educación", administracion: "administración", preparacion: "preparación",
    recepcion: "recepción", reposicion: "reposición", telefono: "teléfono", electronico: "electrónico", informatica: "informática",
    basico: "básico", tecnico: "técnico", dinamico: "dinámico", academica: "académica", almacen: "almacén", camion: "camión",
    abilidades: "habilidades", esperiencia: "experiencia", experencia: "experiencia",
    responsavilidad: "responsabilidad", conocimentos: "conocimientos", desarollo: "desarrollo", proffesional: "profesional"
  },

  help: {
    mid: "Está en tu CV, pero sin ejemplo. Añade un hecho concreto: una cifra, un lugar, una duración.",
    no: "La oferta lo pide. Si ya lo has hecho, aunque sea en un trabajo de verano, unas prácticas o un voluntariado, añádelo.",
    s: "La oferta lo pide. Demuéstralo con un hecho en alguna experiencia, no solo con una palabra."
  },

  // Lettre de motivation (même forme que la version anglaise de js/app.js)
  letter({job, at, why, L, gaps}){
    const when = d => L.when ? L.when.trim() : d;
    return {
      classic: {subj: `Asunto: candidatura al puesto de ${job}`, open: `He leído con mucho interés su oferta para el puesto de ${job}${at}.${why}`, intro: "Esto es lo que puedo aportar:", extra: "", close: `Estoy disponible ${when("en breve")} y me encantaría reunirme con ustedes para hablarlo.`, bye: "Atentamente,"},
      dynamic: {subj: `Asunto: candidatura «${job}»`, open: `Su oferta para el puesto de ${job}${at} me ha dado ganas de escribirles enseguida.${why}`, intro: "Lo que aporto, en concreto:", extra: "", close: `Estoy disponible ${when("desde ya")} y me encantaría contárselo en persona.`, bye: "Un cordial saludo,"},
      change: {subj: `Asunto: candidatura al puesto de ${job} (cambio de profesión)`, open: `Quiero poner mi experiencia al servicio de una nueva profesión, y su oferta para el puesto de ${job}${at} encaja justo con este proyecto.${why}`, intro: "Lo que me ha enseñado mi trayectoria y puedo aprovechar en este puesto:", extra: gaps.length ? `Estoy dispuesto/a a formarme en lo que todavía no conozco, como ${gaps.join(" y ")}.` : "Estoy dispuesto/a a formarme en lo que todavía no conozco.", close: `Estoy disponible ${when("en breve")} y me encantaría reunirme con ustedes para hablarlo.`, bye: "Atentamente,"},
      study: {subj: `Asunto: candidatura para prácticas o FP dual: ${job}`, open: `Busco unas prácticas o una plaza de FP dual [indica cuál, con las fechas o el horario y tu centro de estudios] como ${job}${at}.${why}`, intro: "Lo que ya puedo aportar:", extra: "Tengo muchas ganas de aprender sobre el terreno y de crecer con su equipo.", close: `Estoy disponible ${when("en breve")} y me encantaría reunirme con ustedes para hablarlo.`, bye: "Atentamente,"}
    };
  },

  // Modèles de mails (même forme que la version anglaise de js/outils.js)
  mails({job, at, sentOn}){
    return {
      followup: [`Seguimiento de mi candidatura: ${job}`, `Me pongo en contacto con ustedes en relación con mi candidatura al puesto de ${job}${at}${sentOn}. Este puesto me sigue interesando mucho y quedo a su disposición para hablar cuando les venga bien.`],
      thanks: [`Gracias por la entrevista: ${job}`, `Muchas gracias por el tiempo que me dedicaron. Nuestra conversación ha confirmado mi interés por el puesto de ${job}${at}. [Lo que te gustó de la entrevista]\n\nQuedo a su disposición para cualquier información adicional.`],
      accept: [`Acepto su oferta: ${job}`, `Muchas gracias por su oferta para el puesto de ${job}${at}. Me alegra mucho aceptarla. ¿Podrían indicarme los siguientes pasos (contrato, fecha de incorporación, documentos que debo aportar)?`],
      decline: [`Su oferta: ${job}`, `Muchas gracias por su oferta para el puesto de ${job}${at}. Después de pensarlo bien, he decidido no seguir adelante. He disfrutado mucho de nuestras conversaciones y espero que volvamos a coincidir.`],
      feedback: [`Valoración de mi candidatura: ${job}`, `Gracias por informarme de su decisión sobre el puesto de ${job}${at}. Para poder mejorar, ¿podrían dedicarme unos minutos y decirme qué le faltó a mi candidatura?`]
    };
  },

  // Pitch d'une minute (même résultat que la version anglaise de js/outils.js)
  pitch({name, title, yrs, top, proof, co, job}){
    // Nom commun en minuscule au milieu d'une phrase, sauf logiciels, sigles et noms propres
    const low = k => /^(Windows|Linux|Active Directory|Python|JavaScript|HTML|SQL|Excel|Paquete Office|Inglés|Español|Alemán|Carné|Título)/.test(k) || /^[A-Z]{2,}/.test(k) ? k : k.charAt(0).toLowerCase() + k.slice(1);
    return [
      `Me llamo ${name}.`,
      title ? `Soy ${title.charAt(0).toLowerCase() + title.slice(1)}${yrs ? `, con unos ${yrs} de experiencia` : ""}.` : "[Lo que haces hoy, en una frase.]",
      top.length ? `Mis puntos fuertes: ${top.map(low).join(" y ")}.` : "[Lo que mejor se te da.]",
      proof ? `Por ejemplo: ${proof.charAt(0).toLowerCase() + proof.slice(1)}.` : "[Un ejemplo con una cifra.]",
      `Hoy me gustaría incorporarme a ${co || "su empresa"} como ${job} porque [tu motivo].`
    ].join(" ");
  },

  // Bruto → neto en España (estimación 2025) : Seguridad Social del trabajador + IRPF (escala estatal + autonómica media)
  salary(h){
    const {$, $$, num, show, fill, parseSalary, fold} = h;
    const BASE_MAX = 4909.5 * 12;                     // base máxima de cotización 2025, en 12 meses (pagas extra prorrateadas)
    const SS = {ind: .0648, tmp: .0653};              // 4,70 % comunes + 1,55 % (1,60 % temporal) desempleo + 0,10 % FP + 0,13 % MEI
    const SCALE = [[12450, .19], [20200, .24], [35200, .30], [60000, .37], [300000, .45], [Infinity, .47]];
    const scale = b => { let t = 0, lo = 0; for (const [hi, r] of SCALE) { if (b <= lo) break; t += (Math.min(b, hi) - lo) * r; lo = hi; } return t; };
    // Reducción por obtención de rendimientos del trabajo (art. 20 LIRPF, desde 2024)
    const reduc = rn => rn <= 14852 ? 7302 : rn <= 17673.52 ? 7302 - 1.75 * (rn - 14852) : rn <= 19747.5 ? 2364.34 - 1.14 * (rn - 17673.52) : 0;
    const MINIMO = 5550, GASTOS = 2000;
    let hours = 40, pagas = 14, ctr = "ind", base = {k: "ya", v: 0};
    function taxes(ga){
      const ss = Math.min(ga, BASE_MAX) * SS[ctr], rn = Math.max(0, ga - ss - GASTOS);
      const bl = Math.max(0, rn - reduc(rn));
      // Deducción 2025 para salarios cercanos al SMI (16.576 € al año): hasta 340 €
      const ded = ga <= 16576 ? 340 : ga <= 18276 ? 340 - .2 * (ga - 16576) : 0;
      const irpf = Math.max(0, scale(bl) - scale(MINIMO) - ded);
      return {ss, irpf, net: ga - ss - irpf};
    }
    // Neto → bruto : se busca el bruto que da ese neto
    const grossOf = n => { let lo = 0, hi = Math.max(1000, n * 3); for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (taxes(m).net < n) lo = m; else hi = m; } return (lo + hi) / 2; };
    const perYear = () => hours * 52;
    function calc(){
      const {k, v} = base;
      const ga = k === "ya" ? v : k === "ma" ? v * pagas : k === "ha" ? v * perYear() : k === "yn" ? grossOf(v) : k === "mn" ? grossOf(v * pagas) : k === "hn" ? grossOf(v * perYear()) : 0;
      const t = ga ? taxes(ga) : {ss: 0, irpf: 0, net: 0}, H = perYear();
      const out = {ha: H ? ga / H : 0, ma: ga / pagas, ya: ga, hn: H ? t.net / H : 0, mn: t.net / pagas, yn: t.net};
      Object.entries(out).forEach(([id, x]) => { if (id !== k || document.activeElement !== $("#" + id)) $("#" + id).value = show(x); });
      $("#ss").textContent = (show(t.ss) || "0") + " €"; $("#irpf").textContent = (show(t.irpf) || "0") + " €";
      $("#rate").textContent = ga ? `${show(Math.round(t.irpf / ga * 1000) / 10) || "0"} %` : "0 %";
      $("#pmn").textContent = show(t.net / pagas) || "0"; $("#pan").textContent = show(t.net) || "0";
      $("#pmn12").textContent = show(t.net / 12) || "0";
      $("#hoursv").textContent = String(hours).replace(".", ",") + " h";
      $("#sum").textContent = ga ? `${show(ga)} € brutos al año son unos ${show(t.net / pagas)} € netos por paga (${pagas} pagas al año).` : "Rellena una casilla: las demás se calculan solas.";
    }
    document.addEventListener("input", e => {
      const t = e.target;
      if (t.matches(".money")) { base = {k: t.id, v: num(t.value)}; return calc(); }
      if (t.id === "hours") { hours = +t.value; return calc(); }
    });
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-pg], [data-ct]"); if (!b) return;
      if (b.dataset.pg) { pagas = +b.dataset.pg; $$("[data-pg]").forEach(x => x.setAttribute("aria-pressed", x === b)); }
      if (b.dataset.ct) { ctr = b.dataset.ct; $$("[data-ct]").forEach(x => x.setAttribute("aria-pressed", x === b)); stat("salaire-statut", {st: ctr}); }
      calc();
    });
    $("#clear").addEventListener("click", () => { base = {k: "ya", v: 0}; $$(".money").forEach(i => i.value = ""); calc(); });
    // Salario leído en el anuncio (?s=…) : « 1.500 € brutos al mes », « 12,50 € la hora », « 24.000 € anuales »
    const q = new URLSearchParams(location.search).get("s"), p = q && parseSalary(q);
    if (p) {
      const f = fold(q), u = /hora|\/ ?h\b|\bh\b/.test(f) ? "h" : /\bmes\b|mensual|\/ ?mes/.test(f) ? "m" : /\bano\b|anual|\/ ?ano/.test(f) ? "a" : p.u === "w" ? "w" : p.u;
      const isNet = /\bnet[oa]s?\b/.test(f);
      if (u === "w") base = {k: isNet ? "yn" : "ya", v: p.v * 52};
      else base = {k: (u === "h" ? "h" : u === "a" ? "y" : "m") + (isNet ? "n" : "a"), v: p.v};
    }
    if (q) { $("#from").hidden = false; $("#fromv").textContent = q; }
    $("#hours").value = hours; fill();
    calc();
  }
};
