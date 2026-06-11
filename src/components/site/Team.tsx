import { Instagram } from "lucide-react";

const team = [
  { img: "/photos/ali-pazani-3w14X-Yxffk-unsplash.jpg", name: "Camille Aury", role: "Founder · Master Colorist" },
  { img: "/photos/ayo-ogunseinde-UqT55tGBqzI-unsplash.jpg", name: "Inès Rivière", role: "Lead Bridal Artist" },
  { img: "/photos/kadarius-seegars-Mxy5gokl8mE-unsplash.jpg", name: "Élise Marchand", role: "Head Esthetician" },
  { img: "/photos/vince-mariel-conlu-ajDUxve6clA-unsplash.jpg", name: "Mira Tanaka", role: "Nail Couturier" },
];

export function Team() {
  return (
    <section
      id="team"
      className="relative px-6 py-28 lg:px-10 lg:py-40"
      style={{ background: "linear-gradient(180deg, var(--beige), var(--ivory))" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="eyebrow">The atelier</div>
            <h2 className="mt-4 text-display text-[clamp(2.2rem,4.6vw,3.8rem)] text-charcoal">
              Artisans devoted to the{" "}
              <span className="italic text-gold-gradient">craft of beauty</span>.
            </h2>
          </div>
          <p className="max-w-md text-soft-gray">
            Trained in Paris, Tokyo and Milan — our team brings decades of
            editorial, bridal and clinical expertise to your private suite.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((p) => (
            <article
              key={p.name}
              className="lift-card group relative overflow-hidden rounded-[28px] border border-warm-gold/20 bg-white"
            >
              <div className="zoom-img relative aspect-[4/5]">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/45 via-transparent to-transparent" />
                <a
                  href="#"
                  aria-label={`${p.name} Instagram`}
                  className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full glass text-charcoal opacity-0 transition-all duration-500 group-hover:opacity-100"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
              <div className="p-6">
                <h3 className="text-display text-xl text-charcoal">{p.name}</h3>
                <p className="mt-1 text-[11px] tracking-[0.22em] uppercase text-warm-gold">
                  {p.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
