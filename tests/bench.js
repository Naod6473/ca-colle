// Fait tourner les cas : marche dans le navigateur (tests/index.html) comme dans node (tests/run.js)
function runCases(cases){
  return cases.filter(c => (c.lang || "fr") === LANG).map(c => {
    CV = parseCV(c.cv); fixes = {}; over = {};
    const text = typeof cleanOffer === "function" && c.clean ? cleanOffer(c.offer).text : c.offer;
    const rs = analyse(text), by = Object.fromEntries(rs.map(r => [r.k, r])), fails = [];
    for (const st of ["ok", "mid", "no"]) (c[st] || []).forEach(k => { if (!by[k]) fails.push(`« ${k} » pas repéré (attendu ${st})`); else if (by[k].st !== st) fails.push(`« ${k} » : ${by[k].st} au lieu de ${st}`); });
    (c.absent || []).forEach(k => { if (by[k]) fails.push(`« ${k} » ne devrait pas sortir`); });
    Object.entries(c.prio || {}).forEach(([k, p]) => { if (by[k] && (by[k].prio || "") !== p) fails.push(`« ${k} » : priorité « ${by[k].prio || "aucune"} » au lieu de « ${p} »`); });
    // Ajouts de l'étape 4 : [nom du point, valeurs des cases, numéro du poste choisi], puis le texte attendu dans le CV
    if (c.fills) {
      c.fills.forEach(([k, vals, job]) => { const r = by[k]; if (!r?.fix) return fails.push(`ajout : « ${k} » n'a pas de phrase à trous`); fixes[k] = {vals: Object.assign({}, vals), state: "accepted", fix: r.fix, to: job != null ? jobsOf()[job]?.id : undefined}; });
      const txt = cvLines(false).filter(l => l.raw).map(l => l.raw).join("\n");
      (c.cvHas || []).forEach(w => { if (!txt.includes(w)) fails.push(`ajout : « ${w} » absent du CV`); });
      (c.cvNot || []).forEach(w => { if (txt.includes(w)) fails.push(`ajout : « ${w} » ne devrait pas être dans le CV`); });
      fixes = {};
    }
    if (c.minPoints && rs.length < c.minPoints) fails.push(`${rs.length} points repérés, au moins ${c.minPoints} attendus`);
    Object.entries(c.proof || {}).forEach(([k, w]) => { const p = by[k]?.proof; if (!p || !fold(p.t).includes(fold(w))) fails.push(`preuve de « ${k} » : « ${p ? p.t.slice(0, 60) : "rien"} » au lieu d'une ligne avec « ${w} »`); });
    if (c.clean) {
      const out = cleanOffer(c.offer).text.split("\n").map(l => l.trim());
      c.clean.removed.forEach(l => { if (out.includes(l)) fails.push(`nettoyage : « ${l} » aurait dû partir`); });
      c.clean.kept.forEach(l => { if (!out.some(x => x.includes(l))) fails.push(`nettoyage : « ${l} » a disparu`); });
    }
    if (c.ad) {
      const a = adCheck(c.offer), ids = l => l.map(x => x.id);
      Object.entries(c.ad.facts || {}).forEach(([id, v]) => { const f = a.facts.find(x => x.id === id); if (!f || !fold(f.v).includes(fold(v))) fails.push(`annonce : ${id} = « ${f ? f.v : "rien"} » au lieu de « ${v} »`); });
      (c.ad.missing || []).forEach(id => { if (!ids(a.missing).includes(id)) fails.push(`annonce : ${id} devrait manquer`); });
      (c.ad.flags || []).forEach(id => { if (!ids(a.flags).includes(id)) fails.push(`annonce : signal ${id} pas repéré`); });
      if (c.ad.noFlags && a.flags.length) fails.push(`annonce : signaux en trop (${ids(a.flags).join(", ")})`);
    }
    if (c.review) {
      const rv = cvCheck(c.cv);
      (c.review.typos || []).forEach(([w, to]) => { if (!rv.some(x => x.type === "typo" && x.word === w && x.to === to)) fails.push(`relecture : « ${w} » → « ${to} » pas proposé`); });
      (c.review.types || []).forEach(t => { if (!rv.some(x => x.type === t)) fails.push(`relecture : aucune remarque ${t}`); });
      (c.review.notOn || []).forEach(w => { const x = rv.find(x => x.line && x.line.includes(w)); if (x) fails.push(`relecture : remarque ${x.type} sur « ${w} »`); });
      (c.review.notTypes || []).forEach(t => { if (rv.some(x => x.type === t)) fails.push(`relecture : remarque ${t} en trop (${rv.filter(x => x.type === t).map(x => x.word || x.msg).join(", ")})`); });
    }
    return {name: c.name, points: rs.length, score: scoreOf(rs), fails, rs};
  });
}
if (typeof module !== "undefined") module.exports = runCases;
