import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { products as localProducts } from '../data/products';
import {
  IndianRupee, ShoppingBag, ShieldPlus, ChevronLeft, ShieldCheck, Heart,
  Clock, Ruler, Truck, Layers, Award, Package, Zap, Tag, RefreshCcw,
  CheckCircle, AlertCircle, ArrowRight, Gift, CreditCard, Percent
} from 'lucide-react';

/* ── Helper: derive rich details from category/material ── */
const getCraftProfile = (category, material) => {
  const profiles = {
    Metalwork:  { time: '6–10 weeks', dimensions: '20×20 cm to 60×60 cm', weight: '0.5–3 kg',    delivery: '8–12 business days', care: 'Wipe with dry cloth, avoid moisture' },
    Textiles:   { time: '4–8 weeks',  dimensions: 'Standard saree: 5.5 m × 1.2 m', weight: '300–800 g', delivery: '5–8 business days',  care: 'Hand wash cold, dry in shade' },
    Paintings:  { time: '3–6 weeks',  dimensions: '30×40 cm to 60×90 cm', weight: '200–600 g',   delivery: '5–7 business days',  care: 'Keep away from direct sunlight' },
    Pottery:    { time: '2–4 weeks',  dimensions: 'Dia: 15–35 cm, H: 10–40 cm', weight: '0.5–2 kg',  delivery: '7–10 business days', care: 'Hand wash only, not microwave safe' },
    Decor:      { time: '3–5 weeks',  dimensions: '25×25 cm to 50×70 cm', weight: '0.3–2 kg',    delivery: '6–10 business days', care: 'Dust with soft brush, keep indoors' },
  };
  return profiles[category] || { time: '3–6 weeks', dimensions: 'As shown', weight: 'Varies', delivery: '7–10 business days', care: 'Handle with care' };
};

const getMaterialBadges = (material, category) => {
  const base = [
    { label: 'Handmade', icon: '🖐️' },
    { label: 'Artisan Certified', icon: '🏅' },
    { label: 'No Mass Production', icon: '✋' },
  ];
  if (material) base.unshift({ label: material, icon: '🧵' });
  if (category === 'Paintings') base.push({ label: 'Natural Pigments', icon: '🌿' });
  if (category === 'Textiles')  base.push({ label: 'Handloom Woven', icon: '🪡' });
  if (category === 'Metalwork') base.push({ label: 'Lost-Wax Cast', icon: '🔥' });
  if (category === 'Pottery')   base.push({ label: 'Kiln Fired', icon: '🏺' });
  return base;
};

/* ── Offer data ── */
const OFFERS = [
  {
    icon: <CreditCard size={18} className="text-blue-600" />,
    badge: 'BANK10',
    title: '₹200 off on SBI / HDFC Cards',
    sub: 'On orders above ₹999 · Use code BANK10',
    bg: 'bg-blue-50 border-blue-100',
    badgeBg: 'bg-blue-600 text-white',
  },
  {
    icon: <Percent size={18} className="text-violet-600" />,
    badge: 'UPI5',
    title: '5% Cashback via UPI',
    sub: 'Instant cashback on PhonePe, GPay, Paytm · Use code UPI5',
    bg: 'bg-violet-50 border-violet-100',
    badgeBg: 'bg-violet-600 text-white',
  },
  {
    icon: <Truck size={18} className="text-forest-700" />,
    badge: 'FREE SHIP',
    title: 'Free Delivery on all orders',
    sub: 'No minimum order value · Delivered in eco-friendly packaging',
    bg: 'bg-green-50 border-green-100',
    badgeBg: 'bg-forest-700 text-white',
  },
  {
    icon: <Gift size={18} className="text-terracotta-600" />,
    badge: 'FIRST10',
    title: '10% off on your First Order',
    sub: 'New to Hastkala? · Use code FIRST10 at checkout',
    bg: 'bg-terracotta-50 border-terracotta-100',
    badgeBg: 'bg-terracotta-600 text-white',
  },
];

