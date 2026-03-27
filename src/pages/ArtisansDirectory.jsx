import { useState, useEffect, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Award, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products as localProducts } from '../data/products';

// We can leverage the artisans from the fetched products data to build this directory

const ArtisansDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRegion, setActiveRegion] = useState('All India');
  const [products, setProducts] = useState(localProducts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setIsLoading(false);
      });
  }, []);

  // Extract unique artisans from our products data
  const artisans = useMemo(() => {
    const uniqueArtisansMap = new Map();
    products.forEach(p => {
      if (!uniqueArtisansMap.has(p.artisan)) {
        uniqueArtisansMap.set(p.artisan, {
          id: p.artisan.toLowerCase().replace(/\s+/g, '-'),
          name: p.artisan,
          image: p.artisanImage,
          village: p.village,
          state: p.state,
          specialty: p.category,
          productsCount: products.filter(prod => prod.artisan === p.artisan).length,
          bio: `A master of ${p.category.toLowerCase()} from the heritage village of ${p.village}. Preserving ancestral techniques passed down through generations.`,
          featuredProduct: p.id
        });
      }
    });
    return Array.from(uniqueArtisansMap.values());
  }, [products]);

  const regions = ['All India', ...new Set(artisans.map(a => a.state))].sort();

  const filteredArtisans = artisans.filter(artisan => {
    const matchesSearch = artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          artisan.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          artisan.village.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = activeRegion === 'All India' || artisan.state === activeRegion;
    
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="bg-earth-50 min-h-screen py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta-50 border border-terracotta-200 text-terracotta-700 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Award size={14} /> Master Craftspeople
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-earth-900 leading-tight mb-6">
            Meet the <span className="font-light italic text-terracotta-600">Makers</span>
          </h1>
          <p className="text-earth-600 text-lg md:text-xl font-light leading-relaxed">
            The faces behind India's rich cultural heritage. Discover their stories, explore their regional specialties, and support their craft directly.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-earth-200">
           <div className="relative w-full md:w-96">
             <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" />
             <input 
               type="text" 
               placeholder="Search by name, craft, or village..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-earth-50 border-none rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-terracotta-500 transition-shadow text-earth-900"
             />
           </div>

           <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
             {regions.map(region => (
               <button 
                 key={region}
                 onClick={() => setActiveRegion(region)}
                 className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                   activeRegion === region 
                     ? 'bg-earth-900 text-white shadow-md' 
                     : 'bg-earth-50 text-earth-600 hover:bg-earth-100 border border-earth-200'
                 }`}
               >
                 {region}
               </button>
             ))}
           </div>
        </div>

        {/* Directory Grid */}
        {isLoading ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-earth-100 shadow-sm animate-pulse">
             <p className="text-earth-500 font-serif text-xl">Loading Master Craftsmen...</p>
          </div>
        ) : filteredArtisans.length === 0 ? (
           <div className="text-center py-24 bg-white rounded-3xl border border-earth-100 shadow-sm">
             <p className="text-earth-500 font-serif text-xl mb-4">No artisans found matching your criteria.</p>
             <button 
               onClick={() => { setSearchTerm(''); setActiveRegion('All India'); }} 
               className="text-terracotta-600 font-bold uppercase tracking-wider text-sm hover:underline"
             >
               Clear Filters
             </button>
           </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredArtisans.map((artisan, index) => (
                <motion.div
                  layout
                  key={artisan.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-3xl overflow-hidden border border-earth-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                  <div className="h-48 relative overflow-hidden bg-earth-800">
                     <img 
                       src={artisan.image} 
                       alt={artisan.name} 
                       className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-700 opacity-90"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-earth-900 via-earth-900/40 to-transparent"></div>
                     <div className="absolute bottom-4 left-6 text-white">
                        <p className="text-xs font-bold text-terracotta-400 uppercase tracking-widest mb-1">{artisan.specialty}</p>
                        <h3 className="text-2xl font-serif font-bold">{artisan.name}</h3>
                     </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-earth-500 text-sm font-medium mb-4 pb-4 border-b border-earth-100">
                      <MapPin size={16} className="text-terracotta-500" />
                      {artisan.village}, {artisan.state}
                    </div>
                    
                    <p className="text-earth-600 text-sm leading-relaxed mb-6 font-light line-clamp-3">
                      {artisan.bio}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs font-bold text-forest-700 bg-forest-50 px-3 py-1.5 rounded-lg border border-forest-100">
                        {artisan.productsCount} Masterpiece{artisan.productsCount !== 1 ? 's' : ''}
                      </span>
                      
                      <Link 
                        to={`/product/${artisan.featuredProduct}`}
                        className="text-sm font-bold text-terracotta-600 hover:text-earth-900 transition-colors flex items-center gap-1 group/link"
                      >
                        View Craft <ExternalLink size={14} className="group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ArtisansDirectory;
