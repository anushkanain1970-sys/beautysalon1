import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Isabelle Moreau",
    role: "Editor, Vogue Paris",
    text: "Maison Lumière is the rare beauty house where every detail — the music, the light, the touch — feels considered. My colorist Camille is simply unmatched.",
  },
  {
    name: "Aria Chen",
    role: "Founder, Aria Atelier",
    text: "I&rsquo;ve traveled to spas across Tokyo, Milan, and New York. Nothing comes close to the calm and craft I experience here. It feels like coming home.",
  },
  {
    name: "Sofia Bennett",
    role: "Bride, May 2025",
    text: "They turned my wedding morning into a ceremony. Champagne, soft music, and a glow I&rsquo;d never seen in myself. I cried before I even saw the dress.",
  },
  {
    name: "Lena Hofmann",
    role: "Creative Director",
    text: "Beyond beautiful work — the warmth here is real. Maison Lumière has become my monthly ritual, my pause, my reset.",
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden px-6 py-28 lg:px-10 lg:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, color-mix(in oklab, var(--champagne) 30%, transparent), transparent)",
        }}
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow">Whispers of our guests</div>
          <h2 className="mt-4 text-display text-[clamp(2.2rem,4.6vw,3.8rem)] text-charcoal">
            Loved by the women who{" "}
            <span className="italic text-gold-gradient">return</span>.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="glass-gold lift-card relative rounded-[32px] p-10"
            >
              <Quote className="absolute right-8 top-8 h-10 w-10 text-warm-gold/40" />
              <div className="flex items-center gap-1 text-warm-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-warm-gold" />
                ))}
              </div>
              <blockquote
                className="mt-5 text-display text-[1.45rem] leading-snug text-charcoal"
                dangerouslySetInnerHTML={{ __html: `&ldquo;${r.text}&rdquo;` }}
              />
              <figcaption className="mt-6 flex items-center gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-rose-gradient text-sm text-white">
                  {r.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-sm font-medium text-charcoal">
                    {r.name}
                  </div>
                  <div className="text-[11px] tracking-[0.22em] uppercase text-soft-gray">
                    {r.role}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
