const db = require('./db')

module.exports = async (base, record) => {
  const data = await db.Data.findAll({
    where: {
      base,
      record
    },
    order: ['key']
  })

  const r = {}
  data.forEach(kv => { r[kv.key] = kv.value })
  return r
}
