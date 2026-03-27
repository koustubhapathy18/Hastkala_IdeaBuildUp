import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ShieldCheck, Search, QrCode, ArrowRight, Fingerprint, History, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const TruthMark = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResult(null);
    
    // Simulate API lookup
    setTimeout(() => {
      setIsSearching(false);
      // Mock result
      setSearchResult({
        id: searchQuery,
        status: 'verified',
        product: 'Kanchipuram Silk Saree',
        artisan: 'V. Ranganathan',
        village: 'Kanchipuram, Tamil Nadu',
        dateCreated: '12 Oct 2023',
        material: 'Pure Mulberry Silk & Zari',
        timestamp: new Date().toISOString()
      });
    }, 1500);
  };

  return (
    <div className="bg-earth-50 min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-earth-900 text-white py-24 lg:py-32 relative overflow-hidden">
        {/* Abstract Background Ring */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-forest-900/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-terracotta-900/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-900/50 border border-forest-500/30 text-forest-300 text-xs font-bold uppercase tracking-widest mb-8"
              >
                <ShieldCheck size={16} /> Blockchain Authenticated
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-[1.1]"
              >
                Introducing <br/>
                <span className="text-forest-400">TruthMark</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-earth-300 font-light leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0"
              >
                The world's first decentralized verification system for Indian handicrafts. Combating fakes, protecting heritage, and ensuring 100% transparency.
              </motion.p>
            </div>

            {/* Verification Search Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex-1 w-full max-w-md mx-auto relative"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-forest-400 via-terracotta-400 to-earth-400"></div>
                
                <h3 className="text-2xl font-serif font-bold text-white mb-2">Verify a Product</h3>
                <p className="text-earth-300 text-sm mb-6">Enter the 12-digit code from your TruthMark tag.</p>
                
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <QrCode size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" />
                    <input 
                      type="text" 
                      placeholder="e.g. IN-8A4F-992B" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                      className="w-full bg-earth-900/50 border border-earth-600 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-earth-500 focus:outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500 uppercase tracking-widest font-mono"
                      maxLength={14}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSearching || !searchQuery}
                    className="w-full py-4 bg-forest-600 text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-forest-500 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSearching ? 'Verifying on Ledger...' : 'Authenticate'}
                    {!isSearching && <ArrowRight size={18} />}
                  </button>
                </form>

                {/* Mock Result Output */}
                {searchResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 pt-6 border-t border-earth-700/50"
                  >
                    <div className="bg-forest-900/40 border border-forest-500/30 rounded-xl p-5 relative overflow-hidden">
                       <CheckCircle2 size={100} className="absolute -right-4 -bottom-4 text-forest-500/10" />
                       <div className="flex items-center gap-2 text-forest-300 font-bold uppercase tracking-widest text-xs mb-4">
                         <ShieldCheck size={16} /> Verified Authentic
                       </div>
                       <div className="space-y-3 relative z-10 text-sm">
                         <div className="grid grid-cols-3 gap-2">
                           <span className="text-earth-400">Product</span>
                           <span className="col-span-2 text-white font-medium">{searchResult.product}</span>
                         </div>
                         <div className="grid grid-cols-3 gap-2">
                           <span className="text-earth-400">Master Artisan</span>
                           <span className="col-span-2 text-white font-medium">{searchResult.artisan}</span>
                         </div>
                         <div className="grid grid-cols-3 gap-2">
                           <span className="text-earth-400">Origin</span>
                           <span className="col-span-2 text-white">{searchResult.village}</span>
                         </div>
                       </div>
                    </div>
                  </motion.div>
                )}

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-terracotta-600 font-bold uppercase tracking-widest text-sm mb-4 block">The Process</span>
            <h2 className="text-4xl font-serif font-bold text-earth-900 mb-6">
              How TruthMark Works
            </h2>
            <p className="text-lg text-earth-600 font-light leading-relaxed">
              Every authentic piece created by our master artisans is cataloged on an immutable ledger from the moment of creation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             {/* Connection Line (Desktop only) */}
             <div className="hidden md:block absolute top-[60px] left-1/6 right-1/6 h-0.5 bg-earth-100 z-0 border-t border-dashed border-earth-300"></div>

             {[
               {
                 icon: <Fingerprint size={32} />,
                 title: "1. The Artisan Registry",
                 desc: "The artisan completes the piece and logs its unique material composition, techniques used, and timestamp into the Hastkala node."
               },
               {
                 icon: <QrCode size={32} />,
                 title: "2. The Physical Tag",
                 desc: "A tamper-proof NFC/QR TruthMark tag is permanently attached to the product before it leaves the village cluster."
               },
               {
                 icon: <History size={32} />,
                 title: "3. Buyer Verification",
                 desc: "Upon receiving the item, you scan the tag to verify its provenance and release funds from the escrow directly to the artisan."
               }
             ].map((step, idx) => (
               <div key={idx} className="relative z-10 text-center">
                 <div className="w-24 h-24 mx-auto bg-earth-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl mb-6 text-terracotta-600">
                   {step.icon}
                 </div>
                 <h3 className="text-xl font-bold text-earth-900 mb-4">{step.title}</h3>
                 <p className="text-earth-600 leading-relaxed font-light">{step.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Why it Matters */}
      <section className="py-24 bg-terracotta-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1605335198031-6eacefba50a8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-4xl text-center">
          <ShieldCheck size={48} className="mx-auto text-terracotta-300 mb-8" />
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight">
            Protecting the Legacy,<br /><span className="italic font-light text-terracotta-200">Defeating the Counterfeits</span>
          </h2>
          <p className="text-lg md:text-xl text-terracotta-100 font-light leading-relaxed mb-10">
            Machine-made replicas flooded the market pretending to be handmade. TruthMark ensures that when you pay for a handcrafted heritage piece, the soul of the craft and the livelihood of the artisan are protected.
          </p>
          <Link to="/discover" className="px-8 py-4 bg-white text-terracotta-900 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-earth-100 transition-colors inline-block shadow-2xl">
            Shop Verified Collections
          </Link>
        </div>
      </section>

    </div>
  );
};

export default TruthMark;
