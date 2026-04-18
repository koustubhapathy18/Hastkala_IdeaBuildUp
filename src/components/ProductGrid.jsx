import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, QrCode, ShieldPlus, ExternalLink, ShoppingBag, Eye, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { products as localProducts } from '../data/products';

const ProductGrid = () => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [products, setProducts] = useState(localProducts);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.data)) setProducts(data.data);
        else if (Array.isArray(data)) setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setIsLoading(false);
      });
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 400);
  };

  const filteredProducts = activeFilter === 'All' 
    ? products 
    : products.filter(p => p.category === activeFilter);

  return (
    <section id="collection" className="py-32 lg:py-40 bg-earth-50 relative">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-terracotta-100 rounded-full mix-blend-multiply filter blur-[150px] opacity-20 -translate-y-1/3 translate-x-1/3 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 border-b border-earth-200/50 pb-12">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-50 border border-forest-100 text-forest-700 text-[9px] font-bold uppercase tracking-[0.3em] mb-6"
            >
              <ShieldPlus size={12} />
              Curated Authentic Collection
            </motion.div>
            <h2 className="text-5xl lg:text-7xl font-serif font-light text-earth-900 leading-tight tracking-tight">
              Honest <span className="italic font-light text-terracotta-700">Masterpieces</span>
            </h2>
          </div>
          
          <div className="mt-12 md:mt-0 flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 md:pb-0 scroll-smooth no-scrollbar">
             {['All', 'Textiles', 'Pottery', 'Decor', 'Paintings'].map(filter => (
               <button 
                key={filter} 
                onClick={() => handleFilterChange(filter)}
                className={`relative pb-2 text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-colors duration-500 ${
                  activeFilter === filter 
                    ? 'text-earth-900' 
                    : 'text-earth-400 hover:text-earth-600'
                }`}
               >
                 {filter}
                 {activeFilter === filter && (
                   <motion.div layoutId="activeFilter" className="absolute bottom-0 left-0 right-0 h-px bg-terracotta-600" />
                 )}
               </button>
             ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          <AnimatePresence>
            {isLoading ? (
              [...Array(6)].map((_, idx) => (
                <motion.div
                  key={`skeleton-${idx}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="group flex flex-col h-full bg-transparent relative"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-6 bg-earth-200/50 animate-pulse" />
                  <div className="flex flex-col flex-1 px-1 gap-4">
                    <div className="h-2 w-20 bg-earth-200/70 rounded animate-pulse" />
                    <div className="h-5 w-full bg-earth-200/70 rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-earth-200/70 rounded animate-pulse" />
                  </div>
                </motion.div>
              ))
            ) : (
              filteredProducts.map((product, index) => (
              <motion.div
                layout
                key={product._id || product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`group flex flex-col h-full bg-transparent relative transition-all duration-300 ${hoveredProduct === (product._id || product.id) ? 'z-50' : 'z-10'}`}
              >
                {/* Image Container - Gallery Style */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-8 bg-earth-100">
                  <Link to={`/product/${product._id || product.id}`} className="absolute inset-0 z-0 block">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-1000 ease-out absolute inset-0 z-[1]"
                    />
                    {product.image2 && (
                      <img 
                        src={product.image2} 
                        alt={product.title + ' alternate'}
                        className="w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-[1500ms] ease-out absolute inset-0 z-[0]"
                      />
                    )}
                  </Link>
                  
                  {/* Overlays */}
                  <div className="absolute inset-x-0 top-0 p-5 flex justify-between items-start z-20">
                    <div className="flex flex-col gap-2">
                      {product.authentic && (
                        <div className="bg-white/40 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                          <QrCode size={10} className="text-forest-800" />
                          <span className="text-[8px] font-bold tracking-[0.2em] text-forest-900 uppercase">
                            TruthMark
                          </span>
                        </div>
                      )}
                      {product.isBestseller && (
                        <div className="bg-terracotta-600/80 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-full w-max shadow-sm">
                          <span className="text-[8px] font-bold tracking-[0.2em] uppercase">Bestseller</span>
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                      }}
                      className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-earth-800 hover:bg-white hover:text-terracotta-600 hover:scale-105 transition-all duration-300"
                    >
                      <Heart size={16} className={isWishlisted(product._id || product.id) ? "fill-terracotta-600 text-terracotta-600" : ""} />
                    </button>
                  </div>

                  {/* Hover Quick Actions */}
                  <div className="absolute inset-x-6 bottom-6 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out flex gap-3 z-20">
                    <button 
                      onClick={() => addToCart(product)}
                      className="flex-1 py-3.5 bg-earth-900/90 backdrop-blur-md border border-white/10 text-white font-bold uppercase tracking-[0.2em] text-[9px] hover:bg-terracotta-600 transition-colors shadow-2xl flex items-center justify-center gap-2"
                    >
                       <ShoppingBag size={14} /> Add to Bag
                    </button>

                    <Link to={`/product/${product._id || product.id}`} className="w-[46px] h-[46px] bg-white/90 backdrop-blur-md border border-white/50 text-earth-900 shadow-2xl flex items-center justify-center hover:bg-white hover:scale-105 transition-all">
                      <Eye size={18} />
                    </Link>
                  </div>
                  
                  {/* Subtle gradient overlay for better text readability if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"></div>
                </div>
                
                {/* Product Info — Minimalist, editorial typography */}
                <div className="flex flex-col flex-1 relative px-1">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-[9px] font-bold text-earth-400 uppercase tracking-[0.3em]">{product.category}</p>
                  </div>
                  
                  <Link to={`/product/${product._id || product.id}`} className="block mb-4">
                    <h3 className="text-2xl font-serif font-light text-earth-900 leading-[1.2] group-hover:text-terracotta-700 transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center text-xs font-medium text-earth-500 mb-6 pb-6 border-b border-earth-200/60">
                    <span className="text-forest-700/80 font-bold uppercase tracking-wider">{product.artisan}</span>
                    <span className="mx-2 text-earth-300">•</span>
                    <span className="font-serif italic text-sm">{product.village}</span>
                  </div>
                  
                  {/* PriceMirror Engine Interface */}
                  <div className="mt-auto relative">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center text-2xl font-light text-earth-900">
                         <IndianRupee size={18} strokeWidth={1.5} className="mr-0.5 text-earth-600" />
                         {product.price.toLocaleString('en-IN')}
                       </div>
                       
                       <div 
                         className="relative z-30 flex items-center justify-end"
                         onMouseEnter={() => setHoveredProduct(product._id || product.id)}
                         onMouseLeave={() => setHoveredProduct(null)}
                       >
                         <button className="text-[9px] border border-terracotta-200/60 text-terracotta-700 px-4 py-2 font-bold uppercase tracking-[0.2em] flex items-center gap-1.5 hover:bg-terracotta-50 transition-colors">
                           <ExternalLink size={10} />
                           Price Mirror
                         </button>

                         {/* PriceMirror Tooltip - Redesigned Frost Effect */}
                         <AnimatePresence>
                           {hoveredProduct === (product._id || product.id) && (
                             <motion.div
                               initial={{ opacity: 0, y: 15, scale: 0.95 }}
                               animate={{ opacity: 1, y: 0, scale: 1 }}
                               exit={{ opacity: 0, y: 10, scale: 0.95 }}
                               transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                               className="absolute bottom-full right-0 pb-4 z-40"
                             >
                               <div className="p-6 bg-earth-900/95 backdrop-blur-3xl w-80 rounded-sm text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border border-white/20 origin-bottom-right cursor-default select-none pointer-events-none">
                                 <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-earth-300 mb-5 border-b border-white/10 pb-4 flex justify-between items-center">
                                    Price Transparency <span className="bg-terracotta-500/20 border border-terracotta-500/30 text-terracotta-300 px-2 py-1 rounded-none tracking-widest">0% Markup</span>
                                 </h4>
                                 
                                 <div className="flex items-center gap-4 mb-5 bg-white/5 border border-white/10 p-4">
                                   <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 shrink-0">
                                      <img src={product.artisanImage} alt={product.artisan} className="w-full h-full object-cover" />
                                   </div>
                                   <div>
                                     <p className="text-[10px] text-earth-400 font-bold uppercase tracking-widest mb-1">Earning Artisan</p>
                                     <p className="text-base text-white font-serif tracking-wide">{product.artisan}</p>
                                   </div>
                                 </div>

                                  <div className="space-y-4 text-[13px] font-light">
                                    <div className="flex justify-between items-center text-forest-300 border-b border-white/5 pb-2">
                                      <span>Direct Earnings</span>
                                      <span className="flex items-center font-bold text-base"><IndianRupee size={14}/>{(product.price - Math.round(product.price * 0.075)).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-earth-300 border-b border-white/5 pb-2">
                                      <span>Platform Fee (7.5%)</span>
                                      <span className="flex items-center"><IndianRupee size={12}/>{Math.round(product.price * 0.075).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-white/80">
                                      <span>Total You Pay</span>
                                      <span className="flex items-center font-bold"><IndianRupee size={12}/>{product.price.toLocaleString('en-IN')}</span>
                                    </div>
                                  </div>
                                  <div className="mt-4 bg-white/5 rounded px-3 py-2">
                                    <p className="text-[10px] text-earth-400 leading-relaxed">
                                      <span className="text-terracotta-300 font-bold">{Math.round(((product.price - Math.round(product.price * 0.075)) / product.price) * 100)}%</span> of every rupee goes directly to the artisan.
                                    </p>
                                  </div>
                                 <div className="mt-6 pt-4 border-t border-white/10 text-center">
                                    <p className="text-[9px] text-earth-400/80 uppercase tracking-[0.2em] font-bold">Verified by TruthMark Blockchain</p>
                                 </div>
                               </div>
                             </motion.div>
                           )}
                         </AnimatePresence>
                       </div>
                     </div>
                  </div>
                </div>
              </motion.div>
            )))}
          </AnimatePresence>
        </motion.div>
        
        <div className="mt-28 text-center pt-16 border-t border-earth-200/50">
          <Link to="/discover" className="inline-flex items-center gap-3 px-12 py-5 border border-earth-900 text-earth-900 font-bold tracking-[0.2em] uppercase text-[11px] hover:bg-earth-900 hover:text-white transition-all duration-500 group">
             Explore Full Catalog 
             <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
