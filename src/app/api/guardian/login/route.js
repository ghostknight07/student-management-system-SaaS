import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { phone_number, passkey } = await req.json();

    // Basic validation
    if (!phone_number || !passkey) {
      return NextResponse.json(
        { message: "Phone number and passkey required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB); 
    const students = db.collection("students");

    // Find student by phone number
    const student = await students.findOne({ phone_number });
    if (!student) {
      return NextResponse.json(
        { message: "No student found with that phone number" },
        { status: 404 }
      );
    }

    // Compare passkey
    const isMatch = await bcrypt.compare(passkey, student.passkey);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect passkey" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: student._id,
        name: student.name,
        phone_number: student.phone_number,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send success response
    return NextResponse.json(
      {
        message: "Login successful",
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
