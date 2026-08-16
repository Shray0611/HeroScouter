import { getDb } from './db.js'

function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

export function configureApiMiddleware(app) {
  app.use(async (req, res, next) => {
    if (!req.url?.startsWith('/api/')) return next()

    try {
      const url = new URL(req.url, 'http://localhost')
      const db = await getDb()

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
