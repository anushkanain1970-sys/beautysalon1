import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExploreByMood } from "@/components/site/ExploreByMood";
import { Services as ServicesGrid } from "@/components/site/Services";
import { PremiumProducts } from "@/components/site/PremiumProducts";
import { SectionDivider } from "@/components/site/SectionDivider";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Signature Services — Beauty Elegance" },
      {
        name: "description",
        content: "Explore our curated menu of hair styling, bridal makeup, skincare, and ceremonial facial rituals.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="relative w-full pt-20">
      <ExploreByMood />
      <SectionDivider />
      <ServicesGrid />
      <SectionDivider />
      <PremiumProducts />
    </div>
  );
}
