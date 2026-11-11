
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GenderNavbar() {
  const pathname = usePathname();

  const isMen = pathname === "/";
  const isWomen = pathname.startsWith("/women");
  

  return (
    <nav className="fixed left-0 right-0 top-[70px] z-[100] border-b border-orange-200/60 bg-white/80 shadow-[0_4px_20px_rgba(255,122,0,0.12)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="relative mx-auto flex max-w-md rounded-full border border-orange-200/70 bg-gradient-to-r from-orange-50 via-white to-amber-50 p-1.5 shadow-inner">

          {/* Animated Orange-Gold Sliding Pill */}
          <div
            className={`absolute bottom-1.5 top-1.5 w-[calc(50%-6px)] rounded-full bg-[linear-gradient(135deg,#ff7a00,#ffb300,#ff7a00)] shadow-[0_5px_18px_rgba(255,122,0,0.45)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isWomen ? "translate-x-full" : "translate-x-0"
            }`}
          />

          {/* MEN */}
          <Link
            href="/"
            className={`relative z-10 flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-bold transition-all duration-300 active:scale-95 ${
              isMen
                ? "scale-[1.02] text-white drop-shadow-sm"
                : "text-orange-900 hover:text-orange-600"
            }`}
          >
            <span className="text-xl">👨🏻</span>
            <span className="tracking-wide">MEN</span>
            {isMen && <span className="text-xs">✨</span>}
          </Link>

          {/* WOMEN */}
          <Link
            href="/women"
            className={`relative z-10 flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-bold transition-all duration-300 active:scale-95 ${
              isWomen
                ? "scale-[1.02] text-white drop-shadow-sm"
                : "text-orange-900 hover:text-orange-600"
            }`}
          >
            <span className="text-xl">👩🏻</span>
            <span className="tracking-wide">WOMEN</span>
            {isWomen && <span className="text-xs">✨</span>}
          </Link>

        </div>
      </div>
    </nav>
  );
}
