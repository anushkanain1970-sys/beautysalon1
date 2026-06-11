const tiles = [
  { src: "/photos/amir-seilsepour-_hAaFD1ucfk-unsplash.jpg", alt: "Private salon styling suite still life", span: "row-span-2" },
  { src: "/photos/taylor-heery-7tz7I7naQ8c-unsplash.jpg", alt: "Luxury hair wash backwash basin", span: "" },
  { src: "/photos/hardeep-singh-xqWcoLJf8t0-unsplash.jpg", alt: "Atelier master hair shaping artistry", span: "" },
  { src: "/photos/jessie-dee-dabrowski-www-jessiedee-net-W6cwaL7PMSw-unsplash.jpg", alt: "Premium couture cosmetic palette and brushes", span: "row-span-2 col-span-2" },
  { src: "/photos/sara-dabaghian-w6fsJW8LBD4-unsplash.jpg", alt: "Fine-art beauty makeup details", span: "" },
  { src: "/photos/yunona-uritsky-ajM1jHa0dlg-unsplash.jpg", alt: "Vibrant high-fashion lips close up", span: "" },
  { src: "/photos/enecta-cannabis-extracts-80wCkpt-IKE-unsplash.jpg", alt: "Organic cold-pressed skincare serums", span: "row-span-2" },
  { src: "/photos/roxana-maria-nSfMaRZRjKE-unsplash.jpg", alt: "Amber cosmetic apothecary bottles", span: "" },
  { src: "/photos/sunny-ng-KVIlNRoGwxk-unsplash.jpg", alt: "Luxury fragrance and perfume bottles", span: "" },
  { src: "/photos/huha-inc-Hp-3N5Gl1Ak-unsplash.jpg", alt: "Wellness spa towel and clay bowl setup", span: "row-span-2" },
  { src: "/photos/kate-laine-6ZXJFyTCZ_w-unsplash.jpg", alt: "Aesthetic botanical face mask treatment bowl", span: "" },
  { src: "/photos/edz-norton-PEttXYw9hi8-unsplash.jpg", alt: "Hot volcanic stones massage therapy", span: "" },
  { src: "/photos/olamide-gabriel-SY5_0cZerec-unsplash.jpg", alt: "Editorial beauty close-up portrait", span: "row-span-2" },
  { src: "/photos/adam-winger-KVVjmb3IIL8-unsplash.jpg", alt: "Luxury atelier dresser and floral design", span: "" },
  { src: "/photos/Screenshot 2026-06-08 174145.png", alt: "Signature Maison Lumière couture layout", span: "col-span-2" },
  { src: "/photos/Screenshot 2026-06-08 174207.png", alt: "Maison Lumière atelier interior view", span: "" },
];

export function Gallery() {
  return (
    <section
      id="gallery"
      className="relative overflow-hidden px-6 py-28 lg:px-10 lg:py-40"
      style={{ background: "linear-gradient(180deg, var(--ivory), var(--beige))" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="eyebrow">The portfolio</div>
            <h2 className="mt-4 text-display text-[clamp(2.2rem,4.6vw,3.8rem)] text-charcoal">
              A gallery of{" "}
              <span className="italic text-gold-gradient">quiet luxury</span>.
            </h2>
          </div>
          <p className="max-w-md text-soft-gray">
            Selected work from our atelier — bridal, editorial, and signature
            transformations crafted in our private suites.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5 [grid-auto-rows:220px]">
          {tiles.map((t, i) => (
            <figure
              key={i}
              className={`zoom-img relative overflow-hidden rounded-[28px] shadow-soft ${t.span}`}
            >
              <img
                src={t.src}
                alt={t.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
