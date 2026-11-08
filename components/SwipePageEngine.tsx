"use client"

import { motion } from "framer-motion"
import { useRouter,usePathname } from "next/navigation"
import { useRef } from "react"

export default function SwipePageEngine({children}:{children:React.ReactNode}){

const router = useRouter()
const pathname = usePathname()

const startX = useRef(0)
const currentX = useRef(0)

const pages=[
"/",
"/combos",
"/flash-sale"
]

const handleStart=(e:any)=>{
startX.current = e.touches[0].clientX
}

const handleMove=(e:any)=>{
currentX.current = e.touches[0].clientX
}

const handleEnd=()=>{

const diff = startX.current - currentX.current

/* swipe threshold */

if(Math.abs(diff)<80) return

const index = pages.indexOf(pathname)

if(diff>0 && index < pages.length-1){

router.push(pages[index+1])

}

if(diff<0 && index>0){

router.push(pages[index-1])

}

}

return(

<motion.div
  initial={{opacity:1}}
  animate={{opacity:1}}
  exit={{opacity:1}}
  transition={{duration:0}}

onTouchStart={handleStart}
onTouchMove={handleMove}
onTouchEnd={handleEnd}

style={{
width:"100%",
minHeight:"100vh"
}}

>

{children}

</motion.div>

)

}