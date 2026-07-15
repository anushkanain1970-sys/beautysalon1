import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/site/About";
import { Team } from "@/components/site/Team";
import { SectionDivider } from "@/components/site/SectionDivider";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Beauty Elegance" },
      {
        name: "description",
        content: "Discover the founding philosophy and the artisan team behind Beauty Elegance, a luxury beauty sanctuary.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="relative w-full pt-20">
      <About />
      <SectionDivider />
      <Team />
    </div>
  );
}
