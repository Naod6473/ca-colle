# Ça colle ?

Une app web grand public qui compare une offre d'emploi et un CV, puis aide à réécrire le CV pour cette offre.

Tout se passe dans le navigateur : le CV ne quitte jamais l'appareil de la personne.

## Le parcours

1. **L'offre** : on colle le texte de l'annonce, ou on joint un PDF, un Word ou une capture. On peut garder plusieurs offres et comparer le même CV à chacune.
2. **Ton CV** : on glisse son CV (PDF, Word ou photo), le texte est lu sur place.
3. **Le résultat** : chaque point de l'annonce reçoit un tampon (✓ Ça colle, ? À préciser, ✕ Pas dans ton CV), marqué « Indispensable » ou « Un plus ». En dessous : les mots de l'annonce à reprendre, et un test « robot recruteur » (logiciels de tri des CV).
4. **Améliorer mon CV** : des phrases à trous avec les mots de l'annonce. On n'invente rien : une ligne n'entre dans le CV que si la personne la complète et clique sur « Ajouter ». Export Word, PDF ou copie.
5. **Ma lettre** : une lettre de motivation à compléter, qui ne reprend que les points forts prouvés dans le CV. Export Word, PDF ou copie.

## État actuel

- `index.html` + `css/app.css` : les 5 étapes, au style de l'accueil du portfolio (classeur coloré, une couleur par étape). On n'avance que quand l'étape d'avant est remplie ; « Essayer avec un exemple » remplit tout avec des données fictives.
- `js/lecteur.js` : lecture du CV ou de l'offre dans le navigateur. PDF (pdf.js), Word `.docx` et `.odt` (petit lecteur ZIP intégré), texte, photo ou PDF scanné (OCR Tesseract, français et anglais).
- `js/moteur.js` : dictionnaire tous métiers (compétences, savoir-être, permis, horaires, langues, diplômes, années d'expérience) plus repérage des autres lignes de l'annonce, comparaison avec le CV, phrases à trous, mots de l'annonce, test robot recruteur.
- `js/export.js` : fabrique le fichier Word (.docx) dans le navigateur, impression PDF, copie.
- `js/app.js` : l'interface, les offres multiples, la lettre, la session gardée, « Pourquoi ce tampon ? » (avec correction à la main d'un tampon ou retrait d'un point).
- `js/lang.js` : langue de l'app. `index.html` en français, `index-en.html` en anglais ; le lexique cherche les deux langues dans l'offre et le CV.
- Synonymes (`SYN` dans `js/moteur.js`) : « restauration » retrouve « brasserie », etc. La preuve affichée est la ligne du CV qui colle le mieux.
- `cleanOffer` : retire d'une annonce collée les boutons, menus et mentions des sites d'emploi.
- `js/suivi.js` : « Mes candidatures », suivi par fiche ou en tableau (date de l'offre, date de candidature, état, relance, contact, notes, historique), liste « À faire », export CSV pour un tableur, et préparation d'entretien (questions probables avec méthode STAR, export Word/PDF).
- `adCheck` (`js/moteur.js`) : « L'annonce en bref » à l'étape 3 (contrat, lieu, salaire, horaires, télétravail, début ; ce qui manque) et signaux d'arnaque (paiement, RIB ou papiers, WhatsApp, gains trop beaux, vente en réseau, adresse Gmail).
- `cvCheck` (`js/moteur.js`) : « Relecture du CV » à l'étape 4 (fautes fréquentes corrigeables en un clic, verbes faibles, phrases trop longues, expériences sans chiffre, « je » répété).
- Bilan à partager (étape 3) : résumé pour un conseiller ou un proche, en PDF, Word, texte ou mail. Pas de lien de partage : il faudrait un serveur.
- `js/confort.js` : mode confort (texte plus gros, contraste fort, moins d'animations ; réglage gardé sur l'appareil) et « Écouter le résultat » avec la voix du navigateur.
- `js/demo.js` (temporaire) : mode démo pour les tests. Taper « démo » hors d'un champ, l'écrire seul dans la case de l'offre, ou ouvrir `?demo` : profil fictif de Maurice MARCEL (ingénieur informatique), 5 offres, 7 candidatures, lettre, préparation d'entretien. À retirer avec sa ligne `<script>` et son entrée dans `sw.js`.
- `manifest.webmanifest`, `sw.js`, `icons/` : app installable sur téléphone et utilisable sans réseau après la première visite.
- `tests/` : banc de test (offres et CV fictifs, résultats attendus). `node tests/run.js` (ou `node tests/run.js en`), ou ouvrir `/tests/` dans le navigateur. À lancer après chaque changement du moteur.
- Session : rien n'est gardé par défaut. Si la case du pied de page est cochée, le CV, les offres et les réponses restent dans le navigateur (localStorage) ; un bouton efface tout.
- `fonts/` : Archivo et Figtree (licence OFL), hébergées avec l'app.
- `vendor/` : pdf.js 6.4.299 et tesseract.js 5.1.1 avec leurs licences (voir `vendor/README.txt`). Aucune requête vers un autre site.

## Lancer en local

pdf.js et Tesseract utilisent des workers, qui ne marchent pas en ouvrant le fichier directement. Il faut un petit serveur :

```sh
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000.

## À faire

- [x] Lecture réelle du CV : PDF, Word, photo, le tout en local
- [x] Repérage des points de l'annonce pour tous les métiers (dictionnaire + lignes de l'annonce)
- [x] Polices auto-hébergées (pas de requête externe, RGPD)
- [x] Export du CV et de la lettre (Word, PDF, texte)
- [x] Lettre de motivation à trous, test robot recruteur, mots de l'annonce
- [x] Plusieurs offres, session gardée sur l'appareil (au choix)
- [ ] Hébergement dans son propre LXC (Caddy, site statique)

## Principes

- Grand public : français courant, pas de jargon RH.
- Les statuts s'affichent en texte, pas seulement en couleur.
- Le CV et l'offre ne sont jamais envoyés à un serveur. Seules des statistiques anonymes passent par Umami (stats.pissits.com, sans cookie) : visites et noms d'actions via `stat()` dans `js/lang.js`, jamais de contenu. Une réécriture par IA demanderait un serveur : à décider plus tard, en option.
