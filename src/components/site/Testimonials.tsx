import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "An absolute revelation. The team at Beauty Elegance understood exactly what I needed for my wedding day. The precision, the calm atmosphere, and the final result were all flawless.",
    name: "Eleanor Vance",
    role: "Bridal Client",
    initials: "EV",
  },
  {
    quote: "I have visited luxury salons across the globe, and none compare to the meticulous care and artistry here. My skin has never looked more radiant. A true sanctuary.",
    name: "Isabella Rossi",
    role: "Skincare Client",
    initials: "IR",
  },
  {
    quote: "Every appointment feels like a retreat. The attention to detail and the sheer mastery of the stylists ensure I walk out feeling transformed every single time.",
    name: "Madeleine Chen",
    role: "Regular Client",
    initials: "MC",
  },
];

export function Testimonials() {
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
    <section className="relative py-32 bg-gradient-to-b from-soft-pearl-pink to-blush-ivory overflow-hidden">
      
      {/* Decorative background pearls */}
      <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-white/40 blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-48 h-48 rounded-full bg-rose-gold/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="eyebrow inline-block mb-4">CLIENT EXPERIENCES</span>
            <h2 className="text-display text-4xl lg:text-5xl text-rich-charcoal leading-[1.1]">
              Words of <span className="italic font-light text-deep-mauve">Praise</span>
            </h2>
          </motion.div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 lg:grid-cols-3"
        >
          {testimonials.map((testimonial, i) => (
            <motion.div 
              key={i} 
              variants={item} 
              className="glass rounded-3xl p-10 lg:p-12 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-rose-gold text-lg">★</span>
                  ))}
                </div>
                <p className="font-display italic text-lg leading-relaxed text-soft-mauve-gray mb-10">
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 border-t border-champagne-pink/30 pt-6">
                <div className="w-12 h-12 rounded-full bg-rose-gradient flex items-center justify-center text-white text-sm font-semibold tracking-wider">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="font-sans font-medium text-rich-charcoal text-sm">{testimonial.name}</div>
                  <div className="text-[11px] uppercase tracking-widest text-soft-mauve-gray mt-1">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
