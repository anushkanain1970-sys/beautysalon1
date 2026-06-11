import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#why", label: "Why Us" },
  { href: "#gallery", label: "Gallery" },
  { href: "#team", label: "Atelier" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => {
      window.removeEventListener("scroll", on);
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-6"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <div className={`flex w-full items-center justify-between rounded-full px-6 py-3 transition-all duration-500 ${scrolled ? "glass" : ""}`}>
          <a href="#top" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-rose-gradient text-[10px] font-medium tracking-[0.2em] text-white">ML</span>
            <div className="leading-none">
              <div className="text-display text-xl text-charcoal">Maison Lumière</div>
              <div className="eyebrow !text-[9px] !tracking-[0.4em]">Beauté · Paris</div>
            </div>
          </a>
          <nav className="hidden items-center gap-9 lg:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="group relative text-[13px] font-medium tracking-[0.18em] uppercase text-charcoal/80 transition-colors hover:text-charcoal">
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-warm-gold transition-all duration-500 group-hover:w-full" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to={signedIn ? "/account" : "/auth"}
              className="hidden sm:inline text-[11px] uppercase tracking-[0.2em] text-charcoal/70 hover:text-charcoal"
            >
              {signedIn ? "My account" : "Sign in"}
            </Link>
            <a href="#booking" className="btn-primary !py-2.5 !px-5 !text-[11px]">Book Now</a>
          </div>
        </div>
      </div>
    </header>
  );
}
