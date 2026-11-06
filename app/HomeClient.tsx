
"use client";

import { useState } from "react";
import HomeSectionsContainer from "@/components/HomeSectionsContainer";
import DiscountPopup from "@/components/DiscountPopup";

export default function HomeClient() {
  const [index, setIndex] = useState(0);

  return (
    <>
      <DiscountPopup />

      <main className="pageWrapper">
        <HomeSectionsContainer
          index={index}
          setIndex={setIndex}
        />
      </main>
    </>
  );
}
