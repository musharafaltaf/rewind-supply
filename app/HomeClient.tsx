
"use client";

import HomeSectionsContainer from "@/components/HomeSectionsContainer";
import DiscountPopup from "@/components/DiscountPopup";

export default function HomeClient() {
  return (
    <>
      <DiscountPopup />

      <main className="pageWrapper">
        <HomeSectionsContainer />
      </main>
    </>
  );
}
