
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function OrderDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const SUPPORT_NUMBER = "917006134273";

  /* ========================= */
  /* LOAD ORDER */
  /* ========================= */

  const loadOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        cache: "no-store",
      });

      const data = await res.json();

      setOrder(data);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  /* ========================= */
  /* AUTO REFRESH */
  /* ========================= */

  useEffect(() => {
    loadOrder();

    const interval = setInterval(loadOrder, 3000);

    return () => clearInterval(interval);
  }, []);

  /* ========================= */
  /* CANCEL ORDER */
  /* ========================= */

  const cancelOrder = async () => {
    if (!confirm("Cancel this order?")) return;

    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "cancelled",
      }),
    });

    loadOrder();
  };

  /* ========================= */
  /* WHATSAPP SUPPORT */
  /* ========================= */

  const openSupport = () => {
    const msg = `Hello Rewind Supply

Need help with order ${order._id}`;

    const url = `https://wa.me/${SUPPORT_NUMBER}?text=${encodeURIComponent(
      msg
    )}`;

    window.open(url, "_blank");
  };

  /* ========================= */
  /* DOWNLOAD INVOICE */
  /* ========================= */

  const downloadInvoice = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Rewind Supply", 15, 20);

    doc.setFontSize(10);
    doc.text(`Order ID: ${order._id}`, 15, 28);
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
      15,
      34
    );

    const rows = order.items.map((item: any) => [
      item.name,
      item.size || "-",
      item.quantity,
      `Rs. ${item.price}`,
      `Rs. ${Number(item.price) * Number(item.quantity || 1)}`,
    ]);

    autoTable(doc, {
      startY: 42,
      head: [["Product", "Size", "Qty", "Price", "Total"]],
      body: rows,
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 42;

    const subtotal = order.items.reduce(
      (sum: number, item: any) =>
        sum + Number(item.price) * Number(item.quantity || 1),
      0
    );

    let y = finalY + 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    doc.text(`Subtotal: Rs. ${subtotal.toFixed(2)}`, 150, y);

    y += 8;

    if (Number(order.onlineDiscount || 0) > 0) {
      doc.setTextColor(0, 150, 0);

      doc.text(
        `Prepaid Discount: -Rs. ${Number(
          order.onlineDiscount
        ).toFixed(2)}`,
        150,
        y
      );

      y += 8;
    }

    if (Number(order.codFee || 0) > 0) {
      doc.setTextColor(200, 100, 0);

      doc.text(
        `COD Handling Fee: +Rs. ${Number(order.codFee).toFixed(2)}`,
        150,
        y
      );

      y += 8;
    }

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);

    doc.text(
      `Total Amount: Rs. ${Number(order.total).toFixed(2)}`,
      150,
      y + 5
    );

    doc.save(`invoice_${order._id}.pdf`);
  };

  /* ========================= */
  /* RETURN WINDOW */
  /* ========================= */

  const deliveredTime = new Date(
    order?.deliveredAt || order?.createdAt
  );

  const diffHours =
    (Date.now() - deliveredTime.getTime()) / 3600000;

  const allowReturn =
    order?.status === "delivered" && diffHours <= 48;

  /* ========================= */
  /* TRACKING */
  /* ========================= */

  const steps = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered",
  ];

  const labels = [
    "Order Placed",
    "Confirmed",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  const currentStep = steps.indexOf(order?.status);

  /* ========================= */
  /* LOADING */
  /* ========================= */

  if (loading) {
    return <p className="p-10 text-center">Loading...</p>;
  }

  if (!order) {
    return <p className="p-10 text-center">Order not found</p>;
  }

  const deliveryDate = new Date(
    new Date(order.createdAt).getTime() + 5 * 86400000
  ).toDateString();

  /* ========================= */
  /* PRICE CALCULATIONS */
  /* ========================= */

  const subtotal = order.items.reduce(
    (sum: number, item: any) =>
      sum + Number(item.price) * Number(item.quantity || 1),
    0
  );

  const onlineDiscount = Number(order.onlineDiscount || 0);
  const codFee = Number(order.codFee || 0);
  const finalTotal = Number(order.total || 0);

  /* ========================= */
  /* UI */
  /* ========================= */

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 animate-fadeIn">
      <h1 className="text-xl font-bold mb-2">
        Order Details
      </h1>

      <p className="text-sm text-gray-500">
        Order ID: {order._id}
      </p>

      {!["cancelled", "rejected", "delivered"].includes(
  order.status?.toLowerCase()
) && (
  <p className="text-sm text-green-600 mb-4">
    Expected Delivery: {deliveryDate}
  </p>
)}

      {/* STATUS BADGE */}

      <p
        className={`inline-block mb-6 text-xs px-3 py-1 rounded-full
        ${
          order.status === "delivered"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {order?.status
          ? order.status.replaceAll("_", " ")
          : "pending"}
      </p>

      {/* ========================= */}
      {/* ORDER TRACKING */}
      {/* ========================= */}

      <div className="border rounded-xl p-5 mb-6 bg-white shadow-sm">
        <h2 className="font-semibold mb-4">
          Order Tracking
        </h2>

        {/* PROGRESS BAR */}

        <div className="w-full bg-gray-200 h-2 rounded mb-6">
          <div
            className="bg-green-600 h-2 rounded transition-all duration-500"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        <div className="relative pl-6">
          {labels.map((label, i) => {
            const done = i <= currentStep;

            return (
              <div key={i} className="flex items-start mb-6">
                <div
                  className={`w-4 h-4 rounded-full mt-1 transition-all duration-300
                  ${
                    done
                      ? "bg-green-600 scale-110 shadow-md"
                      : "bg-gray-300"
                  }`}
                />

                <div className="ml-3">
                  <p
                    className={`font-medium ${
                      done ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-gray-200" />
        </div>
      </div>

      {/* ========================= */}
      {/* PRODUCTS */}
      {/* ========================= */}

      {order?.items?.length > 0 &&
        order.items.map((item: any) => (
          <Link
            href={`/product/${item._id}`}
            key={item._id}
            className="flex gap-4 border p-4 rounded-xl mb-4 bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            <img
              src={item.image}
              className="w-20 h-20 object-cover rounded transition-transform duration-200 hover:scale-105"
            />

            <div className="flex-1">
              <p className="font-semibold">
                {item.name}
              </p>

              <p className="text-sm text-gray-500">
                Size: {item.size}
              </p>

              <p className="text-sm text-gray-500">
                Qty: {item.quantity}
              </p>

              <p className="font-bold">
                ₹{item.price}
              </p>
            </div>
          </Link>
        ))}

      {/* ========================= */}
      {/* PRICE DETAILS */}
      {/* ========================= */}

      <div className="border rounded-xl p-5 mb-6 bg-white shadow-sm">
        <h2 className="font-semibold text-lg mb-4">
          Price Details
        </h2>

        <div className="flex justify-between mb-3">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        {onlineDiscount > 0 && (
          <div className="flex justify-between text-green-600 mb-3">
            <span>Extra 5% Prepaid Discount</span>
            <span>-₹{onlineDiscount.toFixed(2)}</span>
          </div>
        )}

        {codFee > 0 && (
          <div className="flex justify-between text-orange-600 mb-3">
            <span>COD Handling Fee</span>
            <span>+₹{codFee.toFixed(2)}</span>
          </div>
        )}

        <hr className="my-4" />

        <div className="flex justify-between font-bold text-lg">
          <span>Total Amount</span>
          <span>₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* ========================= */}
      {/* ACTION BUTTONS */}
      {/* ========================= */}

      <div className="flex flex-wrap gap-3 mt-6">
        {/* CANCEL */}

        {["pending", "confirmed", "processing"].includes(
          order.status
        ) && (
          <button
            onClick={cancelOrder}
            className="border px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            Cancel
          </button>
        )}

        {/* RETURN */}

        {allowReturn && (
          <Link
            href={`/orders/${order._id}/return`}
            className="border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Return
          </Link>
        )}

        {/* EXCHANGE */}

        {allowReturn && (
          <Link
            href={`/orders/${order._id}/exchange`}
            className="border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Exchange
          </Link>
        )}

        {/* INVOICE */}

        <button
          onClick={downloadInvoice}
          className="border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Download Invoice
        </button>

        {/* HELP */}

        <button
          onClick={openSupport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          Need Help
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease;
        }
      `}</style>
    </main>
  );
}
