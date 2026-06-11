import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { WhyUs } from "@/components/site/WhyUs";
import { Gallery } from "@/components/site/Gallery";
import { Testimonials } from "@/components/site/Testimonials";
import { Team } from "@/components/site/Team";
import { Booking } from "@/components/site/Booking";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Lumière — Luxury Beauty Atelier in Paris" },
      {
        name: "description",
        content:
          "Maison Lumière is a luxury beauty atelier in Paris offering couture hair, bridal, skincare and ceremonial spa rituals in private suites.",
      },
      { property: "og:title", content: "Maison Lumière — Luxury Beauty Atelier" },
      {
        property: "og:description",
        content:
          "Couture hair, bridal artistry, advanced skincare and spa rituals — crafted by an atelier of award-winning artisans.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ivory text-charcoal">
      <Nav />
      <Hero />
      <About />
      <Services />
      <WhyUs />
      <Gallery />
      <Testimonials />
      <Team />
      <Booking />
      <Footer />
    </main>
  );
}
