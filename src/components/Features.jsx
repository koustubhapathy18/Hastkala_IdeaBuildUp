// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ShieldCheck, IndianRupee, HandHeart, Sparkles } from 'lucide-react';

const Features = () => {
  const values = [
    {
      id: "pricemirror",
      title: "100% Direct",
      description: "Zero middlemen. PriceMirror ensures every Rupee reaches the artisan who crafted it.",
      icon: <IndianRupee size={28} strokeWidth={1} />,
      accent: 'terracotta',
    },
    {
      id: "truthmark",
      title: "TruthMark Verified",
      description: "Scan the QR on any product to trace its origin back to the artisan's village.",
      icon: <ShieldCheck size={28} strokeWidth={1} />,
      accent: 'forest',
    },
    {
      id: "womencraft",
      title: "Empowering Women",
      description: "Direct Aadhaar payouts so she owns 100% of her financial independence.",
      icon: <HandHeart size={28} strokeWidth={1} />,
      accent: 'earth',
    },
    {
      id: "schemegpt",
      title: "AI-Powered Tools",
      description: "SchemeGPT unlocks government welfare schemes for every artisan on the platform.",
      icon: <Sparkles size={28} strokeWidth={1} />,
      accent: 'terracotta',
    }
  ];

  const accentColors = {
    terracotta: {
      glow: 'group-hover:bg-terracotta-900/5',
      icon: 'text-terracotta-600',
      line: 'bg-terracotta-400',
    },
    forest: {
      glow: 'group-hover:bg-forest-900/5',
      icon: 'text-forest-700',
      line: 'bg-forest-500',
    },
    earth: {
      glow: 'group-hover:bg-earth-900/5',
      icon: 'text-earth-900',
      line: 'bg-earth-900',
    },
  };

  return (
    <section className="py-32 lg:py-40 bg-earth-50 relative overflow-hidden">
      {/* Decorative ambient blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-terracotta-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 -translate-y-1/2 translate-x-1/3"></div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        {/* Editorial Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-px bg-terracotta-500/60"></span>
              <span className="text-terracotta-600 text-[10px] font-bold uppercase tracking-[0.3em]">
                Why Hastkala
              </span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-serif text-earth-900 font-light tracking-tight leading-[1.1]">
              Craftsmanship deserves <br/>
              <span className="italic font-normal text-terracotta-700">complete transparency.</span>
            </h2>
          </div>
          <p className="text-earth-500 max-w-sm font-light leading-relaxed">
            By shifting the paradigm, we place the power and profit back into the hands of the creators.
          </p>
        </motion.div>

        {/* Feature Grid — Borderless and minimalist */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {values.map((value, index) => {
            const colors = accentColors[value.accent];
            return (
              <motion.div
                key={value.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col items-start"
              >
                {/* Floating Glow Background */}
                <div className={`absolute -inset-6 rounded-2xl transition-colors duration-700 ${colors.glow} -z-10`}></div>

                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-full border border-earth-200 bg-white flex items-center justify-center ${colors.icon} mb-8 shadow-sm group-hover:scale-110 group-hover:border-transparent transition-all duration-500 group-hover:shadow-md`}>
                  {value.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-serif font-medium text-earth-900 mb-4 tracking-tight">
                  {value.title}
                </h3>

                {/* Accent line */}
                <div className={`w-8 h-[1px] ${colors.line} mb-4 group-hover:w-16 transition-all duration-700 opacity-40`}></div>

                {/* Description */}
                <p className="text-[13px] text-earth-600 leading-relaxed font-light">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
