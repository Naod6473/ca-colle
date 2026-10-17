// Export du CV et de la lettre : fichier Word (.docx fabriqué dans le navigateur), PDF (impression), copie.
(() => {
// CRC32 pour le ZIP
const T = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = u8 => { let c = 0xffffffff; for (const b of u8) c = T[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };

// ZIP sans compression : suffisant pour un .docx
function zip(files){
  const enc = new TextEncoder(), parts = [], dir = []; let off = 0;
  for (const [name, text] of files) {
    const n = enc.encode(name), d = enc.encode(text), c = crc(d);
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true);
    h.setUint32(14, c, true); h.setUint32(18, d.length, true); h.setUint32(22, d.length, true); h.setUint16(26, n.length, true);
    parts.push(h, n, d);
    const e = new DataView(new ArrayBuffer(46));
    e.setUint32(0, 0x02014b50, true); e.setUint16(4, 20, true); e.setUint16(6, 20, true); e.setUint16(8, 0x0800, true);
    e.setUint32(16, c, true); e.setUint32(20, d.length, true); e.setUint32(24, d.length, true); e.setUint16(28, n.length, true); e.setUint32(42, off, true);
    dir.push(e, n);
    off += 30 + n.length + d.length;
  }
  const size = dir.reduce((s, x) => s + (x.byteLength ?? x.length), 0), end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
  end.setUint32(12, size, true); end.setUint32(16, off, true);
  return new Blob([...parts, ...dir, end], {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
}
const x = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// paras : [{text, style: "title" | "head" | "", bold}]
function docx(paras){
  const p = ({text, style, bold}) => {
    const sz = style === "title" ? 36 : style === "head" ? 24 : 22, b = bold || style ? "<w:b/>" : "";
    const sp = style === "head" ? '<w:spacing w:before="240" w:after="80"/>' : '<w:spacing w:after="80"/>';
    return `<w:p><w:pPr>${sp}</w:pPr><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>${b}<w:sz w:val="${sz}"/></w:rPr><w:t xml:space="preserve">${x(text)}</w:t></w:r></w:p>`;
  };
  const body = paras.map(p).join("");
  return zip([
    ["[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],
    ["_rels/.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
    ["word/document.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="0" w:footer="0" w:gutter="0"/></w:sectPr></w:body></w:document>`]
  ]);
}

function download(blob, name){
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
// PDF : on imprime seulement la zone voulue, le navigateur propose « Enregistrer en PDF »
function printHTML(html){
  const z = document.getElementById("printzone"); z.innerHTML = html;
  document.body.classList.add("printing");
  const done = () => { document.body.classList.remove("printing"); z.innerHTML = ""; window.removeEventListener("afterprint", done); };
  window.addEventListener("afterprint", done);
  window.print();
  setTimeout(done, 1500);
}
async function copy(text){
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}
window.Export = { docx, download, printHTML, copy };
})();
