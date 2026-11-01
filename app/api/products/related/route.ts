export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import  { connectDB }   from "@/app/lib/mongodb";
import Product from "@/app/lib/models/Product";

export async function GET(req: Request) {

  await connectDB();

  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");

 const products = await (Product as any)
  .find({ category })
  .limit(4);
  return NextResponse.json(products);

}