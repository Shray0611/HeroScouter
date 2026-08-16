import { closeDb, getDb } from './db.js'
import { activeCompaniesFromRoles, readSeedRoles } from './roles.js'

async function seed() {
  const roles = await readSeedRoles()
  const companies = activeCompaniesFromRoles(roles)
  const db = await getDb()

  await db.collection('roles').deleteMany({})
  if (roles.length) {
    await db.collection('roles').insertMany(roles)
  }

  await db.collection('companies').deleteMany({})
  if (companies.length) {
    await db.collection('companies').insertMany(companies)
  }

  await db.collection('roles').createIndex({ id: 1 }, { unique: true })
  await db.collection('roles').createIndex({ status: 1 })
  await db.collection('companies').createIndex({ name: 1 }, { unique: true })
  await db.collection('companies').createIndex({ active: 1 })

  console.log(`Seeded ${roles.length} roles and ${companies.length} active companies.`)
}

seed()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(closeDb)
