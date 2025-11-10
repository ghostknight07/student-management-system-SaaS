import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import jwt from "jsonwebtoken";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function DELETE(req, context) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Batch ID is required" }, { status: 400 });
    }


    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;


    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const batchCollection = db.collection("batches");

    const objectId = new ObjectId(id);
    const res = await batchCollection.deleteOne({ _id: objectId, createdBy: new ObjectId(userId) });

    if (res.deletedCount === 0) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }


    await redis.del(`batches:${userId}`);

    return NextResponse.json({ message: "Batch deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting batch:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
