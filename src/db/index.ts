import mongoose from 'mongoose'

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME as string}:${process.env.MONGODB_PASSWORD as string}@${process.env.MONGODB_HOST as string}/${process.env.MONGO_DB_NAME as string}${process.env.MONGODB_PARAMS as string}&appName=${process.env.MONGODB_APP_NAME as string}`

if (MONGODB_URI.length === 0 || MONGODB_URI.includes('undefined')) {
  throw new Error('Please define MongoDB environment variables inside .env.local')
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null }

if (global.mongoose === undefined) {
  global.mongoose = cached
}

/**
 * Connect to MongoDB using Mongoose with connection caching
 * @returns Mongoose instance
 */
async function connectDB (): Promise<typeof mongoose> {
  if (cached.conn !== null) {
    return cached.conn
  }

  if (cached.promise === null) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('[MongoDB] Connected successfully')
      return mongoose
    }).catch((error) => {
      console.error('[MongoDB] Connection error:', error)
      cached.promise = null
      throw error
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

/**
 * Get native MongoDB database instance for Better Auth
 * Better Auth uses native MongoDB driver, not Mongoose
 */
export async function getAuthDb (): Promise<any> {
  const mongooseInstance = await connectDB()
  return mongooseInstance.connection.db
}

/**
 * Get native MongoDB client for Better Auth transactions
 */
export async function getAuthClient (): Promise<any> {
  const mongooseInstance = await connectDB()
  return mongooseInstance.connection.getClient()
}

export default connectDB
