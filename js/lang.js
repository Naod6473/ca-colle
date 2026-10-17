// Langue de l'app : français (index.html) ou anglais (index-en.html). tr("texte fr", "english text").
const EN = (typeof CACOLLE_LANG !== "undefined" ? CACOLLE_LANG : typeof document !== "undefined" ? document.documentElement.lang : "fr") === "en";
const tr = (fr, en) => EN ? en : fr;
