// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Leaf, Award, Compass, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Heritage = () => {
  return (
    <div className="bg-earth-50 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-earth-900 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512413914619-75618408d669?q=80&w=2070&auto=format&fit=crop" 
            alt="Indian Craft Heritage" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-terracotta-400 font-bold uppercase tracking-[0.3em] text-sm mb-6 block">Our Story</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Preserving <span className="italic font-light text-earth-200">Thousands of Years</span> of Art
            </h1>
            <p className="text-xl text-earth-100 font-light leading-relaxed">
              India's cultural tapestry is woven with the threads of millions of artisans. 
              At Hastkala, we are on a mission to bring their untold stories and unmatched craft direct to the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <h2 className="text-4xl font-serif font-bold text-earth-900 mb-6">
                The Dying Art of the <span className="italic text-terracotta-600">Middleman Economy</span>
              </h2>
              <p className="text-lg text-earth-600 mb-6 leading-relaxed font-light">
                For centuries, rural artisans have been the backbone of India's creative economy. Yet, they remain among the most marginalized communities.
              </p>
              <p className="text-lg text-earth-600 mb-8 leading-relaxed font-light">
                Why? Because a complex web of traders, middlemen, and retail markups swallows <strong className="font-medium text-earth-900">up to 70%</strong> of the final price. The creator—the one who spends weeks hunched over a loom or molding clay—often barely makes minimum wage.
              </p>
              
              <div className="bg-earth-50 p-6 rounded-2xl border-l-4 border-terracotta-500">
                <p className="font-serif italic text-xl text-earth-800 leading-relaxed">
                  "When the hands that weave the magic cannot afford to feed their families, a piece of our heritage dies every single day."
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/images/products/img3_5.jpg" 
                  alt="Weaver at work" 
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-earth-900 text-white p-8 rounded-2xl shadow-xl max-w-xs hidden md:block">
                <p className="text-4xl font-serif font-bold text-terracotta-400 mb-2">70%</p>
                <p className="text-sm uppercase tracking-widest font-bold">Lost to Middlemen</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Hastkala Solution */}
      <section className="py-24 bg-earth-900 text-earth-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-terracotta-900 rounded-full mix-blend-screen filter blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              The Hastkala <span className="italic text-terracotta-400 font-light">Revolution</span>
            </h2>
            <p className="text-xl text-earth-300 font-light leading-relaxed">
              We built a decentralized, transparent technology bridge connecting the deepest villages of India directly to your living room.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Compass size={32} />,
                title: "Direct Access",
                desc: "We onboard artisans from remote clusters, providing them the digital tools to showcase their work globally."
              },
              {
                icon: <Award size={32} />,
                title: "TruthMark Blockchain",
                desc: "Every product is authenticated. You can trace exactly where it came from, who made it, and the materials used."
              },
              {
                icon: <Leaf size={32} />,
                title: "0% Markup",
                desc: "Our PriceMirror engine ensures absolute transparency. The price you pay is the exact amount the artisan earns."
              },
              {
                icon: <Heart size={32} />,
                title: "WomenCraft Direct",
                desc: "Special focus on supporting female artisan collectives, ensuring financial independence and community growth."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-earth-800/50 backdrop-blur-sm p-8 rounded-3xl border border-earth-700 hover:bg-earth-800 transition-colors"
              >
                <div className="w-16 h-16 bg-earth-900 rounded-full flex items-center justify-center text-terracotta-400 mb-6 shadow-lg border border-earth-700">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-earth-400 leading-relaxed text-sm font-light">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Craft Regions Map Proxy */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl mx-auto">
          <span className="text-terracotta-600 font-bold uppercase tracking-widest text-sm mb-4 block">Regional Diversity</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-earth-900 mb-8">
            From Every Corner of <span className="italic font-light">India</span>
          </h2>
          <p className="text-lg text-earth-600 mb-12 font-light leading-relaxed">
             From the intricate Pattachitra painters of Odisha to the delicate weavers of Assam, and the metal casters of Bastar. True Indian heritage is not a monolith; it's a vibrant mosaic.
          </p>
          
          <div className="bg-earth-50 rounded-3xl p-8 md:p-12 border border-earth-100 shadow-sm relative overflow-hidden">
             {/* Abstract Map Graphic Representation */}
             <div className="opacity-20 absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596423735880-5f2a689b903e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
             
             <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-6 bg-white/90 backdrop-blur rounded-2xl shadow-sm text-center transform -rotate-2 hover:rotate-0 transition-transform">
                   <p className="text-3xl font-serif font-bold text-terracotta-600 mb-2">12+</p>
                   <p className="text-xs font-bold uppercase tracking-widest text-earth-600">States Covered</p>
                </div>
                <div className="p-6 bg-white/90 backdrop-blur rounded-2xl shadow-sm text-center transform rotate-1 hover:rotate-0 transition-transform">
                   <p className="text-3xl font-serif font-bold text-forest-600 mb-2">50+</p>
                   <p className="text-xs font-bold uppercase tracking-widest text-earth-600">Craft Clusters</p>
                </div>
                <div className="p-6 bg-white/90 backdrop-blur rounded-2xl shadow-sm text-center transform -rotate-1 hover:rotate-0 transition-transform">
                   <p className="text-3xl font-serif font-bold text-earth-900 mb-2">200+</p>
                   <p className="text-xs font-bold uppercase tracking-widest text-earth-600">Master Artisans</p>
                </div>
                <div className="p-6 bg-white/90 backdrop-blur rounded-2xl shadow-sm text-center transform rotate-2 hover:rotate-0 transition-transform">
                   <p className="text-3xl font-serif font-bold text-terracotta-600 mb-2">100%</p>
                   <p className="text-xs font-bold uppercase tracking-widest text-earth-600">Verified Authentic</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-terracotta-50 border-t border-terracotta-100">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-earth-900 mb-6">
            Become a Patron of the Arts
          </h2>
          <p className="text-lg text-earth-700 mb-10 font-light">
            Every piece you buy isn't just a transaction; it's a vote to keep a centuries-old tradition alive. Be part of the change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/discover" className="px-8 py-4 bg-earth-900 text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-terracotta-600 transition-colors shadow-lg">
              Explore Collections
            </Link>
            <Link to="/artisans" className="px-8 py-4 bg-transparent border-2 border-earth-900 text-earth-900 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-earth-100 transition-colors">
              Meet the Masters
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Heritage;
