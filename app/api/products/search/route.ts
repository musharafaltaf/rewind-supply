export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Product from "@/app/lib/models/Product";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || typeof q !== "string") {
      return NextResponse.json([]);
    }

    const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const products = await Product.find({
      $or: [
        { name: { $regex: safe, $options: "i" } },
        { category: { $regex: safe, $options: "i" } }
      ]
    } as any)
      .select("_id name price image")
      .limit(6)
      .lean();

    return NextResponse.json(Array.isArray(products) ? products : []);

  } catch (err) {
    console.log("SEARCH API ERROR:", err);
    return NextResponse.json([]);
  }
} // ✅ THIS WAS MISSING