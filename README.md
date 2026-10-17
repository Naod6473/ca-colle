# Ça colle ?

Une app web grand public qui compare une offre d'emploi et un CV, puis aide à réécrire le CV pour cette offre.

Tout se passe dans le navigateur : le CV ne quitte jamais l'appareil de la personne.

## Le parcours

1. **L'offre** : on colle le texte de l'annonce.
2. **Ton CV** : on glisse son CV (PDF, Word ou photo), le texte est lu sur place.
3. **Le résultat** : chaque point de l'annonce reçoit un tampon
   - ✓ **Ça colle** : dans le CV, avec un exemple concret
   - ? **À préciser** : cité, mais rien ne le prouve
   - ✕ **Pas dans ton CV** : demandé par l'annonce, absent du CV
4. **Réécrire mon CV** : des phrases à trous avec les mots de l'annonce. On n'invente rien : une ligne n'entre dans le CV que si la personne la complète et clique sur « Ajouter ».

## État actuel

- `index.html` + `css/app.css` : les 4 étapes, au style de l'accueil du portfolio (classeur coloré, une couleur par étape). On n'avance que quand l'étape d'avant est remplie ; un bouton « Essayer avec un exemple » remplit tout avec des données fictives.
- `js/lecteur.js` : lecture du vrai CV dans le navigateur. PDF (pdf.js), Word `.docx` et `.odt` (petit lecteur ZIP intégré), texte, photo ou PDF scanné (OCR Tesseract, français et anglais). Les bibliothèques ne se chargent qu'au premier fichier déposé.
- `js/moteur.js` : découpage du CV en rubriques (Expériences, Compétences, Formation, Divers), comparaison avec l'offre, réécriture à trous.
- `js/app.js` : l'interface.
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
- [ ] Repérage des points de l'annonce sans liste figée (dictionnaire de métiers, synonymes)
- [x] Polices auto-hébergées (pas de requête externe, RGPD)
- [ ] Export du CV réécrit (texte, puis PDF)
- [ ] Hébergement dans son propre LXC (Caddy, site statique)

## Principes

- Grand public : français courant, pas de jargon RH.
- Les statuts s'affichent en texte, pas seulement en couleur.
- Rien n'est envoyé à un serveur. Une réécriture par IA demanderait un serveur : à décider plus tard, en option.
