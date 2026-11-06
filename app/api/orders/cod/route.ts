
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Order from "@/app/lib/models/Order";

export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();

    console.log("ORDER:", body);

    // BASIC VALIDATION
    if (!body.items || !body.customer) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    // PAYMENT CALCULATION
    const paymentMethod = body.paymentMethod || "cod";

    const subtotal = body.items.reduce(
      (sum: number, item: any) =>
        sum + Number(item.price) * Number(item.quantity || 1),
      0
    );

    const COD_FEE = 99;
    const PREPAID_DISCOUNT_PERCENT = 5;

    const codFee =
      paymentMethod === "cod" ? COD_FEE : 0;

    const onlineDiscount =
      paymentMethod === "upi" || paymentMethod === "qr"
        ? Math.round(
            subtotal * PREPAID_DISCOUNT_PERCENT / 100
          )
        : 0;

    const finalTotal =
      subtotal - onlineDiscount + codFee;

    // CREATE ORDER
    const order = await Order.create({
      userId: body.userId || "guest",

      items: body.items,

      total: finalTotal,

      codFee,
      onlineDiscount,

      customer: body.customer,

      paymentMethod,

      status: "pending",

      tracking: [
        {
          status: "Order Placed",
          date: new Date(),
        },
      ],
    });

    return NextResponse.json(order);

  } catch (err) {
    console.log("ORDER ERROR:", err);

    return NextResponse.json(
      { error: "Order failed" },
      { status: 500 }
    );
  }
}
