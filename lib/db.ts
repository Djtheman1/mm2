import { MongoClient, Db } from "mongodb";

const MONGO_URI = process.env.MONGO_URI!;
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
    if (cachedDb) return cachedDb;

    if (!MONGO_URI) {
        throw new Error("Missing MONGO_URI in environment variables");
    }

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    cachedClient = client;
    cachedDb = client.db(); // Change this if you need a specific database name

    return cachedDb;
}
