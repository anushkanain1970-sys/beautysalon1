import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, LogOut, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/account")({
  component: AccountPage,
  head: () => ({ meta: [{ title: "My account · Maison Lumière" }] }),
});

interface Booking {
  id: string;
  status: string;
  preferred_date: string | null;
  preferred_time: string | null;
  created_at: string;
  message: string | null;
  service_id: string | null;
  services: { name: string } | null;
}

function statusColor(s: string) {
  switch (s) {
    case "confirmed": return "bg-green-100 text-green-800";
    case "completed": return "bg-blue-100 text-blue-800";
    case "cancelled": return "bg-red-100 text-red-800";
    default: return "bg-amber-100 text-amber-800";
  }
}

function AccountPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState({ full_name: "", phone: "", email: "" });
  const [bookings, setBookings] = useState<Booking[]>([]);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [{ data: p }, { data: b }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("bookings").select("*, services(name)").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle(),
    ]);
    setProfile({ full_name: p?.full_name ?? "", phone: p?.phone ?? "", email: p?.email ?? user.email ?? "" });
    setBookings((b as Booking[]) ?? []);
    setIsAdmin(!!r);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      phone: profile.phone || null,
    }).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  };

  const cancel = async (id: string) => {
    const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Booking cancelled");
    load();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (loading) return <div className="min-h-screen grid place-items-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="text-display text-xl text-charcoal">Maison Lumière</Link>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button asChild variant="outline" size="sm"><Link to="/admin"><ShieldCheck className="h-4 w-4 mr-1" />Admin</Link></Button>
            )}
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="h-4 w-4 mr-1" />Sign out</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 grid gap-8 lg:grid-cols-[1fr_2fr]">
        <section className="rounded-2xl border bg-card p-6">
          <h2 className="text-display text-xl text-charcoal mb-4">Profile</h2>
          <form onSubmit={save} className="grid gap-4">
            <div className="grid gap-2">
              <Label>Full name</Label>
              <Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} maxLength={120} />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input value={profile.email} disabled />
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} maxLength={40} />
            </div>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save profile"}</Button>
          </form>
        </section>

        <section className="rounded-2xl border bg-card p-6">
          <h2 className="text-display text-xl text-charcoal mb-4">My bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings yet. <Link to="/" className="underline">Book your first appointment</Link>.</p>
          ) : (
            <ul className="grid gap-3">
              {bookings.map((b) => (
                <li key={b.id} className="rounded-lg border p-4 grid gap-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-charcoal">{b.services?.name ?? "Service"}</strong>
                    <Badge className={statusColor(b.status)}>{b.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {b.preferred_date ? new Date(b.preferred_date).toLocaleDateString() : "Date TBD"}
                    {b.preferred_time ? ` · ${b.preferred_time}` : ""}
                  </div>
                  {b.message && <p className="text-sm text-foreground/80">{b.message}</p>}
                  {b.status !== "cancelled" && b.status !== "completed" && (
                    <Button variant="outline" size="sm" className="justify-self-start" onClick={() => cancel(b.id)}>Cancel</Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
