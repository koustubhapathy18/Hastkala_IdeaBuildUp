import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, ShieldCheck } from 'lucide-react';

const AdminSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: '', color: 'bg-transparent', width: 'w-0' };
    let score = 0;
    if (pass.length > 5) score += 1;
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/4', text: 'text-red-400' };
    if (score === 2) return { label: 'Medium', color: 'bg-orange-400', width: 'w-2/4', text: 'text-orange-400' };
    if (score === 3) return { label: 'Good', color: 'bg-yellow-400', width: 'w-3/4', text: 'text-yellow-400' };
    return { label: 'Strong', color: 'bg-green-400', width: 'w-full', text: 'text-green-400' };
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        role: 'admin'
      });
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        if (decoded.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          setError('Failed to create admin profile.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-terracotta-900/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-forest-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="w-full max-w-md bg-earth-800 rounded-2xl shadow-2xl overflow-hidden border border-earth-700 relative z-10">
        
        <div className="p-8 pb-6 border-b border-earth-700 bg-earth-800/80">
          <Link to="/" className="text-earth-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium mb-8">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          
          <div className="flex items-center gap-3 mb-2 text-terracotta-400">
            <ShieldCheck size={28} />
            <span className="font-serif text-2xl font-bold text-white tracking-widest">ADMIN PORTAL</span>
          </div>
          <p className="text-earth-400 text-sm">Create a new system administrator account.</p>
        </div>

        <div className="p-8 pt-6">
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            
            <div className="relative">
              <label className="block text-xs font-bold text-earth-300 uppercase tracking-wider mb-2">Admin Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400 pointer-events-none" />
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3 bg-earth-900 border border-earth-700 rounded text-white focus:outline-none focus:border-terracotta-500 transition-all placeholder-earth-500"
                  placeholder="Master Admin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-bold text-earth-300 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400 pointer-events-none" />
                <input
                  type="email"
                  className="w-full pl-11 pr-4 py-3 bg-earth-900 border border-earth-700 rounded text-white focus:outline-none focus:border-terracotta-500 transition-all placeholder-earth-500"
                  placeholder="admin@hastkala.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-bold text-earth-300 uppercase tracking-wider mb-2">Secure Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400 pointer-events-none" />
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-3 bg-earth-900 border border-earth-700 rounded text-white focus:outline-none focus:border-terracotta-500 transition-all placeholder-earth-500"
                  placeholder="Encryption key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-earth-500 uppercase tracking-widest font-bold">Security Level</span>
                    <span className={`text-[10px] uppercase tracking-widest font-bold ${getPasswordStrength(password).text}`}>
                      {getPasswordStrength(password).label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-earth-900 border border-earth-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getPasswordStrength(password).color} ${getPasswordStrength(password).width} transition-all duration-300`} 
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center bg-red-900/30 border border-red-800 rounded px-4 py-2 mt-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-terracotta-600 text-white font-bold uppercase tracking-widest py-4 rounded mt-4 hover:bg-terracotta-500 transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authorizing...' : 'Create Admin Account'}
            </button>
          </form>

          <p className="text-center text-sm text-earth-400 mt-6">
            Already an admin?{' '}
            <Link to="/admin/login" className="font-bold text-terracotta-400 hover:text-terracotta-300">
              Access Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
