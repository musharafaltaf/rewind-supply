import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/lib/models/Users";

export async function GET() {

  await connectDB();

  const existing = await User.findOne({ email: "musharafdar@10gmail.com" } as any);

  if (existing) {
    return NextResponse.json({ message: "Admin already exists" });
  }

  const admin = await User.create({
    name: "Admin",
    email: "admin@05mart.com",
    password: "@Humayoonlonee",
    role: "admin"
  });

  return NextResponse.json(admin);
}