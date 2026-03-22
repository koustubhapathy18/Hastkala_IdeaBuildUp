import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { IndianRupee, Trash2, ArrowRight, ShoppingBag, ShieldPlus } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart } = useCart();

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-earth-50 flex flex-col items-center justify-center py-32 px-6">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-earth-300">
           <ShoppingBag size={48} strokeWidth={1} />
        </div>
        <h1 className="text-4xl font-serif text-earth-900 mb-4">Your Bag is Empty</h1>
        <p className="text-earth-600 mb-8 max-w-md text-center">Looks like you haven't added any handcrafted masterpieces to your bag yet.</p>
        <Link to="/discover" className="px-8 py-4 bg-earth-900 text-white rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-terracotta-600 transition-colors shadow-lg shadow-earth-900/20">
          Discover Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-earth-50 min-h-screen py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-earth-900 mb-12 border-b border-earth-200 pb-6">
          Shopping <span className="font-light italic text-terracotta-600">Bag</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-12 relative">
          
          {/* Cart Items List */}
          <div className="flex-1 space-y-6">
            {cart.map((item, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={item.id} 
                className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-earth-100 flex flex-col sm:flex-row gap-6 relative"
              >
                <Link to={`/product/${item.id}`} className="w-full sm:w-32 h-40 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-earth-50 block">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </Link>
                
                <div className="flex-1 flex flex-col justify-between">
                   <div className="flex justify-between items-start pr-8 sm:pr-0">
                     <div>
                       <p className="text-[10px] font-bold text-terracotta-600 uppercase tracking-widest mb-1">{item.category}</p>
                       <Link to={`/product/${item.id}`}>
                         <h3 className="text-lg font-serif font-bold text-earth-900 hover:text-terracotta-600 transition-colors">{item.title}</h3>
                       </Link>
                       <p className="text-sm text-earth-500 mt-1">Artisan: <span className="font-medium text-earth-700">{item.artisan}</span></p>
                     </div>
                     <div className="text-right hidden sm:block">
                        <p className="text-lg font-bold text-earth-900 flex items-center justify-end"><IndianRupee size={16} className="text-earth-600 mr-0.5" />{item.price.toLocaleString('en-IN')}</p>
                     </div>
                   </div>

                   <div className="flex items-center justify-between mt-4 sm:mt-0 pt-4 border-t border-earth-100 sm:border-0 sm:pt-0">
                     <div className="flex items-center gap-3 bg-earth-50 px-3 py-1.5 rounded-lg border border-earth-200">
                        <span className="text-sm text-earth-600 font-medium">Qty: {item.quantity}</span>
                     </div>
                     
                     <div className="sm:hidden text-right">
                        <p className="text-lg font-bold text-earth-900 flex items-center justify-end"><IndianRupee size={16} className="text-earth-600 mr-0.5" />{item.price.toLocaleString('en-IN')}</p>
                     </div>

                     <button 
                       onClick={() => removeFromCart(item.id)}
                       className="absolute top-4 right-4 sm:static text-earth-400 hover:text-red-500 transition-colors p-2"
                       title="Remove item"
                     >
                       <Trash2 size={18} />
                     </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[400px] shrink-0">
             <div className="bg-white rounded-3xl p-8 border border-earth-200 shadow-xl shadow-earth-900/5 sticky top-28">
               <h3 className="font-serif text-2xl font-bold text-earth-900 mb-6">Order Summary</h3>
               
               <div className="space-y-4 mb-8 text-earth-700 text-sm">
                 <div className="flex justify-between items-center">
                   <span>Subtotal ({cart.length} items)</span>
                   <span className="font-bold text-earth-900 flex items-center"><IndianRupee size={14}/> {calculateSubtotal().toLocaleString('en-IN')}</span>
                 </div>
                 <div className="flex justify-between items-center text-forest-700">
                   <span>Platform Fee (0%)</span>
                   <span><IndianRupee size={14} className="inline"/> 0</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span>Estimated Shipping</span>
                   <span className="text-earth-500 italic">Calculated at checkout</span>
                 </div>
               </div>

               <div className="border-t border-earth-200 pt-6 mb-8">
                 <div className="flex justify-between items-end mb-2">
                   <span className="text-lg font-bold text-earth-900">Total</span>
                   <span className="text-3xl font-bold text-earth-900 flex items-center"><IndianRupee size={24} strokeWidth={2.5} className="mr-0.5" /> {calculateSubtotal().toLocaleString('en-IN')}</span>
                 </div>
                 <p className="text-[10px] text-right text-earth-500 uppercase tracking-widest font-bold text-forest-700">
                   100% directly to artisans
                 </p>
               </div>

               <Link to="/checkout" className="w-full py-5 bg-earth-900 text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-terracotta-600 transition-colors shadow-lg flex items-center justify-center gap-2 group">
                 Proceed to Secure Checkout
                 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </Link>

               <div className="mt-6 bg-forest-50 p-4 rounded-xl border border-forest-100/50 flex items-start gap-3">
                 <ShieldPlus size={20} className="text-forest-700 shrink-0 mt-0.5" />
                 <p className="text-xs text-forest-800/80 leading-relaxed font-medium">
                   Every purchase is protected by TruthMark. Your payment is securely held and transferred instantly to the artisan's Aadhaar linked bank account upon delivery verification.
                 </p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
