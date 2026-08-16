import 'dotenv/config'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const dbName = process.env.MONGODB_DB || 'heroscouter'

let clientPromise

export async function getDb() {
  if (!clientPromise) {
    const client = new MongoClient(uri)
    clientPromise = client.connect()
  }

  const client = await clientPromise
  return client.db(dbName)
}

export async function closeDb() {
  if (!clientPromise) return
  const client = await clientPromise
  await client.close()
  clientPromise = null
}
