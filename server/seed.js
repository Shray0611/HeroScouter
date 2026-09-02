import { closeDb, getDb } from './db.js'
import { activeCompaniesFromRoles, readSeedRoles } from './roles.js'

async function seed() {
  console.log('Reading seed files from server/...')
  const roles = await readSeedRoles()

  if (!roles.length) {
    console.error('No roles found. Place your seed JSON inside server/ named hero_scouter_seed_*.json')
    process.exitCode = 1
    return
  }

  // Split into active and inactive — both go into DB, only active are served by the API
  const activeRoles = roles.filter((r) => r.status === 'Active')
  const inactiveRoles = roles.filter((r) => r.status !== 'Active')
  const companies = activeCompaniesFromRoles(roles)

  const db = await getDb()

  // Wipe existing data and insert fresh
  await db.collection('roles').deleteMany({})
  await db.collection('companies').deleteMany({})

  if (roles.length) {
    await db.collection('roles').insertMany(roles)
  }
  if (companies.length) {
    await db.collection('companies').insertMany(companies)
  }

  // Ensure indexes
  await db.collection('roles').createIndex({ id: 1 }, { unique: true })
  await db.collection('roles').createIndex({ status: 1 })
  await db.collection('companies').createIndex({ name: 1 }, { unique: true })
  await db.collection('companies').createIndex({ active: 1 })

  console.log(`\nDone.`)
  console.log(`Roles:     ${activeRoles.length} active + ${inactiveRoles.length} inactive = ${roles.length} total inserted`)
  console.log(`Companies: ${companies.length} active companies derived`)
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(closeDb)
