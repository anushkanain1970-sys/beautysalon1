import { ArrowUpRight } from "lucide-react";

const services = [
  {
    n: "01",
    title: "Couture Hair Styling",
    desc: "Editorial cuts, blowouts and silk-finish treatments tailored to your couture moment.",
    price: "from €120",
    img: "/photos/ali-pazani-3w14X-Yxffk-unsplash.jpg",
  },
  {
    n: "02",
    title: "Maison Color",
    desc: "Hand-painted balayage, soft tonal glosses and signature champagne dimensional color.",
    price: "from €240",
    img: "/photos/lola-azizada-I3y-aJ4DWng-unsplash.jpg",
  },
  {
    n: "03",
    title: "Bridal Atelier",
    desc: "Full bridal artistry — hair, makeup, trial sessions and a private suite for your party.",
    price: "from €680",
    img: "/photos/jessica-felicio-QS9ZX5UnS14-unsplash.jpg",
  },
  {
    n: "04",
    title: "Advanced Skincare",
    desc: "Diagnostic-led facials with cold cryo, LED therapy and pure botanical actives.",
    price: "from €180",
    img: "/photos/nataliya-melnychuk-tnWjbdPmk1M-unsplash.jpg",
  },
  {
    n: "05",
    title: "Spa Rituals",
    desc: "Hour-long ceremonial body rituals — gold leaf, oud, rose and ancient hammam.",
    price: "from €220",
    img: "/photos/hanen-souhail-DLWs1tZvsdY-unsplash.jpg",
  },
  {
    n: "06",
    title: "Nail Couture",
    desc: "Pure-mineral manicures, sculpted gel finishes and bespoke wedding nail art.",
    price: "from €75",
    img: "/photos/yash-mevawala-QkFz4YmMpT0-unsplash.jpg",
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden px-6 py-28 lg:px-10 lg:py-40"
      style={{ background: "linear-gradient(180deg, var(--pearl), var(--ivory))" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--champagne), transparent)" }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="eyebrow">The services</div>
            <h2 className="mt-4 text-display text-[clamp(2.2rem,4.6vw,3.8rem)] text-charcoal">
              Signature rituals,{" "}
              <span className="italic text-gold-gradient">crafted</span> by hand.
            </h2>
          </div>
          <p className="max-w-md text-soft-gray">
            Every service is delivered in a private suite, with a curated
            playlist, a champagne pour, and undivided attention from your
            personal artisan.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.title}
              className="lift-card group relative overflow-hidden rounded-[32px] border border-warm-gold/15 bg-white"
            >
              <div className="zoom-img relative aspect-[4/5]">
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-charcoal/0 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full glass px-3 py-1 text-[10px] tracking-[0.28em] uppercase text-charcoal">
                  {s.n}
                </span>
                <span className="absolute right-5 top-5 rounded-full bg-white/85 px-3 py-1 text-[10px] tracking-[0.22em] uppercase text-warm-gold">
                  {s.price}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 p-7">
                <div>
                  <h3 className="text-display text-2xl text-charcoal">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-soft-gray">
                    {s.desc}
                  </p>
                </div>
                <a
                  href="#booking"
                  aria-label={`Book ${s.title}`}
                  className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-warm-gold/40 text-warm-gold transition-all duration-500 group-hover:bg-rose-gradient group-hover:text-white group-hover:border-transparent"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
