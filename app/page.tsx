// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import FlashSale from "@/components/FlashSale";
// import ProductRating from "@/components/ProductRating";

// export default function HomePage() {

//   const [products, setProducts] = useState<any[]>([]);

//   useEffect(() => {

//     const fetchProducts = async () => {

//       try {

//         const res = await fetch("/api/products");

//         if (!res.ok) {
//           console.error("API error");
//           return;
//         }

//         const data = await res.json();

//         setProducts(data);

//       } catch (error) {
//         console.error("Fetch error:", error);
//       }

//     };

//     fetchProducts();

//   }, []);

//   return (

//     <main className="max-w-7xl mx-auto p-8">

//       <h1 className="text-3xl font-bold mb-8">
//         Products
//       </h1>

//       {/* ⚡ Flash Sale Section */}
//       <FlashSale />

//       {/* Product Grid */}

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">

//         {products.map((product: any) => (

//           <Link key={product._id} href={`/product/${product._id}`}>

//             <div className="border p-4 rounded hover:shadow-lg transition">

//               <img
//                 src={product.image || "https://via.placeholder.com/300"}
//                 alt={product.name}
//                 className="w-full h-60 object-cover rounded"
//               />

//               <h2 className="mt-3 font-semibold">
//                 {product.name}
//               </h2>

//               <p className="text-gray-500">
//                 ₹{product.price}
//               </p>

//             </div>

//           </Link>

//         ))}

//       </div>

//     </main>

//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import ProductCard from "@/components/ProductCard";

// export default function HomePage(){

// const [products,setProducts] = useState<any[]>([]);

// useEffect(()=>{

// const loadProducts = async()=>{

// const res = await fetch("/api/products");
// const data = await res.json();

// setProducts(data);

// };

// loadProducts();

// },[]);

// return(

// <main className="max-w-7xl mx-auto px-4 py-10">

// <h1 className="text-2xl md:text-3xl font-bold mb-8">
// Featured Products
// </h1>

// <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

// {products.map((product:any)=>(
// <ProductCard key={product._id} product={product}/>
// ))}

// </div>

// </main>

// );

// }


// import HeroSlider from "@/components/HeroSlider"
// import Categories from "@/components/Categories"
// import StoreBenefits from "@/components/StoreBenefits"
// import ProductCard from "@/components/ProductCard"
// import TrendingProducts from "@/components/TrendingProducts"
// import FlashSale from "@/components/FlashSale";
// import PromoBanner from "@/components/PromoBanner";
// import RecentlyViewed from "@/components/RecentlyViewed";
// import FeaturedProducts from "@/components/FeaturedProducts";
// import ShopByCategory from "@/components/ShopByCategory";
// import Hero from "@/components/Hero";

// export default function Home(){

// return(

// <main className="relative z-10">

// <HeroSlider/>

// <Categories/>

// <TrendingProducts/>
// <FlashSale/>
// <PromoBanner/>
// <RecentlyViewed/>
// <FeaturedProducts/>
// <ShopByCategory/>
// <Hero/>

// <section className="max-w-7xl mx-auto px-4 py-10">

// <h2 className="text-2xl font-bold mb-6">
// Featured Products
// </h2>

// </section>

// <StoreBenefits/>

// </main>

// )

// }


// "use client"

// import { useState } from "react"

// import HeroSlider from "@/components/HeroSlider"
// import StoreBenefits from "@/components/StoreBenefits"
// import TrendingProducts from "@/components/TrendingProducts"
// import FlashSale from "@/components/FlashSale"
// import RecentlyViewed from "@/components/RecentlyViewed"
// import FeaturedProducts from "@/components/FeaturedProducts"
// import ShopByCategory from "@/components/ShopByCategory"

// import HomeSectionsNav from "@/components/HomeSectionsNav"

// export default function Home(){

// const [mode,setMode] = useState<"products"|"combos">("products")

// return(

// <main className="relative z-10">

// {/* HERO */}

// <HeroSlider/>

// {/* CATEGORIES */}

// <ShopByCategory/>
// <HomeSectionsNav/>




// {/* PRODUCTS MODE */}

// {mode==="products" && (

// <>

// <FeaturedProducts/>

// <TrendingProducts/>

// <FlashSale/>

// <RecentlyViewed/>

// </>

// )}

// {/* COMBO MODE */}


// {/* BENEFITS */}

// <StoreBenefits/>


// </main>

// )

// }





import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Rewind Supply | Shop Online",
  description:
    "Discover Rewind Supply. Explore our latest products, browse collections, and shop online.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Rewind Supply | Shop Online",
    description:
      "Discover Rewind Supply. Explore our latest products and shop online.",
    url: "https://rewindsupply.online/",
    siteName: "Rewind Supply",
    type: "website",
  },
};

export default function Home() {
  return <HomeClient />;
}