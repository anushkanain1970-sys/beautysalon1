import { Instagram, Facebook, MapPin, Mail, Phone, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer
      id="contact"
      className="relative px-6 pt-24 pb-10 lg:px-10"
      style={{ background: "linear-gradient(180deg, var(--ivory), var(--pearl))" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          {/* Brand + Newsletter */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-rose-gradient text-[11px] tracking-[0.2em] text-white">
                ML
              </span>
              <div className="text-display text-2xl text-charcoal">
                Maison Lumière
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-soft-gray">
              A maison devoted to the quiet art of beauty — couture hair, skin,
              and ceremonial rituals in the heart of Paris.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-7 flex max-w-md items-center gap-2 rounded-full border border-warm-gold/30 bg-white/70 p-1.5 pl-5 backdrop-blur"
            >
              <input
                type="email"
                required
                placeholder="Your email"
                className="flex-1 bg-transparent text-sm text-charcoal placeholder:text-soft-gray/70 focus:outline-none"
              />
              <button className="btn-primary !py-2.5 !px-5 !text-[10px]">
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-[11px] tracking-[0.22em] uppercase text-soft-gray">
              Receive the Maison letter · monthly
            </p>
          </div>

          {/* Visit */}
          <div>
            <div className="eyebrow">Visit</div>
            <ul className="mt-5 space-y-4 text-sm text-soft-gray">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-warm-gold" />
                <span>
                  14 Rue Saint-Honoré
                  <br />
                  75001 Paris, France
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-warm-gold" />
                <a href="tel:+33100000000" className="hover:text-charcoal">
                  +33 1 00 00 00 00
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-warm-gold" />
                <a href="mailto:bonjour@maisonlumiere.com" className="hover:text-charcoal">
                  bonjour@maisonlumiere.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <div className="eyebrow">Atelier hours</div>
            <ul className="mt-5 space-y-3 text-sm text-soft-gray">
              <li className="flex items-center justify-between">
                <span>Mon — Fri</span>
                <span className="text-charcoal">10:00 — 21:00</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Saturday</span>
                <span className="text-charcoal">09:00 — 20:00</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Sunday</span>
                <span className="text-charcoal">By appointment</span>
              </li>
            </ul>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] tracking-[0.22em] uppercase text-charcoal">
              <Clock className="h-3 w-3 text-warm-gold" />
              Open now
            </div>
          </div>

          {/* Map */}
          <div>
            <div className="eyebrow">Find us</div>
            <div className="mt-5 overflow-hidden rounded-2xl border border-warm-gold/25 shadow-soft">
              <iframe
                title="Maison Lumière map"
                src="https://www.google.com/maps?q=Rue+Saint-Honor%C3%A9+Paris&output=embed"
                width="100%"
                height="180"
                loading="lazy"
                style={{ border: 0, filter: "saturate(0.85) contrast(0.95)" }}
              />
            </div>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-warm-gold/40 text-warm-gold transition-all hover:bg-rose-gradient hover:text-white hover:border-transparent"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="grid h-10 w-10 place-items-center rounded-full border border-warm-gold/40 text-warm-gold transition-all hover:bg-rose-gradient hover:text-white hover:border-transparent"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-warm-gold/20 pt-8 text-[11px] tracking-[0.22em] uppercase text-soft-gray sm:flex-row">
          <div>© {new Date().getFullYear()} Maison Lumière · Paris</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-charcoal">Privacy</a>
            <a href="#" className="hover:text-charcoal">Terms</a>
            <a href="#" className="hover:text-charcoal">Press</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
