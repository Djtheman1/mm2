import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

// Define a global type for caching the connection
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: Mongoose | null; promise: Promise<Mongoose> | null } | undefined;
}

// Reuse the cached connection if available
const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
};

const cached = globalWithMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalWithMongoose.mongooseCache = cached;

/**
 * Connect to MongoDB with connection caching (recommended for Next.js)
 */
export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "data",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
