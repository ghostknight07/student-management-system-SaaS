import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function PATCH(req, { params }) {
  const { id } = await params;

  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  let objId;
  try {
    objId = new ObjectId(id);
  } catch {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  let updateData;
  try {
    updateData = await req.json();
  } catch {
    return NextResponse.json({ error: "Cannot parse request body" }, { status: 400 });
  }

  Object.keys(updateData).forEach((key) => {
    let value = updateData[key];

    if (value === "" || value === null || value === undefined) {
      delete updateData[key];
      return;
    }

    if (key === "payment_amount") {
      const num = parseFloat(value);
      if (!isNaN(num)) updateData[key] = num;
      else delete updateData[key];
    }

    if (key === "payment_status") {
      if (value === "true" || value === true) updateData[key] = true;
      else if (value === "false" || value === false) updateData[key] = false;
      else delete updateData[key];
    }
  });

  if (Object.keys(updateData).length === 0)
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const collection = db.collection("students");

  const res = await collection.updateOne({ _id: objId }, { $set: updateData });
  if (res.matchedCount === 0)
    return NextResponse.json({ error: "Student not found" }, { status: 404 });

  await redis.del(`student:${id}`);

  return NextResponse.json({ message: "Student updated successfully" });
}
