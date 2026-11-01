"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

interface Banner {
  _id?: string;
  title?: string;
  subtitle?: string;
  image: string;
  link?: string;
}

export default function HeroSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Load banners from admin
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await fetch("/api/banners", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load banners");
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setBanners(data);
        }
      } catch (error) {
        console.error("Banner error:", error);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section
        aria-label="Featured offers"
        className="max-w-7xl mx-auto px-4 py-6"
      >
        <div className="relative rounded-xl overflow-hidden">
          <div className="w-full h-[220px] md:h-[420px] bg-gray-200 shimmer" />

          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16">
            <div className="h-6 md:h-10 w-2/3 rounded shimmer mb-3" />
            <div className="h-4 md:h-6 w-1/2 rounded shimmer mb-4" />
            <div className="h-10 w-[140px] rounded-md shimmer" />
          </div>
        </div>
      </section>
    );
  }

  // No banners available
  if (!banners.length) {
    return null;
  }

  return (
    <section
      aria-label="Rewind Supply featured collections and offers"
      className="max-w-7xl mx-auto px-4 py-6"
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
        }}
        loop={banners.length > 1}
        className="rounded-xl overflow-hidden"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner._id || index}>
            <div
              className={`relative ${
                banner.link ? "cursor-pointer" : ""
              }`}
              onClick={() => {
                if (banner.link) {
                  router.push(banner.link);
                }
              }}
              onKeyDown={(e) => {
                if (banner.link && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  router.push(banner.link);
                }
              }}
              role={banner.link ? "link" : undefined}
              tabIndex={banner.link ? 0 : undefined}
              aria-label={banner.link ? `Explore ${banner.title || "collection"}` : undefined}
            >
              <img
                src={banner.image}
                alt={
                  banner.title
                    ? `${banner.title} - Rewind Supply`
                    : "Rewind Supply featured shopping banner"
                }
                className="w-full h-[220px] md:h-[420px] object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Banner content */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 text-white">
                {banner.title && (
                  <h2 className="text-2xl md:text-5xl font-bold">
                    {banner.title}
                  </h2>
                )}

                {banner.subtitle && (
                  <p className="text-sm md:text-xl mt-2">
                    {banner.subtitle}
                  </p>
                )}

                {banner.link && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(banner.link!);
                    }}
                    className="mt-4 bg-white text-black px-6 py-2 rounded w-fit font-medium hover:scale-105 transition"
                  >
                    Shop Now
                  </button>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}