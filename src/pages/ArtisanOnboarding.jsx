import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Upload, CreditCard, CheckCircle2, QrCode } from 'lucide-react';

const craftTypes = [
  'Textiles & Weaving', 'Pottery & Ceramics', 'Wood Carving',
  'Metal Work', 'Painting', 'Jewellery', 'Bamboo & Cane'
];

const ArtisanOnboarding = () => {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Collect all form data in state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    specialty: craftTypes[0],
    upi: ''
  });

  const updateField = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!formData.name.trim() || !formData.phone.trim() || !formData.specialty.trim() || !formData.location.trim()) {
        setError('Please fill all mandatory fields marked with *');
        return;
      }
    } else if (step === 3) {
      if (!formData.upi.trim()) {
        setError('Please provide your UPI ID *');
        return;
      }
    }
    if (step < 4) setStep(step + 1);
  };

  const finishOnboarding = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/artisans/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          location: formData.location,
          specialty: formData.specialty,
          upi: formData.upi,
        })
      });
      localStorage.setItem('hasOnboarded', 'true');
    } catch (err) {
      console.error('Failed to save profile', err);
    } finally {
      setIsSaving(false);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-3xl">

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-6 border border-earth-200">
            <QrCode size={32} className="text-forest-600" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-earth-900 mb-4">TruthMark Verification</h1>
          <p className="text-earth-600 text-lg max-w-xl mx-auto">
            Complete this once to earn your TruthMark badge and start selling directly.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-earth-200 -z-10 transform -translate-y-1/2" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-terracotta-500 -z-10 transform -translate-y-1/2 transition-all duration-500"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
          {[{ num: 1, label: 'Details' }, { num: 2, label: 'Documents' }, { num: 3, label: 'Wallet' }, { num: 4, label: 'Status' }].map(s => (
            <div key={s.num} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-serif text-lg transition-colors duration-300 ${step >= s.num ? 'bg-terracotta-500 text-white shadow-md' : 'bg-earth-100 text-earth-400 border border-earth-300'}`}>
                {step > s.num ? <CheckCircle2 size={20} /> : s.num}
              </div>
              <span className={`text-xs font-bold uppercase mt-3 tracking-wider ${step >= s.num ? 'text-earth-900' : 'text-earth-400'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-xl border border-earth-100 p-8 lg:p-12 overflow-hidden relative">
          <AnimatePresence mode="wait">

            {/* STEP 1: Personal Details */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-serif font-bold text-earth-900 mb-2">Personal & Craft Details</h2>
                <p className="text-sm text-terracotta-600 mb-6 italic">* means must have to fill</p>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-earth-700 uppercase tracking-wider mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => updateField('name', e.target.value)}
                        className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded focus:border-terracotta-500 focus:outline-none"
                        placeholder="e.g., Kamla Devi"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-earth-700 uppercase tracking-wider mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => updateField('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded focus:border-terracotta-500 focus:outline-none"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-earth-700 uppercase tracking-wider mb-2">Craft Type *</label>
                    <select
                      value={formData.specialty}
                      onChange={e => updateField('specialty', e.target.value)}
                      className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded focus:border-terracotta-500 focus:outline-none"
                    >
                      {craftTypes.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-earth-700 uppercase tracking-wider mb-2">Village / Location *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={e => updateField('location', e.target.value)}
                      className="w-full px-4 py-3 bg-earth-50 border border-earth-200 rounded focus:border-terracotta-500 focus:outline-none"
                      placeholder="e.g., Raghurajpur, Odisha"
                    />
                  </div>
                </div>
                <div className="mt-10 flex flex-col items-end gap-3">
                  {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                  <button onClick={handleNext} className="bg-earth-900 text-white px-8 py-3 rounded font-bold uppercase tracking-wider hover:bg-terracotta-700 transition-colors">
                    Save & Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Documents */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-serif font-bold text-earth-900 mb-2">Upload Proof of Authenticity</h2>
                <p className="text-earth-600 mb-8 text-sm">This is exactly what stops counterfeits. Your identity guarantees the product's value.</p>
                <div className="space-y-6">
                  <label className="border-2 border-dashed border-earth-300 bg-earth-50 rounded-lg p-8 text-center hover:bg-earth-100 transition-colors cursor-pointer group block">
                    <input type="file" accept="image/*,.pdf" className="hidden" />
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                      <Upload className="text-terracotta-500" />
                    </div>
                    <p className="font-bold text-earth-900 mb-1">Government ID (Aadhaar)</p>
                    <p className="text-xs text-earth-500 uppercase tracking-wider">Click to browse or drag and drop</p>
                  </label>
                  <label className="border-2 border-dashed border-earth-300 bg-earth-50 rounded-lg p-8 text-center hover:bg-earth-100 transition-colors cursor-pointer group block">
                    <input type="file" accept="image/*" className="hidden" />
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                      <Upload className="text-forest-500" />
                    </div>
                    <p className="font-bold text-earth-900 mb-1">A Photo of You Working</p>
                    <p className="text-xs text-earth-500 uppercase tracking-wider">This will be shown on TruthMark QR scans</p>
                  </label>
                </div>
                <div className="mt-10 flex justify-between">
                  <button onClick={() => { setError(''); setStep(step - 1); }} className="text-earth-600 font-bold uppercase tracking-wider px-6 py-3 hover:bg-earth-100 rounded transition-colors">Back</button>
                  <button onClick={handleNext} className="bg-earth-900 text-white px-8 py-3 rounded font-bold uppercase tracking-wider hover:bg-terracotta-700 transition-colors">Upload & Continue</button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Wallet */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-serif font-bold text-earth-900">Direct Earnings Wallet</h2>
                  <span className="bg-forest-100 text-forest-700 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">100% Direct</span>
                </div>
                <p className="text-earth-600 mb-8 text-sm">Set up your Aadhaar-linked bank details. 100% of the product price goes directly here.</p>
                <div className="bg-earth-800 text-white p-6 rounded-xl mb-8 relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <CreditCard size={32} className="text-terracotta-400 mb-6" />
                  <div>
                    <label className="block text-xs font-bold text-earth-400 uppercase tracking-wider mb-1">Aadhaar Linked UPI ID *</label>
                    <input
                      type="text"
                      value={formData.upi}
                      onChange={e => updateField('upi', e.target.value)}
                      className="w-full bg-earth-900/50 border border-earth-600 rounded px-4 py-2 text-white focus:outline-none focus:border-terracotta-500 text-lg tracking-widest"
                      placeholder="9876543210@upi"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-terracotta-50 rounded border border-terracotta-100">
                  <ShieldCheck className="text-terracotta-600 mt-0.5" size={20} />
                  <p className="text-sm text-terracotta-900 leading-relaxed font-medium">By linking this account, you confirm sole access to the funds, supporting our mission against financial exploitation.</p>
                </div>
                <div className="mt-10 flex flex-col gap-3">
                  {error && <p className="text-red-500 text-sm font-medium text-right">{error}</p>}
                  <div className="flex justify-between w-full">
                    <button onClick={() => { setError(''); setStep(step - 1); }} className="text-earth-600 font-bold uppercase tracking-wider px-6 py-3 hover:bg-earth-100 rounded transition-colors">Back</button>
                    <button onClick={handleNext} className="bg-earth-900 text-white px-8 py-3 rounded font-bold uppercase tracking-wider hover:bg-terracotta-700 transition-colors">Link Bank Account</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Status */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-24 h-24 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck size={48} className="text-forest-600" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-earth-900 mb-4">Verification Pending</h2>
                <p className="text-earth-600 mb-8 max-w-md mx-auto">
                  Your identity and craft details are being verified. Once approved, you'll receive the TruthMark badge and can start selling.
                </p>
                <div className="inline-block bg-earth-50 p-6 rounded-lg text-left border border-earth-200 mb-10 w-full max-w-md">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-earth-900 mb-4 border-b border-earth-200 pb-2">What Happens Next?</h3>
                  <ul className="space-y-3 text-sm text-earth-700">
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-terracotta-500 rounded-full mt-1.5" />We match your details with government registries.</li>
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-terracotta-500 rounded-full mt-1.5" />A TruthMark QR code profile is generated for you.</li>
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-terracotta-500 rounded-full mt-1.5" /><span className="font-bold text-earth-900">SchemeGPT automatically checks</span> if you are eligible for any welfare funds (e.g., PM Vishwakarma).</li>
                  </ul>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={finishOnboarding}
                    disabled={isSaving}
                    className="bg-earth-900 text-white px-10 py-4 rounded font-bold uppercase tracking-wider hover:bg-terracotta-700 transition-colors shadow-lg disabled:opacity-60"
                  >
                    {isSaving ? 'Saving Profile...' : 'Go to My Dashboard'}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ArtisanOnboarding;
