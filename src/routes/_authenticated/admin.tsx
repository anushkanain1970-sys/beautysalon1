import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  Loader2, Plus, Pencil, Trash2, ArrowLeft, Search, Calendar,
  CheckCircle2, Clock, XCircle, BarChart3, Users, BookOpen, Sparkles, Download, TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin · Maison Lumière" }] }),
});

interface Booking {
  id: string; name: string; email: string; phone: string | null;
  preferred_date: string | null; preferred_time: string | null;
  message: string | null; status: string; admin_notes: string | null;
  created_at: string; service_id: string | null;
  services: { name: string } | null;
}
interface Service {
  id: string; slug: string; name: string; description: string | null;
  duration_min: number; price_cents: number; image_url: string | null;
  is_active: boolean; sort_order: number;
}
interface Profile {
  id: string; full_name: string | null; email: string | null;
  phone: string | null; created_at: string;
}

const STATUS_OPTIONS = ["all", "new", "confirmed", "completed", "cancelled"] as const;

function statusColor(s: string) {
  switch (s) {
    case "confirmed": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "completed": return "bg-sky-100 text-sky-800 border-sky-200";
    case "cancelled": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-amber-100 text-amber-800 border-amber-200";
  }
}

function statusIcon(s: string) {
  switch (s) {
    case "confirmed": return <CheckCircle2 className="h-3 w-3" />;
    case "completed": return <Sparkles className="h-3 w-3" />;
    case "cancelled": return <XCircle className="h-3 w-3" />;
    default: return <Clock className="h-3 w-3" />;
  }
}

