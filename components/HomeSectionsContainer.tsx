"use client"

import { useEffect, useRef } from "react"

import FeaturedProducts from "@/components/FeaturedProducts"
import TrendingProducts from "@/components/TrendingProducts"
import HeroSlider from "@/components/HeroSlider"
import ShopByCategory from "@/components/ShopByCategory"
import StoreBenefits from "@/components/StoreBenefits"
import HomeSectionsNav from "@/components/HomeSectionsNav"

export default function HomeSectionsContainer({
index,
setIndex
}:{
index:number
setIndex:(i:number)=>void
}){

const startX = useRef(0)
const currentX = useRef(0)
const dragging = useRef(false)

const sliderRef = useRef<HTMLDivElement>(null)

useEffect(()=>{

const slider = sliderRef.current

if(!slider) return

slider.style.transition =
"transform .35s cubic-bezier(.4,.8,.2,1)"

slider.style.transform =
`translate3d(-${index * 100}%,0,0)`

},[index])

/* TOUCH START */

const handleStart=(e:any)=>{

dragging.current = true

startX.current = e.touches[0].clientX

currentX.current = startX.current

}

/* TOUCH MOVE */

const handleMove=(e:any)=>{

if(!dragging.current) return

currentX.current = e.touches[0].clientX

const diff = currentX.current - startX.current

const slider = sliderRef.current
if(!slider) return

const width = slider.clientWidth
const offset = (-index * width) + diff

slider.style.transition = "none"
slider.style.transform = `translate3d(${offset}px,0,0)`

}

/* TOUCH END */

const handleEnd=()=>{

if(!dragging.current) return

dragging.current = false

const diff = currentX.current - startX.current

let newIndex = index

if(diff < -80 && index < 0){
newIndex = index + 1
}

if(diff > 80 && index > 0){
newIndex = index - 1
}

setIndex(newIndex)

const slider = sliderRef.current
if(!slider) return

const width = slider.clientWidth

slider.style.transition = "transform .35s cubic-bezier(.4,.8,.2,1)"
slider.style.transform = `translate3d(${-newIndex * width}px,0,0)`

}

return(

<div
className="slider"
onTouchStart={handleStart}
onTouchMove={handleMove}
onTouchEnd={handleEnd}
>

<div
className="track"
ref={sliderRef}
>

{/* PRODUCTS PAGE */}


<div className="page">

{/* HERO + CATEGORY ONLY HERE */}

<HeroSlider/>
<ShopByCategory/>

{/* PRODUCTS */}

<FeaturedProducts/>
<TrendingProducts/>

{/* BENEFITS */}

<StoreBenefits/>

</div>


</div>

<style jsx>{`

.slider {
  position: relative;
  width: 100%;
  max-width: 100%;
  overflow-x: clip;
  overflow-y: visible;
  touch-action: pan-y;
}

.track {
  display: flex;
  width: 100%;
  transition: transform 0.35s cubic-bezier(.4,.8,.2,1);
}

.page {
  flex: 0 0 100%;
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




