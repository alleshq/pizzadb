const db = require('../db')

module.exports = async (req, res) => {
  // Get base
  const base = await db.Base.findOne({
    where: {
      id: req.params.base
    }
  })
  if (!base) return res.status(404).json({ err: 'notFound' })
  if (!base.public && base.secret !== req.headers.authorization) return res.status(401).json({ err: 'badAuthorization' })

  // Get key/value record
  const kv = await db.Data.findOne({
    where: {
      base: base.id,
      key: req.params.key,
      value: req.params.value
    }
  })
  if (!kv) return res.status(404).json({ err: 'notFound' })

  // Get all record data
  const recordData = await db.Data.findAll({
    where: {
      base: kv.base,
      record: kv.record
    },
    order: ['key']
  })

  // Record output
  const record = {}
  recordData.forEach(kv => { record[kv.key] = kv.value })

  // Response
  res.json(record)
}
