"use client";

import { useState } from "react";
import HomeSectionsContainer from "@/components/HomeSectionsContainer";

export default function HomeClient() {
  const [index, setIndex] = useState(0);

  return (
    <main className="pageWrapper">
      <HomeSectionsContainer
        index={index}
        setIndex={setIndex}
      />
    </main>
  );
}