import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LuxuryHero } from "@/components/site/LuxuryHero";
import { LuxuryShowcase } from "@/components/site/LuxuryShowcase";
import { WhyUs } from "@/components/site/WhyUs";
import { BookingCTA } from "@/components/site/BookingCTA";
import { SectionDivider } from "@/components/site/SectionDivider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beauty Elegance — Luxury Beauty Atelier" },
      {
        name: "description",
        content: "Where Beauty Meets Elegance. An exclusive sanctuary for bespoke hair, skin, and ceremonial rituals.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative w-full">
      <LuxuryHero />
      <LuxuryShowcase />
      <SectionDivider />
      <div className="relative z-10 bg-blush-ivory">
        <WhyUs />
        <SectionDivider />
        <BookingCTA />
      </div>
    </div>
  );
}
