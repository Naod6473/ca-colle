Bibliothèques du mode recruteur (recruteur.html), hébergées avec le site, chargées seulement quand on dépose un fichier.
- pdf.js 6.4.299, build « legacy » en module ES (Mozilla, Apache-2.0) : lecture des PDF. pdf/wasm/ = décodeurs JBIG2, JPEG 2000 et couleurs (licences à côté). Mise à jour : npm pack pdfjs-dist, puis copier legacy/build/pdf.min.mjs -> pdf/pdf.min.js, legacy/build/pdf.worker.min.mjs -> pdf/pdf.worker.min.js, wasm/*.wasm -> pdf/wasm/
- tesseract.js 5.1.1 et tesseract.js-core 5.1.1 (Apache-2.0) : OCR des images et des PDF scannés
- Données de langue fra / eng (tesseract.js-data 1.0.0, Apache-2.0, modèles Tesseract 4.0.0)

Copié depuis le portfolio (Naod6473/cv, assets/vendor/recruteur/).
