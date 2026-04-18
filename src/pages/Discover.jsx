import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { IndianRupee, ShieldPlus, Filter, X, QrCode, ShoppingBag, ExternalLink, Heart } from 'lucide-react';
import { products as localProducts } from '../data/products';


const FilterSidebar = ({ categories, activeCategory, setActiveCategory, priceRange, setPriceRange }) => (
  <div className="space-y-8">
    <div>
      <h3 className="text-lg font-serif font-bold text-earth-900 mb-4 border-b border-earth-200 pb-2">Category</h3>
      <div className="space-y-2">
        {categories.map(cat => (
          <label key={cat} className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              name="category"
              checked={activeCategory === cat}
              onChange={() => setActiveCategory(cat)}
              className="w-4 h-4 text-terracotta-600 border-earth-300 focus:ring-terracotta-500"
            />
            <span className={`text-sm transition-colors ${activeCategory === cat ? 'text-terracotta-700 font-bold' : 'text-earth-600 group-hover:text-earth-900'}`}>{cat}</span>
          </label>
        ))}
      </div>
    </div>

    <div>
      <h3 className="text-lg font-serif font-bold text-earth-900 mb-4 border-b border-earth-200 pb-2">Price Range</h3>
      <div className="space-y-4">
        <input 
          type="range" 
          min="500" 
          max="15000" 
          step="500"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full h-1 bg-earth-200 rounded-lg appearance-none cursor-pointer accent-terracotta-600"
        />
        <div className="flex justify-between text-sm text-earth-600 font-medium">
          <span className="flex items-center"><IndianRupee size={12}/> 0</span>
          <span className="flex items-center"><IndianRupee size={12}/> {priceRange.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
    
    <div className="bg-forest-50 p-4 rounded-xl border border-forest-100">
      <div className="flex items-center gap-2 text-forest-700 font-bold text-xs uppercase tracking-widest mb-2">
        <ShieldPlus size={14} /> TruthMark Verified
      </div>
      <p className="text-xs text-forest-800/80 leading-relaxed">
        All products in this collection are 100% authenticated directly from the artisan, with zero middleman markup.
      </p>
    </div>
  </div>
);

const Discover = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [products, setProducts] = useState(localProducts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(15000);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let url = '/api/products';
    if (searchQuery) {
       url += `?search=${encodeURIComponent(searchQuery)}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.data)) {
          setProducts(data.data);
        } else if (Array.isArray(data)) {
          setProducts(data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setIsLoading(false);
      });
  }, [searchQuery]);

  const categories = ['All', 'Textiles', 'Pottery', 'Decor', 'Metalwork', 'Paintings'];
  
  const filteredProducts = products.filter(p => {
    const categoryMatch = activeCategory === 'All' || p.category === activeCategory;
    const priceMatch = p.price <= priceRange;
    return categoryMatch && priceMatch;
  });

  return (
    <div className="py-24 bg-earth-50 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-earth-900 mb-4">
            {searchQuery ? (
               <>Search Results for <span className="font-light italic text-terracotta-600">"{searchQuery}"</span></>
            ) : (
               <>Discover <span className="font-light italic text-terracotta-600">Collections</span></>
            )}
          </h1>
          <p className="text-earth-600 max-w-2xl text-lg font-light">
            {searchQuery 
              ? `Showing results matching your query across all our authentic, TruthMark verified artisans.` 
              : `Explore handcrafted masterpieces verified by TruthMark. Shop directly from rural artisans across India.`}
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex justify-between items-center mb-6">
           <span className="text-earth-600 font-medium text-sm">{filteredProducts.length} Products</span>
           <button 
             onClick={() => setIsMobileFiltersOpen(true)}
             className="flex items-center gap-2 px-4 py-2 bg-white border border-earth-200 rounded-lg text-earth-800 text-sm font-bold shadow-sm"
           >
             <Filter size={16} /> Filters
           </button>
        </div>

        <div className="flex flex-col md:flex-row gap-12 relative">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 shrink-0 sticky top-28 h-fit">
             <FilterSidebar 
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
             />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-2xl border border-earth-100 shadow-sm">
                 <p className="text-earth-500 font-serif text-xl mb-4">No products found for this criteria.</p>
                 <button 
                   onClick={() => { setActiveCategory('All'); setPriceRange(15000); }} 
                   className="text-terracotta-600 font-bold uppercase tracking-wider text-sm hover:underline"
                 >
                   Clear Filters
                 </button>
               </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {isLoading ? (
                    <div className="col-span-full text-center py-20 bg-earth-100 rounded-2xl animate-pulse">
                      <p className="text-earth-500 font-serif text-xl">Loading Masterpieces...</p>
                    </div>
                  ) : filteredProducts.map((product, index) => (
                    <motion.div
                      layout
                      key={product._id || product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className={`group flex flex-col h-full bg-white rounded-2xl border border-earth-100 shadow-sm hover:shadow-xl hover:border-earth-200 transition-all duration-300 relative ${hoveredProduct === (product._id || product.id) ? 'z-50' : 'z-10'}`}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-earth-100">
                        <Link to={`/product/${product._id || product.id}`} className="absolute inset-0 z-0 block">
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                        </Link>
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
                          <div className="flex flex-col gap-2">
                            {product.authentic && (
                              <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                <QrCode size={10} className="text-forest-700" />
                                <span className="text-[8px] font-bold tracking-wider text-forest-900 uppercase">TruthMark</span>
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(product);
                            }}
                            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-earth-800 hover:bg-white hover:text-terracotta-600 transition-colors pointer-events-auto"
                          >
                            <Heart size={14} className={isWishlisted(product._id || product.id) ? "fill-terracotta-600 text-terracotta-600" : ""} />
                          </button>
                        </div>
                        
                        <div className="absolute inset-x-3 bottom-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                          <button 
                            onClick={(e) => { e.preventDefault(); addToCart(product); }}
                            className="flex-1 py-2.5 bg-earth-900/90 backdrop-blur-sm text-white font-bold uppercase tracking-wider text-[10px] rounded hover:bg-terracotta-600 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <ShoppingBag size={12} /> Add to Bag
                          </button>
                        </div>
                      </div>
                      
                      <Link to={`/product/${product._id || product.id}`} className="p-5 flex flex-col flex-1">
                        <p className="text-[9px] font-bold text-earth-400 uppercase tracking-widest mb-1">{product.category}</p>
                        <h3 className="text-base font-serif font-bold text-earth-900 leading-snug group-hover:text-terracotta-600 transition-colors line-clamp-2 mb-2">
                          {product.title}
                        </h3>
                        <p className="text-xs text-earth-500 mb-4">{product.artisan} • {product.state}</p>
                        
                        <div className="mt-auto relative">
                          <div className="flex items-center justify-between pt-4 border-t border-earth-100">
                            <div className="flex items-center text-lg font-bold text-earth-900">
                              <IndianRupee size={16} className="text-earth-600 mr-0.5" />
                              {product.price.toLocaleString('en-IN')}
                            </div>
                            
                            <div 
                              className="relative z-30 flex items-center justify-end"
                              onMouseEnter={(e) => { e.preventDefault(); e.stopPropagation(); setHoveredProduct(product._id || product.id); }}
                              onMouseLeave={(e) => { e.preventDefault(); e.stopPropagation(); setHoveredProduct(null); }}
                            >
                              <button onClick={e => e.preventDefault()} className="text-[9px] border border-terracotta-200/60 text-terracotta-700 px-4 py-2 font-bold uppercase tracking-[0.2em] flex items-center gap-1.5 hover:bg-terracotta-50 transition-colors rounded">
                                <ExternalLink size={10} />
                                Price Mirror
                              </button>

                              <AnimatePresence>
                                {hoveredProduct === (product._id || product.id) && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute bottom-full right-0 pb-4 z-40"
                                    onClick={e => e.preventDefault()}
                                  >
                                    <div className="p-6 bg-earth-900/95 backdrop-blur-3xl w-80 rounded-sm text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border border-white/20 origin-bottom-right cursor-default select-none pointer-events-none text-left">
                                      <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-earth-300 mb-5 border-b border-white/10 pb-4 flex justify-between items-center">
                                         Transparency <span className="bg-terracotta-500/20 border border-terracotta-500/30 text-terracotta-300 px-2 py-1 rounded-none tracking-widest">0% Markup</span>
                                      </h4>
                                      
                                      <div className="flex items-center gap-4 mb-5 bg-white/5 border border-white/10 p-4 rounded text-left">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 shrink-0">
                                           <img src={product.artisanImage} alt={product.artisan} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                          <p className="text-[10px] text-earth-400 font-bold uppercase tracking-widest mb-1">Earning Artisan</p>
                                          <p className="text-base text-white font-serif tracking-wide">{product.artisan}</p>
                                        </div>
                                      </div>

                                      <div className="space-y-4 text-[13px] font-light text-left">
                                        <div className="flex justify-between items-center text-forest-300 pb-2 border-b border-white/5">
                                          <span>Direct Earnings</span>
                                          <span className="flex items-center font-bold text-base"><IndianRupee size={14}/>{(product.price - Math.round(product.price * 0.075)).toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-earth-300">
                                          <span>Platform Fee (7.5%)</span>
                                          <span className="flex items-center"><IndianRupee size={12}/>{Math.round(product.price * 0.075).toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-white/80 border-t border-white/10 pt-2">
                                          <span>Total You Pay</span>
                                          <span className="flex items-center font-bold"><IndianRupee size={12}/>{product.price.toLocaleString('en-IN')}</span>
                                        </div>
                                      </div>
                                      <div className="mt-4 bg-white/5 rounded px-3 py-2">
                                        <p className="text-[10px] text-earth-400 leading-relaxed">
                                          <span className="text-terracotta-300 font-bold">{Math.round(((product.price - Math.round(product.price * 0.075)) / product.price) * 100)}%</span> of every rupee goes directly to the artisan.
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
           <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-earth-900/40 backdrop-blur-sm z-50 md:hidden"
               onClick={() => setIsMobileFiltersOpen(false)}
             />
             <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 h-[80vh] bg-white rounded-t-3xl z-50 p-6 flex flex-col md:hidden"
             >
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-serif font-bold text-earth-900">Filters</h2>
                   <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-earth-100 rounded-full text-earth-600 hover:text-terracotta-600">
                      <X size={20} />
                   </button>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar">
                   <FilterSidebar 
                     categories={categories}
                     activeCategory={activeCategory}
                     setActiveCategory={setActiveCategory}
                     priceRange={priceRange}
                     setPriceRange={setPriceRange}
                   />
                </div>
                
                <div className="pt-6 border-t border-earth-100 mt-auto">
                   <button 
                     onClick={() => setIsMobileFiltersOpen(false)}
                     className="w-full py-4 bg-earth-900 text-white rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl"
                   >
                     Show {filteredProducts.length} Results
                   </button>
                </div>
             </motion.div>
           </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Discover;
