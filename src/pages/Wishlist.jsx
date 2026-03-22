import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { IndianRupee, Trash2, ShoppingBag, Heart, ArrowRight, ShieldPlus } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [movedToCart, setMovedToCart] = useState({});

  const handleMoveToCart = (item) => {
    addToCart(item);
    setMovedToCart((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setMovedToCart((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-earth-50 flex flex-col items-center justify-center py-32 px-6">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-earth-200">
          <Heart size={48} strokeWidth={1} />
        </div>
        <h1 className="text-4xl font-serif text-earth-900 mb-4">Your Wishlist is Empty</h1>
        <p className="text-earth-600 mb-8 max-w-md text-center">
          Save your favourite handcrafted pieces here and come back to them anytime.
        </p>
        <Link
          to="/discover"
          className="px-8 py-4 bg-earth-900 text-white rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-terracotta-600 transition-colors shadow-lg shadow-earth-900/20"
        >
          Discover Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-earth-50 min-h-screen py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Page Header */}
        <div className="border-b border-earth-200 pb-6 mb-12 flex items-end justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-earth-900">
              My <span className="font-light italic text-terracotta-600">Wishlist</span>
            </h1>
            <p className="text-earth-500 text-sm mt-2">{wishlist.length} saved {wishlist.length === 1 ? 'item' : 'items'}</p>
          </div>
          <Link
            to="/discover"
            className="hidden sm:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-earth-500 hover:text-terracotta-600 transition-colors"
          >
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid of wishlist items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlist.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.06, duration: 0.35 }}
                className="bg-white rounded-2xl border border-earth-100 shadow-sm overflow-hidden flex flex-col group"
              >
                {/* Product Image */}
                <Link to={`/product/${item.id}`} className="block relative overflow-hidden aspect-[4/3]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Remove from wishlist */}
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => { e.preventDefault(); removeFromWishlist(item.id); }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow text-terracotta-600 hover:bg-terracotta-600 hover:text-white transition-all duration-200"
                    title="Remove from wishlist"
                  >
                    <Heart size={15} className="fill-current" />
                  </motion.button>
                </Link>

                {/* Info */}
                <div className="flex flex-col flex-1 p-4">
                  <p className="text-[10px] font-bold text-terracotta-500 uppercase tracking-widest mb-1">{item.category}</p>
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-serif font-bold text-earth-900 text-base leading-snug hover:text-terracotta-600 transition-colors line-clamp-2 mb-1">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-earth-500 mb-3">
                    By <span className="font-medium text-earth-700">{item.artisan}</span> · {item.state}
                  </p>

                  <div className="mt-auto">
                    <p className="text-lg font-bold text-earth-900 flex items-center mb-3">
                      <IndianRupee size={15} className="mr-0.5 text-earth-600" />
                      {item.price?.toLocaleString('en-IN')}
                    </p>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleMoveToCart(item)}
                        className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition-all duration-300 ${
                          movedToCart[item.id]
                            ? 'bg-forest-700 text-white'
                            : 'bg-earth-900 text-white hover:bg-terracotta-600'
                        }`}
                      >
                        <ShoppingBag size={13} />
                        {movedToCart[item.id] ? 'Added!' : 'Add to Bag'}
                      </motion.button>

                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="w-9 h-9 shrink-0 border border-earth-200 rounded-lg flex items-center justify-center text-earth-400 hover:text-red-500 hover:border-red-200 transition-all"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom trust bar */}
        <div className="mt-16 bg-white border border-earth-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <ShieldPlus size={28} className="text-forest-700 shrink-0" />
          <p className="text-sm text-earth-700 leading-relaxed text-center sm:text-left">
            <strong className="text-earth-900">All items are handcrafted and authentic.</strong> Every purchase is protected by Hastkala's TruthMark guarantee — your payment is held securely until delivery is verified.
          </p>
          <Link
            to="/discover"
            className="ml-auto shrink-0 px-6 py-3 bg-terracotta-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-terracotta-700 transition-colors"
          >
            Shop More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
