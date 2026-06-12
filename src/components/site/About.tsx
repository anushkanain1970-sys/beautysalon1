const imgAboutMain = "/photos/amir-seilsepour-VLJV46hPLSM-unsplash.webp";
const imgAboutCollage1 = "/photos/taylor-beach-kwu9Ny5dKOE-unsplash.webp";
const imgAboutCollage2 = "/photos/dynamic-wang-NRFH-dCQ5i8-unsplash.webp";

export function About() {
  return (
    <section id="about" className="relative px-6 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Gallery collage */}
        <div className="relative">
          <div className="grid grid-cols-6 grid-rows-6 gap-4 h-[640px]">
            <div className="col-span-4 row-span-6 zoom-img rounded-[36px] shadow-luxe">
              <img
                src={imgAboutMain}
                alt="Luxury salon interior at Maison Lumière"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="col-span-2 row-span-3 zoom-img rounded-[28px] shadow-soft">
              <img
                src={imgAboutCollage1}
                alt="Elegant salon dressing chairs"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="col-span-2 row-span-3 zoom-img rounded-[28px] shadow-soft">
              <img
                src={imgAboutCollage2}
                alt="Signature product scents display"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* decorative gold ring */}
          <div
            aria-hidden
            className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full border border-warm-gold/40 animate-float"
          />
        </div>

        {/* Text */}
        <div>
          <div className="eyebrow">Our maison</div>
          <h2 className="mt-4 text-display text-[clamp(2.2rem,4.6vw,3.8rem)] text-charcoal">
            A sanctuary <span className="italic text-gold-gradient">crafted</span>{" "}
            for those who appreciate the quiet art of beauty.
          </h2>
          <span className="divider-gold mt-8" />
          <p className="mt-8 text-[1.02rem] leading-relaxed text-soft-gray">
            Founded in 2013 by master colorist Camille Aury, Maison Lumière was
            born from a singular obsession: to elevate every beauty experience
            into something deeply personal, considered, and timeless.
          </p>
          <p className="mt-5 text-[1.02rem] leading-relaxed text-soft-gray">
            Behind our champagne doors, an atelier of certified artisans curates
            bespoke rituals — from couture color and bridal artistry to advanced
            skincare and ceremonial spa treatments — using the world&rsquo;s
            most refined botanical formulations.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6">
            {[
              { k: "Maison since", v: "2013" },
              { k: "Master artisans", v: "18" },
              { k: "Signature rituals", v: "42" },
              { k: "Private suites", v: "9" },
            ].map((s) => (
              <div
                key={s.k}
                className="rounded-2xl border border-warm-gold/20 bg-white/60 p-5 backdrop-blur"
              >
                <div className="eyebrow !text-[10px]">{s.k}</div>
                <div className="mt-1 text-display text-3xl text-charcoal">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
