import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Package, QrCode, TrendingUp, AlertCircle, Plus, User, X, ImageIcon, CheckCircle2, Sparkles, ChevronRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import IPShieldScanner from '../components/IPShieldScanner';

const CATEGORIES = ['Textiles', 'Pottery', 'Decor', 'Paintings', 'Metalwork', 'Jewellery', 'Wood Carving'];

const ArtisanDashboard = () => {
  const [artisan, setArtisan] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '', price: '', category: CATEGORIES[0],
    material: '', stock: '10', image: '', image2: '',
    workHours: '', complexity: 'medium'
  });
  const [priceAdvice, setPriceAdvice] = useState(null);
  const [isFetchingAdvice, setIsFetchingAdvice] = useState(false);
  const [priceAdviceError, setPriceAdviceError] = useState(null);
  const [showIPShield, setShowIPShield] = useState(false);

  const fetchPriceAdvice = async () => {
    if (!newProduct.category) return;
    setIsFetchingAdvice(true);
    setPriceAdvice(null);
    setPriceAdviceError(null);
    try {
      const params = new URLSearchParams({
        category:   newProduct.category,
        material:   newProduct.material   || '',
        workHours:  newProduct.workHours  || 0,
        complexity: newProduct.complexity || 'medium',
      });
      console.log('[AI Price] fetching:', `/api/products/price-advice?${params}`);
      const res  = await fetch(`/api/products/price-advice?${params}`);
      const data = await res.json();
      console.log('[AI Price] response:', res.status, data);
      if (res.ok) {
        setPriceAdvice(data);
      } else {
        setPriceAdviceError(data.message || 'Server error — is the backend running?');
      }
    } catch (err) {
      console.error('[AI Price] fetch failed:', err);
      setPriceAdviceError('Could not reach server. Make sure the backend is running on port 5001.');
    } finally {
      setIsFetchingAdvice(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      try {
        const artisanRes = await fetch('/api/artisans/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const artisanData = await artisanRes.json();
        if (artisanRes.status === 401) { navigate('/login'); return; }
        setArtisan(artisanData);

        const productsRes = await fetch('/api/products/me', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token 
          }
        });
        const productsData = await productsRes.json();
        setProducts(productsData);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const method = isEditing ? 'PUT' : 'POST';
      const endpoint = isEditing ? `/api/products/${editProductId}` : '/api/products';

      const res = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        },
        body: JSON.stringify(newProduct)
      });
      const saved = await res.json();
      if (res.ok) {
        if (isEditing) {
          setProducts(prev => prev.map(p => p._id === editProductId ? saved : p));
        } else {
          setProducts(prev => [...prev, saved]);
        }
        setSubmitSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setSubmitSuccess(false);
          setIsEditing(false);
          setEditProductId(null);
          setPriceAdvice(null);
          setNewProduct({
            title: '', price: '', category: CATEGORIES[0],
            material: '', stock: '10', image: '', image2: '',
            workHours: '', complexity: 'medium'
          });
        }, 1500);
      }
    } catch (err) {
      console.error('Product operation failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center py-32">
        <p className="text-earth-600 animate-pulse text-xl font-serif">Loading your Dashboard...</p>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center py-32">
        <p className="text-earth-600">Could not load dashboard. <a href="/login" className="text-terracotta-600 font-bold">Please log in again.</a></p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-50 pb-20">
       <header className="bg-earth-900 border-b-4 border-terracotta-500 pt-28 pb-12">
         <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between">
           <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full border-4 border-earth-700 overflow-hidden relative bg-earth-700 flex items-center justify-center">
                {artisan.image ? (
                  <img src={artisan.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-earth-400" />
                )}
                <div className="absolute bottom-0 inset-x-0 bg-forest-600 flex justify-center py-1">
                   <QrCode size={12} className="text-white" />
                </div>
              </div>
              <div className="text-center md:text-left text-white mt-4 md:mt-0">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                   <h1 className="text-3xl font-serif font-bold">{artisan.name || 'My Artisan Profile'}</h1>
                   <span className="bg-forest-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                     <QrCode size={10} /> {artisan.isVerified ? 'Verified' : 'Pending'}
                   </span>
                </div>
                <p className="text-earth-400">
                  {artisan.location || 'Location not set'}&nbsp;•&nbsp;{artisan.specialty || 'Craft not set'}
                </p>
                {artisan.upi && (
                  <p className="text-terracotta-400 text-sm mt-2 font-medium tracking-wide">UPI: {artisan.upi}</p>
                )}
              </div>
           </div>

           <div className="flex items-center gap-3 mt-8 md:mt-0">
              <button
                onClick={() => {
                   setIsEditing(false);
                   setEditProductId(null);
                   setPriceAdvice(null);
                   setNewProduct({
                     title: '', price: '', category: CATEGORIES[0],
                     material: '', stock: '10', image: '', image2: '',
                     workHours: '', complexity: 'medium'
                   });
                   setShowModal(true);
                }}
                className="bg-terracotta-600 hover:bg-terracotta-500 text-white font-bold uppercase tracking-wider px-6 py-3 rounded shadow-lg flex items-center gap-2 transition-colors"
              >
                 <Plus size={18} /> List New Product
              </button>
              <button
                onClick={() => setShowIPShield(true)}
                className="bg-earth-800 hover:bg-earth-700 text-terracotta-400 font-bold uppercase tracking-wider px-4 py-3 rounded shadow-lg flex items-center gap-2 transition-colors border border-terracotta-900/50"
              >
                <ShieldAlert size={18} /> IP Shield
              </button>
              <Link
                to="/truthmark/register"
                className="bg-forest-600 hover:bg-forest-500 text-white font-bold uppercase tracking-wider px-4 py-3 rounded shadow-lg flex items-center gap-2 transition-colors"
              >
                <ShieldCheck size={18} /> TruthMark
              </Link>
            </div>
         </div>
       </header>

       <div className="container mx-auto px-6 lg:px-12 mt-[-30px] relative z-10">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-xl p-6 border border-earth-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-earth-500">100% Direct Earnings</h3>
                <div className="w-10 h-10 rounded bg-green-50 flex items-center justify-center">
                   <IndianRupee size={20} className="text-green-600" />
                </div>
              </div>
              <div>
                 <h2 className="text-4xl font-serif font-bold text-earth-900 mb-1 flex items-center">
                    <IndianRupee size={28} strokeWidth={2.5} className="mr-0.5 text-earth-700" />
                    {(artisan.metrics?.totalEarnings || 0).toLocaleString('en-IN')}
                 </h2>
                 <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                   <TrendingUp size={14} /> Direct to your account
                 </p>
              </div>
           </motion.div>

           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-earth-900 rounded-xl shadow-xl p-6 border border-earth-800 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta-500/10 rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-earth-400">PriceMirror Engine</h3>
              </div>
              <div className="relative z-10">
                 <p className="text-xs text-earth-400 mb-1">Money saved from middlemen</p>
                 <h2 className="text-4xl font-serif font-bold text-terracotta-400 mb-1 flex items-center">
                    <IndianRupee size={28} strokeWidth={2.5} className="mr-0.5" />
                    {(artisan.metrics?.priceMirrorSavings || 0).toLocaleString('en-IN')}
                 </h2>
              </div>
           </motion.div>

           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-xl p-6 border border-earth-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-earth-500">Pending Orders</h3>
                <div className="w-10 h-10 rounded bg-earth-50 flex items-center justify-center">
                   <Package size={20} className="text-earth-700" />
                </div>
              </div>
              <div>
                 <h2 className="text-4xl font-serif font-bold text-earth-900 mb-1">
                    {artisan.metrics?.pendingOrders || 0}
                 </h2>
                 <p className="text-sm text-terracotta-600 font-medium flex items-center gap-1">
                   <AlertCircle size={14} /> {artisan.metrics?.shippingToday || 0} require shipping today
                 </p>
              </div>
           </motion.div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-serif font-bold text-earth-900 mb-6">Your Live Products</h2>

              {products && products.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-earth-200 overflow-hidden">
                  {products.map((product, i) => (
                    <div key={i} className="p-6 border-b border-earth-100 last:border-0 hover:bg-earth-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                       <div className="flex items-center gap-4">
                         <div className="w-16 h-16 bg-earth-200 rounded object-cover overflow-hidden shrink-0">
                            {product.image && <img src={product.image} alt={product.title} className="w-full h-full object-cover" />}
                         </div>
                         <div>
                           <h4 className="font-bold text-earth-900">{product.title}</h4>
                           <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 inline-flex items-center mt-1 mb-1">
                             <IndianRupee size={10} className="mr-0.5"/> {product.price} (You receive 100%)
                           </span>
                           {product.truthMarkCode ? (
                             <div className="flex items-center gap-1 text-[10px] font-bold text-forest-700 uppercase tracking-widest mt-1">
                               <ShieldCheck size={12} /> TruthMark Verified
                             </div>
                           ) : (
                             <div className="mt-1">
                               <Link
                                 to="/truthmark/register"
                                 state={{ product }}
                                 className="text-[10px] bg-earth-900 text-white px-2 py-1 rounded font-bold uppercase tracking-widest flex items-center w-fit gap-1 hover:bg-earth-800 transition-colors"
                               >
                                 <ShieldCheck size={12} /> TruthMark It
                               </Link>
                             </div>
                           )}
                         </div>
                       </div>
                       <div className="flex flex-row md:flex-col gap-6 md:gap-1 text-sm text-earth-600">
                         <p><span className="font-bold text-earth-900">{product.stock}</span> in stock</p>
                         <p><span className="font-bold text-earth-900">{product.orders || 0}</span> total sales</p>
                       </div>
                       <button 
                         onClick={() => {
                           setIsEditing(true);
                           setEditProductId(product._id);
                           setNewProduct({
                             title: product.title || '',
                             price: (product.price || 0).toString(),
                             category: product.category || CATEGORIES[0],
                             material: product.material || '',
                             stock: (product.stock || 10).toString(),
                             image: product.image || '',
                             image2: product.image2 || ''
                           });
                           setShowModal(true);
                         }}

                         className="text-terracotta-600 font-bold uppercase tracking-wider text-sm hover:underline text-left md:text-right"
                       >
                         Edit Listing
                       </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-earth-200 p-12 text-center shadow-sm">
                  <p className="text-earth-400 font-serif text-lg mb-4">No products listed yet.</p>
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setEditProductId(null);
                      setNewProduct({
                        title: '', price: '', category: CATEGORIES[0],
                        material: '', stock: '10', image: '', image2: '',
                        workHours: '', complexity: 'medium'
                      });
                      setShowModal(true);
                    }}
                    className="bg-terracotta-600 text-white font-bold px-6 py-3 rounded uppercase tracking-wider text-sm hover:bg-terracotta-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} /> Add Your First Product
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
               <div className="bg-forest-50 border border-forest-200 rounded-xl p-8 sticky top-28">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <span className="text-xl">🎙️</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-forest-900 mb-3">SchemeGPT Alert</h3>
                  <p className="text-forest-800 text-sm leading-relaxed mb-6">
                    You may be eligible for the <strong className="text-forest-900">PM Vishwakarma Toolkit Fund</strong> (Rs.15,000 allowance).
                  </p>
                  <button 
                    onClick={() => setShowSchemeModal(true)}
                    className="w-full bg-forest-600 hover:bg-forest-700 text-white font-bold uppercase tracking-wider py-3 rounded transition-colors text-sm"
                  >
                    Apply Now
                  </button>
                  <p className="text-xs text-forest-600/80 mt-4 text-center">AI assistance available in your native language</p>
               </div>
            </div>
         </div>
       </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-earth-900/70 backdrop-blur-sm px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-earth-200">
                <h2 className="text-2xl font-serif font-bold text-earth-900">
                  {isEditing ? 'Edit Product Listing' : 'List a New Product'}
                </h2>
                <button onClick={() => setShowModal(false)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-earth-100 text-earth-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <CheckCircle2 size={56} className="text-green-500 mb-4" />
                  <h3 className="text-2xl font-serif font-bold text-earth-900">
                    {isEditing ? 'Product Updated!' : 'Product Listed!'}
                  </h3>
                  <p className="text-earth-500 mt-2">
                    {isEditing ? 'Your changes have been saved.' : 'Your product is now live on the marketplace.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAddProduct} className="p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-earth-700 uppercase tracking-wider mb-2">Product Title *</label>
                    <input
                      required
                      type="text"
                      value={newProduct.title}
                      onChange={e => setNewProduct(p => ({ ...p, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded-lg focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500"
                      placeholder="e.g., Hand-Painted Madhubani Wall Art"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-earth-700 uppercase tracking-wider">Price (₹) *</label>
                        <button
                          type="button"
                          onClick={fetchPriceAdvice}
                          disabled={isFetchingAdvice}
                          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-terracotta-600 hover:text-terracotta-700 transition-colors disabled:opacity-50"
                        >
                          <Sparkles size={11} />
                          {isFetchingAdvice ? 'Analysing...' : 'AI Price'}
                        </button>
                      </div>
                      <input
                        required
                        type="number"
                        min="1"
                        value={newProduct.price}
                        onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                        className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded-lg focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500"
                        placeholder="e.g., 4500"
                      />
                      {priceAdviceError && (
                        <p className="text-[10px] text-red-500 mt-1">⚠ {priceAdviceError}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-earth-700 uppercase tracking-wider mb-2">Category *</label>
                      <select
                        value={newProduct.category}
                        onChange={e => {
                          setNewProduct(p => ({ ...p, category: e.target.value }));
                          setPriceAdvice(null);
                        }}
                        className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded-lg focus:outline-none focus:border-terracotta-500"
                      >
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* AI Price Advice Card */}
                  <AnimatePresence>
                    {priceAdvice && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="bg-earth-900 rounded-xl p-5 text-white relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta-500/10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Sparkles size={15} className="text-terracotta-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-earth-300">AI Price Advisor</span>
                          </div>
                          <span className="text-[9px] bg-terracotta-500/20 border border-terracotta-500/30 text-terracotta-300 px-2 py-1 rounded font-bold uppercase tracking-widest">
                            {priceAdvice.sampleSize} products analysed
                          </span>
                        </div>

                        {/* Recommended price */}
                        <div className="mb-4">
                          <p className="text-[10px] text-earth-400 uppercase tracking-wider mb-1">Recommended Price</p>
                          <div className="flex items-end gap-3">
                            <span className="text-3xl font-serif font-bold text-white flex items-center">
                              <IndianRupee size={22} strokeWidth={2} className="mr-0.5" />
                              {priceAdvice.recommended.toLocaleString('en-IN')}
                            </span>
                            <span className="text-earth-400 text-xs mb-1">based on your inputs</span>
                          </div>
                          {/* Breakdown pills */}
                          {priceAdvice.breakdown && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="text-[9px] bg-earth-800 border border-earth-700 text-earth-300 px-2 py-1 rounded-full">
                                🧵 Material ₹{priceAdvice.breakdown.materialCost.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[9px] bg-earth-800 border border-earth-700 text-earth-300 px-2 py-1 rounded-full">
                                ⏱ Labour ₹{priceAdvice.breakdown.laborCost.toLocaleString('en-IN')} ({priceAdvice.breakdown.hoursUsed}h)
                              </span>
                              <span className="text-[9px] bg-earth-800 border border-earth-700 text-earth-300 px-2 py-1 rounded-full">
                                🏅 Skill ×{priceAdvice.breakdown.skillPremium.toFixed(1)}
                              </span>
                              {priceAdvice.breakdown.marketSampleSize > 0 && (
                                <span className="text-[9px] bg-terracotta-900/40 border border-terracotta-800/40 text-terracotta-300 px-2 py-1 rounded-full">
                                  📊 {priceAdvice.breakdown.marketSampleSize} market products
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Range bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-[10px] text-earth-400 mb-1.5">
                            <span className="flex items-center gap-1"><IndianRupee size={10}/>{priceAdvice.min.toLocaleString('en-IN')} min</span>
                            <span className="text-terracotta-300 font-bold">Optimal Range</span>
                            <span className="flex items-center gap-1"><IndianRupee size={10}/>{priceAdvice.max.toLocaleString('en-IN')} max</span>
                          </div>
                          <div className="relative h-2 bg-earth-700 rounded-full overflow-hidden">
                            {/* grey full bar */}
                            <div className="absolute inset-0 bg-earth-700 rounded-full" />
                            {/* highlighted P25-P75 range */}
                            <div
                              className="absolute top-0 bottom-0 bg-terracotta-500/70 rounded-full"
                              style={{
                                left: `${((priceAdvice.rangeLow - priceAdvice.min) / (priceAdvice.max - priceAdvice.min)) * 100}%`,
                                width: `${((priceAdvice.rangeHigh - priceAdvice.rangeLow) / (priceAdvice.max - priceAdvice.min)) * 100}%`
                              }}
                            />
                            {/* recommended marker */}
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-terracotta-500 shadow"
                              style={{ left: `calc(${((priceAdvice.recommended - priceAdvice.min) / (priceAdvice.max - priceAdvice.min)) * 100}% - 6px)` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-terracotta-300/80 mt-1">
                            <span>₹{priceAdvice.rangeLow.toLocaleString('en-IN')}</span>
                            <span>Sweet spot</span>
                            <span>₹{priceAdvice.rangeHigh.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {/* Apply button */}
                        <button
                          type="button"
                          onClick={() => setNewProduct(p => ({ ...p, price: String(priceAdvice.recommended) }))}
                          className="w-full py-2.5 bg-terracotta-600 hover:bg-terracotta-500 text-white font-bold uppercase tracking-wider rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                        >
                          Apply Recommended Price <ChevronRight size={14} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-earth-700 uppercase tracking-wider mb-2">Material</label>
                      <input
                        type="text"
                        value={newProduct.material}
                        onChange={e => setNewProduct(p => ({ ...p, material: e.target.value }))}
                        className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded-lg focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500"
                        placeholder="e.g., Cotton, Clay, Silk"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-earth-700 uppercase tracking-wider mb-2">Quantity in Stock</label>
                      <input
                        type="number"
                        min="1"
                        value={newProduct.stock}
                        onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))}
                        className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded-lg focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500"
                      />
                    </div>
                  </div>

                  {/* Work Hours + Complexity — used by AI Price Advisor */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-earth-700 uppercase tracking-wider mb-1">
                        Estimated Work Hours
                        <span className="ml-1 font-normal normal-case tracking-normal text-earth-400">(for AI pricing)</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={newProduct.workHours}
                        onChange={e => setNewProduct(p => ({ ...p, workHours: e.target.value }))}
                        className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded-lg focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500"
                        placeholder="e.g., 20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-earth-700 uppercase tracking-wider mb-1">
                        Craft Complexity
                        <span className="ml-1 font-normal normal-case tracking-normal text-earth-400">(for AI pricing)</span>
                      </label>
                      <select
                        value={newProduct.complexity}
                        onChange={e => setNewProduct(p => ({ ...p, complexity: e.target.value }))}
                        className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded-lg focus:outline-none focus:border-terracotta-500"
                      >
                        <option value="low">Low — basic patterns</option>
                        <option value="medium">Medium — detailed work</option>
                        <option value="high">High — intricate craft</option>
                        <option value="expert">Expert — heirloom quality</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-earth-700 uppercase tracking-wider mb-2">Main Product Image URL *</label>
                    <div className="flex gap-3">
                      <input
                        required
                        type="url"
                        value={newProduct.image}
                        onChange={e => setNewProduct(p => ({ ...p, image: e.target.value }))}
                        className="flex-1 px-4 py-3 bg-earth-50 border border-earth-200 rounded-lg focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500"
                        placeholder="https://images.unsplash.com/..."
                      />
                      {newProduct.image ? (
                        <img src={newProduct.image} alt="preview" className="w-14 h-14 object-cover rounded-lg border border-earth-200 shrink-0" />
                      ) : (
                        <div className="w-14 h-14 bg-earth-100 rounded-lg border border-earth-200 flex items-center justify-center shrink-0">
                          <ImageIcon size={20} className="text-earth-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-earth-700 uppercase tracking-wider mb-2">Second Image URL (optional)</label>
                    <input
                      type="url"
                      value={newProduct.image2}
                      onChange={e => setNewProduct(p => ({ ...p, image2: e.target.value }))}
                      className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded-lg focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>



                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3 border border-earth-200 text-earth-700 font-bold uppercase tracking-wider rounded-lg hover:bg-earth-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-earth-900 text-white font-bold uppercase tracking-wider rounded-lg hover:bg-terracotta-600 transition-colors disabled:opacity-60"
                    >
                      {isSubmitting ? (isEditing ? 'Saving...' : 'Listing...') : (isEditing ? 'Save Changes' : 'Publish Product')}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSchemeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-earth-900/70 backdrop-blur-sm px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowSchemeModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-earth-200 bg-earth-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🏛️</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-forest-900">Eligible Government Schemes</h2>
                    <p className="text-xs font-bold uppercase tracking-wider text-earth-500">Matched to your Artisan Profile</p>
                  </div>
                </div>
                <button onClick={() => setShowSchemeModal(false)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-earth-200 text-earth-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto bg-white flex-1 relative">
                 <div className="space-y-4">
                    {/* Scheme 1 */}
                    <div className="border border-forest-200 bg-forest-50/50 rounded-xl p-5 relative overflow-hidden">
                       <div className="absolute top-0 right-0 py-1 px-3 bg-forest-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-bl-lg">Highest Match</div>
                       <h3 className="text-lg font-bold text-forest-900 mb-1">PM Vishwakarma Scheme</h3>
                       <p className="text-sm text-forest-800 mb-3">Holistic support for artisans focusing on skill upgradation, toolkit incentive, and credit support.</p>
                       <div className="flex flex-wrap gap-2 mb-4">
                         <span className="text-[10px] bg-white border border-forest-200 px-2 py-1 rounded-full text-forest-700 font-medium">₹15,000 Toolkit Fund</span>
                         <span className="text-[10px] bg-white border border-forest-200 px-2 py-1 rounded-full text-forest-700 font-medium">Up to ₹3L Credit @ 5%</span>
                         <span className="text-[10px] bg-white border border-forest-200 px-2 py-1 rounded-full text-forest-700 font-medium">Skill Training Stipend</span>
                       </div>
                       <button onClick={() => { alert('Initializing Voice Assistant for PM Vishwakarma Application...'); setShowSchemeModal(false); }} className="w-full sm:w-auto px-6 py-2.5 bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm">
                         Apply automatically
                       </button>
                    </div>

                    {/* Scheme 2 */}
                    <div className="border border-earth-200 bg-white rounded-xl p-5 hover:border-earth-300 transition-colors">
                       <h3 className="text-lg font-bold text-earth-900 mb-1">Ambedkar Hastshilp Vikas Yojana</h3>
                       <p className="text-sm text-earth-600 mb-3">Design and technology upgradation for craft clusters. Best suited, since you operate in a recognized craft hub.</p>
                       <div className="flex flex-wrap gap-2 mb-4">
                         <span className="text-[10px] bg-earth-50 border border-earth-200 px-2 py-1 rounded-full text-earth-700 font-medium">Cluster Infrastructure</span>
                         <span className="text-[10px] bg-earth-50 border border-earth-200 px-2 py-1 rounded-full text-earth-700 font-medium">Design Workshops</span>
                       </div>
                       <button onClick={() => { alert('Initializing Voice Assistant for AHVY Application...'); setShowSchemeModal(false); }} className="w-full sm:w-auto px-6 py-2.5 bg-earth-900 hover:bg-earth-800 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm">
                         Apply automatically
                       </button>
                    </div>

                    {/* Scheme 3 */}
                    <div className="border border-earth-200 bg-white rounded-xl p-5 hover:border-earth-300 transition-colors">
                       <h3 className="text-lg font-bold text-earth-900 mb-1">Mudra Yojana (Shishu/Kishore)</h3>
                       <p className="text-sm text-earth-600 mb-3">Collateral-free micro-credit for expanding production capacity and buying raw materials.</p>
                       <div className="flex flex-wrap gap-2 mb-4">
                         <span className="text-[10px] bg-earth-50 border border-earth-200 px-2 py-1 rounded-full text-earth-700 font-medium">₹50,000 to ₹5L Loans</span>
                         <span className="text-[10px] bg-earth-50 border border-earth-200 px-2 py-1 rounded-full text-earth-700 font-medium">No Collateral</span>
                       </div>
                       <button onClick={() => { alert('Initializing Voice Assistant for Mudra Yojana Application...'); setShowSchemeModal(false); }} className="w-full sm:w-auto px-6 py-2.5 bg-earth-900 hover:bg-earth-800 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm">
                         Apply automatically
                       </button>
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t border-earth-200 bg-earth-50 flex justify-between items-center text-xs text-earth-500">
                <p>SchemeGPT uses your profile to auto-fill these applications.</p>
                <button onClick={() => setShowSchemeModal(false)} className="px-6 py-2 bg-white text-earth-900 border border-earth-300 font-bold uppercase tracking-wider rounded transition-colors hover:bg-earth-100">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* IP Shield Scanner Modal */}
      <IPShieldScanner 
        isOpen={showIPShield} 
        onClose={() => setShowIPShield(false)} 
        products={products} 
      />
    </div>
  );
};

export default ArtisanDashboard;
