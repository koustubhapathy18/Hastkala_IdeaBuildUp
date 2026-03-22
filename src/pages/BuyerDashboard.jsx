import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  User as UserIcon, 
  MapPin, 
  CreditCard, 
  Phone, 
  Mail, 
  Clock, 
  ChevronRight, 
  ShoppingBag,
  ExternalLink,
  X,
  AlertCircle,
  RefreshCcw,
  CheckCircle,
  Truck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const BuyerDashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnOrder, setReturnOrder] = useState(null);
  const [returnStep, setReturnStep] = useState(1);
  const [returnReason, setReturnReason] = useState('');
  const [returnComments, setReturnComments] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const userRes = await fetch('/api/auth/me', {
          headers: { 
            'x-auth-token': token,
            'Authorization': `Bearer ${token}`
          }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

        // Fetch user orders
        const ordersRes = await fetch('/api/orders/me', {
          headers: { 
            'x-auth-token': token,
            'Authorization': `Bearer ${token}`
          }
        });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }

      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const calculateTotalSpend = () => {
    return orders.reduce((sum, order) => sum + order.totalAmount, 0);
  };

  const handleReturnSubmit = () => {
    // In a real app, you'd call an API here.
    // We'll update local state to mock the success.
    setOrders(orders.map(o => o._id === returnOrder._id ? { ...o, status: 'return requested' } : o));
    setReturnStep(4); // Success step
  };

  const closeModals = () => {
    setSelectedOrder(null);
    setReturnOrder(null);
    setReturnStep(1);
    setReturnReason('');
    setReturnComments('');
  };

  const openReturnFlow = (order) => {
    setSelectedOrder(null);
    setReturnOrder(order);
    setReturnStep(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-terracotta-200 border-t-terracotta-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-earth-600 font-serif">Loading your heritage profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-50 pt-28 pb-20 relative">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 border border-earth-100 shadow-sm mb-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-earth-50 shadow-md">
              <img 
                src={user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2000&auto=format&fit=crop"} 
                alt={user?.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-earth-900 mb-2">{user?.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-earth-600 text-sm">
                <span className="flex items-center gap-1.5"><Mail size={16} className="text-terracotta-500" /> {user?.email}</span>
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-terracotta-500" /> {user?.location || 'Mumbai, Maharashtra'}</span>
                {user?.phone && <span className="flex items-center gap-1.5"><Phone size={16} className="text-terracotta-500" /> {user.phone}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-earth-50 p-4 rounded-2xl text-center">
                <p className="text-2xl font-serif font-bold text-earth-900">{orders.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-earth-500">Orders</p>
              </div>
              <div className="bg-earth-50 p-4 rounded-2xl text-center border border-terracotta-100">
                <p className="text-2xl font-serif font-bold text-terracotta-600">₹{calculateTotalSpend().toLocaleString()}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-earth-500">Spendings</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Recent Orders */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-serif font-bold text-earth-900 flex items-center gap-2">
              <Package size={24} className="text-terracotta-600" /> Recent Orders
            </h2>
            
            {orders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-earth-300 text-center">
                <ShoppingBag size={48} className="text-earth-200 mx-auto mb-4" />
                <p className="text-earth-500 font-serif text-lg mb-6">You haven't placed any orders yet.</p>
                <Link to="/discover" className="px-8 py-3 bg-earth-900 text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-terracotta-600 transition-colors">
                  Start Exploring
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div 
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-3xl border border-earth-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pb-4 border-b border-earth-50">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-earth-400 mb-1">Order ID</p>
                        <p className="font-mono font-bold text-earth-900">#HK-{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div className="flex gap-8">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-earth-400 mb-1">Date</p>
                          <p className="text-sm font-medium text-earth-700">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-earth-400 mb-1">Status</p>
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                            order.status === 'delivered' ? 'bg-green-50 text-green-700' : 
                            order.status === 'return requested' || order.status === 'returned' ? 'bg-amber-50 text-amber-700' :
                            order.status === 'shipped' ? 'bg-blue-50 text-blue-700' : 
                            'bg-earth-100 text-earth-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-earth-50 shrink-0">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-earth-900">{item.title}</h4>
                            <p className="text-xs text-earth-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-earth-900">₹{item.price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 flex items-center justify-between border-t border-earth-50">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-xs font-bold text-terracotta-600 hover:text-earth-900 flex items-center gap-1 transition-colors"
                      >
                        View Details <ChevronRight size={14} />
                      </button>
                      <p className="text-lg font-serif font-bold text-earth-900">Total: ₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Account Details */}
            <div className="bg-white p-8 rounded-3xl border border-earth-100 shadow-sm">
              <h3 className="text-xl font-serif font-bold text-earth-900 mb-6 flex items-center gap-2">
                <UserIcon size={20} className="text-terracotta-600" /> Account Stats
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-earth-50 rounded-full flex items-center justify-center text-earth-600">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-earth-400">Patron Since</p>
                    <p className="text-sm font-medium text-earth-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Recent Member'}
                    </p>

                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-earth-50 rounded-full flex items-center justify-center text-earth-600">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-earth-400">Default Payment</p>
                    <p className="text-sm font-medium text-earth-900">{user?.upi || 'Linked UPI'}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => alert('Profile editing is currently under development.')}
                className="w-full py-3 border border-earth-200 text-earth-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-earth-50 transition-colors mt-8"
              >
                Edit Profile
              </button>
            </div>

            {/* Support/Links */}
            <div className="bg-earth-900 p-8 rounded-3xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <h3 className="text-xl font-serif font-bold mb-4 relative z-10">TruthMark Protection</h3>
              <p className="text-earth-400 text-sm leading-relaxed mb-6 font-light relative z-10">
                Your purchases are secured by TruthMark. If you haven't received the NFC certificate for any item, please contact support.
              </p>
              <Link to="/truthmark" className="inline-flex items-center gap-2 text-terracotta-400 font-bold uppercase tracking-widest text-xs hover:text-white transition-all relative z-10 mt-2">
                Learn More <ExternalLink size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ── Order Details Modal ── */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={closeModals}
              className="absolute inset-0 bg-earth-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-10 p-6 md:p-10 hide-scrollbar"
            >
              <button 
                onClick={closeModals}
                className="absolute top-6 right-6 w-10 h-10 bg-earth-50 rounded-full flex items-center justify-center text-earth-500 hover:bg-earth-100 hover:text-earth-900 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-earth-400 mb-1">Order Details</p>
                <h2 className="text-2xl font-serif font-bold text-earth-900">#HK-{selectedOrder._id.slice(-8).toUpperCase()}</h2>
                <div className="flex gap-4 mt-2 text-sm text-earth-500">
                  <span>{new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>{selectedOrder.status}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-earth-50 rounded-2xl p-6 mb-8 border border-earth-100">
                <h3 className="font-bold text-sm text-earth-900 mb-4 uppercase tracking-wider">Items ({selectedOrder.items.length})</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white shadow-sm">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-earth-900 leading-tight">{item.title}</h4>
                        <p className="text-xs text-earth-500 mt-1">Artisan: {item.artisan}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-earth-600 font-medium">Qty: {item.quantity}</p>
                          <p className="font-bold text-earth-900">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-earth-200 mt-6 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-earth-600">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-earth-600">
                    <span>Shipping</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between font-bold text-earth-900 text-lg pt-2">
                    <span>Total Paid</span>
                    <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Shipping & Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border border-earth-100 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={16} className="text-terracotta-500" />
                    <h3 className="font-bold text-sm text-earth-900 uppercase tracking-wider">Shipping Address</h3>
                  </div>
                  <p className="text-sm text-earth-600 leading-relaxed font-light">
                    {user?.name}<br/>
                    123, Craftsvilla Apartment<br/>
                    {user?.location || 'Mumbai, Maharashtra'}<br/>
                    400001
                  </p>
                </div>
                <div className="border border-earth-100 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard size={16} className="text-terracotta-500" />
                    <h3 className="font-bold text-sm text-earth-900 uppercase tracking-wider">Payment Method</h3>
                  </div>
                  <p className="text-sm text-earth-600 leading-relaxed font-light mb-1">UPI - {user?.upi || 'Linked Account'}</p>
                  <p className="text-xs text-forest-700 bg-forest-50 inline-block px-2 py-1 rounded font-medium">Protected by TruthMark</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button 
                  onClick={closeModals}
                  className="flex-1 py-3.5 border border-earth-200 text-earth-700 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-earth-50 transition-colors"
                >
                  Close
                </button>
                {selectedOrder.status !== 'return requested' && selectedOrder.status !== 'returned' && selectedOrder.status !== 'cancelled' && (
                  <button 
                    onClick={() => openReturnFlow(selectedOrder)}
                    className="flex-1 py-3.5 bg-earth-900 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-terracotta-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCcw size={14} /> Return Order
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Guided Return Flow Modal ── */}
      <AnimatePresence>
        {returnOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-earth-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-earth-50 px-8 py-6 border-b border-earth-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif font-bold text-earth-900">Return Request</h2>
                  <p className="text-xs text-earth-500 mt-1 font-mono">#HK-{returnOrder._id.slice(-8).toUpperCase()}</p>
                </div>
                {returnStep !== 4 && (
                  <button onClick={closeModals} className="text-earth-400 hover:text-earth-900 transition-colors">
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Step Content */}
              <div className="p-8">
                {/* Visual Step Progress */}
                {returnStep < 4 && (
                  <div className="flex items-center justify-between mb-8 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-earth-100 z-0 rounded-full" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-terracotta-600 z-0 rounded-full transition-all duration-500" style={{ width: `${((returnStep - 1) / 2) * 100}%` }} />
                    
                    {[1, 2, 3].map((step) => (
                      <div key={step} className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        returnStep >= step ? 'bg-terracotta-600 text-white' : 'bg-earth-100 text-earth-400'
                      }`}>
                        {step}
                      </div>
                    ))}
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {/* Step 1: Reason */}
                  {returnStep === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h3 className="font-bold text-earth-900 mb-4 flex items-center gap-2"><AlertCircle size={16} className="text-terracotta-500" /> Select reason for return</h3>
                      <div className="space-y-3 mb-6">
                        {['Item arrived damaged', 'Not as described', 'Quality issues', 'Changed my mind'].map((reason) => (
                          <label 
                            key={reason} 
                            onClick={() => setReturnReason(reason)}
                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                              returnReason === reason ? 'border-terracotta-500 bg-terracotta-50' : 'border-earth-200 hover:bg-earth-50'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${returnReason === reason ? 'border-terracotta-600' : 'border-earth-300'}`}>
                              {returnReason === reason && <div className="w-2 h-2 rounded-full bg-terracotta-600" />}
                            </div>
                            <span className="text-sm font-medium text-earth-800">{reason}</span>
                          </label>
                        ))}
                      </div>
                      <div className="mb-6">
                        <p className="text-xs font-bold text-earth-600 mb-2 uppercase tracking-wider">Additional Comments (Optional)</p>
                        <textarea 
                          value={returnComments}
                          onChange={(e) => setReturnComments(e.target.value)}
                          className="w-full border border-earth-200 rounded-xl p-3 text-sm focus:outline-none focus:border-terracotta-500 resize-none h-24 bg-white"
                          placeholder="Please provide more details..."
                        />
                      </div>
                      <button 
                        disabled={!returnReason}
                        onClick={() => setReturnStep(2)}
                        className="w-full py-4 bg-earth-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-terracotta-600 transition-colors disabled:opacity-50 disabled:hover:bg-earth-900"
                      >
                        Continue to Pickup
                      </button>
                    </motion.div>
                  )}

                  {/* Step 2: Pickup Details */}
                  {returnStep === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h3 className="font-bold text-earth-900 mb-4 flex items-center gap-2"><Truck size={16} className="text-terracotta-500" /> Confirm Pickup Details</h3>
                      
                      <div className="bg-earth-50 p-5 rounded-2xl border border-earth-100 mb-6 relative">
                        <div className="absolute top-4 right-4 text-[10px] bg-green-100 text-green-700 font-bold px-2 py-1 rounded uppercase tracking-wider">Free</div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-earth-400 mb-2">Pickup Address</p>
                        <p className="text-sm font-medium text-earth-900 mb-1">{user?.name}</p>
                        <p className="text-sm text-earth-600 leading-relaxed font-light">
                          123, Craftsvilla Apartment<br/>
                          {user?.location || 'Mumbai, Maharashtra'}<br/>
                          400001
                        </p>
                        <p className="text-sm text-earth-600 mt-2 font-medium flex items-center gap-2"><Phone size={14}/> {user?.phone || '+91 9876543210'}</p>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mb-8 flex items-start gap-3">
                        <Clock size={16} className="text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-800 leading-relaxed">
                          Pickup will be scheduled within <strong>2-3 business days</strong>. Please keep the item packed in its original packaging.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => setReturnStep(1)} className="px-6 py-4 border border-earth-200 text-earth-600 rounded-xl text-xs font-bold uppercase tracking-widest">Back</button>
                        <button onClick={() => setReturnStep(3)} className="flex-1 py-4 bg-earth-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-terracotta-600 transition-colors">Confirm & Next</button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Review Refund */}
                  {returnStep === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h3 className="font-bold text-earth-900 mb-6 flex items-center gap-2"><CreditCard size={16} className="text-terracotta-500" /> Review Refund Summary</h3>
                      
                      <div className="bg-earth-50 rounded-2xl p-6 border border-earth-100 mb-8">
                        <div className="space-y-3 text-sm text-earth-600 mb-4 pb-4 border-b border-earth-200">
                          <div className="flex justify-between">
                            <span>Item Total</span>
                            <span>₹{returnOrder.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-green-700">
                            <span>Return Shipping</span>
                            <span>Free</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-earth-400 mb-0.5">Total Refund amount</p>
                            <p className="text-xs text-earth-500">to {user?.upi || 'Original Payment Mode'}</p>
                          </div>
                          <p className="text-2xl font-serif font-bold text-earth-900">₹{returnOrder.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => setReturnStep(2)} className="px-6 py-4 border border-earth-200 text-earth-600 rounded-xl text-xs font-bold uppercase tracking-widest">Back</button>
                        <button onClick={handleReturnSubmit} className="flex-1 py-4 bg-terracotta-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-terracotta-700 transition-[background,transform] active:scale-95 shadow-lg shadow-terracotta-600/30">Submit Return Request</button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Success Message */}
                  {returnStep === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-600" />
                      </div>
                      <h2 className="text-2xl font-serif font-bold text-earth-900 mb-2">Return Initiated</h2>
                      <p className="text-earth-600 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
                        Your return request for order <span className="font-mono font-bold text-earth-800">#HK-{returnOrder._id.slice(-8).toUpperCase()}</span> has been placed. You will receive an email confirmation shortly detailing pickup.
                      </p>
                      <button onClick={closeModals} className="px-8 py-4 bg-earth-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-earth-800 transition-colors">
                        Back to Dashboard
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default BuyerDashboard;
