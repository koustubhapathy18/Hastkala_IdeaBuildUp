// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, MapPin, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroHeader = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-earth-900 border-b border-earth-800">
      {/* Full-bleed Background Image with Cinematic Grading */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1584982631627-c1d09dedc0bf?q=80&w=2670&auto=format&fit=crop"
          alt="Indian handicraft artisan workshop"
          className="w-full h-full object-cover"
        />
        {/* Soft, rich, dark gradient overlay for typographic contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-earth-900/90 via-earth-900/60 to-earth-900/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900 via-transparent to-transparent"></div>
        
        {/* Subtle animated vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)] pointer-events-none"></div>

        {/* Grain texture for organic feel */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 container mx-auto px-6 lg:px-16 pt-32 pb-12 min-h-screen flex flex-col justify-between">
        
        {/* Hero Content */}
        <div className="flex-1 flex items-center">
          <div className="max-w-4xl">
            {/* Editorial Tag */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-12"
            >
              <span className="w-16 h-px bg-terracotta-500/50"></span>
              <span className="text-terracotta-400 text-[10px] font-bold uppercase tracking-[0.4em]">
                Authentic Indian Handicrafts
              </span>
            </motion.div>

            {/* Main Headline — Thinner font weights, extreme contrast */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl lg:text-8xl font-serif text-white leading-[1.05] tracking-tight mb-8"
            >
              <span className="font-extralight text-earth-100 block mb-2">Preserving</span>
              Ancient <span className="italic text-terracotta-400 font-light">Heritage.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg lg:text-xl text-earth-300/80 mb-16 max-w-2xl leading-relaxed font-light"
            >
              Directly connecting India's finest rural artisans to conscious buyers. <br className="hidden md:block"/>
              <span className="text-white">Zero middlemen. 100% Transparent pricing.</span>
            </motion.p>

            {/* Premium CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-6"
            >
              <button
                onClick={() => {
                  const el = document.getElementById('collection');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative px-8 py-4 bg-transparent text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-none border border-terracotta-500/50 hover:border-terracotta-400 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-terracotta-600/20 to-terracotta-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <ShoppingBag size={16} className="text-terracotta-400 group-hover:scale-110 transition-transform duration-500" />
                  Explore Collection
                </div>
              </button>

              <Link
                to="/artisans"
                className="group px-8 py-4 text-earth-200 text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-500 flex items-center gap-3 hover:text-white"
              >
                Meet Our Artisans
                <ArrowRight size={14} className="transform group-hover:translate-x-2 text-earth-400 group-hover:text-white transition-all duration-500" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar — Minimalistic Stats + Featured Artisan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 pt-10 border-t border-earth-100/10 mt-16 lg:mt-0"
        >
          {/* Stats Strip */}
          <div className="flex flex-wrap gap-12 lg:gap-20">
            {[
              { value: '1,200', label: 'Master Artisans' },
              { value: '26', label: 'States Represented' },
              { value: '100%', label: 'Direct Compensation' },
            ].map((stat) => (
              <div key={stat.label} className="group cursor-default">
                <p className="text-3xl lg:text-4xl font-serif text-white font-light tracking-tight group-hover:text-terracotta-300 transition-colors duration-500">
                  {stat.value}
                </p>
                <p className="text-[9px] text-earth-400/80 uppercase tracking-[0.3em] mt-2 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Featured Artisan Card — Ultra-clean Glass */}
          <div className="relative group overflow-hidden bg-earth-900/40 backdrop-blur-2xl border border-white/5 rounded-2xl p-5 flex items-center gap-5 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-700 cursor-default">
            {/* Subtle glow behind card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-terracotta-900/20 mix-blend-screen rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-duration-700 pointer-events-none"></div>

            <div className="w-14 h-14 rounded-full overflow-hidden border border-white/20 flex-shrink-0 relative z-10">
              <img
                src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=200"
                alt="Featured artisan"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="relative z-10">
              <p className="text-[9px] text-terracotta-400 font-bold uppercase tracking-[0.25em] mb-1">Featured Artisan</p>
              <p className="text-base text-white font-serif tracking-wide">Meera Devi</p>
              <p className="text-[11px] text-earth-400 flex items-center gap-1.5 mt-0.5">
                <MapPin size={10} className="text-earth-500" /> Bhuj, Gujarat
              </p>
            </div>
            <div className="ml-4 flex items-center gap-1.5 bg-forest-900/50 border border-forest-500/20 text-forest-300 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest relative z-10">
              <Shield size={10} />
              Verified
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 hidden md:flex"
        >
          <span className="text-[9px] text-earth-500 uppercase tracking-[0.4em] font-bold">Discover</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-earth-600/50 to-transparent"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroHeader;
