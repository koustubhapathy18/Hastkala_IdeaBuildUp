import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { IndianRupee, ShieldCheck, CheckCircle2, ChevronRight, Lock, MapPin, Truck } from 'lucide-react';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => { if (res.ok) return res.json(); })
        .then(data => {
          if (data) {
            setFormData(prev => ({
              ...prev,
              firstName: data.name?.split(' ')[0] || '',
              lastName: data.name?.split(' ').slice(1).join(' ') || '',
              email: data.email || ''
            }));
          }
        })
        .catch(console.error);
    }
  }, []);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    
    const orderData = {
      customerInfo: {
        name: `${formData.firstName} ${formData.lastName}`.trim() || "Guest User",
        email: formData.email || "guest@example.com",
        address: formData.address || "Not provided",
        city: formData.city || "Not provided",
        zipCode: formData.zipCode || "000000"
      },
      items: cart.map(item => ({
        productId: item._id || item.id,
        title: item.title || item.name || 'Unnamed Product',
        image: item.image || '',
        artisan: item.artisan || '',
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: calculateSubtotal()
    };

    const token = localStorage.getItem('token');
    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(orderData)
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to place order');
      return data;
    })
    .then(data => {
      setIsProcessing(false);
      setOrderId(data._id || Math.floor(100000 + Math.random() * 900000));
      setStep(3); // Success step
      clearCart();
    })
    .catch(err => {
      console.error('Order placement failed:', err);
      alert('Order placement failed: ' + err.message);
      setIsProcessing(false);
    });
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-earth-50 flex flex-col items-center justify-center py-32">
        <h1 className="text-3xl font-serif text-earth-900 mb-4">Your Cart is Empty</h1>
        <button onClick={() => navigate('/discover')} className="text-terracotta-600 font-bold hover:underline">
          Return to Shop
        </button>
      </div>
    );
  }

  // --- Success State ---
  if (step === 3) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center py-24 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-xl w-full text-center border border-earth-100"
        >
          <div className="w-20 h-20 bg-forest-50 text-forest-600 rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-earth-900 mb-4">Order Confirmed!</h1>
          <p className="text-earth-600 mb-2 leading-relaxed">
            Thank you for supporting authentic Indian craftsmanship. Your order <span className="font-mono font-bold text-earth-900">#HK{orderId}</span> has been placed successfully.
          </p>
          
          <div className="bg-earth-50 p-4 rounded-xl mt-6 mb-8 text-sm text-earth-700 text-left flex gap-3">
             <ShieldCheck size={20} className="text-forest-700 shrink-0 mt-0.5" />
             <p>Your payment is secure in our TruthMark escrow. It will be released directly to the artisan's Aadhaar wallet once the item is delivered.</p>
          </div>
          
          <Link to="/" className="w-full py-4 bg-earth-900 text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-terracotta-600 transition-colors inline-block">
            Return to Storefront
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-earth-50 min-h-screen py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        
        {/* Checkout Header / Breadcrumbs */}
        <div className="flex items-center gap-4 mb-10 text-sm font-bold uppercase tracking-widest text-earth-400">
           <span className={step >= 1 ? "text-earth-900" : ""}>Address</span>
           <ChevronRight size={14} />
           <span className={step >= 2 ? "text-earth-900" : ""}>Payment</span>
           <ChevronRight size={14} />
           <span>Confirmation</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Form Area */}
          <div className="flex-1">
            
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-serif font-bold text-earth-900 mb-6 flex items-center gap-2">
                  <MapPin size={24} className="text-terracotta-600" /> Shipping Details
                </h2>
                
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-earth-200 shadow-sm space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-earth-500 uppercase tracking-widest mb-2">First Name</label>
                      <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-earth-50 border border-earth-200 rounded-lg px-4 py-3 focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500 transition-shadow" placeholder="Jane" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-earth-500 uppercase tracking-widest mb-2">Last Name</label>
                      <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-earth-50 border border-earth-200 rounded-lg px-4 py-3 focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500 transition-shadow" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-earth-500 uppercase tracking-widest mb-2">Email Address</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-earth-50 border border-earth-200 rounded-lg px-4 py-3 focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500 transition-shadow" placeholder="jane.doe@example.com" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-earth-500 uppercase tracking-widest mb-2">Full Address</label>
                    <textarea rows="3" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-earth-50 border border-earth-200 rounded-lg px-4 py-3 focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500 transition-shadow" placeholder="123 Heritage Lane, Apartment 4B"></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-earth-500 uppercase tracking-widest mb-2">City</label>
                      <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-earth-50 border border-earth-200 rounded-lg px-4 py-3 focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500 transition-shadow" placeholder="Mumbai" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-earth-500 uppercase tracking-widest mb-2">Pincode</label>
                      <input type="text" value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} className="w-full bg-earth-50 border border-earth-200 rounded-lg px-4 py-3 focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500 transition-shadow" placeholder="400001" />
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep(2)}
                    className="w-full py-4 bg-earth-900 text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-terracotta-600 transition-colors mt-4"
                  >
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold text-earth-900 flex items-center gap-2">
                    <Lock size={20} className="text-forest-600" /> Secure Payment
                  </h2>
                  <button onClick={() => setStep(1)} className="text-sm font-bold text-earth-500 hover:text-terracotta-600 transition-colors uppercase tracking-wider">
                    Back to Details
                  </button>
                </div>
                
                <div className="bg-white rounded-2xl border border-earth-200 shadow-sm overflow-hidden mb-8">
                  <label className="flex items-center p-6 border-b border-earth-100 cursor-pointer hover:bg-earth-50 transition-colors has-[:checked]:bg-earth-50">
                    <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-terracotta-600 border-earth-300 focus:ring-terracotta-500" />
                    <span className="ml-4 font-bold text-earth-900">UPI (GPay, PhonePe, Paytm)</span>
                  </label>
                  
                  <div className="p-6 bg-earth-50 border-b border-earth-100">
                    <div className="max-w-xs mx-auto text-center">
                       <div className="w-48 h-48 bg-white mx-auto rounded-xl shadow-sm border border-earth-200 p-2 mb-4">
                         {/* Mock QR */}
                         <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=hastkala-truthmark-payment-gateway')] bg-contain bg-center bg-no-repeat opacity-80" />
                       </div>
                       <p className="text-sm text-earth-600 font-medium">Scan with any UPI app to pay</p>
                    </div>
                  </div>

                  <label className="flex items-center p-6 border-b border-earth-100 cursor-pointer hover:bg-earth-50 transition-colors has-[:checked]:bg-earth-50">
                    <input type="radio" name="payment" className="w-5 h-5 text-terracotta-600 border-earth-300 focus:ring-terracotta-500" />
                    <span className="ml-4 font-bold text-earth-900">Credit / Debit Card</span>
                  </label>
                  
                  <label className="flex items-center p-6 cursor-pointer hover:bg-earth-50 transition-colors has-[:checked]:bg-earth-50">
                    <input type="radio" name="payment" className="w-5 h-5 text-terracotta-600 border-earth-300 focus:ring-terracotta-500" />
                    <span className="ml-4 font-bold text-earth-900">Cash on Delivery</span>
                  </label>
                </div>
                
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full py-5 bg-terracotta-600 text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-terracotta-700 transition-colors flex justify-center items-center shadow-lg shadow-terracotta-600/20 disabled:opacity-70"
                >
                  {isProcessing ? 'Processing Payment...' : `Pay \u20B9${calculateSubtotal().toLocaleString('en-IN')} via Escrow`}
                </button>
              </motion.div>
            )}

          </div>

          {/* Checkout Order Summary */}
          <div className="w-full lg:w-[400px] shrink-0">
             <div className="bg-earth-100/50 rounded-3xl p-6 md:p-8 border border-earth-200 sticky top-28">
               <h3 className="font-serif text-xl font-bold text-earth-900 mb-6">Order Summary</h3>
               
               <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                 {cart.map(item => (
                   <div key={item.id} className="flex gap-4">
                     <div className="w-16 h-16 rounded-lg bg-white overflow-hidden shrink-0 border border-earth-200 relative">
                       <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                       <span className="absolute -top-2 -right-2 w-5 h-5 bg-earth-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                         {item.quantity}
                       </span>
                     </div>
                     <div className="flex-1">
                       <h4 className="text-sm font-bold text-earth-900 leading-tight line-clamp-2">{item.title}</h4>
                       <p className="text-xs text-earth-500 mt-1">{item.artisan}</p>
                       <p className="text-sm font-bold text-earth-900 mt-1"><IndianRupee size={12} className="inline mr-0.5" />{item.price.toLocaleString('en-IN')}</p>
                     </div>
                   </div>
                 ))}
               </div>

               <div className="space-y-3 pt-6 border-t border-earth-200 text-sm">
                 <div className="flex justify-between text-earth-600">
                   <span>Subtotal</span>
                   <span className="font-medium text-earth-900"><IndianRupee size={12} className="inline"/> {calculateSubtotal().toLocaleString('en-IN')}</span>
                 </div>
                 <div className="flex justify-between text-earth-600">
                   <span>Shipping</span>
                   <span className="text-forest-600 font-bold uppercase text-[10px] tracking-wider bg-forest-50 px-2 py-0.5 rounded">Free</span>
                 </div>
                 <div className="flex justify-between font-bold text-lg text-earth-900 pt-4 border-t border-earth-200 mt-4">
                   <span>Total</span>
                   <span><IndianRupee size={16} className="inline"/> {calculateSubtotal().toLocaleString('en-IN')}</span>
                 </div>
               </div>
               
               <div className="mt-8 flex items-start gap-3 text-xs text-earth-500 bg-white p-4 rounded-xl shadow-sm">
                 <Truck size={24} className="shrink-0 text-terracotta-500" />
                 <p>Orders are dispatched directly from the artisan's village within 3-5 days. Tracking details will be provided via email.</p>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
