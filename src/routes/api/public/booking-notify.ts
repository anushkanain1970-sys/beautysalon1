import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Schema = z.object({
  booking_id: z.string().uuid(),
  event: z.enum(["new", "status"]).default("new"),
});

const GATEWAY = "https://connector-gateway.lovable.dev";

async function sendEmail(opts: { to: string; subject: string; html: string }) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.SALON_FROM_EMAIL || "Maison Lumière <onboarding@resend.dev>";
  if (!lovableKey || !resendKey) {
    console.warn("[notify] Email skipped — RESEND_API_KEY not configured");
    return { skipped: true };
  }
  const res = await fetch(`${GATEWAY}/resend/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
    },
    body: JSON.stringify({ from, to: [opts.to], subject: opts.subject, html: opts.html }),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error("[notify] Resend error", res.status, t);
    return { error: t };
  }
  return await res.json();
}

async function sendWhatsApp(opts: { to: string; body: string }) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const twilioKey = process.env.TWILIO_API_KEY;
  const from = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+14155238886"
  if (!lovableKey || !twilioKey || !from) {
    console.warn("[notify] WhatsApp skipped — Twilio not configured");
    return { skipped: true };
  }
  const to = opts.to.startsWith("whatsapp:") ? opts.to : `whatsapp:${opts.to}`;
  const res = await fetch(`${GATEWAY}/twilio/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": twilioKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: to, From: from, Body: opts.body }),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error("[notify] Twilio error", res.status, t);
    return { error: t };
  }
  return await res.json();
}

function fmt(d: string | null, t: string | null) {
  if (!d) return "to be confirmed";
  const date = new Date(d).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  return t ? `${date} at ${t}` : date;
}

function customerHtml(b: any, svc: string) {
  return `<div style="font-family:Georgia,serif;color:#2a2a2a;max-width:560px;margin:0 auto;padding:32px">
    <h1 style="font-weight:400;font-size:24px;color:#1a1a1a">Hello ${b.name},</h1>
    <p>Thank you for booking with <strong>Maison Lumière</strong>. We've received your reservation request and an artisan will reach out within 24 hours to confirm.</p>
    <div style="border:1px solid #eee;border-radius:8px;padding:16px;margin:24px 0;background:#fafafa">
      <p style="margin:4px 0"><strong>Service:</strong> ${svc}</p>
      <p style="margin:4px 0"><strong>When:</strong> ${fmt(b.preferred_date, b.preferred_time)}</p>
      ${b.message ? `<p style="margin:4px 0"><strong>Your note:</strong> ${b.message}</p>` : ""}
    </div>
    <p style="color:#666;font-size:13px">Status: <strong>${b.status}</strong></p>
    <p style="color:#666;font-size:13px">With care,<br/>Maison Lumière</p>
  </div>`;
}

function adminHtml(b: any, svc: string) {
  return `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
    <h2>New booking received</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:4px 8px"><strong>Name</strong></td><td>${b.name}</td></tr>
      <tr><td style="padding:4px 8px"><strong>Email</strong></td><td>${b.email}</td></tr>
      ${b.phone ? `<tr><td style="padding:4px 8px"><strong>Phone</strong></td><td>${b.phone}</td></tr>` : ""}
      <tr><td style="padding:4px 8px"><strong>Service</strong></td><td>${svc}</td></tr>
      <tr><td style="padding:4px 8px"><strong>When</strong></td><td>${fmt(b.preferred_date, b.preferred_time)}</td></tr>
      ${b.message ? `<tr><td style="padding:4px 8px"><strong>Notes</strong></td><td>${b.message}</td></tr>` : ""}
    </table>
  </div>`;
}

function statusHtml(b: any, svc: string) {
  const titles: Record<string, string> = {
    confirmed: "Your booking is confirmed",
    completed: "Thank you for visiting",
    cancelled: "Your booking has been cancelled",
    new: "Your booking is being reviewed",
  };
  return `<div style="font-family:Georgia,serif;color:#2a2a2a;max-width:560px;margin:0 auto;padding:32px">
    <h1 style="font-weight:400;font-size:24px;color:#1a1a1a">${titles[b.status] ?? "Booking update"}</h1>
    <p>Hello ${b.name}, here's the latest on your <strong>${svc}</strong> appointment.</p>
    <div style="border:1px solid #eee;border-radius:8px;padding:16px;margin:24px 0;background:#fafafa">
      <p style="margin:4px 0"><strong>When:</strong> ${fmt(b.preferred_date, b.preferred_time)}</p>
      <p style="margin:4px 0"><strong>Status:</strong> ${b.status}</p>
    </div>
    <p style="color:#666;font-size:13px">With care,<br/>Maison Lumière</p>
  </div>`;
}

export const Route = createFileRoute("/api/public/booking-notify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const json = await request.json().catch(() => ({}));
        const parsed = Schema.safeParse(json);
        if (!parsed.success) return new Response("Bad request", { status: 400 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: booking, error } = await supabaseAdmin
          .from("bookings")
          .select("*, services(name)")
          .eq("id", parsed.data.booking_id)
          .maybeSingle();
        if (error || !booking) return new Response("Not found", { status: 404 });

        const svc = (booking as any).services?.name ?? "Consultation";
        const adminEmail = process.env.SALON_ADMIN_EMAIL;
        const adminWhatsApp = process.env.SALON_ADMIN_WHATSAPP;

        const tasks: Promise<unknown>[] = [];

        if (parsed.data.event === "new") {
          tasks.push(sendEmail({
            to: booking.email,
            subject: "Your reservation at Maison Lumière",
            html: customerHtml(booking, svc),
          }));
          if (adminEmail) tasks.push(sendEmail({
            to: adminEmail,
            subject: `New booking · ${booking.name} · ${svc}`,
            html: adminHtml(booking, svc),
          }));
          if (booking.phone) tasks.push(sendWhatsApp({
            to: booking.phone,
            body: `Maison Lumière: thank you ${booking.name}! Your ${svc} reservation for ${fmt(booking.preferred_date, booking.preferred_time)} has been received. We'll confirm within 24h.`,
          }));
          if (adminWhatsApp) tasks.push(sendWhatsApp({
            to: adminWhatsApp,
            body: `New booking: ${booking.name} (${booking.email}) · ${svc} · ${fmt(booking.preferred_date, booking.preferred_time)}`,
          }));
        } else {
          tasks.push(sendEmail({
            to: booking.email,
            subject: `Booking ${booking.status} · Maison Lumière`,
            html: statusHtml(booking, svc),
          }));
          if (booking.phone) tasks.push(sendWhatsApp({
            to: booking.phone,
            body: `Maison Lumière: your ${svc} booking is now "${booking.status}".`,
          }));
        }

        const results = await Promise.allSettled(tasks);
        return Response.json({ ok: true, sent: results.length });
      },
    },
  },
});
