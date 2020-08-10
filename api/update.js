const db = require('../db')
const uuid = require('uuid').v4

module.exports = async (req, res) => {
  // Get base
  const base = await db.Base.findOne({
    where: {
      id: req.params.base
    }
  })
  if (!base) return res.status(404).json({ err: 'notFound' })
  if (base.secret !== req.headers.authorization) return res.status(401).json({ err: 'badAuthorization' })

  // Get key/value record
  const kv = await db.Data.findOne({
    where: {
      base: base.id,
      key: req.params.key,
      value: req.params.value
    }
  })
  if (!kv) return res.status(404).json({ err: 'notFound' })

  // Check body
  for (let i = 0; i < Object.keys(req.body).length; i++) {
    const key = Object.keys(req.body)[i]
    if (
      key.length > 255 ||
            typeof req.body[key] !== 'string' ||
            req.body[key].length > 255
    ) return res.status(400).json({ err: 'badRequest' })
  }

  // Create or update key/value records
  await Promise.all(Object.keys(req.body).map(async key => {
    const kvExists = await db.Data.findOne({
      where: {
        base: base.id,
        record: kv.record,
        key
      }
    })

    if (kvExists) await kvExists.update({ value: req.body[key] })
    else {
      await db.Data.create({
        id: uuid(),
        base: base.id,
        record: kv.record,
        key,
        value: req.body[key]
      })
    }
  }))

  // Get all record data
  const recordData = await db.Data.findAll({
    where: {
      base: base.id,
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
