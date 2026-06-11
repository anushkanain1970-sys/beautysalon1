import { useEffect, useState, type ReactNode } from "react";
import { z } from "zod";
import { CalendarHeart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  service_id: z.string().trim().optional().or(z.literal("")),
  preferred_date: z.string().trim().max(20).optional().or(z.literal("")),
  preferred_time: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

interface ServiceOpt { id: string; name: string }

export function BookingDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<ServiceOpt[]>([]);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", service_id: "",
    preferred_date: "", preferred_time: "", message: "",
  });

  useEffect(() => {
    if (!open) return;
    supabase.from("services").select("id,name").eq("is_active", true).order("sort_order")
      .then(({ data }) => setServices((data as ServiceOpt[]) ?? []));
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setForm((f) => ({
          ...f,
          email: f.email || data.user!.email || "",
        }));
      }
    });
  }, [open]);

  const update = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data: inserted, error } = await supabase.from("bookings").insert({
      user_id: user?.id ?? null,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      service_id: parsed.data.service_id || null,
      preferred_date: parsed.data.preferred_date || null,
      preferred_time: parsed.data.preferred_time || null,
      message: parsed.data.message || null,
    }).select("id").maybeSingle();

    if (error) {
      setLoading(false);
      console.error(error);
      toast.error("Something went wrong. Please try again.");
      return;
    }

    // Fire-and-forget notification (emails + WhatsApp)
    if (inserted?.id) {
      fetch("/api/public/booking-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: inserted.id }),
      }).catch(() => {});
    }

    setLoading(false);
    toast.success("Reservation received — we'll be in touch within 24 hours.");
    setForm({ name: "", email: "", phone: "", service_id: "", preferred_date: "", preferred_time: "", message: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-display text-2xl text-charcoal flex items-center gap-2">
            <CalendarHeart className="h-5 w-5" />
            Reserve your consultation
          </DialogTitle>
          <DialogDescription>
            Share a few details and an artisan will reach out within 24 hours to confirm your private appointment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-4 pt-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required maxLength={120} value={form.name} onChange={(e) => update("name")(e.target.value)} placeholder="Your name" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required maxLength={200} value={form.email} onChange={(e) => update("email")(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone (WhatsApp)</Label>
              <Input id="phone" type="tel" maxLength={40} value={form.phone} onChange={(e) => update("phone")(e.target.value)} placeholder="+33 1 00 00 00 00" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="service">Service</Label>
              <Select value={form.service_id} onValueChange={update("service_id")}>
                <SelectTrigger id="service"><SelectValue placeholder="Choose a service" /></SelectTrigger>
                <SelectContent>
                  {services.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preferred_date">Preferred date</Label>
              <Input id="preferred_date" type="date" value={form.preferred_date} onChange={(e) => update("preferred_date")(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="preferred_time">Preferred time</Label>
            <Input id="preferred_time" type="time" value={form.preferred_time} onChange={(e) => update("preferred_time")(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Notes (optional)</Label>
            <Textarea id="message" rows={3} maxLength={2000} value={form.message} onChange={(e) => update("message")(e.target.value)} placeholder="Anything we should know — occasion, inspiration, allergies…" />
          </div>

          <DialogFooter className="pt-2">
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
              {loading ? (<><Loader2 className="h-4 w-4 animate-spin" />Reserving…</>) : (<><CalendarHeart className="h-4 w-4" />Confirm reservation</>)}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
