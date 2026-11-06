
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DiscountPopup() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const completed = localStorage.getItem(
      "rewind_first_order_completed"
    );

    const dismissed = sessionStorage.getItem(
      "rewind_discount_popup_closed"
    );

    // Consume the Explore flag once
    if (dismissed) {
      sessionStorage.removeItem("rewind_discount_popup_closed");
      return;
    }

    if (!completed) {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  const closePopup = () => {
    setOpen(false);
  };

  const exploreCollection = () => {
    sessionStorage.setItem(
      "rewind_discount_popup_closed",
      "true"
    );

    setOpen(false);
    router.push("/");
  };

  return (
    <div
      onClick={closePopup}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[90vw] sm:w-[60vw] max-w-[620px] max-h-[65vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white shadow-2xl animate-[popupIn_.35s_ease-out]"
      >
        {/* Close Button */}
        <button
          onClick={closePopup}
          aria-label="Close popup"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-orange-500"
        >
          ✕
        </button>

        {/* Popup Content */}
        <div className="relative overflow-hidden bg-[#111111] px-5 py-9 sm:px-10 sm:py-12 text-center text-white">
          {/* Background Effects */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative">
            {/* Brand */}
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-orange-400">
              REWIND SUPPLY
            </p>

            {/* Discount */}
            <h2 className="text-5xl font-black tracking-tight sm:text-7xl">
              10<span className="text-orange-500">%</span>
            </h2>

            <p className="mt-1 text-xl font-bold uppercase tracking-[0.2em] sm:text-2xl">
              OFF
            </p>

            {/* Divider */}
            <div className="mx-auto my-5 h-[2px] w-14 bg-orange-500" />

            <p className="text-sm text-gray-300 sm:text-base">
              Discover your next favourite style.
            </p>

            {/* Explore Collection */}
            <button
              onClick={exploreCollection}
              className="mt-7 inline-flex items-center justify-center gap-3 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-black transition duration-300 hover:bg-orange-400 hover:scale-[1.03] active:scale-95"
            >
              Explore Collection
              <span className="text-lg">→</span>
            </button>

            <p className="mt-5 text-[10px] uppercase tracking-widest text-gray-500">
              Limited-time offer · Shop now
            </p>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes popupIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(15px);
          }

          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
