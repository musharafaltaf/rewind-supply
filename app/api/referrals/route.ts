export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Referral from "@/app/lib/models/Referral";
import mongoose from "mongoose";

export async function GET(req: Request){

  await connectDB();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if(!userId){
    return NextResponse.json([]);
  }

  /* ✅ FIX: convert to ObjectId */
  const referrals = await Referral.find({
    referrer: new mongoose.Types.ObjectId(userId)
  } as any)
  .populate("referredUser", "name img email")
  .sort({ createdAt: -1 });

  /* ✅ RETURN CORRECT STRUCTURE */
  const formatted = referrals.map((r:any)=>({

    _id: r._id.toString(),

    referredUser: {
      name: r.referredUser?.name || "User",
      email: r.referredUser?.email || "",
      img:
        r.referredUser?.img ||
        `https://randomuser.me/api/portraits/men/${(Math.floor(Math.random()*90)+1)}.jpg`
    },

    status: {
      registered: r.status?.registered || false,
      ordered: r.status?.ordered || false,
      delivered: r.status?.delivered || false,
      rewardGiven: r.status?.rewardGiven || false
    },

    createdAt: r.createdAt

  }));

  return NextResponse.json(formatted);
}