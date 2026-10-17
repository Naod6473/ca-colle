// Lecture d'un CV dans le navigateur : PDF, Word (.docx), OpenDocument (.odt), texte, image (OCR).
// Rien n'est envoyé : les bibliothèques sont dans vendor/ et ne se chargent qu'au premier fichier.
// Repris du mode recruteur du portfolio (js/recruteur.js).
(() => {
const V = "vendor/";
const LIB = { pdf: V + "pdf/pdf.min.js", pdfWorker: V + "pdf/pdf.worker.min.js", pdfWasm: V + "pdf/wasm/", tess: V + "tesseract/tesseract.min.js", tessWorker: V + "tesseract/worker.min.js", core: V + "tesseract/core", lang: V + "lang" };
const abs = (u) => new URL(u, location.href).href;
const loaded = {};
const load = (src) => loaded[src] || (loaded[src] = new Promise((ok, ko) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = () => ko(new Error("load " + src)); document.head.append(s); }));

let progress = () => {};
let ocrWorker = null, ocrBase = 0, ocrSpan = 1;
async function ocrWorkerGet() {
  if (ocrWorker) return ocrWorker;
  await load(LIB.tess);
  ocrWorker = await Tesseract.createWorker(["fra", "eng"], 1, {
    workerPath: abs(LIB.tessWorker), corePath: abs(LIB.core), langPath: abs(LIB.lang), workerBlobURL: false,
    logger: (m) => {
      if (m.status === "recognizing text") progress(ocrBase + m.progress * ocrSpan, tr(`Lecture de l'image : ${Math.round(m.progress * 100)} %`, `Reading the image: ${Math.round(m.progress * 100)}%`));
      else if (/load|initializ/.test(m.status)) progress(.05 + (m.progress || 0) * .1, tr("Préparation de la lecture d'image (la première fois seulement)…", "Getting image reading ready (first time only)…"));
    },
  });
  return ocrWorker;
}
async function ocr(images) {
  const w = await ocrWorkerGet();
  let out = "", conf = 0;
  for (let i = 0; i < images.length; i++) {
    ocrBase = .15 + .85 * i / images.length; ocrSpan = .85 / images.length;
    const { data } = await w.recognize(images[i]);
    out += data.text + "\n"; conf += data.confidence;
  }
  return { text: out, conf: Math.round(conf / images.length) };
}

// Mini lecteur ZIP (DOCX et ODT sont des ZIP) : répertoire central + DecompressionStream, sans bibliothèque
async function unzipEntry(buf, name) {
  const v = new DataView(buf), u8 = new Uint8Array(buf);
  let e = buf.byteLength - 22; while (e >= 0 && v.getUint32(e, true) !== 0x06054b50) e--;
  if (e < 0) throw new Error(tr("Ce fichier Word semble abîmé. Enregistre-le à nouveau ou envoie un PDF.", "This Word file seems damaged. Save it again or send a PDF."));
  let p = v.getUint32(e + 16, true); const n = v.getUint16(e + 10, true);
  for (let i = 0; i < n; i++) {
    const method = v.getUint16(p + 10, true), csize = v.getUint32(p + 20, true), nlen = v.getUint16(p + 28, true), xlen = v.getUint16(p + 30, true), clen = v.getUint16(p + 32, true), off = v.getUint32(p + 42, true);
    const fname = new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nlen));
    if (fname === name) {
      const lo = off + 30 + v.getUint16(off + 26, true) + v.getUint16(off + 28, true), data = u8.subarray(lo, lo + csize);
      if (method === 0) return new TextDecoder().decode(data);
      const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
      return await new Response(stream).text();
    }
    p += 46 + nlen + xlen + clen;
  }
  throw new Error(tr("Ce fichier ne contient pas de texte lisible.", "This file has no readable text."));
}
const xmlText = (xml, para, tab) => xml.replace(para, "\n").replace(tab, "\t").replace(/<w:br[^>]*>|<text:line-break[^>]*>/g, "\n").replace(/<[^>]+>/g, "")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");

// Nettoyage : césures de fin de ligne, espaces en trop
const tidy = (t) => t.replace(/\r/g, "").replace(/(\w)-\n(\w)/g, "$1$2").replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim();

