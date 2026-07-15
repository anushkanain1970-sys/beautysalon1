import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Sun, Droplets, GlassWater } from "lucide-react";

const moods = [
  {
    id: "bridal",
    title: "Bridal Glow",
    description: "Luminous, enduring elegance for your most photographed day.",
    icon: Sparkles,
    image: "/photos/lola-azizada-Bv8pYo9RJno-unsplash.jpg",
  },
  {
    id: "everyday",
    title: "Everyday Radiance",
    description: "Subtle refinements to elevate your natural, daily beauty.",
    icon: Sun,
    image: "/photos/ayo-ogunseinde-UqT55tGBqzI-unsplash.jpg",
  },
  {
    id: "restoration",
    title: "Deep Restoration",
    description: "Intensive, healing rituals to rejuvenate tired skin and hair.",
    icon: Droplets,
    image: "/photos/enecta-cannabis-extracts-80wCkpt-IKE-unsplash.jpg",
  },
  {
    id: "occasion",
    title: "Special Occasion",
    description: "Statement styling and makeup for when you need to turn heads.",
    icon: GlassWater,
    image: "/photos/dynamic-wang-NRFH-dCQ5i8-unsplash.jpg",
  },
];

export function ExploreByMood() {
  const [activeMood, setActiveMood] = useState(moods[0]);

  return (
    <section className="relative py-32 bg-gradient-to-br from-champagne-pink/40 to-soft-pearl-pink overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="eyebrow inline-block mb-4">CURATED EXPERIENCES</span>
          <h2 className="text-display text-4xl lg:text-5xl text-rich-charcoal">
            Explore by <span className="italic font-light text-deep-mauve">Mood</span>
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          
          {/* Left: Mood List */}
          <div className="flex flex-col gap-2">
            {moods.map((mood) => {
              const isActive = activeMood.id === mood.id;
              return (
                <div
                  key={mood.id}
                  onMouseEnter={() => setActiveMood(mood)}
                  onClick={() => setActiveMood(mood)}
                  className={`group cursor-pointer p-6 rounded-2xl transition-all duration-500 flex gap-6 items-start ${
                    isActive 
                      ? "bg-white/60 shadow-sm border border-white/50 border-l-2 border-l-rose-gold" 
                      : "hover:bg-white/30 border border-transparent border-l-2 border-l-transparent"
                  }`}
                >
                  <div className={`mt-1 transition-colors duration-500 ${isActive ? "text-rose-gold" : "text-soft-mauve-gray group-hover:text-rose-gold"}`}>
                    <mood.icon strokeWidth={1.5} className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-display text-2xl mb-2 transition-colors duration-500 ${isActive ? "text-deep-mauve" : "text-rich-charcoal"}`}>
                      {mood.title}
                    </h3>
                    <p className={`text-sm font-sans transition-colors duration-500 ${isActive ? "text-soft-mauve-gray" : "text-soft-mauve-gray/70"}`}>
                      {mood.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Image Display Panel */}
          <div className="relative aspect-[4/5] lg:aspect-[3/4] w-full rounded-[2.5rem] overflow-hidden shadow-luxe bg-blush-ivory/50">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeMood.id}
                src={activeMood.image}
                alt={activeMood.title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-rich-charcoal/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-8 left-8 right-8 z-10 pointer-events-none">
              <motion.p
                key={`caption-${activeMood.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-white font-display italic text-2xl drop-shadow-md"
              >
                {activeMood.title}
              </motion.p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
