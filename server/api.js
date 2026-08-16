import { getDb } from './db.js'

function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body

  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw.trim()) return {}

  return JSON.parse(raw)
}

function submissionUrl(kind, payload) {
  const env = process.env
  if (kind === 'companies') return env.GOOGLE_SHEETS_COMPANIES_URL || env.VITE_GOOGLE_SHEETS_COMPANIES_URL || env.GOOGLE_SHEETS_URL || env.VITE_GOOGLE_SHEETS_URL
  if (kind === 'recruiters') return env.GOOGLE_SHEETS_RECRUITERS_URL || env.VITE_GOOGLE_SHEETS_RECRUITERS_URL || env.GOOGLE_SHEETS_URL || env.VITE_GOOGLE_SHEETS_URL
  if (kind === 'candidates' && payload?.jobId) return env.GOOGLE_SHEETS_JD_URL || env.VITE_GOOGLE_SHEETS_JD_URL || env.GOOGLE_SHEETS_URL || env.VITE_GOOGLE_SHEETS_URL
  return env.GOOGLE_SHEETS_URL || env.VITE_GOOGLE_SHEETS_URL
}

async function forwardSubmission(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  })

  if (!response.ok && response.status !== 0) {
    throw new Error(`Submission endpoint returned ${response.status}`)
  }
}

export function configureApiMiddleware(app) {
  app.use(async (req, res, next) => {
    if (!req.url?.startsWith('/api/')) return next()

    try {
      const url = new URL(req.url, 'http://localhost')

      if (url.pathname === '/api/submissions' && req.method === 'POST') {
        const body = await readJsonBody(req)
        const kind = typeof body.kind === 'string' ? body.kind : 'candidates'
        const payload = {
          ...(body.payload && typeof body.payload === 'object' ? body.payload : {}),
          submittedAt: new Date().toISOString(),
          source: kind,
        }
        const target = submissionUrl(kind, payload)

        if (!target) return sendJson(res, 500, { error: 'Submission endpoint is not configured' })

        await forwardSubmission(target, payload)
        return sendJson(res, 200, { ok: true })
      }

      const db = await getDb()

      if (url.pathname === '/api/roles/count') {
        const query = url.searchParams.get('status') === 'active' ? { status: 'Active' } : {}
        const count = await db.collection('roles').countDocuments(query)
        return sendJson(res, 200, { count })
      }

      if (url.pathname === '/api/companies') {
        const companies = await db
          .collection('companies')
          .find({ active: true })
          .sort({ name: 1 })
          .toArray()

        return sendJson(res, 200, companies.map(({ _id, ...company }) => company))
      }

      if (url.pathname === '/api/roles') {
        const query = url.searchParams.get('status') === 'active' ? { status: 'Active' } : {}
        const limit = Number(url.searchParams.get('limit') || 0)
        let cursor = db.collection('roles').find(query).sort({ id: 1 })
        if (Number.isFinite(limit) && limit > 0) cursor = cursor.limit(limit)
        const roles = await cursor.toArray()

        return sendJson(res, 200, roles.map(({ _id, ...role }) => role))
      }

      if (url.pathname.startsWith('/api/roles/')) {
        const id = decodeURIComponent(url.pathname.replace('/api/roles/', ''))
        const role = await db.collection('roles').findOne({ id, status: 'Active' })
        if (!role) return sendJson(res, 404, { error: 'Role not found' })

        const { _id, ...payload } = role
        return sendJson(res, 200, payload)
      }

      return sendJson(res, 404, { error: 'Not found' })
    } catch (error) {
      return sendJson(res, 500, { error: error instanceof Error ? error.message : 'Unknown server error' })
    }
  })
}
