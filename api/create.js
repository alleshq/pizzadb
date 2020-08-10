const db = require('../db')
const uuid = require('uuid').v4

module.exports = async (req, res) => {
  // Get base
  const base = await db.Base.findOne({
    where: {
      id: req.params.base
    }
  })
  if (!base) return res.status(404).json({ err: 'missingResource' })
  if (base.secret !== req.headers.authorization) return res.status(401).json({ err: 'badAuthentication' })

  // Check body
  for (let i = 0; i < Object.keys(req.body).length; i++) {
    const key = Object.keys(req.body)[i]
    if (
      key.length > 255 ||
            typeof req.body[key] !== 'string' ||
            req.body[key].length > 255
    ) return res.status(400).json({ err: 'badRequest' })
  }

  // Create key/value records
  const record = uuid()
  await Promise.all(Object.keys(req.body).map(key => db.Data.create({
    id: uuid(),
    base: base.id,
    record,
    key,
    value: req.body[key]
  })))

  // Response
  res.json(req.body)
}
