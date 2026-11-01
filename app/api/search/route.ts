export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import ScratchCard from "@/app/lib/models/ScratchCard";

export async function GET(req: Request){

  await connectDB();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  /* ❗ VALIDATION */
  if(!userId){
    return NextResponse.json([]);
  }

  const cards = await ScratchCard.find({
    user: userId,
    isScratched: false
  } as any).sort({ createdAt: -1 });

  /* CLEAN RESPONSE */
  const formatted = cards.map((c:any)=>({
    _id: c._id.toString(),
    amount: c.amount,
    isScratched: c.isScratched
  }));

  return NextResponse.json(formatted);
}