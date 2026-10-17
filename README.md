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

`index.html` est la **maquette v2** : un seul fichier, données fictives (offre logistique, CV de « Camille Martin »), aucune dépendance à part les polices Google Fonts.

Ouvrir `index.html` dans un navigateur suffit pour la tester.

## À faire

- [ ] Lecture réelle du CV : PDF (pdf.js), Word (.docx), photo (Tesseract OCR), le tout en local
- [ ] Repérage des points de l'annonce sans liste figée (dictionnaire de métiers, synonymes)
- [ ] Polices auto-hébergées (pas de requête externe, RGPD)
- [ ] Export du CV réécrit (texte, puis PDF)
- [ ] Hébergement dans son propre LXC (Caddy, site statique)

## Principes

- Grand public : français courant, pas de jargon RH.
- Les statuts s'affichent en texte, pas seulement en couleur.
- Rien n'est envoyé à un serveur. Une réécriture par IA demanderait un serveur : à décider plus tard, en option.
