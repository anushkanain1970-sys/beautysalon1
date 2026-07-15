import { CalendarHeart, Phone } from "lucide-react";
import { BookingDialog } from "./BookingDialog";
import { motion } from "framer-motion";

export function Booking() {
  return (
    <section className="relative px-6 py-28 lg:px-10 lg:py-40 bg-blush-ivory">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative overflow-hidden rounded-[3rem] px-8 py-20 text-center lg:px-20 lg:py-32 shadow-luxe border border-champagne-pink/40"
          style={{
            background: "linear-gradient(135deg, var(--blush-ivory), var(--champagne-pink) 55%, var(--dusty-rose))",
          }}
        >
          {/* decorative */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-60 blur-[100px] bg-rose-gold"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-60 blur-[100px] bg-deep-mauve"
          />
          {/* floating particles */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute left-[15%] top-[20%] h-1.5 w-1.5 rounded-full bg-white animate-float" />
            <div className="absolute right-[18%] top-[30%] h-2 w-2 rounded-full bg-white animate-float [animation-delay:1.2s]" />
            <div className="absolute left-[40%] bottom-[20%] h-1 w-1 rounded-full bg-white animate-float [animation-delay:2s]" />
          </div>

          <div className="relative z-10">
            <div className="eyebrow !text-rich-charcoal/70">Reserve your ritual</div>
            <h2 className="mx-auto mt-5 max-w-3xl text-display text-[clamp(2.4rem,5.5vw,4.6rem)] text-rich-charcoal">
              Step into a sanctuary{" "}
              <span className="italic font-light text-deep-mauve">made just for you</span>.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[1.02rem] text-soft-mauve-gray font-sans">
              Reserve a private consultation with an artisan and let us craft a
              ritual entirely around you. Champagne included, of course.
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              <BookingDialog
                trigger={
                  <button type="button" className="btn-primary !px-8 !py-4 shadow-luxe">
                    <CalendarHeart className="h-4 w-4" />
                    Book a Consultation
                  </button>
                }
              />
              <a href="tel:+33100000000" className="btn-secondary !px-8 !py-4 bg-white/50 hover:bg-white transition-colors">
                <Phone className="h-4 w-4" />
                +33 1 00 00 00 00
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
