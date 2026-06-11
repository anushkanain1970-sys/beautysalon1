import { CalendarHeart, Phone } from "lucide-react";
import { BookingDialog } from "./BookingDialog";

export function Booking() {
  return (
    <section id="booking" className="relative px-6 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div
          className="relative overflow-hidden rounded-[44px] px-8 py-20 text-center lg:px-20 lg:py-32"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.984 0.006 80), oklch(0.925 0.020 75) 55%, oklch(0.788 0.067 75))",
          }}
        >
          {/* decorative */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(closest-side, var(--rose-gold), transparent)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(closest-side, var(--warm-gold), transparent)" }}
          />
          {/* floating particles */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute left-[15%] top-[20%] h-1.5 w-1.5 rounded-full bg-white/80 animate-float" />
            <div className="absolute right-[18%] top-[30%] h-2 w-2 rounded-full bg-white/70 animate-float [animation-delay:1.2s]" />
            <div className="absolute left-[40%] bottom-[20%] h-1 w-1 rounded-full bg-white/80 animate-float [animation-delay:2s]" />
          </div>

          <div className="relative">
            <div className="eyebrow !text-charcoal/70">Reserve your ritual</div>
            <h2 className="mx-auto mt-5 max-w-3xl text-display text-[clamp(2.4rem,5.5vw,4.6rem)] text-charcoal">
              Step into a sanctuary{" "}
              <span className="italic">made just for you</span>.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[1.02rem] text-charcoal/70">
              Reserve a private consultation with an artisan and let us craft a
              ritual entirely around you. Champagne included, of course.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <BookingDialog
                trigger={
                  <button type="button" className="btn-primary">
                    <CalendarHeart className="h-4 w-4" />
                    Book a Consultation
                  </button>
                }
              />
              <a href="tel:+33100000000" className="btn-secondary">
                <Phone className="h-3.5 w-3.5" />
                +33 1 00 00 00 00
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
