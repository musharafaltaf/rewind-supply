
// "use client";

// import Link from "next/link";
// import { useCart } from "@/app/context/CartContext";

// export default function ProductCard({ product }: any) {
//   const { addToCart } = useCart();

//   /* DISCOUNT */
//   const discount = product?.mrp
//     ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
//     : 0;

//   const stock = product?.stock ?? 1;

//   return (
//     <div className="group bg-white rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      
//       {/* IMAGE */}
//       <Link href={`/product/${product?._id}`}>
//         <div className="relative w-full aspect-square overflow-hidden bg-gray-100">

//           <img
//             src={product?.image || "/placeholder.png"}
//             alt={product?.name}
//             className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
//           />

//           {/* NEW Badge */}
//           {product?.isNew && (
//             <div className="absolute top-2 left-2 bg-black text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
//               NEW
//             </div>
//           )}

//           {/* Discount Badge */}
//           {discount > 0 && (
//             <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
//               {discount}% OFF
//             </div>
//           )}

//           {/* Out of Stock Overlay */}
//           {stock === 0 && (
//             <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
//               <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
//                 Out of Stock
//               </span>
//             </div>
//           )}

//           {/* Quick View Button */}
// {stock !== 0 && (
//   <div className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
//     <Link href={`/product/${product?._id}`}>
//       <button
//         onClick={(e) => e.stopPropagation()}
//         className="bg-white text-black px-4 py-2 rounded-lg shadow-lg text-sm font-medium hover:bg-gray-100"
//       >
//         Quick View
//       </button>
//     </Link>
//   </div>
// )}
//         </div>
//       </Link>

//       {/* CONTENT */}
//       <div className="p-3">
        
//         {/* PRODUCT NAME */}
//         <Link href={`/product/${product?._id}`}>
//           <h3 className="text-sm md:text-base font-medium line-clamp-2 hover:underline cursor-pointer min-h-[40px]">
//             {product?.name}
//           </h3>
//         </Link>

//         {/* PRICE */}
//         <div className="flex items-center gap-2 mt-2 flex-wrap">
//           <p className="font-bold text-lg text-black">
//             ₹{product?.price}
//           </p>

//           {product?.mrp && (
//             <p className="text-gray-400 line-through text-xs">
//               ₹{product?.mrp}
//             </p>
//           )}

          
//         </div>

//         {/* SIZES */}
//         {product?.sizes?.length > 0 && (
//           <p className="text-xs text-gray-500 mt-2">
//             Sizes: {product.sizes.join(" • ")}
//           </p>
//         )}

//         {/* Free Delivery Badge */}
// <div className="mt-2">
//   <span className="inline-flex items-center bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
//     🚚 Free Delivery
//   </span>
// </div>

//         {/* ADD TO CART */}
//         <div className="mt-3">
//           <button
//             disabled={stock === 0}
//             onClick={() => addToCart({ ...product, quantity: 1 })}
//             className={`w-full py-2 rounded-lg font-medium transition-all duration-200 ${
//               stock === 0
//                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 :  "bg-[#b9e3f5] text-black hover:bg-[#a5d8ef] active:scale-95"
//             }`}
//           >
//             {stock === 0 ? "Out of Stock" : "Add to Bag"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  image?: string;
  price: number;
  mrp?: number;
  stock?: number;
  isNew?: boolean;
  sizes?: string[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const stock = product?.stock ?? 1;

  const isOutOfStock = stock <= 0;

  // Calculate discount safely
  const discount =
    product?.mrp &&
    product.mrp > product.price &&
    product.price >= 0
      ? Math.round(
          ((product.mrp - product.price) / product.mrp) * 100
        )
      : 0;

  const productUrl = `/product/${product._id}`;

  return (
    <article className="group bg-white overflow-hidden">
      {/* PRODUCT IMAGE */}
      <Link
        href={productUrl}
        aria-label={`View ${product.name}`}
      >
        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-[#f1f1f1]">

          <img
            src={product.image || "/placeholder.png"}
            alt={`${product.name} - Rewind Supply`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* NEW BADGE */}
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-[#b9e3f5] text-black text-[10px] font-bold px-2.5 py-1 rounded">
              NEW
            </span>
          )}

          {/* DISCOUNT BADGE */}
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-white text-black text-[11px] font-bold px-2 py-1 rounded">
              {discount}% OFF
            </span>
          )}

          {/* OUT OF STOCK */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-black text-xs font-semibold px-3 py-2 rounded">
                Out of Stock
              </span>
            </div>
          )}

        </div>
      </Link>

      {/* PRODUCT DETAILS */}
      <div className="pt-3 pb-4 px-1">

        {/* PRODUCT NAME */}
        <Link href={productUrl}>
          <h3 className="text-[13px] sm:text-sm text-gray-700 font-normal line-clamp-2 leading-5 hover:text-black transition">
            {product.name}
          </h3>
        </Link>

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">

          <span className="text-base sm:text-lg font-bold text-black">
            ₹{product.price}
          </span>

          {product.mrp && product.mrp > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.mrp}
            </span>
          )}

          {discount > 0 && (
            <span className="text-[11px] font-semibold text-green-600">
              {discount}% off
            </span>
          )}

        </div>

        {/* SIZES */}
        {product.sizes && product.sizes.length > 0 && (
          <p className="text-[11px] text-gray-500 mt-1">
            Sizes: {product.sizes.join(" • ")}
          </p>
        )}

        {/* STOCK STATUS */}
        {stock > 0 && stock <= 5 && (
          <p className="text-[11px] text-orange-600 mt-1 font-medium">
            Only {stock} left
          </p>
        )}

      </div>
    </article>
  );
}