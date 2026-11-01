export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Wishlist from "@/app/lib/models/Wishlist";

export async function GET(req: Request) {

  await connectDB();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "guest";

  const wishlist = await (Wishlist as any).findOne({ userId });

  return NextResponse.json({
    items: wishlist?.items || []
  });

}