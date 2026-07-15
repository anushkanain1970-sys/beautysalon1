import { motion } from "framer-motion";
import { Award, ShieldCheck, Sparkles, HeartHandshake, Crown, Sparkle } from "lucide-react";

const reasons = [
  {
    title: "Certified Experts",
    description: "Our artisans are globally trained masters of their craft.",
    icon: Award,
  },
  {
    title: "Premium Products",
    description: "We use only the finest, scientifically proven luxury brands.",
    icon: Crown,
  },
  {
    title: "Hygienic Environment",
    description: "Impeccable sanitation protocols for your peace of mind.",
    icon: ShieldCheck,
  },
  {
    title: "Personalized Care",
    description: "Every ritual is tailored precisely to your unique needs.",
    icon: HeartHandshake,
  },
  {
    title: "Luxury Experience",
    description: "A serene, five-star sanctuary designed for pure relaxation.",
    icon: Sparkles,
  },
  {
    title: "Award-Winning Team",
    description: "Recognized internationally for excellence in beauty.",
    icon: Sparkle,
  },
];

export function WhyUs() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
    },
  };

  return (
    <section className="relative py-32 bg-gradient-to-b from-champagne-pink/30 to-soft-pearl-pink overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="eyebrow inline-block mb-4">THE ATELIER STANDARD</span>
            <h2 className="text-display text-4xl lg:text-5xl text-rich-charcoal">
              Why Choose <span className="italic font-light text-deep-mauve">Beauty Elegance</span>
            </h2>
          </motion.div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {reasons.map((reason, i) => (
            <motion.div key={i} variants={item} className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-white shadow-soft flex items-center justify-center mb-6 transition-transform duration-500 group-hover:-translate-y-2">
                <reason.icon className="w-8 h-8 text-rose-gold" strokeWidth={1.5} />
              </div>
              <h3 className="text-display text-xl text-rich-charcoal mb-3">{reason.title}</h3>
              <p className="text-sm text-soft-mauve-gray leading-relaxed max-w-[260px]">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
