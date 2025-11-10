import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET(req, { params }) {
  const { id } = await params;

  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  let objId;
  try {
    objId = new ObjectId(id);
  } catch {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const cacheKey = `student:${id}`;
  const cached = await redis.get(cacheKey);
  if (cached) return NextResponse.json(JSON.parse(cached));

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const collection = db.collection("students");

  const student = await collection.findOne({ _id: objId });
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  await redis.set(cacheKey, JSON.stringify(student), { ex: 86400 });

  return NextResponse.json(student);
}
