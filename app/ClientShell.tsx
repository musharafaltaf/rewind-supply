
"use client";

import Navbar from "../components/Navbar";
import GenderNavbar from "@/components/GenderNavbar";
import SupportButton from "@/components/SupportButton";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { SearchProvider } from "@/app/context/SearchContext";

import ClientLayout from "@/components/ClientLayout";
import ReviewPopup from "@/components/ReviewPopup";

import { usePathname } from "next/navigation";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideUI =
    pathname.startsWith("/register") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/loading") ||
    pathname.startsWith("/invite") ||
    pathname.startsWith("/wallet") ||
    pathname.startsWith("/intro") ||
    pathname.startsWith("/forgot") ||
    pathname.startsWith("/payment");

  return (
    <SearchProvider>
      <ReviewPopup />

      <CartProvider>
        <WishlistProvider>
          <ClientLayout>
            {!hideUI && <Navbar children={""} />}

            {!hideUI && <GenderNavbar />}

            {!hideUI && <SupportButton />}

            <div className="min-h-screen flex flex-col">
              <main
                className={`flex-1 relative z-10 ${
                  !hideUI ? "pb-[80px]" : ""
                }`}
              >
                <div className={!hideUI ? "pt-12" : ""}>
  <PageTransition>{children}</PageTransition>
</div>
              </main>

              {!hideUI && <BottomNav />}
            </div>
          </ClientLayout>
        </WishlistProvider>
      </CartProvider>
    </SearchProvider>
  );
}