/* ── Return policy steps ── */
const RETURN_STEPS = [
  { icon: <AlertCircle size={18} className="text-amber-600" />, label: 'Report Issue', sub: 'Raise a return request within 7 days of delivery via your Buyer Dashboard', step: '01' },
  { icon: <Truck size={18} className="text-blue-600" />,        label: 'Free Pickup',  sub: 'We arrange a free pickup from your doorstep within 2–3 business days', step: '02' },
  { icon: <RefreshCcw size={18} className="text-violet-600" />, label: 'Inspection',   sub: 'Item inspected by our quality team within 1 business day of receipt', step: '03' },
  { icon: <CheckCircle size={18} className="text-forest-600" />, label: 'Refund',      sub: 'Full refund to original payment method within 5–7 business days', step: '04' },
];

const RETURN_CONDITIONS = [
  'Item arrived damaged or broken',
  'Product significantly different from description',
  'Wrong item delivered',
  'Packaging tampered during transit',
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [added, setAdded] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  useEffect(() => {
    // Try API first, fall back to local data
    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback: find product in local data by _id or id
        const found = localProducts.find(
          p => String(p._id) === String(id) || String(p.id) === String(id)
        );
        setProduct(found || null);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-earth-50 flex flex-col items-center justify-center py-32 px-6">
        <div className="w-12 h-12 rounded-full border-4 border-terracotta-200 border-t-terracotta-600 animate-spin mb-4" />
        <p className="text-earth-600 text-sm uppercase tracking-widest font-bold">Loading Craft Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-earth-50 flex flex-col items-center justify-center py-32 px-6">
        <h1 className="text-4xl font-serif text-earth-900 mb-4">Product Not Found</h1>
        <p className="text-earth-600 mb-8">We couldn't find the handcrafted item you're looking for.</p>
        <button onClick={() => navigate('/discover')} className="px-8 py-3 bg-earth-900 text-white rounded-lg font-bold tracking-widest uppercase hover:bg-terracotta-600 transition-colors">
          Return to Collections
        </button>
      </div>
    );
  }

  const images = [product.image, product.image2].filter(Boolean);
  const profile = getCraftProfile(product.category, product.material);
  const badges = getMaterialBadges(product.material, product.category);
  const productId = product._id || product.id;
  const wishlisted = isWishlisted(productId);

  // PriceMirror: 3.5% platform fee, rest goes to artisan
  const platformFee = Math.round(product.price * 0.035);
  const artisanEarning = product.price - platformFee;

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    setBuyingNow(true);
    addToCart(product);
    setTimeout(() => {
      navigate('/checkout');
    }, 300);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  const tabs = [
    { id: 'details',  label: 'Craft Details' },
    { id: 'sizing',   label: 'Size & Dimensions' },
    { id: 'delivery', label: 'Delivery & Care' },
  ];

  return (
    <div className="bg-earth-50 min-h-screen pb-24 pt-24 lg:pt-32">
      <div className="container mx-auto px-6 lg:px-12">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-earth-500 mb-8">
          <Link to="/discover" className="hover:text-terracotta-600 flex items-center gap-1 transition-colors">
             <ChevronLeft size={16} /> Collections
          </Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-earth-900 font-medium truncate">{product.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* ── Image Gallery ── */}
          <div className="lg:w-[48%] w-full flex flex-col gap-4">
            <div className="aspect-[4/5] bg-earth-100 rounded-3xl overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={images[activeImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {product.authentic && (
                <div className="absolute top-6 left-6 glass-effect px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <ShieldCheck size={16} className="text-forest-700" />
                  <span className="text-[10px] font-bold tracking-wider text-forest-900 uppercase">TruthMark Verified</span>
                </div>
              )}
              
              {/* Wishlist Heart Button */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleToggleWishlist}
                className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  wishlisted
                    ? 'bg-terracotta-600 text-white shadow-terracotta-300'
                    : 'glass-effect text-earth-700 hover:text-terracotta-600 hover:scale-110'
                }`}
              >
                <Heart size={20} className={wishlisted ? 'fill-white text-white' : ''} />
              </motion.button>

              {/* Wishlist toast */}
              <AnimatePresence>
                {wishlisted && (
                  <motion.div
                    key="wishlist-toast"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-earth-900 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                  >
                    <Heart size={12} className="fill-terracotta-400 text-terracotta-400" /> Saved to Wishlist
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Thumbnail Reel */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto no-scrollbar">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-24 h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-terracotta-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Material Badges */}
            <div className="flex flex-wrap gap-2 mt-2 mb-6">
              {badges.map((b, i) => (
                <span key={i} className="text-[11px] font-bold tracking-wide uppercase bg-earth-100 text-earth-700 border border-earth-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <span>{b.icon}</span> {b.label}
                </span>
              ))}
            </div>

            {/* PriceMirror — left column */}
            <div className="p-6 bg-earth-900 text-white rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-earth-800 rounded-full blur-2xl opacity-50 -translate-y-1/2 translate-x-1/2" />
              <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-6 h-px bg-terracotta-500" /> PriceMirror Logic
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center pb-3 border-b border-earth-700">
                  <span className="text-earth-300">Direct to {product.artisan}</span>
                  <span className="text-lg font-bold flex items-center"><IndianRupee size={16}/>{artisanEarning.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-earth-700/50 text-earth-400">
                  <span>Platform Fee (3.5%)</span>
                  <span className="flex items-center text-terracotta-400"><IndianRupee size={14}/>{platformFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-earth-300 font-semibold">Total You Pay</span>
                  <span className="text-white font-bold flex items-center text-base"><IndianRupee size={16}/>{product.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="mt-3 bg-earth-800/60 rounded-lg px-4 py-3">
                  <p className="text-[11px] text-earth-400 leading-relaxed">
                    <span className="text-terracotta-400 font-bold">{Math.round((artisanEarning / product.price) * 100)}%</span> of every rupee goes directly into the artisan's hands. No middlemen.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Return Policy ── left column below PriceMirror ── */}
            <div className="border border-earth-200 rounded-2xl overflow-hidden mt-4">
              {/* Header */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-forest-900 to-forest-700 text-white px-5 py-3.5">
                <RefreshCcw size={18} />
                <div>
                  <h3 className="font-bold text-sm tracking-wide">Easy 7-Day Returns</h3>
                  <p className="text-forest-200 text-[11px]">Hassle-free · Free pickup · Full refund</p>
                </div>
                <span className="ml-auto bg-white/20 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shrink-0">
                  100% Protected
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Step vertical list */}
                <div className="space-y-3">
                  {RETURN_STEPS.map((step) => (
                    <div key={step.step} className="flex items-start gap-3 bg-earth-50 border border-earth-100 rounded-xl px-4 py-3">
                      <div className="shrink-0 mt-0.5">{step.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-earth-900 font-bold text-xs">{step.label}</p>
                          <span className="text-[10px] font-black text-earth-300 ml-2">{step.step}</span>
                        </div>
                        <p className="text-earth-500 text-[11px] leading-relaxed mt-0.5">{step.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Eligible Conditions */}
                <div className="pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-earth-500 mb-2">Return Eligible If</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {RETURN_CONDITIONS.map((cond, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle size={13} className="text-forest-600 shrink-0" />
                        <span className="text-xs text-earth-700">{cond}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Non-returnable note */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex gap-2">
                  <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    <strong>Note:</strong> Customised or made-to-order items are non-returnable unless damaged. Items must be unused and in original packaging.
                  </p>
                </div>
              </div>
            </div>

          </div>
          
          {/* ── Product Info & Actions ── */}
          <div className="lg:w-[52%] flex flex-col">

            <div className="mb-4">
              <p className="text-xs font-bold text-terracotta-600 uppercase tracking-widest mb-2">{product.category}</p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-earth-900 leading-[1.1] mb-5">
                {product.title}
              </h1>

              {/* Quick stats row */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-earth-600">
                  <Clock size={15} className="text-terracotta-500" />
                  <span><strong className="text-earth-900">{profile.time}</strong> to craft</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-earth-600">
                  <Truck size={15} className="text-forest-600" />
                  <span>Ships in <strong className="text-earth-900">{profile.delivery}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-earth-600">
                  <Award size={15} className="text-amber-600" />
                  <span><strong className="text-earth-900">GI Tagged</strong> Craft</span>
                </div>
              </div>
              
              <div className="flex items-center text-3xl font-bold text-earth-900 mb-6">
                <IndianRupee size={28} strokeWidth={2.5} className="mr-0.5 text-earth-700" />
                {product.price.toLocaleString('en-IN')}
                <span className="ml-4 text-sm font-medium text-forest-700 bg-forest-50 px-3 py-1 rounded-full border border-forest-100">
                  <span className="flex items-center gap-1.5"><ShieldPlus size={14}/> 100% Artisan Direct</span>
                </span>
              </div>
            </div>

            <p className="text-base text-earth-600 font-light leading-relaxed mb-6">
              A 100% handcrafted masterpiece made by traditional artisans using age-old techniques passed down through generations. Every purchase goes <strong className="text-earth-800">directly to the maker</strong> — no middlemen, no markups.
            </p>

            {/* ── Action Buttons: Add to Bag + Buy Now ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {/* Add to Bag */}
              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className={`flex-1 px-8 py-4 font-bold uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-3 text-sm transition-all duration-300 ${
                  added 
                    ? 'bg-forest-700 text-white' 
                    : 'bg-earth-900 text-white hover:bg-earth-700'
                }`}
              >
                <ShoppingBag size={18} /> {added ? '✓ Added to Bag!' : 'Add to Bag'}
              </motion.button>

              {/* Buy Now */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleBuyNow}
                disabled={buyingNow}
                className="flex-1 px-8 py-4 font-bold uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-3 text-sm bg-terracotta-600 text-white hover:bg-terracotta-700 transition-all duration-300 disabled:opacity-70 relative overflow-hidden"
              >
                <Zap size={18} />
                {buyingNow ? 'Redirecting…' : 'Buy Now'}
                {!buyingNow && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60">
                    <ArrowRight size={16} />
                  </span>
                )}
              </motion.button>
            </div>

            {/* Wishlist CTA strip */}
            <button
              onClick={handleToggleWishlist}
              className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border text-sm font-semibold mb-8 transition-all duration-300 ${
                wishlisted
                  ? 'border-terracotta-300 bg-terracotta-50 text-terracotta-700'
                  : 'border-earth-200 bg-white text-earth-600 hover:border-terracotta-300 hover:text-terracotta-600'
              }`}
            >
              <Heart size={16} className={wishlisted ? 'fill-terracotta-600 text-terracotta-600' : ''} />
              {wishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>

            {/* ── Offer Details Section ── */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-terracotta-600" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-earth-800">Available Offers</h3>
              </div>
              <div className="space-y-2">
                {OFFERS.map((offer, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border ${offer.bg}`}
                  >
                    <div className="mt-0.5 shrink-0">{offer.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-earth-900 leading-tight">{offer.title}</p>
                      <p className="text-[11px] text-earth-500 mt-0.5 leading-relaxed">{offer.sub}</p>
                    </div>
                    <span className={`shrink-0 text-[9px] font-bold tracking-widest px-2 py-1 rounded-md ${offer.badgeBg}`}>
                      {offer.badge}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── Tabbed Detail Sections ── */}
            <div className="border border-earth-200 rounded-2xl overflow-hidden mb-6">
              {/* Tab Switcher */}
              <div className="flex border-b border-earth-200 bg-earth-100/50">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-earth-900 text-white' 
                        : 'text-earth-500 hover:text-earth-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'details' && (
                  <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: <Layers size={16}/>, label: 'Material', value: product.material || 'Traditional mixed media' },
                        { icon: <Clock size={16}/>, label: 'Crafting Time', value: profile.time },
                        { icon: <Package size={16}/>, label: 'Weight', value: profile.weight },
                        { icon: <Award size={16}/>, label: 'Origin State', value: product.state },
                        { icon: <ShieldCheck size={16}/>, label: 'Authenticity', value: 'GI & TruthMark' },
                        { icon: <span>🧑‍🎨</span>, label: 'Made By', value: product.artisan },
                      ].map(({ icon, label, value }) => (
                        <div key={label} className="bg-earth-50 rounded-xl p-4 border border-earth-100">
                          <div className="flex items-center gap-2 text-earth-500 mb-1">
                            <span className="text-terracotta-500">{icon}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
                          </div>
                          <p className="text-earth-900 font-semibold text-sm">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">🕰️ Why It Takes This Long</p>
                      <p className="text-sm text-amber-800 font-light leading-relaxed">
                        This piece is entirely hand-crafted — no machines are used. Each {product.category?.toLowerCase() || 'item'} requires meticulous attention, with multiple drying, firing, or curing stages. The time investment is what makes it truly one-of-a-kind.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'sizing' && (
                  <motion.div key="sizing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Ruler size={18} className="text-terracotta-500" />
                      <h3 className="font-serif font-bold text-earth-900">Dimensions & Size Guide</h3>
                    </div>
                    <div className="bg-earth-50 border border-earth-200 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-earth-900 text-white">
                            <th className="py-3 px-4 text-left text-[10px] uppercase tracking-widest font-bold">Attribute</th>
                            <th className="py-3 px-4 text-left text-[10px] uppercase tracking-widest font-bold">Measurement</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-earth-100">
                          {[
                            ['Dimensions', profile.dimensions],
                            ['Weight', profile.weight],
                            ['Packaging Size', 'Adds ~5 cm on each side'],
                            ['Fragility', product.category === 'Pottery' ? 'Fragile — bubble wrap included' : 'Standard craft packaging'],
                          ].map(([attr, val]) => (
                            <tr key={attr} className="hover:bg-earth-50">
                              <td className="py-3 px-4 font-medium text-earth-700">{attr}</td>
                              <td className="py-3 px-4 text-earth-900">{val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-earth-500 leading-relaxed">
                      ⚠️ As each piece is handmade, exact dimensions may vary slightly. All measurements are approximate. Photos show actual product.
                    </p>
                  </motion.div>
                )}

                {activeTab === 'delivery' && (
                  <motion.div key="delivery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 space-y-5">
                    {/* Delivery Timeline */}
                    <div className="flex items-center gap-3 mb-1">
                      <Truck size={18} className="text-forest-600" />
                      <h3 className="font-serif font-bold text-earth-900">Delivery Timeline</h3>
                    </div>
                    <div className="relative pl-6">
                      {[
                        { dot: 'bg-terracotta-500', label: 'Order Confirmed', sub: 'Immediately after payment' },
                        { dot: 'bg-amber-500',      label: 'Artisan Notified', sub: 'Within 24 hours' },
                        { dot: 'bg-earth-500',      label: 'Handcrafted & Packed', sub: '1–3 business days' },
                        { dot: 'bg-forest-500',     label: 'Shipped to You', sub: profile.delivery },
                      ].map((step, i, arr) => (
                        <div key={i} className="relative flex gap-4 pb-5 last:pb-0">
                          {i < arr.length - 1 && (
                            <div className="absolute left-[-13px] top-5 w-px h-full bg-earth-200" />
                          )}
                          <div className={`w-3 h-3 rounded-full mt-1 shrink-0 -ml-[1.5px] ${step.dot}`} />
                          <div>
                            <p className="text-earth-900 font-semibold text-sm">{step.label}</p>
                            <p className="text-earth-500 text-xs">{step.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Care Instructions */}
                    <div className="border-t border-earth-200 pt-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-earth-500 mb-3">Care Instructions</p>
                      <div className="bg-earth-50 rounded-xl p-4 border border-earth-100">
                        <p className="text-sm text-earth-700 leading-relaxed">{profile.care}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Artisan Profile ── */}
            <div className="p-6 bg-earth-100/50 border border-earth-200 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-earth-300">
                  <img src={product.artisanImage} alt={product.artisan} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs text-earth-500 uppercase tracking-widest font-bold mb-1">Meet the Maker</p>
                  <p className="text-xl font-serif font-bold text-earth-900">{product.artisan}</p>
                  <p className="text-sm text-earth-600 italic">{product.village}, {product.state}</p>
                </div>
              </div>
              <p className="text-sm text-earth-700 leading-relaxed font-light">
                Selling via Hastkala allows {product.artisan} to reach global customers directly, circumventing the 70% commission previously taken by local traders.
              </p>
            </div>

          </div>
        </div>

        {/* ── Recommendation Engine: Similar Masterpieces ── */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-earth-200/60">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-serif font-light text-earth-900 leading-tight">
                  Similar <span className="italic font-light text-terracotta-700">Masterpieces</span>
                </h2>
                <p className="text-earth-500 text-sm mt-2">Customers who explored this also viewed authentic crafts by other artisans.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {product.relatedProducts.map((related) => (
                <Link
                  key={related._id}
                  to={`/product/${related._id}`}
                  className="group block bg-white rounded-2xl border border-earth-100 hover:border-earth-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-[4/5] bg-earth-100 overflow-hidden relative">
                    <img 
                      src={related.image} 
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-bold text-earth-400 uppercase tracking-widest mb-1">{related.category}</p>
                    <h3 className="font-serif font-bold text-earth-900 leading-tight group-hover:text-terracotta-600 transition-colors line-clamp-1 mb-2">
                       {related.title}
                    </h3>
                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-earth-100">
                       <span className="text-xs text-earth-500">{related.artisan}</span>
                       <span className="font-bold flex items-center text-earth-900"><IndianRupee size={12}/>{related.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
