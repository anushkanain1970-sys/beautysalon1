import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

export function LuxuryHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  const floatVariants = {
    animate: {
      y: [-8, 8, -8],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-gradient-to-br from-blush-ivory via-blush-ivory to-champagne-pink/50 pt-32 pb-20 lg:pt-0 lg:pb-0 flex items-center">
      {/* Background radial glows */}
      <div className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-dusty-rose/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] h-[700px] w-[700px] rounded-full bg-rose-gold/15 blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 w-full z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center h-full">
          
          {/* Left Column: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start justify-center pt-10 lg:pt-0"
          >
            <motion.div variants={itemVariants} className="mb-8 inline-flex items-center rounded-full bg-white/60 backdrop-blur-md border border-white/40 px-4 py-1.5 shadow-sm">
              <span className="eyebrow !text-[10px] !tracking-[0.2em] !text-deep-mauve">LUXURY BEAUTY & WELLNESS</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-display text-5xl sm:text-6xl lg:text-[5.5rem] leading-[1.05] text-rich-charcoal mb-6">
              Where Beauty <br />
              <span className="italic text-deep-mauve font-light">Meets Elegance</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="max-w-md text-lg leading-relaxed text-soft-mauve-gray mb-10 font-sans">
              Discover a sanctuary devoted to the quiet art of transformation. Couture hair, advanced skincare, and ceremonial rituals crafted for your radiant self.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-14 w-full sm:w-auto">
              <Link to="/booking" className="btn-primary w-full sm:w-auto !py-3.5 !px-8">
                Book Appointment
              </Link>
              <Link to="/services" className="btn-secondary w-full sm:w-auto !py-3.5 !px-8">
                Explore Services
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-8 lg:gap-12 pt-6 border-t border-rose-gold/20">
              <div>
                <div className="text-display text-2xl font-semibold text-rich-charcoal mb-1">12+</div>
                <div className="text-[11px] uppercase tracking-[0.15em] text-soft-mauve-gray">Years of Artistry</div>
              </div>
              <div className="h-8 w-px bg-rose-gold/20" />
              <div>
                <div className="text-display text-2xl font-semibold text-rich-charcoal mb-1">5★</div>
                <div className="text-[11px] uppercase tracking-[0.15em] text-soft-mauve-gray">Award Winning</div>
              </div>
              <div className="h-8 w-px bg-rose-gold/20" />
              <div>
                <div className="text-display text-2xl font-semibold text-rich-charcoal mb-1">Paris</div>
                <div className="text-[11px] uppercase tracking-[0.15em] text-soft-mauve-gray">Flagship Atelier</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Imagery */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative h-[600px] lg:h-[750px] w-full rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-luxe"
          >
            {/* Silk Fabric Overlay */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-20 z-10 pointer-events-none"
            >
              <source src="/media/Blush-pink_silk_fabric_flowing_g.mp4" type="video/mp4" />
            </video>

            {/* Main Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            >
              <source src="/media/Beauty_salon_hero_video.mp4" type="video/mp4" />
              {/* Fallback image if video fails to load */}
              <img src="/photos/jessica-felicio-QS9ZX5UnS14-unsplash.jpg" alt="Luxury Beauty Salon" className="h-full w-full object-cover" />
            </video>
            
            <div className="absolute inset-0 bg-gradient-to-t from-blush-ivory/80 via-transparent to-transparent" />

            {/* Bottom Caption */}
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-white font-display italic text-lg lg:text-xl drop-shadow-md">
                Signature Ritual — The Elegance Glow
              </p>
            </div>

            {/* Floating Glassmorphism Cards */}
            <motion.div
              variants={floatVariants}
              animate="animate"
              style={{ animationDelay: "0s" }}
              className="absolute top-12 -left-6 lg:-left-12 glass rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl bg-white/40 border border-white/50"
            >
              <div className="h-10 w-10 rounded-full bg-rose-gradient flex items-center justify-center text-white text-lg">
                ★
              </div>
              <div>
                <div className="text-sm font-semibold text-rich-charcoal">4.9/5 Rating</div>
                <div className="text-[10px] uppercase tracking-widest text-soft-mauve-gray mt-0.5">230+ Reviews</div>
              </div>
            </motion.div>

            <motion.div
              variants={floatVariants}
              animate="animate"
              style={{ animationDelay: "1.5s" }}
              className="absolute bottom-24 -right-4 lg:-right-8 glass rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl bg-white/40 border border-white/50"
            >
              <div>
                <div className="text-sm font-semibold text-rich-charcoal">98% Satisfaction</div>
                <div className="text-[10px] uppercase tracking-widest text-soft-mauve-gray mt-0.5">Client Excellence</div>
              </div>
            </motion.div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
