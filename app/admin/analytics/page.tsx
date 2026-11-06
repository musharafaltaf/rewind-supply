"use client";

import { useEffect, useState } from "react";

export default function Analytics() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Analytics error:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const validOrders = orders.filter(
    (order) =>
      !["cancelled", "refunded", "returned"].includes(
        order.status?.toLowerCase()
      )
  );

  const totalRevenue = validOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const totalCODFees = validOrders.reduce(
    (sum, order) => sum + Number(order.codFee || 0),
    0
  );

  const totalPrepaidDiscounts = validOrders.reduce(
    (sum, order) => sum + Number(order.onlineDiscount || 0),
    0
  );

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">Store Analytics</h1>

      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <div className="space-y-3">
          <p>Total Orders: {orders.length}</p>

          <p>Active Orders: {validOrders.length}</p>

          <p className="text-xl font-bold text-green-700">
            Total Revenue: ₹{totalRevenue.toFixed(2)}
          </p>

          <p className="text-orange-600">
            COD Fees Collected: ₹{totalCODFees.toFixed(2)}
          </p>

          <p className="text-green-600">
            Prepaid Discounts Given: ₹{totalPrepaidDiscounts.toFixed(2)}
          </p>
        </div>
      )}
    </main>
  );
}