async function read(f) {
  const ext = (f.name.split(".").pop() || "").toLowerCase();
  if (f.size > 20e6) throw new Error(tr("Fichier trop lourd : 20 Mo maximum.", "File too large: 20 MB maximum."));
  if (/^text\//.test(f.type) || /^(txt|md)$/.test(ext)) { progress(.5, tr("Lecture du texte…", "Reading the text…")); return { text: await f.text(), info: tr("Fichier texte", "Text file") }; }
  if (ext === "docx") {
    progress(.4, tr("Ouverture du document Word…", "Opening the Word document…"));
    return { text: xmlText(await unzipEntry(await f.arrayBuffer(), "word/document.xml"), /<\/w:p>/g, /<w:tab\/>/g), info: tr("Document Word", "Word document") };
  }
  if (ext === "odt") {
    progress(.4, tr("Ouverture du document…", "Opening the document…"));
    return { text: xmlText(await unzipEntry(await f.arrayBuffer(), "content.xml"), /<\/text:(p|h)>/g, /<text:tab\/>/g), info: tr("Document OpenDocument", "OpenDocument file") };
  }
  if (ext === "doc") throw new Error(tr("L'ancien format Word (.doc) n'est pas lu. Dans Word, fais « Enregistrer sous » en .docx ou en PDF.", "The old Word format (.doc) cannot be read. In Word, use \"Save as\" .docx or PDF."));
  if (f.type === "application/pdf" || ext === "pdf") {
    progress(.08, tr("Chargement du lecteur PDF…", "Loading the PDF reader…"));
    const pdfjsLib = await import(abs(LIB.pdf)); pdfjsLib.GlobalWorkerOptions.workerSrc = abs(LIB.pdfWorker);
    const pdf = await pdfjsLib.getDocument({ data: await f.arrayBuffer(), wasmUrl: abs(LIB.pdfWasm), enableScripting: false, isEvalSupported: false }).promise;
    const pages = Math.min(pdf.numPages, 6);
    let text = "";
    for (let i = 1; i <= pages; i++) {
      const tc = await (await pdf.getPage(i)).getTextContent();
      text += tc.items.map(it => it.str + (it.hasEOL ? "\n" : " ")).join("") + "\n\n";
      progress(.1 + .8 * i / pages, `Page ${i} sur ${pages}`);
    }
    const pl = `${pdf.numPages} page${pdf.numPages > 1 ? "s" : ""}`;
    if (text.replace(/\s/g, "").length > 80) return { text, info: "PDF · " + pl };
    // PDF scanné : on rend les pages en image, puis OCR
    progress(.12, tr("Ce PDF est une image : lecture à l'œil (OCR)…", "This PDF is an image: reading it by eye (OCR)…"));
    const imgs = [];
    for (let i = 1; i <= Math.min(pages, 3); i++) {
      const page = await pdf.getPage(i), vp = page.getViewport({ scale: 2 }), c = document.createElement("canvas");
      c.width = vp.width; c.height = vp.height; await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise; imgs.push(c);
    }
    const r = await ocr(imgs);
    return { text: r.text, info: tr(`PDF scanné · ${pl} · lu à ${r.conf} %`, `Scanned PDF · ${pl} · ${r.conf}% read`), conf: r.conf };
  }
  if (/^image\//.test(f.type) || /^(png|jpe?g|webp|gif|bmp)$/.test(ext)) {
    if (/hei[cf]/.test(f.type) || /^hei[cf]$/.test(ext)) throw new Error(tr("Les photos HEIC d'iPhone ne s'ouvrent pas dans le navigateur. Envoie une capture d'écran ou un JPEG.", "iPhone HEIC photos do not open in the browser. Send a screenshot or a JPEG."));
    progress(.04, tr("Lecture de la photo…", "Reading the photo…"));
    const url = URL.createObjectURL(f);
    try { const r = await ocr([url]); return { text: r.text, info: tr(`Photo · lue à ${r.conf} %`, `Photo · ${r.conf}% read`), conf: r.conf }; }
    finally { URL.revokeObjectURL(url); }
  }
  throw new Error(tr("Format non reconnu. Envoie un PDF, un Word (.docx), un .odt, un .txt ou une photo.", "Unknown format. Send a PDF, a Word file (.docx), an .odt, a .txt or a photo."));
}

// readCV(fichier, (avancement 0-1, message) => …) → { text, info, conf? }
window.readCV = async (f, onProgress) => {
  progress = onProgress || (() => {});
  const r = await read(f);
  r.text = tidy(r.text);
  if (r.text.replace(/\s/g, "").length < 40) throw new Error(tr("Je n'ai presque pas trouvé de texte. Essaie un PDF, ou une photo bien droite et nette.", "I found almost no text. Try a PDF, or a straight, sharp photo."));
  progress(1, tr("C'est lu.", "Done."));
  return r;
};
})();
