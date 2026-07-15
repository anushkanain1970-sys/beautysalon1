import { Instagram, Facebook, MapPin, Mail, Phone, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer
      id="footer"
      className="relative px-6 pt-24 pb-10 lg:px-10 bg-rich-charcoal text-soft-pearl-pink"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          {/* Brand + Newsletter */}
          <div>
            <div className="flex items-center gap-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-rose-gradient text-[11px] font-medium tracking-[0.2em] text-white">
                BE
              </span>
              <div className="text-display text-2xl text-white">
                Beauty Elegance
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-soft-pearl-pink/70">
              Where Beauty Meets Elegance. An exclusive sanctuary for bespoke hair, skin, and ceremonial rituals.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-7 flex max-w-md items-center gap-2 rounded-full border border-soft-mauve-gray/40 bg-white/5 p-1.5 pl-5 backdrop-blur"
            >
              <input
                type="email"
                required
                placeholder="Your email"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-soft-pearl-pink/40 focus:outline-none"
              />
              <button className="btn-primary !py-2.5 !px-5 !text-[10px] !bg-rose-gradient">
                Subscribe
              </button>
            </form>
          </div>

          {/* Visit */}
          <div>
            <div className="eyebrow !text-rose-gold">Visit</div>
            <ul className="mt-5 space-y-4 text-sm text-soft-pearl-pink/80">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-rose-gold" />
                <span>
                  14 Rue Saint-Honoré
                  <br />
                  75001 Paris, France
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-rose-gold" />
                <a href="tel:+33100000000" className="hover:text-white transition-colors">
                  +33 1 00 00 00 00
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-rose-gold" />
                <a href="mailto:bonjour@beautyelegance.com" className="hover:text-white transition-colors">
                  bonjour@beautyelegance.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <div className="eyebrow !text-rose-gold">Atelier hours</div>
            <ul className="mt-5 space-y-3 text-sm text-soft-pearl-pink/80">
              <li className="flex items-center justify-between border-b border-soft-mauve-gray/20 pb-2">
                <span>Mon — Fri</span>
                <span className="text-white">10:00 — 21:00</span>
              </li>
              <li className="flex items-center justify-between border-b border-soft-mauve-gray/20 pb-2">
                <span>Saturday</span>
                <span className="text-white">09:00 — 20:00</span>
              </li>
              <li className="flex items-center justify-between border-b border-soft-mauve-gray/20 pb-2">
                <span>Sunday</span>
                <span className="text-white">By appointment</span>
              </li>
            </ul>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-soft-mauve-gray/30 px-4 py-2 text-[11px] tracking-[0.2em] uppercase text-soft-pearl-pink">
              <Clock className="h-3 w-3 text-rose-gold" />
              Open now
            </div>
          </div>

          {/* Socials & Links */}
          <div>
            <div className="eyebrow !text-rose-gold">Connect</div>
            <div className="mt-5 flex items-center gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="grid h-11 w-11 place-items-center rounded-full border border-soft-mauve-gray/40 text-soft-pearl-pink transition-all hover:bg-rose-gradient hover:text-white hover:border-transparent"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="grid h-11 w-11 place-items-center rounded-full border border-soft-mauve-gray/40 text-soft-pearl-pink transition-all hover:bg-rose-gradient hover:text-white hover:border-transparent"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
            
            <div className="mt-8 flex flex-col space-y-3 text-sm">
               <Link to="/about" className="text-soft-pearl-pink/80 hover:text-white transition-colors">Our Story</Link>
               <Link to="/services" className="text-soft-pearl-pink/80 hover:text-white transition-colors">Signature Services</Link>
               <Link to="/testimonials" className="text-soft-pearl-pink/80 hover:text-white transition-colors">Client Reviews</Link>
               <Link to="/booking" className="text-soft-pearl-pink/80 hover:text-white transition-colors">Book an Appointment</Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-20 flex flex-col items-center justify-center gap-4 border-t border-soft-mauve-gray/30 pt-8 text-[11px] tracking-[0.2em] uppercase text-soft-pearl-pink/60">
          <div>© {new Date().getFullYear()} Beauty Elegance · Paris</div>
          <div className="flex gap-8 mt-2">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
