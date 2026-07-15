import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Testimonials } from "@/components/site/Testimonials";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Client Reviews — Beauty Elegance" },
      {
        name: "description",
        content: "Read the experiences of our esteemed clients at the Beauty Elegance atelier.",
      },
    ],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  return (
    <div className="relative w-full pt-20">
      <Testimonials />
    </div>
  );
}
