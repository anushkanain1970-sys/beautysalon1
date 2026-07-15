import { motion } from "framer-motion";

const staff = [
  {
    name: "Clara Dubois",
    role: "Master Colourist",
    image: "/photos/jessie-dee-dabrowski-www-jessiedee-net-W6cwaL7PMSw-unsplash.jpg",
  },
  {
    name: "Sophie Laurent",
    role: "Bridal Specialist",
    image: "/photos/lola-azizada-Bv8pYo9RJno-unsplash.jpg",
  },
  {
    name: "Aurelie Martin",
    role: "Skin Therapist",
    image: "/photos/lola-azizada-I3y-aJ4DWng-unsplash.jpg",
  },
  {
    name: "Chloe Moreau",
    role: "Senior Stylist",
    image: "/photos/sara-dabaghian-w6fsJW8LBD4-unsplash.jpg",
  },
];

export function Team() {
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
    <section className="relative py-32 bg-soft-pearl-pink overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="eyebrow inline-block mb-4">OUR ARTISANS</span>
            <h2 className="text-display text-4xl lg:text-5xl text-rich-charcoal">
              The Hands Behind <br />
              <span className="italic font-light text-deep-mauve">The Elegance</span>
            </h2>
          </motion.div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {staff.map((member, i) => (
            <motion.div key={i} variants={item} className="group cursor-pointer">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-soft mb-6 transition-all duration-700 group-hover:-translate-y-2 group-hover:shadow-luxe">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter saturate-[0.9] group-hover:saturate-100"
                />
              </div>
              <div className="text-center">
                <h3 className="text-display text-2xl text-rich-charcoal mb-1">{member.name}</h3>
                <p className="text-[11px] tracking-widest uppercase text-soft-mauve-gray">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
