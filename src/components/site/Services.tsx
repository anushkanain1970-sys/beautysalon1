import { motion } from "framer-motion";
import { Scissors, Droplet, Sparkles, Sprout, Heart, Gem } from "lucide-react";

const services = [
  {
    title: "Hair Styling",
    description: "Couture cuts and transformative styling tailored to your bone structure.",
    icon: Scissors,
  },
  {
    title: "Hair Colour",
    description: "Bespoke balayage and dimensional color using premium low-toxin pigments.",
    icon: Droplet,
  },
  {
    title: "Bridal Makeup",
    description: "Enduring, camera-ready elegance crafted for your most significant day.",
    icon: Sparkles,
  },
  {
    title: "Skincare",
    description: "Advanced clinical treatments combined with holistic relaxation.",
    icon: Sprout,
  },
  {
    title: "Facials",
    description: "Ceremonial facial rituals designed to lift, sculpt, and restore radiance.",
    icon: Heart,
  },
  {
    title: "Nail Services",
    description: "Immaculate manicures and pedicures in a strictly hygienic environment.",
    icon: Gem,
  },
];

export function Services() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    },
  };

  return (
    <section className="relative py-32 bg-blush-ivory overflow-hidden">
      {/* Decorative Serum Droplets */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 -left-10 w-64 h-64 opacity-20 blur-sm pointer-events-none mix-blend-multiply"
      >
        <img src="/media/Floating_beauty_serum_droplets.jpeg" alt="" className="w-full h-full object-cover rounded-full" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 -right-20 w-96 h-96 opacity-15 blur-[2px] pointer-events-none mix-blend-multiply"
      >
        <img src="/media/Floating_beauty_serum_droplets.jpeg" alt="" className="w-full h-full object-cover rounded-full" />
      </motion.div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="eyebrow inline-block mb-4">SIGNATURE OFFERINGS</span>
            <h2 className="text-display text-4xl lg:text-5xl text-rich-charcoal">
              The <span className="italic font-light text-deep-mauve">Menu</span>
            </h2>
          </motion.div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, i) => (
            <motion.div 
              key={i} 
              variants={item} 
              className="group bg-white/60 backdrop-blur-sm border border-champagne-pink/50 rounded-[2rem] p-8 lg:p-10 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-luxe hover:border-rose-gold/40 flex flex-col items-center text-center cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-champagne-pink to-rose-gold flex items-center justify-center mb-6 shadow-sm">
                <service.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-display text-2xl text-rich-charcoal mb-4">{service.title}</h3>
              <p className="text-[15px] leading-relaxed text-soft-mauve-gray font-sans">
                {service.description}
              </p>
              
              <div className="mt-8 w-0 h-[1px] bg-rose-gold transition-all duration-500 group-hover:w-16" />
            </motion.div>
          ))}
        </motion.div>
        
      </div>
    </section>
  );
}
