import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, ShieldAlert, ShoppingBag, TrendingUp, Search, X } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin/login');
          return;
        }

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

    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const toggleBan = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/users/${userId}/ban`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setUsers(users.map(u => 
        u._id === userId ? { ...u, isBanned: !currentStatus } : u
      ));
      
      // Update selected user if modal is currently open
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, isBanned: !currentStatus });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Users', value: users.length, icon: <Users size={20} className="text-terracotta-500" /> },
    { label: 'Active Artisans', value: users.filter((u) => u.role === 'artisan').length, icon: <ShoppingBag size={20} className="text-forest-500" /> },
    { label: 'Platform Buyers', value: users.filter((u) => u.role === 'buyer').length, icon: <TrendingUp size={20} className="text-earth-500" /> }
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
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-earth-800 rounded text-earth-50 hover:bg-earth-700 transition-colors text-sm font-medium">
            <Users size={18} /> User Management
          </button>
          {/* Add more nav items if needed in future */}
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
          <p className="text-earth-600">Overview of platform users and artisans.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-earth-100 flex items-center justify-between">
              <div>
                <p className="text-earth-500 text-sm font-medium mb-1 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-bold text-earth-900">{stat.value}</h3>
              </div>
              <div className="w-12 h-12 bg-earth-50 rounded-full flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-earth-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-earth-50/50">
            <h2 className="text-lg font-bold text-earth-900">User Directory</h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
              <input
                type="text"
                placeholder="Search users..."
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
                  <th className="px-6 py-4 font-bold">Joined</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-earth-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-earth-900">{user.name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-earth-600 text-sm">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isBanned ? 'bg-red-100 text-red-800' :
                          user.role === 'admin' ? 'bg-terracotta-100 text-terracotta-800' :
                          user.role === 'artisan' ? 'bg-forest-100 text-forest-800' :
                          'bg-earth-200 text-earth-800'
                        }`}>
                          {user.isBanned ? 'Suspended' : user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-earth-500 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="text-terracotta-600 hover:text-terracotta-900 transition-colors mr-4"
                        >
                          View
                        </button>
                        {user.role !== 'admin' && (
                          <button 
                            onClick={() => toggleBan(user._id, user.isBanned)}
                            className={`${user.isBanned ? 'text-forest-600 hover:text-forest-900' : 'text-red-500 hover:text-red-700'} transition-colors`}
                          >
                            {user.isBanned ? 'Restore' : 'Suspend'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-earth-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col pt-0 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-earth-100 bg-earth-50/50">
              <h3 className="text-xl font-serif font-bold text-earth-900">User Details</h3>
              <button onClick={() => setSelectedUser(null)} className="text-earth-400 hover:text-earth-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-earth-200 overflow-hidden flex-shrink-0 shadow-inner">
                   <img src={selectedUser.image || 'https://images.unsplash.com/photo-1620188989504-20d0f4d34cd6?q=80&w=2070&auto=format&fit=crop'} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-earth-900">{selectedUser.name || 'N/A'}</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    selectedUser.isBanned ? 'bg-red-100 text-red-800' :
                    selectedUser.role === 'admin' ? 'bg-terracotta-100 text-terracotta-800' :
                    selectedUser.role === 'artisan' ? 'bg-forest-100 text-forest-800' :
                    'bg-earth-200 text-earth-800'
                  }`}>
                    {selectedUser.isBanned ? 'Suspended' : selectedUser.role}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between border-b border-earth-100 pb-3">
                  <span className="text-earth-500 text-sm font-medium">Email Address</span>
                  <span className="text-earth-900 text-sm font-medium">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between border-b border-earth-100 pb-3">
                  <span className="text-earth-500 text-sm font-medium">Joined Date</span>
                  <span className="text-earth-900 text-sm">{new Date(selectedUser.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                
                {selectedUser.role === 'artisan' && (
                  <>
                    <div className="flex justify-between border-b border-earth-100 pb-3">
                      <span className="text-earth-500 text-sm font-medium">Location</span>
                      <span className="text-earth-900 text-sm">{selectedUser.location || 'Not Specified'}</span>
                    </div>
                    <div className="flex justify-between border-b border-earth-100 pb-3">
                      <span className="text-earth-500 text-sm font-medium">Craft Specialty</span>
                      <span className="text-earth-900 text-sm">{selectedUser.specialty || 'Not Specified'}</span>
                    </div>
                    {selectedUser.upi && (
                      <div className="flex justify-between border-b border-earth-100 pb-3">
                        <span className="text-earth-500 text-sm font-medium">UPI ID</span>
                        <span className="text-earth-900 text-sm font-mono">{selectedUser.upi}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-earth-100 pb-3">
                      <span className="text-earth-500 text-sm font-medium">Total Earnings</span>
                      <span className="text-earth-900 text-sm font-bold text-terracotta-600">₹{selectedUser.metrics?.totalEarnings?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between pb-3">
                      <span className="text-earth-500 text-sm font-medium">Pending Orders</span>
                      <span className="text-earth-900 text-sm">{selectedUser.metrics?.pendingOrders || 0}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-earth-100 bg-earth-50 flex justify-between items-center">
              {selectedUser.role !== 'admin' ? (
                <button 
                  onClick={() => toggleBan(selectedUser._id, selectedUser.isBanned)}
                  className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded border transition-colors ${
                    selectedUser.isBanned 
                      ? 'border-forest-200 text-forest-700 bg-forest-50 hover:bg-forest-100' 
                      : 'border-red-200 text-red-700 bg-red-50 hover:bg-red-100'
                  }`}
                >
                  {selectedUser.isBanned ? 'Restore Access' : 'Suspend Account'}
                </button>
              ) : (
                <div />
              )}
              <button 
                onClick={() => setSelectedUser(null)} 
                className="px-6 py-2.5 bg-earth-900 text-white text-sm font-bold uppercase tracking-wider rounded border border-earth-900 hover:bg-white hover:text-earth-900 transition-colors shadow-sm"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
