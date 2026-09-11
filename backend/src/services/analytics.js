module.exports = function analytics(pool) {
  let ready
  function ensure() {
    if (!ready) ready = pool.query(`CREATE TABLE IF NOT EXISTS visitas_navegador (
      visitante UUID NOT NULL,
      tipo VARCHAR(10) NOT NULL,
      referencia VARCHAR(80) NOT NULL DEFAULT '',
      dia DATE NOT NULL DEFAULT ((CURRENT_TIMESTAMP AT TIME ZONE 'America/Bahia')::date),
      PRIMARY KEY (visitante, tipo, referencia, dia)
    )`).catch(error => { ready = null; throw error })
    return ready
  }
  return {
    async record(visitante, tipo, referencia) {
      await ensure()
      await pool.query('INSERT INTO visitas_navegador (visitante, tipo, referencia) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [visitante, tipo, referencia])
    },
    async stats() {
      await ensure()
      const [counts, top] = await Promise.all([
        pool.query(`SELECT
          COUNT(DISTINCT visitante) FILTER (WHERE dia = (CURRENT_TIMESTAMP AT TIME ZONE 'America/Bahia')::date) AS hoje,
          COUNT(DISTINCT visitante) FILTER (WHERE dia >= date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bahia')::date) AS mes
          FROM visitas_navegador`),
        pool.query(`SELECT referencia, COUNT(*) AS total FROM visitas_navegador
          WHERE tipo = 'produto' AND referencia <> '' GROUP BY referencia ORDER BY total DESC LIMIT 5`),
      ])
      return { visitasHoje: Number(counts.rows[0].hoje), visitasMes: Number(counts.rows[0].mes), topProdutos: top.rows }
    },
  }
}
