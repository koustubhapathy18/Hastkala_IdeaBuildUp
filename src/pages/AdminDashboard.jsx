import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, ShieldAlert, ShoppingBag, TrendingUp, Search, X, Clock, CheckCircle2, XCircle, AlertTriangle, MapPin, Palette, Wallet, Eye, Package, ChevronDown } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'artisans' | 'buyers'
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      if (!token) { navigate('/admin/login'); return; }
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      } else {
        setError('Failed to fetch data from the server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const toggleBan = async (userId, currentStatus) => {
    try {
      await axios.put(`/api/admin/users/${userId}/ban`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u._id === userId ? { ...u, isBanned: !currentStatus } : u));
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, isBanned: !currentStatus });
      }
      showSuccess(`User ${currentStatus ? 'restored' : 'suspended'} successfully`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const handleArtisanStatus = async (userId, newStatus) => {
    try {
      await axios.put(`/api/admin/artisans/${userId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
      showSuccess(`Artisan ${newStatus === 'active' ? 'approved' : 'rejected'} successfully`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update artisan status.');
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'pending') return user.role === 'artisan' && user.status === 'pending' && matchesSearch;
    if (activeTab === 'artisans') return user.role === 'artisan' && matchesSearch;
    if (activeTab === 'buyers') return user.role === 'buyer' && matchesSearch;
    return matchesSearch;
  });

  // Stats
  const pendingCount = users.filter(u => u.role === 'artisan' && u.status === 'pending').length;
  const stats = [
    { label: 'Total Users', value: users.length, icon: <Users size={20} className="text-terracotta-500" /> },
    { label: 'Active Artisans', value: users.filter(u => u.role === 'artisan' && u.status === 'active').length, icon: <ShoppingBag size={20} className="text-forest-500" /> },
    { label: 'Platform Buyers', value: users.filter(u => u.role === 'buyer').length, icon: <TrendingUp size={20} className="text-earth-500" /> },
    { label: 'Pending Applications', value: pendingCount, icon: <Clock size={20} className="text-amber-500" />, highlight: pendingCount > 0 }
  ];

  const getStatusBadge = (user) => {
    if (user.isBanned) return { text: 'Suspended', cls: 'bg-red-100 text-red-800' };
    if (user.role === 'artisan') {
      if (user.status === 'pending') return { text: 'Pending Review', cls: 'bg-amber-100 text-amber-800' };
      if (user.status === 'rejected') return { text: 'Rejected', cls: 'bg-red-100 text-red-700' };
      if (user.status === 'active') return { text: 'Approved', cls: 'bg-forest-100 text-forest-800' };
    }
    if (user.role === 'admin') return { text: 'Admin', cls: 'bg-terracotta-100 text-terracotta-800' };
    return { text: 'Buyer', cls: 'bg-earth-100 text-earth-700' };
  };

  const tabs = [
    { id: 'all', label: 'All Users', count: users.length },
    { id: 'pending', label: 'Pending', count: pendingCount, pulse: pendingCount > 0 },
    { id: 'artisans', label: 'Artisans', count: users.filter(u => u.role === 'artisan').length },
    { id: 'buyers', label: 'Buyers', count: users.filter(u => u.role === 'buyer').length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-earth-900 text-earth-50 flex flex-col shadow-xl z-20 sticky top-0 md:h-screen">
        <div className="p-6 border-b border-earth-800 flex items-center gap-3">
          <ShieldAlert size={24} className="text-terracotta-500" />
          <span className="font-serif text-xl font-bold tracking-widest">PORTAL</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('all')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-earth-800 text-earth-50' : 'text-earth-400 hover:bg-earth-800 hover:text-earth-50'}`}
          >
            <Users size={18} /> All Users
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors relative ${activeTab === 'pending' ? 'bg-earth-800 text-earth-50' : 'text-earth-400 hover:bg-earth-800 hover:text-earth-50'}`}
          >
            <Clock size={18} /> Pending Applications
            {pendingCount > 0 && (
              <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('artisans')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${activeTab === 'artisans' ? 'bg-earth-800 text-earth-50' : 'text-earth-400 hover:bg-earth-800 hover:text-earth-50'}`}
          >
            <Palette size={18} /> Artisans
          </button>
          <button 
            onClick={() => setActiveTab('buyers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${activeTab === 'buyers' ? 'bg-earth-800 text-earth-50' : 'text-earth-400 hover:bg-earth-800 hover:text-earth-50'}`}
          >
            <ShoppingBag size={18} /> Buyers
          </button>
        </nav>

        <div className="p-4 border-t border-earth-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-earth-400 hover:text-white hover:bg-red-900/50 rounded transition-colors text-sm font-medium"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-earth-900 mb-2">System Dashboard</h1>
          <p className="text-earth-600">Manage users, review artisan applications, and monitor platform health.</p>
        </div>

        {/* Toast Notifications */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}><X size={16} /></button>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-forest-50 border-l-4 border-forest-500 text-forest-700 rounded-r-lg flex items-center gap-2">
            <CheckCircle2 size={16} /> {success}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={`bg-white p-5 rounded-xl shadow-sm border flex items-center justify-between cursor-pointer transition-all hover:shadow-md ${stat.highlight ? 'border-amber-300 ring-1 ring-amber-200' : 'border-earth-100'}`}
              onClick={() => stat.label === 'Pending Applications' && setActiveTab('pending')}
            >
              <div>
                <p className="text-earth-500 text-xs font-medium mb-1 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-bold text-earth-900">{stat.value}</h3>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.highlight ? 'bg-amber-50' : 'bg-earth-50'}`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Tab Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-earth-900 text-white shadow-md' 
                  : 'bg-white text-earth-600 border border-earth-200 hover:bg-earth-100'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-earth-100'
              } ${tab.pulse ? 'animate-pulse bg-amber-200 text-amber-800' : ''}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Pending Banner */}
        {activeTab === 'pending' && pendingCount > 0 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800">{pendingCount} artisan(s) awaiting your review</p>
              <p className="text-xs text-amber-700 mt-1">Click "View" on any artisan to review their full profile and approve or reject their application.</p>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-earth-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-earth-50/50">
            <h2 className="text-lg font-bold text-earth-900">
              {activeTab === 'pending' ? 'Pending Applications' : activeTab === 'artisans' ? 'Artisan Directory' : activeTab === 'buyers' ? 'Buyer Directory' : 'User Directory'}
            </h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="pl-10 pr-4 py-2 border border-earth-200 rounded-lg text-sm focus:outline-none focus:border-terracotta-500 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-earth-50/30 text-earth-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Name</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Joined</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const badge = getStatusBadge(user);
                    return (
                      <tr key={user._id} className={`hover:bg-earth-50/50 transition-colors ${user.status === 'pending' ? 'bg-amber-50/30' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-earth-200 overflow-hidden shrink-0">
                              <img src={user.image || 'https://images.unsplash.com/photo-1620188989504-20d0f4d34cd6?q=80&w=100&auto=format&fit=crop'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-medium text-earth-900">{user.name || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-earth-600 text-sm">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-terracotta-100 text-terracotta-800' :
                            user.role === 'artisan' ? 'bg-forest-100 text-forest-800' :
                            'bg-earth-200 text-earth-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}>
                            {badge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-earth-500 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap space-x-2">
                          <button 
                            onClick={() => setSelectedUser(user)}
                            className="text-terracotta-600 hover:text-terracotta-900 transition-colors font-bold"
                          >
                            View
                          </button>
                          {user.role === 'artisan' && user.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleArtisanStatus(user._id, 'active')}
                                className="text-forest-600 hover:text-forest-900 transition-colors font-bold"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleArtisanStatus(user._id, 'rejected')}
                                className="text-red-500 hover:text-red-700 transition-colors font-bold"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {user.role !== 'admin' && user.status !== 'pending' && (
                            <button 
                              onClick={() => toggleBan(user._id, user.isBanned)}
                              className={`${user.isBanned ? 'text-forest-600 hover:text-forest-900' : 'text-red-500 hover:text-red-700'} transition-colors font-bold`}
                            >
                              {user.isBanned ? 'Restore' : 'Suspend'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-14 text-center">
                      <div className="text-earth-400">
                        {activeTab === 'pending' ? (
                          <>
                            <CheckCircle2 size={40} className="mx-auto mb-3 text-forest-400" />
                            <p className="font-bold text-earth-600">All caught up!</p>
                            <p className="text-sm mt-1">No pending artisan applications.</p>
                          </>
                        ) : (
                          <p>No users found matching your search.</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── Artisan Detail Modal ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth-900/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col animate-in fade-in duration-200" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-earth-100 bg-earth-50/50">
              <h3 className="text-xl font-serif font-bold text-earth-900">
                {selectedUser.role === 'artisan' ? 'Artisan Application' : 'User Details'}
              </h3>
              <button onClick={() => setSelectedUser(null)} className="text-earth-400 hover:text-earth-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-earth-200 overflow-hidden flex-shrink-0 shadow-lg ring-4 ring-white">
                   <img src={selectedUser.image || 'https://images.unsplash.com/photo-1620188989504-20d0f4d34cd6?q=80&w=200&auto=format&fit=crop'} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-earth-900">{selectedUser.name || 'N/A'}</h4>
                  <p className="text-sm text-earth-500">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedUser.role === 'artisan' ? 'bg-forest-100 text-forest-800' :
                      selectedUser.role === 'admin' ? 'bg-terracotta-100 text-terracotta-800' :
                      'bg-earth-200 text-earth-800'
                    }`}>
                      {selectedUser.role}
                    </span>
                    {(() => { const b = getStatusBadge(selectedUser); return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${b.cls}`}>{b.text}</span>; })()}
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="bg-earth-50 rounded-xl p-4 space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-earth-500 text-sm font-medium flex items-center gap-2"><Clock size={14} /> Joined</span>
                  <span className="text-earth-900 text-sm">{new Date(selectedUser.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              {/* Artisan-Specific Details */}
              {selectedUser.role === 'artisan' && (
                <div className="space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-earth-500 mt-4 mb-2">Artisan Profile</h5>
                  
                  <div className="bg-earth-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-earth-500 text-sm font-medium flex items-center gap-2"><MapPin size={14} /> Location</span>
                      <span className="text-earth-900 text-sm font-medium">{selectedUser.location || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-earth-500 text-sm font-medium flex items-center gap-2"><Palette size={14} /> Craft Specialty</span>
                      <span className="text-earth-900 text-sm font-medium">{selectedUser.specialty || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-earth-500 text-sm font-medium flex items-center gap-2"><Wallet size={14} /> UPI ID</span>
                      <span className="text-earth-900 text-sm font-mono">{selectedUser.upi || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-earth-500 text-sm font-medium flex items-center gap-2"><CheckCircle2 size={14} /> Verified</span>
                      <span className={`text-sm font-bold ${selectedUser.isVerified ? 'text-forest-600' : 'text-amber-600'}`}>
                        {selectedUser.isVerified ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <h5 className="text-xs font-bold uppercase tracking-widest text-earth-500 mt-4 mb-2">Performance</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-earth-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-earth-900">₹{selectedUser.metrics?.totalEarnings?.toLocaleString() || 0}</p>
                      <p className="text-xs text-earth-500 font-medium mt-1">Total Earnings</p>
                    </div>
                    <div className="bg-earth-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-earth-900">{selectedUser.metrics?.pendingOrders || 0}</p>
                      <p className="text-xs text-earth-500 font-medium mt-1">Pending Orders</p>
                    </div>
                    <div className="bg-earth-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-earth-900">{selectedUser.liveProducts?.length || 0}</p>
                      <p className="text-xs text-earth-500 font-medium mt-1">Listed Products</p>
                    </div>
                    <div className="bg-earth-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-earth-900">₹{selectedUser.metrics?.priceMirrorSavings?.toLocaleString() || 0}</p>
                      <p className="text-xs text-earth-500 font-medium mt-1">AI Savings</p>
                    </div>
                  </div>

                  {/* Products Preview */}
                  {selectedUser.liveProducts?.length > 0 && (
                    <>
                      <h5 className="text-xs font-bold uppercase tracking-widest text-earth-500 mt-4 mb-2">Listed Products</h5>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedUser.liveProducts.map((prod, i) => (
                          <div key={i} className="flex items-center gap-3 bg-earth-50 rounded-lg p-3">
                            <div className="w-10 h-10 rounded-lg bg-white overflow-hidden shrink-0 border border-earth-200">
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-earth-900 truncate">{prod.name}</p>
                              <p className="text-xs text-earth-500">₹{prod.price?.toLocaleString()} · Stock: {prod.stock}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs text-earth-500 flex items-center gap-1"><Eye size={12} />{prod.views || 0}</p>
                              <p className="text-xs text-earth-500 flex items-center gap-1"><Package size={12} />{prod.orders || 0}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Footer Actions */}
            <div className="p-6 border-t border-earth-100 bg-earth-50 flex flex-wrap justify-between items-center gap-3">
              <div className="flex gap-2">
                {/* Approve/Reject for pending artisans */}
                {selectedUser.role === 'artisan' && selectedUser.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleArtisanStatus(selectedUser._id, 'active')}
                      className="px-5 py-2.5 text-sm font-bold uppercase tracking-wider rounded-lg bg-forest-600 text-white hover:bg-forest-700 transition-colors shadow-sm flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} /> Approve
                    </button>
                    <button 
                      onClick={() => handleArtisanStatus(selectedUser._id, 'rejected')}
                      className="px-5 py-2.5 text-sm font-bold uppercase tracking-wider rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
                {/* Suspend/Restore for active users */}
                {selectedUser.role !== 'admin' && selectedUser.status !== 'pending' && (
                  <button 
                    onClick={() => toggleBan(selectedUser._id, selectedUser.isBanned)}
                    className={`px-4 py-2.5 text-sm font-bold uppercase tracking-wider rounded-lg border transition-colors flex items-center gap-2 ${
                      selectedUser.isBanned 
                        ? 'border-forest-200 text-forest-700 bg-forest-50 hover:bg-forest-100' 
                        : 'border-red-200 text-red-700 bg-red-50 hover:bg-red-100'
                    }`}
                  >
                    {selectedUser.isBanned ? <><CheckCircle2 size={16} /> Restore Access</> : <><AlertTriangle size={16} /> Suspend Account</>}
                  </button>
                )}
              </div>
              <button 
                onClick={() => setSelectedUser(null)} 
                className="px-6 py-2.5 bg-earth-900 text-white text-sm font-bold uppercase tracking-wider rounded-lg border border-earth-900 hover:bg-white hover:text-earth-900 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
