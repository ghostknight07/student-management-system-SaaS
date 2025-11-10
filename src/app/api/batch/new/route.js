import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { Redis } from "@upstash/redis";


const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const body = await req.json();


    const batch = {
      ...body,
      _id: new ObjectId(),
      createdBy: new ObjectId(userId),
      createdAt: new Date(),
    };


    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("batches");

    const result = await collection.insertOne(batch);

    if (!result.acknowledged) {
      return NextResponse.json({ error: "Cannot insert batch" }, { status: 500 });
    }

    
    await redis.del(`batches:${userId}`);

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    console.error("Error creating batch:", error);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }
}
