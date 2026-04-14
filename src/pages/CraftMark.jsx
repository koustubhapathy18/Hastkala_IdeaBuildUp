import { motion } from 'framer-motion';
import { ShieldAlert, Fingerprint, Search, Scale, FileWarning } from 'lucide-react';
import { Link } from 'react-router-dom';

const CraftMark = () => {
  return (
    <div className="bg-earth-50 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-earth-900 z-0">
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-terracotta-900 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-forest-900/50 border border-forest-500 flex items-center justify-center text-forest-400">
                <ShieldAlert size={32} />
              </div>
            </div>
            <span className="text-terracotta-400 font-bold uppercase tracking-[0.3em] text-sm mb-6 block">The Identity Guard</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              CraftMark <span className="italic font-light text-terracotta-400">IP Shield</span>
            </h1>
            <p className="text-xl text-earth-300 font-light leading-relaxed">
              Protecting artisan heritage with Perceptual Hashing (pHash) and AI Web Crawlers. Because a masterpiece deserves to remain original.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-earth-900 mb-6">
              How We Protect <span className="italic text-terracotta-600 font-light">Creators</span>
            </h2>
            <p className="text-lg text-earth-600 leading-relaxed font-light">
              Fast fashion and mass manufacturing frequently rip off traditional designs. Our technology proactively finds and removes counterfeits, sending automatic legal notices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Fingerprint size={32} />,
                title: "1. Digital Fingerprint",
                desc: "Every product image is converted into a unique mathematical hash (pHash) upon listing.",
                delay: 0.1
              },
              {
                icon: <Search size={32} />,
                title: "2. 24/7 AI Crawling",
                desc: "Our AI bots continuously scan global platforms like Amazon and Myntra for matching image hashes.",
                delay: 0.2
              },
              {
                icon: <Scale size={32} />,
                title: "3. Detection & Verification",
                desc: "Matches are flagged when visual similarity exceeds 90% without Hastkala authorization.",
                delay: 0.3
              },
              {
                icon: <FileWarning size={32} />,
                title: "4. Auto-Takedown Notices",
                desc: "We auto-generate and dispatch legal IP Takedown Notices to the violating platform instantly.",
                delay: 0.4
              }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.delay }}
                className="bg-earth-50 p-8 rounded-3xl border border-earth-100 hover:border-terracotta-300 transition-colors group"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-terracotta-600 mb-6 shadow-sm border border-earth-200 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-earth-900 mb-4">{step.title}</h3>
                <p className="text-earth-600 leading-relaxed text-sm font-light">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section className="py-24 bg-earth-900 border-y border-earth-800 overflow-hidden relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <h2 className="text-4xl font-serif font-bold text-white mb-6">
                Active <span className="italic text-forest-400 font-light">Defense</span>
              </h2>
              <p className="text-lg text-earth-300 mb-8 leading-relaxed font-light">
                Our dashboard simulates the real-time activity of the CraftMark Web Crawler. View the latest protected designs and automated legal actions taken against counterfeiting vendors.
              </p>
              <ul className="space-y-4 text-earth-200">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-forest-400 animate-pulse"></span>
                  Currently crawling 1.2M+ product listings
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-terracotta-400"></span>
                  48 Takedowns successfully executed this week
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-earth-400"></span>
                  Zero cost to the artisan
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="bg-[#130d0a] border border-earth-700 rounded-2xl p-6 font-mono text-sm overflow-hidden shadow-2xl relative">
                <div className="flex items-center justify-between mb-4 border-b border-earth-800 pb-4">
                  <span className="text-forest-400 uppercase tracking-widest font-bold text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-forest-400 animate-ping"></span>
                    Terminal — Crawler Output
                  </span>
                  <span className="text-earth-500 text-xs">v1.0.4—pHash</span>
                </div>
                <div className="space-y-3 text-earth-400">
                  <p><span className="text-blue-400">[info]</span> Scanning Amazon IN for pHash: <span className="text-white">a3f91b7c...</span></p>
                  <p><span className="text-terracotta-400">[warn]</span> Match found: 98% similarity structurally.</p>
                  <p><span className="text-blue-400">[info]</span> Verifying seller authorization using Blockchain ledger.</p>
                  <p><span className="text-terracotta-500">[alert]</span> Seller not authorized.</p>
                  <p className="text-white"><span className="text-forest-400">[success]</span> Generating DMCA Takedown Notice PDF.</p>
                  <p><span className="text-forest-400">[success]</span> Legal Notice dispatched to infringement@amazon.com.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-terracotta-50 border-t border-terracotta-100">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-earth-900 mb-6">
            Buy with Confidence
          </h2>
          <p className="text-lg text-earth-700 mb-10 font-light">
            Every product on Hastkala is verified original. Shop knowing your purchase supports the true creator, not a corporate copycat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/discover" className="px-8 py-4 bg-earth-900 text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-terracotta-600 transition-colors shadow-lg">
              Explore Originals
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default CraftMark;
