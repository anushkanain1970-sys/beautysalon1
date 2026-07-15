import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Booking } from "@/components/site/Booking";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book Appointment — Beauty Elegance" },
      {
        name: "description",
        content: "Reserve your private suite and experience the pinnacle of luxury beauty. Our artisans await.",
      },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  return (
    <div className="relative w-full pt-20 bg-blush-ivory">
      <Booking />
    </div>
  );
}
