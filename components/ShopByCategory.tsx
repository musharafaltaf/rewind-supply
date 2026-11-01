// "use client";

// import { useEffect, useState } from "react";

// export default function ShopByCategory(){

// const [categories,setCategories] = useState<any[]>([]);

// useEffect(()=>{

// const loadCategories = async()=>{

// try{

// const res = await fetch("/api/categories");

// if(!res.ok){
// console.log("Categories API failed");
// return;
// }

// const text = await res.text();

// if(!text){
// setCategories([]);
// return;
// }

// const data = JSON.parse(text);

// setCategories(data);

// }catch(err){

// console.log("Categories error:",err);
// setCategories([]);

// }

// };

// loadCategories();

// },[]);

// return(

// <section className="max-w-7xl mx-auto px-4 py-10">

// <h2 className="text-xl font-bold mb-6">
// Shop by Category
// </h2>

// <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

// {categories.map((cat:any)=>(

// <div
// key={cat._id}
// className="border rounded p-4 text-center hover:shadow"
// >

// <img
// src={cat.image}
// className="w-full h-28 object-cover rounded mb-3"
// />

// <p className="font-medium">
// {cat.name}
// </p>

// </div>

// ))}

// </div>

// </section>

// );

// }








"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  image: string;
}

export default function ShopByCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/categories", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load categories");
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Categories error:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section
        aria-label="Shop by category"
        className="max-w-7xl mx-auto px-4 pt-3 pb-6 md:py-10"
      >
        <div className="h-6 w-40 mb-6 rounded shimmer" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
            >
              <div className="w-full h-36 md:h-48 shimmer" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // No categories available
  if (!categories.length) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-3 py-3 md:py-6">
      {/* Section heading */}
      <h2 className="text-2xl font-bold mb-4 md:mb-6">
        Shop by Category
      </h2>

      {/* Categories grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/category/${encodeURIComponent(
              cat.name.toLowerCase()
            )}`}
            aria-label={`Shop ${cat.name} category at Rewind Supply`}
            className="relative rounded-xl overflow-hidden cursor-pointer group active:scale-95 transition duration-150 block"
          >
            {/* Category image */}
            <img
              src={cat.image}
              alt={`${cat.name} collection at Rewind Supply`}
              loading="lazy"
              className="w-full h-36 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h3 className="text-white font-semibold text-lg tracking-wide text-center px-2">
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}