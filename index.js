// Express
const express = require('express')
const app = express()
app.use(require('body-parser').json())
app.use((_err, _req, res, _next) => res.status(500).json({ err: 'internalError' }))

// Database
const db = require('./db')
db.sync().then(() => app.listen(8080, () => console.log('Server is listening...')))

// Create record
app.put('/:base', require('./api/create'))

// 404
app.use((_req, res) => res.status(404).json({ err: 'notFound' }))
