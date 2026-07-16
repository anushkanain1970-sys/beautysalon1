import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Salon" },
  { to: "/services", label: "Services" },
  { to: "/testimonials", label: "Testimonials" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
    };
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${scrolled ? "py-4" : "py-8"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <div className={`flex w-full items-center justify-between rounded-full px-8 py-4 transition-all duration-700 ${scrolled ? "glass" : "bg-transparent"}`}>
          <Link to="/" className="flex items-center gap-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-rose-gradient text-[11px] font-medium tracking-[0.2em] text-white">BE</span>
            <div className="leading-none">
              <div className="text-display text-2xl text-rich-charcoal">Beauty Elegance</div>
              <div className="eyebrow !text-[9px] !tracking-[0.4em] !text-soft-mauve-gray mt-1">Paris · London</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-10 lg:flex">
            {links.map((l) => (
              <Link 
                key={l.to} 
                to={l.to} 
                className="group relative text-[13px] font-medium tracking-[0.16em] uppercase text-rich-charcoal/70 transition-colors hover:text-rich-charcoal"
                activeProps={{ className: "!text-rich-charcoal" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-rose-gold transition-all duration-500 group-hover:w-full group-[.active]:w-full" />
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-6">
            <Link to="/booking" className="btn-primary !py-3 !px-7 !text-[12px]">Book Appointment</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
