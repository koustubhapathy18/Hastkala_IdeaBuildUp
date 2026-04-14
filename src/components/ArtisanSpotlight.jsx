// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ArtisanSpotlight = () => {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#130d0a' }}>
      {/* Grain Texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      {/* Ambient glow */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-terracotta-900 rounded-full mix-blend-screen filter blur-[180px] opacity-[0.15] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-forest-900 rounded-full mix-blend-screen filter blur-[150px] opacity-[0.12] pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-16 py-32 lg:py-48 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Image Column — Arched modern frame */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-[45%] w-full relative"
          >
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:mx-0 overflow-hidden rounded-t-full rounded-b-sm border border-white/10 group">
              <img
                src="/images/products/artisan_spotlight.jpg"
                alt="Hand embroidered pashmina shawl by Kamla Devi"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out brightness-90 group-hover:brightness-100"
              />
              
              {/* Inner gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#130d0a]/90"></div>
            </div>

            {/* CraftMark Badge */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-12 z-20"
            >
              <div className="bg-[#1a1410]/60 backdrop-blur-2xl border border-white/10 rounded-sm px-6 py-5 max-w-[240px] shadow-2xl">
                <div className="flex items-center gap-3 mb-2 border-b border-white/10 pb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse"></span>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-terracotta-400">
                    CraftMark Secured
                  </p>
                </div>
                <p className="text-sm font-light text-earth-200 leading-relaxed font-serif italic">
                  Design Protected. 24/7 AI monitoring against knock-offs.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Column */}
          <div className="lg:w-[55%] flex flex-col justify-center mt-12 lg:mt-0">
            {/* Editorial Tag */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-10"
            >
              <span className="w-16 h-px bg-terracotta-500/50"></span>
              <span className="text-terracotta-400 text-[10px] font-bold uppercase tracking-[0.4em]">
                Meet The Maker
              </span>
            </motion.div>

            {/* Pull Quote — Massive, Ultra-light typography */}
            <motion.blockquote
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-14 relative"
            >
              <span className="absolute -top-12 -left-8 text-[120px] font-serif font-bold text-white/5 leading-none select-none pointer-events-none">&ldquo;</span>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extralight text-white leading-[1.1] tracking-tight">
                Every piece I weave holds the{' '}
                <span className="italic text-terracotta-400 font-light block mt-2">
                  story of my ancestors.
                </span>
              </p>
            </motion.blockquote>

            {/* Artisan Info Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-xl"
            >
              <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=200"
                    alt="Kamla Devi"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-2xl text-white font-serif font-light tracking-wide mb-1">Kamla Devi</p>
                  <p className="text-[10px] text-earth-500 uppercase tracking-[0.2em] font-bold">3rd Gen Weaver • Sualkuchi, Assam</p>
                </div>
              </div>

              {/* Story */}
              <div className="space-y-6 mb-16">
                <p className="text-earth-400 leading-relaxed font-light text-sm lg:text-base">
                  For decades, the intricate silk weaving of Sualkuchi was controlled by local traders who siphoned 70% of the profits. Master weavers like Kamla remained in poverty despite their exquisite skill.
                </p>
                <p className="text-earth-400 leading-relaxed font-light text-sm lg:text-base">
                  Through Hastkala, Kamla now sells her Mekhela Chadors directly to the world. With{' '}
                  <span className="text-earth-200 font-medium tracking-wide">SchemeGPT</span>, she unlocked pending PM Vishwakarma benefits, enabling her to purchase a second loom.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-6">
                <Link
                  to="/discover"
                  className="group relative px-8 py-4 bg-transparent text-white text-[10px] font-bold tracking-[0.2em] uppercase rounded-none border border-terracotta-500/50 hover:border-terracotta-400 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-terracotta-600/20 to-terracotta-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex items-center gap-3">
                    Shop The Collection
                    <ArrowRight size={14} className="group-hover:translate-x-1 text-terracotta-400 transition-transform" />
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtisanSpotlight;
