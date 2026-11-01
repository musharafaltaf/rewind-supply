export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/lib/models/Users";

export async function GET(req: Request){

  await connectDB();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  /* ❗ VALIDATION */
  if(!userId){
    return NextResponse.json({ balance: 0 });
  }

  const user = await (User as any).findById(userId) ;

  return NextResponse.json({
    balance: user?.wallet || 0
  });
}