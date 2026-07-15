import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Calendar } from "lucide-react";

export function BookingCTA() {
  return (
    <section className="relative w-full overflow-hidden py-32 bg-gradient-to-br from-rose-gold to-deep-mauve text-white">
      {/* Decorative rose petals / soft glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-screen"
        >
          <source src="/media/Rose_petals_floating_through_air.mp4" type="video/mp4" />
        </video>
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-blush-ivory blur-[120px]"
        />
        <motion.div
          animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-champagne-pink blur-[150px]"
        />
      </div>

      <div className="mx-auto max-w-4xl px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <h2 className="text-display text-5xl md:text-6xl lg:text-7xl mb-6">
            Begin Your <span className="italic font-light">Transformation</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 font-sans max-w-2xl mx-auto mb-12">
            Reserve your private suite and experience the pinnacle of luxury beauty. Our artisans await.
          </p>
          
          <Link
            to="/booking"
            className="inline-flex items-center justify-center gap-3 bg-white text-deep-mauve px-10 py-5 rounded-full font-sans font-semibold text-sm tracking-widest uppercase transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)]"
          >
            <Calendar className="w-5 h-5" />
            Book Appointment
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
