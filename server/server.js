import 'dotenv/config'
import express from 'express'
import { configureApiMiddleware } from './api.js'

const app = express()
const port = Number(process.env.API_PORT || 3001)

configureApiMiddleware(app)

app.listen(port, () => {
  console.log(`HeroScouter API listening on http://localhost:${port}`)
})
