import { Sparkles } from "lucide-react";
import { HeroBackground3D } from "./HeroBackground3D";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-24 pb-12 lg:pt-32 lg:pb-16 isolate"
    >

      {/* Video + 3D WebGL layered background */}
      <HeroBackground3D />

      {/* floating particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[20%] h-2 w-2 rounded-full bg-warm-gold/60 animate-float" />
        <div className="absolute left-[14%] top-[60%] h-1.5 w-1.5 rounded-full bg-rose-gold/70 animate-float [animation-delay:1.5s]" />
        <div className="absolute right-[12%] top-[30%] h-2.5 w-2.5 rounded-full bg-champagne/60 animate-float [animation-delay:2.5s]" />
        <div className="absolute right-[20%] bottom-[18%] h-1 w-1 rounded-full bg-warm-gold/70 animate-float [animation-delay:0.8s]" />
        <div className="absolute left-[48%] top-[8%] h-1.5 w-1.5 rounded-full bg-rose-gold/60 animate-float [animation-delay:3s]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-10">
        <div className="animate-fade-up inline-flex items-center gap-3 rounded-full hairline-gold bg-white/50 px-4 py-2 text-[11px] tracking-[0.28em] uppercase text-charcoal/80 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-warm-gold" />
          Voted #1 Luxury Beauty Atelier · 2025
        </div>

        <h1 className="animate-fade-up delay-1 mt-7 text-display text-[clamp(2.8rem,7vw,6rem)] text-charcoal">
          Where beauty <br />
          meets{" "}
          <span className="italic text-gold-gradient font-light">
            quiet luxury
          </span>
          .
        </h1>

        <p className="animate-fade-up delay-2 mx-auto mt-7 max-w-xl text-[1.05rem] leading-relaxed text-charcoal/80">
          A maison dedicated to the art of refined beauty. Bespoke hair, skin,
          and ceremonial treatments designed by an atelier of award-winning
          artisans — in a sanctuary tailored entirely to you.
        </p>

        <div className="animate-fade-up delay-3 mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#booking" className="btn-primary">
            Reserve Your Ritual
          </a>
          <a href="#services" className="btn-secondary">
            Explore Services
          </a>
        </div>

        {/* Trust */}
        <div className="animate-fade-up delay-4 mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-6">
          {[
            { k: "12+", v: "Years of Craft" },
            { k: "9.8★", v: "Guest Rating" },
            { k: "40k", v: "Rituals Performed" },
          ].map((s) => (
            <div key={s.v}>
              <div className="text-display text-3xl text-charcoal">{s.k}</div>
              <div className="mt-1 text-[11px] tracking-[0.22em] uppercase text-soft-gray">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="relative mt-16 overflow-hidden border-y border-warm-gold/20 bg-white/40 py-4 backdrop-blur">
        <div className="flex w-max animate-marquee gap-16 whitespace-nowrap text-[11px] tracking-[0.4em] uppercase text-charcoal/70">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-16">
              {[
                "Vogue Beauty 2025",
                "✦",
                "Harper&rsquo;s Bazaar",
                "✦",
                "Tatler Spa Guide",
                "✦",
                "Forbes Style",
                "✦",
                "Condé Nast Traveler",
                "✦",
                "Elle France",
                "✦",
              ].map((t, i) => (
                <span key={`${k}-${i}`} dangerouslySetInnerHTML={{ __html: t }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
