import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { Redis } from "@upstash/redis";


const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json([], { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json([], { status: 401 });
    }

    const userId = decoded.userId;
    if (!userId) return NextResponse.json([], { status: 401 });

    const cacheKey = `batches:${userId}`;
    const cachedBatches = await redis.get(cacheKey);

    if (cachedBatches) {

      return NextResponse.json(cachedBatches, { status: 200 });
    }


    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("batches");

    const batches = await collection
      .find({ createdBy: new ObjectId(userId) })
      .toArray();

    await redis.set(cacheKey, batches, { ex: 86400 });

    return NextResponse.json(batches, { status: 200 });
  } catch (error) {
    console.error("Error fetching batches:", error);
    return NextResponse.json({ error: "Cannot fetch batches" }, { status: 500 });
  }
}
