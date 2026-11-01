// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI as string;

// if (!MONGODB_URI) {
//   throw new Error("Please add MONGODB_URI in .env.local");
// }

// let cached = (global as any).mongoose;

// if (!cached) {
//   cached = (global as any).mongoose = { conn: null, promise: null };
// }

// export async function connectDB() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI);
//   }

//   cached.conn = await cached.promise;
//   console.log("✅ MongoDB Connected");
//   return cached.conn;
// }


import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
throw new Error("Please add MONGODB_URI to your environment variables");
}

interface MongooseCache {
conn: typeof mongoose | null;
promise: Promise<typeof mongoose> | null;
}

declare global {
var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache =
global.mongoose ??
(global.mongoose = {
conn: null,
promise: null,
});

export async function connectDB() {
if (cached.conn && mongoose.connection.readyState === 1) {
return cached.conn;
}

if (!cached.promise) {
cached.promise = mongoose.connect(MONGODB_URI, {
serverSelectionTimeoutMS: 10000,
connectTimeoutMS: 10000,
});
}

try {
cached.conn = await cached.promise;
return cached.conn;
} catch (error) {
cached.promise = null;
cached.conn = null;

console.error("MongoDB Connection Error:", error);

throw error;


}
}
