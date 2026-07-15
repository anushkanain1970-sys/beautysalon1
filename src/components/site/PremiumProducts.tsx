import { motion } from "framer-motion";

export function PremiumProducts() {
  return (
    <section className="relative py-32 bg-soft-pearl-pink overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Glassmorphism Card Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="order-2 lg:order-1"
          >
            <div className="glass-gold rounded-[2rem] p-10 lg:p-14">
              <span className="eyebrow inline-block mb-6">THE MAISON COLLECTION</span>
              <h2 className="text-display text-4xl lg:text-5xl text-rich-charcoal leading-[1.1] mb-6">
                Premium Products <br />
                <span className="italic font-light text-deep-mauve">We Trust</span>
              </h2>
              <p className="text-soft-mauve-gray leading-relaxed mb-8">
                Your ritual extends beyond our atelier. We curate only the most efficacious, scientifically proven, and ethically sourced beauty products globally. From biocompatible skincare to low-toxin hair formulations, every product we use and prescribe is chosen to protect your health and amplify your radiance.
              </p>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-rose-gold" />
                  <span className="text-rich-charcoal font-medium tracking-wide">Biocompatible Skincare</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-rose-gold" />
                  <span className="text-rich-charcoal font-medium tracking-wide">Low-Toxin Hair Formulations</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-rose-gold" />
                  <span className="text-rich-charcoal font-medium tracking-wide">Ethically Sourced Ingredients</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Floating Product Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="order-1 lg:order-2 flex justify-center relative"
          >
            <motion.div
              animate={{ y: [-15, 15, -15] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-md aspect-square rounded-full flex items-center justify-center"
            >
              {/* Soft glows behind product */}
              <div className="absolute inset-0 rounded-full bg-rose-gold/20 blur-[80px]" />
              <div className="absolute inset-10 rounded-full bg-champagne-pink/30 blur-[40px]" />
              
              <video
                autoPlay
                loop
                muted
                playsInline
                className="relative z-10 w-[80%] h-[80%] object-cover rounded-full shadow-luxe"
              >
                <source src="/media/Luxury_beauty_products_floating_.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
