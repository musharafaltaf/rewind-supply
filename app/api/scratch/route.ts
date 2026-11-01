export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import ScratchCard from "@/app/lib/models/ScratchCard";

export async function GET(req: Request){

  await connectDB();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const cards = await ScratchCard.find({
    user: userId,
    isScratched: false
  }as any);

  return NextResponse.json(cards);
}