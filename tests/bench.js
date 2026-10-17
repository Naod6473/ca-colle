// Fait tourner les cas : marche dans le navigateur (tests/index.html) comme dans node (tests/run.js)
function runCases(cases){
  return cases.filter(c => (c.lang || "fr") === (EN ? "en" : "fr")).map(c => {
    CV = parseCV(c.cv); fixes = {}; over = {};
    const text = typeof cleanOffer === "function" && c.clean ? cleanOffer(c.offer).text : c.offer;
    const rs = analyse(text), by = Object.fromEntries(rs.map(r => [r.k, r])), fails = [];
    for (const st of ["ok", "mid", "no"]) (c[st] || []).forEach(k => { if (!by[k]) fails.push(`« ${k} » pas repéré (attendu ${st})`); else if (by[k].st !== st) fails.push(`« ${k} » : ${by[k].st} au lieu de ${st}`); });
    (c.absent || []).forEach(k => { if (by[k]) fails.push(`« ${k} » ne devrait pas sortir`); });
    if (c.minPoints && rs.length < c.minPoints) fails.push(`${rs.length} points repérés, au moins ${c.minPoints} attendus`);
    Object.entries(c.proof || {}).forEach(([k, w]) => { const p = by[k]?.proof; if (!p || !fold(p.t).includes(fold(w))) fails.push(`preuve de « ${k} » : « ${p ? p.t.slice(0, 60) : "rien"} » au lieu d'une ligne avec « ${w} »`); });
    if (c.clean) {
      const out = cleanOffer(c.offer).text.split("\n").map(l => l.trim());
      c.clean.removed.forEach(l => { if (out.includes(l)) fails.push(`nettoyage : « ${l} » aurait dû partir`); });
      c.clean.kept.forEach(l => { if (!out.some(x => x.includes(l))) fails.push(`nettoyage : « ${l} » a disparu`); });
    }
    return {name: c.name, points: rs.length, score: scoreOf(rs), fails, rs};
  });
}
if (typeof module !== "undefined") module.exports = runCases;
