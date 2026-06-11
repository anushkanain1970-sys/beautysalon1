import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Schema = z.object({ booking_id: z.string().uuid() });

export const Route = createFileRoute("/api/public/booking-status-email")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const json = await request.json().catch(() => ({}));
        const parsed = Schema.safeParse(json);
        if (!parsed.success) return new Response("Bad request", { status: 400 });
        // Forward to unified notify endpoint with event=status
        const url = new URL(request.url);
        const res = await fetch(`${url.origin}/api/public/booking-notify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking_id: parsed.data.booking_id, event: "status" }),
        });
        return new Response(await res.text(), { status: res.status });
      },
    },
  },
});
