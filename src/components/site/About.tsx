import { motion } from "framer-motion";

export function About() {
  return (
    <section className="relative py-32 bg-blush-ivory overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
          
          {/* Left: Imagery Grid */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative h-[500px] lg:h-[650px] rounded-[2.5rem] overflow-hidden shadow-luxe"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/media/Luxury_flower_sculpture_unfoldin.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-rose-gold/10 mix-blend-multiply pointer-events-none" />
          </motion.div>

          {/* Right: Storytelling Copy */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col justify-center"
          >
            <span className="eyebrow inline-block mb-6">OUR PHILOSOPHY</span>
            <h2 className="text-display text-4xl lg:text-5xl text-rich-charcoal leading-[1.1] mb-8">
              Patience, Mastery, <br />
              <span className="italic font-light text-deep-mauve">and the Art of Listening.</span>
            </h2>
            
            <div className="space-y-6 text-[15px] lg:text-[16px] leading-relaxed text-soft-mauve-gray font-sans">
              <p>
                Beauty Elegance was founded on a singular premise: that true luxury lies in the unseen details. It is found in the unhurried consultation, the precise calibration of color, and the meticulous attention to the health of your hair and skin. 
              </p>
              <p>
                We reject the rushed, transactional nature of modern salons. Instead, our atelier operates as a sanctuary of calm. Our master artisans are trained to listen deeply before they act, blending technical mastery with an intuitive understanding of your personal aesthetic.
              </p>
              <p>
                Whether you seek a subtle refinement or a complete ceremonial transformation, every ritual is executed with patience, precision, and an unwavering commitment to elegance.
              </p>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-rose-gold/30">
                <img src="/photos/nataliya-melnychuk-tnWjbdPmk1M-unsplash.jpg" alt="Founder Portrait" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-display italic text-2xl text-rich-charcoal">Elise Laurent</div>
                <div className="text-[11px] tracking-widest uppercase text-rose-gold mt-1">Founder & Creative Director</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
