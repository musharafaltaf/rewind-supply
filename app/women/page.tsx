"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function WomenPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");

        if (!res.ok) {
          setProducts([]);
          return;
        }

        const data = await res.json();

        // Only women's products
        const womenProducts = data.filter(
  (p: any) => p.gender === "women" && p.womenSection === true
);

        setProducts(womenProducts);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-orange-50/30">
      {/* Women's Hero */}
      <section className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 px-4 py-12 text-center text-white">
        <p className="mb-2 text-sm tracking-[0.3em]">REWIND SUPPLY</p>

        <h1 className="text-4xl font-extrabold md:text-6xl">
          WOMEN'S COLLECTION
        </h1>

        <p className="mt-3">
          Discover your style. Wear your confidence.
        </p>
      </section>

      {/* Women's Products */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-6 text-2xl font-bold">
          Women's Products
        </h2>

        {loading ? (
          <p className="py-10 text-center">Loading collection...</p>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-white py-16 text-center">
            <p className="text-4xl">👗</p>
            <h3 className="mt-4 text-xl font-bold">
              Collection Coming Soon
            </h3>
            <p className="mt-2 text-gray-500">
              Women's products will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}