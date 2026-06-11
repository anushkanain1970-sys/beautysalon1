import { Award, Leaf, ShieldCheck, Heart, Gem, Crown } from "lucide-react";

const items = [
  { icon: Award, title: "Award-winning team", desc: "Recognized by Vogue, Tatler & Allure across three continents." },
  { icon: Gem, title: "Premium products", desc: "Sisley, Augustinus Bader, Oribe & rare French botanicals." },
  { icon: ShieldCheck, title: "Hygienic sanctuary", desc: "Hospital-grade sterilization and single-use couture tooling." },
  { icon: Heart, title: "Personalized care", desc: "Every visit begins with a private consultation and tea ceremony." },
  { icon: Crown, title: "Luxury experience", desc: "Private suites, champagne service, curated playlists. Always." },
  { icon: Leaf, title: "Conscious beauty", desc: "Carbon-neutral atelier, refillable formulas, ethical sourcing." },
];

export function WhyUs() {
  return (
    <section id="why" className="relative px-6 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow">Why Maison Lumière</div>
          <h2 className="mt-4 text-display text-[clamp(2.2rem,4.6vw,3.8rem)] text-charcoal">
            Six promises woven into{" "}
            <span className="italic text-gold-gradient">every visit</span>.
          </h2>
          <span className="divider-gold mt-8" />
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="lift-card group relative overflow-hidden rounded-3xl border border-warm-gold/20 bg-white/60 p-8 backdrop-blur"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: "radial-gradient(closest-side, var(--champagne), transparent)" }}
              />
              <div className="relative">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-beige to-white border border-warm-gold/30 text-warm-gold shadow-soft">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-6 text-[11px] tracking-[0.3em] uppercase text-warm-gold">
                  0{i + 1}
                </div>
                <h3 className="mt-2 text-display text-2xl text-charcoal">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