function AdminPage() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    const [{ data: b }, { data: s }, { data: p }] = await Promise.all([
      supabase.from("bookings").select("*, services(name)").order("created_at", { ascending: false }),
      supabase.from("services").select("*").order("sort_order"),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    ]);
    setBookings((b as Booking[]) ?? []);
    setServices((s as Service[]) ?? []);
    setProfiles((p as Profile[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/auth" }); return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (!data) { setAuthorized(false); return; }
      setAuthorized(true);
      await loadAll();
    })();
  }, [navigate]);

  if (authorized === null) return (
    <div className="min-h-screen grid place-items-center bg-[#faf9f7]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin h-8 w-8 text-amber-600" />
        <p className="text-sm text-gray-500">Loading dashboard…</p>
      </div>
    </div>
  );

  if (authorized === false) return (
    <div className="min-h-screen grid place-items-center px-4 text-center bg-[#faf9f7]">
      <div>
        <h1 className="text-2xl font-light text-gray-800">Not authorized</h1>
        <p className="mt-2 text-gray-500">You don't have admin access.</p>
        <Button asChild className="mt-4"><Link to="/">Go home</Link></Button>
      </div>
    </div>
  );

  // Derived stats
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = bookings.filter((b) => b.preferred_date === today).length;
  const upcoming = bookings.filter((b) => b.preferred_date && b.preferred_date >= today && b.status !== "cancelled").length;
  const newCount = bookings.filter((b) => b.status === "new").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const revenue = completedBookings.reduce((acc, b) => {
    const svc = services.find((s) => s.id === b.service_id);
    return acc + (svc?.price_cents ?? 0);
  }, 0);

  // Revenue by service
  const revenueByService = services.map((s) => {
    const completed = completedBookings.filter((b) => b.service_id === s.id);
    return {
      name: s.name,
      count: completed.length,
      revenue: completed.length * s.price_cents,
      price_cents: s.price_cents,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // CSV export
  const exportCSV = () => {
    const headers = ["Name","Email","Phone","Service","Date","Time","Status","Message","Admin Notes","Booked At"];
    const rows = bookings.map((b) => [
      b.name, b.email, b.phone ?? "",
      b.services?.name ?? "",
      b.preferred_date ?? "", b.preferred_time ?? "",
      b.status, b.message ?? "", b.admin_notes ?? "",
      new Date(b.created_at).toLocaleDateString("en-GB"),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `maison-bookings-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered bookings
  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const matchDate = !dateFilter || b.preferred_date === dateFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      b.name.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      (b.phone ?? "").toLowerCase().includes(q) ||
      (b.services?.name ?? "").toLowerCase().includes(q);
    return matchStatus && matchDate && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-amber-100/60">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <Link to="/account"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link>
            </Button>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 grid place-items-center">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <h1 className="font-light text-gray-900 text-lg tracking-wide">Maison Lumière Admin</h1>
            </div>
          </div>
          <Button onClick={loadAll} variant="outline" size="sm" disabled={loading} className="gap-2">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Refresh
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 mb-8">
          <Stat label="Awaiting" value={newCount} icon={<Clock className="h-4 w-4" />} accent="amber" />
          <Stat label="Confirmed" value={confirmedCount} icon={<CheckCircle2 className="h-4 w-4" />} accent="emerald" />
          <Stat label="Today" value={todayCount} icon={<Calendar className="h-4 w-4" />} accent="sky" />
          <Stat label="Upcoming" value={upcoming} icon={<BarChart3 className="h-4 w-4" />} accent="violet" />
          <Stat label="Customers" value={profiles.length} icon={<Users className="h-4 w-4" />} accent="rose" />
          <StatMoney label="Revenue" value={revenue} icon={<TrendingUp className="h-4 w-4" />} accent="emerald" />
        </div>

        <Tabs defaultValue="bookings">
          <TabsList className="bg-white border border-amber-100/60 p-1 rounded-xl">
            <TabsTrigger value="bookings" className="rounded-lg gap-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-800">
              <BookOpen className="h-3.5 w-3.5" />Bookings
              {newCount > 0 && (
                <span className="ml-1 h-4.5 min-w-[18px] rounded-full bg-amber-500 px-1 text-[10px] text-white grid place-items-center">
                  {newCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="services" className="rounded-lg gap-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-800">
              <Sparkles className="h-3.5 w-3.5" />Services
            </TabsTrigger>
            <TabsTrigger value="customers" className="rounded-lg gap-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-800">
              <Users className="h-3.5 w-3.5" />Customers
            </TabsTrigger>
            <TabsTrigger value="revenue" className="rounded-lg gap-2 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-800">
              <TrendingUp className="h-3.5 w-3.5" />Revenue
            </TabsTrigger>
          </TabsList>

          {/* ── Bookings ── */}
          <TabsContent value="bookings" className="mt-6">
            {/* Filters bar */}
            <div className="flex flex-wrap items-center gap-3 mb-5 p-4 bg-white rounded-xl border border-amber-100/60">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  placeholder="Search name, email, phone, service…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-gray-200 text-sm h-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 h-9 border-gray-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s === "all" ? "All statuses" : s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-40 h-9 border-gray-200 text-sm"
              />
              {(searchQuery || dateFilter || statusFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 h-9"
                  onClick={() => { setSearchQuery(""); setDateFilter(""); setStatusFilter("all"); }}
                >
                  Clear
                </Button>
              )}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-gray-500">{filtered.length} of {bookings.length}</span>
                <Button size="sm" variant="outline" className="gap-1.5 h-9 text-xs" onClick={exportCSV}>
                  <Download className="h-3.5 w-3.5" />Export CSV
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-amber-100/60 bg-white overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-amber-50/60 text-xs uppercase tracking-wider text-gray-500">
                  <tr className="text-left">
                    <th className="p-3 pl-5">Customer</th>
                    <th className="p-3">Service</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Booked</th>
                    <th className="p-3">Status</th>
                    <th className="p-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-amber-50/30 transition-colors group">
                      <td className="p-3 pl-5">
                        <div className="font-medium text-gray-900">{b.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{b.email}{b.phone ? ` · ${b.phone}` : ""}</div>
                      </td>
                      <td className="p-3 text-gray-600">{b.services?.name ?? <span className="text-gray-300">—</span>}</td>
                      <td className="p-3 whitespace-nowrap text-gray-600">
                        {b.preferred_date
                          ? new Date(b.preferred_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                          : <span className="text-gray-300">TBD</span>}
                        {b.preferred_time && <span className="ml-1.5 text-gray-400">{b.preferred_time}</span>}
                      </td>
                      <td className="p-3 whitespace-nowrap text-gray-400 text-xs">
                        {new Date(b.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </td>
                      <td className="p-3">
                        <Badge className={`gap-1 border text-xs font-medium ${statusColor(b.status)}`}>
                          {statusIcon(b.status)}
                          <span className="capitalize">{b.status}</span>
                        </Badge>
                      </td>
                      <td className="p-3 pr-5">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <BookingDetail booking={b} onUpdate={loadAll} />
                          <QuickActions booking={b} onUpdate={loadAll} />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-gray-400">
                        <Search className="h-8 w-8 mx-auto mb-3 text-gray-200" />
                        <p>{bookings.length === 0 ? "No bookings yet" : "No bookings match your filters"}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* ── Services ── */}
          <TabsContent value="services" className="mt-6">
            <div className="mb-5 flex justify-between items-center">
              <p className="text-sm text-gray-500">{services.length} service{services.length !== 1 ? "s" : ""} · {services.filter(s => s.is_active).length} active</p>
              <ServiceEditor onSaved={loadAll} trigger={
                <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                  <Plus className="h-4 w-4" />New service
                </Button>
              } />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <div key={s.id} className="rounded-xl border border-amber-100/60 bg-white p-5 hover:shadow-md transition-shadow">
                  {s.image_url && (
                    <div className="h-36 w-full rounded-lg overflow-hidden mb-4">
                      <img src={s.image_url} alt={s.name} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{s.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{s.duration_min} min · €{(s.price_cents / 100).toFixed(0)}</p>
                    </div>
                    <Badge variant={s.is_active ? "default" : "outline"} className={s.is_active ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "text-gray-400"}>
                      {s.is_active ? "Active" : "Hidden"}
                    </Badge>
                  </div>
                  {s.description && <p className="mt-2 text-sm text-gray-500 line-clamp-2">{s.description}</p>}
                  <div className="mt-4 flex gap-2 border-t border-gray-50 pt-4">
                    <ServiceEditor service={s} onSaved={loadAll} trigger={
                      <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
                        <Pencil className="h-3 w-3" />Edit
                      </Button>
                    } />
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={async () => {
                      const { error } = await supabase.from("services").update({ is_active: !s.is_active }).eq("id", s.id);
                      if (error) toast.error(error.message); else { toast.success(s.is_active ? "Service hidden" : "Service activated"); loadAll(); }
                    }}>
                      {s.is_active ? "Hide" : "Show"}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto" onClick={async () => {
                      if (!confirm(`Delete "${s.name}"?`)) return;
                      const { error } = await supabase.from("services").delete().eq("id", s.id);
                      if (error) toast.error(error.message); else { toast.success("Service deleted"); loadAll(); }
                    }}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {services.length === 0 && (
                <div className="col-span-3 py-16 text-center text-gray-400 bg-white rounded-xl border border-amber-100/60">
                  <Sparkles className="h-8 w-8 mx-auto mb-3 text-gray-200" />
                  <p>No services yet. Add your first service.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Customers ── */}
          <TabsContent value="customers" className="mt-6">
            <div className="mb-5">
              <p className="text-sm text-gray-500">{profiles.length} registered customer{profiles.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="rounded-xl border border-amber-100/60 bg-white overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-amber-50/60 text-xs uppercase tracking-wider text-gray-500">
                  <tr className="text-left">
                    <th className="p-3 pl-5">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Joined</th>
                    <th className="p-3">Bookings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {profiles.map((p) => {
                    const customerBookings = bookings.filter(b => b.email === p.email).length;
                    return (
                      <tr key={p.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="p-3 pl-5">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-200 to-rose-200 grid place-items-center text-xs font-medium text-amber-800 shrink-0">
                              {(p.full_name ?? p.email ?? "?").slice(0, 1).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{p.full_name ?? "—"}</span>
                          </div>
                        </td>
                        <td className="p-3 text-gray-600">{p.email ?? "—"}</td>
                        <td className="p-3 text-gray-500">{p.phone ?? "—"}</td>
                        <td className="p-3 whitespace-nowrap text-gray-400 text-xs">
                          {new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="p-3">
                          {customerBookings > 0
                            ? <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">{customerBookings}</Badge>
                            : <span className="text-gray-300 text-xs">—</span>
                          }
                        </td>
                      </tr>
                    );
                  })}
                  {profiles.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-gray-400">
                        <Users className="h-8 w-8 mx-auto mb-3 text-gray-200" />
                        <p>No registered customers yet</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* ── Revenue ── */}
          <TabsContent value="revenue" className="mt-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-light text-gray-900">Revenue overview</h2>
                <p className="text-sm text-gray-400 mt-0.5">Based on completed bookings · prices in €</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-emerald-700">€{(revenue / 100).toFixed(2)}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">{completedBookings.length} completed</div>
              </div>
            </div>

            {/* Revenue by service */}
            <div className="rounded-xl border border-amber-100/60 bg-white overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-amber-50/60 text-xs uppercase tracking-wider text-gray-500">
                  <tr className="text-left">
                    <th className="p-3 pl-5">Service</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Completed</th>
                    <th className="p-3">Revenue</th>
                    <th className="p-3 pr-5">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {revenueByService.map((r) => (
                    <tr key={r.name} className="hover:bg-amber-50/20 transition-colors">
                      <td className="p-3 pl-5 font-medium text-gray-900">{r.name}</td>
                      <td className="p-3 text-gray-500">€{(r.price_cents / 100).toFixed(0)}</td>
                      <td className="p-3">
                        {r.count > 0
                          ? <Badge className="bg-sky-100 text-sky-800 border-sky-200 text-xs">{r.count}</Badge>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="p-3 text-emerald-700 font-medium">€{(r.revenue / 100).toFixed(2)}</td>
                      <td className="p-3 pr-5">
                        {revenue > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 rounded-full bg-gray-100 max-w-[120px]">
                              <div className="h-1.5 rounded-full bg-emerald-400" style={{ width: `${(r.revenue / revenue) * 100}%` }} />
                            </div>
                            <span className="text-xs text-gray-400 w-8 text-right">{revenue > 0 ? Math.round((r.revenue / revenue) * 100) : 0}%</span>
                          </div>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 text-sm font-medium">
                  <tr>
                    <td className="p-3 pl-5 text-gray-700">Total</td>
                    <td className="p-3" />
                    <td className="p-3 text-gray-700">{completedBookings.length}</td>
                    <td className="p-3 text-emerald-700">€{(revenue / 100).toFixed(2)}</td>
                    <td className="p-3 pr-5" />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Recent completed bookings */}
            {completedBookings.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Recent completed</h3>
                <div className="rounded-xl border border-amber-100/60 bg-white overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-amber-50/60 text-xs uppercase tracking-wider text-gray-500">
                      <tr className="text-left">
                        <th className="p-3 pl-5">Customer</th>
                        <th className="p-3">Service</th>
                        <th className="p-3">Date</th>
                        <th className="p-3 pr-5">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {completedBookings.slice(0, 10).map((b) => {
                        const svc = services.find((s) => s.id === b.service_id);
                        return (
                          <tr key={b.id} className="hover:bg-amber-50/20 transition-colors">
                            <td className="p-3 pl-5">
                              <div className="font-medium text-gray-900">{b.name}</div>
                              <div className="text-xs text-gray-400">{b.email}</div>
                            </td>
                            <td className="p-3 text-gray-600">{b.services?.name ?? "—"}</td>
                            <td className="p-3 text-gray-500 whitespace-nowrap text-xs">
                              {b.preferred_date ? new Date(b.preferred_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                            </td>
                            <td className="p-3 pr-5 text-emerald-700 font-medium">€{((svc?.price_cents ?? 0) / 100).toFixed(0)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// ── Stat card ──
function Stat({ label, value, icon, accent }: { label: string; value: number; icon: React.ReactNode; accent: string }) {
  const colors: Record<string, string> = {
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    sky: "bg-sky-50 text-sky-600 border-sky-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
  };
  return (
    <div className="rounded-xl border border-amber-100/60 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${colors[accent]}`}>
        {icon}
      </div>
      <div className="mt-3 text-3xl font-light text-gray-900">{value}</div>
      <div className="mt-0.5 text-xs uppercase tracking-wider text-gray-400">{label}</div>
    </div>
  );
}

function StatMoney({ label, value, icon, accent }: { label: string; value: number; icon: React.ReactNode; accent: string }) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  return (
    <div className="rounded-xl border border-emerald-100/60 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${colors[accent]}`}>
        {icon}
      </div>
      <div className="mt-3 text-2xl font-light text-emerald-700">€{(value / 100).toFixed(0)}</div>
      <div className="mt-0.5 text-xs uppercase tracking-wider text-gray-400">{label}</div>
    </div>
  );
}

// ── Quick action buttons (confirm / complete / cancel) ──
function QuickActions({ booking, onUpdate }: { booking: Booking; onUpdate: () => void }) {
  const updateStatus = async (status: "new" | "confirmed" | "completed" | "cancelled") => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", booking.id);
    if (error) return toast.error(error.message);
    toast.success(`Marked as ${status}`);
    try {
      await fetch("/api/public/booking-status-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: booking.id }),
      });
    } catch { /* non-fatal */ }
    onUpdate();
  };

  const deleteBooking = async () => {
    if (!confirm(`Delete booking for "${booking.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("bookings").delete().eq("id", booking.id);
    if (error) return toast.error(error.message);
    toast.success("Booking deleted");
    onUpdate();
  };

  return (
    <div className="flex items-center gap-1">
      {booking.status === "new" && (
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-emerald-700 hover:bg-emerald-50" onClick={() => updateStatus("confirmed")}>
          Confirm
        </Button>
      )}
      {booking.status === "confirmed" && (
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-sky-700 hover:bg-sky-50" onClick={() => updateStatus("completed")}>
          Complete
        </Button>
      )}
      {booking.status !== "cancelled" && booking.status !== "completed" && (
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-red-500 hover:bg-red-50" onClick={() => updateStatus("cancelled")}>
          Cancel
        </Button>
      )}
      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-300 hover:text-red-500 hover:bg-red-50" onClick={deleteBooking}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

// ── Booking detail dialog ──
function BookingDetail({ booking, onUpdate }: { booking: Booking; onUpdate: () => void }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(booking.status);
  const [notes, setNotes] = useState(booking.admin_notes ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const prevStatus = booking.status;
    const { error } = await supabase.from("bookings").update({
      status: status as "new" | "confirmed" | "completed" | "cancelled",
      admin_notes: notes || null,
    }).eq("id", booking.id);
    setSaving(false);
    if (error) return toast.error(error.message);

    if (status !== prevStatus) {
      try {
        await fetch("/api/public/booking-status-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking_id: booking.id }),
        });
      } catch { /* non-fatal */ }
    }
    toast.success("Booking updated");
    setOpen(false);
    onUpdate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-7 px-3 text-xs gap-1.5">
          <Pencil className="h-3 w-3" />Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-light text-xl text-gray-900">Booking — {booking.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 text-sm">
          <div className="grid gap-2 rounded-lg bg-gray-50 p-4 text-gray-600">
            <div><span className="text-gray-400 text-xs uppercase tracking-wide">Email</span><br />{booking.email}</div>
            {booking.phone && <div><span className="text-gray-400 text-xs uppercase tracking-wide">Phone</span><br />{booking.phone}</div>}
            <div><span className="text-gray-400 text-xs uppercase tracking-wide">Service</span><br />{booking.services?.name ?? "—"}</div>
            <div>
              <span className="text-gray-400 text-xs uppercase tracking-wide">Appointment</span><br />
              {booking.preferred_date
                ? new Date(booking.preferred_date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                : "Date TBD"}
              {booking.preferred_time && ` at ${booking.preferred_time}`}
            </div>
            {booking.message && (
              <div><span className="text-gray-400 text-xs uppercase tracking-wide">Customer note</span><br />{booking.message}</div>
            )}
          </div>
          <div className="grid gap-2">
            <Label className="text-xs uppercase tracking-wide text-gray-500">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label className="text-xs uppercase tracking-wide text-gray-500">Internal notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={4000} rows={4} placeholder="Private notes visible only to the team…" className="resize-none text-sm" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
          <Button onClick={save} disabled={saving} className="bg-amber-600 hover:bg-amber-700 text-white">
            {saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Saving…</> : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Service editor dialog ──
function ServiceEditor({ service, onSaved, trigger }: { service?: Service; onSaved: () => void; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: service?.name ?? "",
    slug: service?.slug ?? "",
    description: service?.description ?? "",
    duration_min: service?.duration_min ?? 60,
    price_cents: service?.price_cents ?? 0,
    image_url: service?.image_url ?? "",
    is_active: service?.is_active ?? true,
    sort_order: service?.sort_order ?? 0,
  });

  const save = async () => {
    if (!form.name || !form.slug) return toast.error("Name and slug required");
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      description: form.description || null,
      duration_min: Number(form.duration_min) || 60,
      price_cents: Math.round(Number(form.price_cents) || 0),
      image_url: form.image_url || null,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
    };
    const { error } = service
      ? await supabase.from("services").update(payload).eq("id", service.id)
      : await supabase.from("services").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(service ? "Service updated" : "Service created");
    setOpen(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-light text-xl text-gray-900">{service ? "Edit" : "New"} service</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-xs uppercase tracking-wide text-gray-500">Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Bridal Artistry" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs uppercase tracking-wide text-gray-500">Slug *</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="bridal-artistry" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs uppercase tracking-wide text-gray-500">Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="resize-none text-sm" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-xs uppercase tracking-wide text-gray-500">Duration (min)</Label>
              <Input type="number" value={form.duration_min} onChange={(e) => setForm({ ...form, duration_min: Number(e.target.value) })} />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs uppercase tracking-wide text-gray-500">Price (€ cents)</Label>
              <Input type="number" value={form.price_cents} onChange={(e) => setForm({ ...form, price_cents: Number(e.target.value) })} />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs uppercase tracking-wide text-gray-500">Sort order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs uppercase tracking-wide text-gray-500">Image URL</Label>
            <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" />
          </div>
          <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 accent-amber-600" />
            Active — visible to customers
          </label>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
          <Button onClick={save} disabled={saving} className="bg-amber-600 hover:bg-amber-700 text-white">
            {saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Saving…</> : "Save service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
