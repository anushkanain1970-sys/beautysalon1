import { motion } from "framer-motion";

export function LuxuryShowcase() {
  return (
    <section className="relative py-32 bg-rich-charcoal text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col justify-center"
          >
            <span className="eyebrow inline-block mb-6 !text-rose-gold">THE ART OF ELEVATION</span>
            <h2 className="text-display text-4xl lg:text-6xl leading-[1.1] mb-8">
              Beauty as a <br />
              <span className="italic font-light text-champagne-pink">Living Sculpture</span>
            </h2>
            <p className="text-white/70 font-sans text-lg leading-relaxed max-w-md">
              We approach every client as a masterpiece in motion. Our atelier blends time-honored artistry with state-of-the-art technique to craft a look that is definitively yours—effortless, striking, and unforgettable.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative aspect-[3/4] w-full rounded-[2.5rem] overflow-hidden shadow-luxe"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/media/Luxury_centerpiece_sculpture_rot.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-rich-charcoal/60 via-transparent to-transparent" />
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
