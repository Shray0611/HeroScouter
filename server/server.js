import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
// Load .env from same folder as server.js (works from both root and server/)
config({ path: join(__dirname, '.env') })
import express from 'express'
import { configureApiMiddleware } from './api.js'

const app = express()
const port = Number(process.env.PORT || process.env.API_PORT || 3001)

// Enable CORS for frontend requests (Vercel, custom domain, localhost)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    return res.end()
  }
  next()
})

// Lightweight health check endpoint for UptimeRobot and Render monitoring
app.get(['/', '/health', '/api/health'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'HeroScouter API',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  })
})

configureApiMiddleware(app)

app.listen(port, '0.0.0.0', () => {
  console.log(`HeroScouter API listening on port ${port}`)
})
