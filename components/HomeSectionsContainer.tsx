
"use client"

import FeaturedProducts from "@/components/FeaturedProducts"
import TrendingProducts from "@/components/TrendingProducts"
import HeroSlider from "@/components/HeroSlider"
import ShopByCategory from "@/components/ShopByCategory"
import StoreBenefits from "@/components/StoreBenefits"

export default function HomeSectionsContainer() {
  return (
    <div className="homeSections">
      <div className="page">
        <HeroSlider />
        <ShopByCategory />
        <FeaturedProducts />
        <TrendingProducts />
        <StoreBenefits />
      </div>

      <style jsx>{`
        .homeSections {
          position: relative;
          width: 100%;
          max-width: 100%;
          overflow-x: clip;
        }

        .page {
          width: 100%;
          max-width: 100%;
          min-height: 100vh;
          overflow: visible;
          padding: 10px 14px;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}