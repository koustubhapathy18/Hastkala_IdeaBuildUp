import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Upload, MapPin, Send, CheckCircle2, QrCode, Copy, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5001';

const craftTypes = [
  { value: 'kolam',       label: 'Kolam' },
  { value: 'pashmina',    label: 'Pashmina' },
  { value: 'madhubani',   label: 'Madhubani' },
  { value: 'pottery',     label: 'Pottery' },
  { value: 'weaving',     label: 'Weaving' },
  { value: 'woodwork',    label: 'Woodwork' },
  { value: 'metalwork',   label: 'Metalwork' },
  { value: 'embroidery',  label: 'Embroidery' },
  { value: 'block_print', label: 'Block Print' },
  { value: 'silk',        label: 'Silk' },
  { value: 'carpet',      label: 'Carpet' },
  { value: 'bamboo',      label: 'Bamboo Craft' },
  { value: 'stone',       label: 'Stone Carving' },
  { value: 'leather',     label: 'Leather Craft' },
  { value: 'lacquer',     label: 'Lacquer Work' },
];

const ArtisanTruthMark = () => {
  const location = useLocation();
  const productContext = location.state?.product;

  const [form, setForm] = useState({
    artisanName: productContext?.artisan || '',
    village: productContext?.village || '',
    craftType: productContext?.category?.toLowerCase() || '',
    story: '',
    lat: '',
    lng: ''
  });
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const detectGPS = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(prev => ({
          ...prev,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6)
        }));
        setGpsLoading(false);
      },
      (err) => {
        setError('GPS detection failed: ' + err.message);
        setGpsLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('artisanName', form.artisanName);
      formData.append('village', form.village);
      formData.append('craftType', form.craftType);
      formData.append('story', form.story);
      formData.append('lat', form.lat);
      formData.append('lng', form.lng);
      if (productContext?._id) {
        formData.append('productId', productContext._id);
      }
      if (photo) formData.append('photo', photo);
      if (video) formData.append('video', video);

      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/truthmark/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCode = () => {
    if (result?.truthMarkCode) {
      navigator.clipboard.writeText(result.truthMarkCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-earth-50 min-h-screen">

      {/* Hero */}
      <section className="bg-earth-900 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-forest-900/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-terracotta-900/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-900/50 border border-forest-500/30 text-forest-300 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <ShieldCheck size={16} /> Artisan Registration
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-[1.1]"
          >
            Register Your <br />
            <span className="text-forest-400">TruthMark</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-earth-300 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Register your handcrafted creation and receive a unique TruthMark authentication code, QR tag, and IPFS-backed provenance record.
          </motion.p>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Success Result */}
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-forest-50 border-2 border-forest-200 rounded-3xl p-8 mb-12 text-center"
              >
                <CheckCircle2 size={48} className="text-forest-500 mx-auto mb-4" />
                <h3 className="text-2xl font-serif font-bold text-earth-900 mb-2">
                  TruthMark Registered!
                </h3>
                <p className="text-earth-600 mb-6">Your product is now permanently authenticated.</p>

                {/* TruthMark Code */}
                <div className="bg-white rounded-2xl p-6 border border-forest-200 mb-6 inline-block">
                  <p className="text-xs text-earth-500 uppercase tracking-widest font-bold mb-2">Your TruthMark Code</p>
                  <div className="flex items-center gap-3 justify-center">
                    <span className="text-3xl font-mono font-bold text-forest-700 tracking-widest">
                      {result.truthMarkCode}
                    </span>
                    <button
                      onClick={copyCode}
                      className="p-2 rounded-lg bg-forest-100 hover:bg-forest-200 text-forest-600 transition-colors"
                      title="Copy code"
                    >
                      {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                {/* QR Code */}
                {result.qrCodeUrl && (
                  <div className="mb-6">
                    <p className="text-xs text-earth-500 uppercase tracking-widest font-bold mb-3">QR Authentication Tag</p>
                    <img
                      src={`${API_URL}${result.qrCodeUrl}`}
                      alt="TruthMark QR Code"
                      className="w-48 h-48 mx-auto rounded-xl border-4 border-white shadow-lg"
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <Link
                    to={`/verify/${result.truthMarkCode}`}
                    className="px-6 py-3 bg-forest-600 text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-forest-500 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    Verify Now <ArrowRight size={16} />
                  </Link>
                  <button
                    onClick={() => { setResult(null); setForm({ artisanName: '', village: '', craftType: '', story: '', lat: '', lng: '' }); setPhoto(null); setVideo(null); }}
                    className="px-6 py-3 bg-earth-200 text-earth-700 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-earth-300 transition-colors"
                  >
                    Register Another
                  </button>
                </div>
              </motion.div>
            )}

            {/* Form */}
            {!result && (
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-earth-100">
                <h2 className="text-2xl font-serif font-bold text-earth-900 mb-8 flex items-center gap-3">
                  <ShieldCheck size={28} className="text-forest-600" />
                  Product Registration
                </h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Name & Village */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-earth-700 uppercase tracking-wider mb-2">
                        Artisan Name *
                      </label>
                      <input
                        type="text"
                        name="artisanName"
                        value={form.artisanName}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Meena Devi"
                        className="w-full bg-earth-50 border border-earth-200 rounded-xl px-4 py-3.5 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-earth-700 uppercase tracking-wider mb-2">
                        Village / Location *
                      </label>
                      <input
                        type="text"
                        name="village"
                        value={form.village}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Thanjavur, Tamil Nadu"
                        className="w-full bg-earth-50 border border-earth-200 rounded-xl px-4 py-3.5 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Craft Type */}
                  <div>
                    <label className="block text-sm font-bold text-earth-700 uppercase tracking-wider mb-2">
                      Craft Type *
                    </label>
                    <select
                      name="craftType"
                      value={form.craftType}
                      onChange={handleChange}
                      required
                      className="w-full bg-earth-50 border border-earth-200 rounded-xl px-4 py-3.5 text-earth-900 focus:outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-colors appearance-none"
                    >
                      <option value="">Select craft type...</option>
                      {craftTypes.map(ct => (
                        <option key={ct.value} value={ct.value}>{ct.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Story */}
                  <div>
                    <label className="block text-sm font-bold text-earth-700 uppercase tracking-wider mb-2">
                      Your Story
                    </label>
                    <textarea
                      name="story"
                      value={form.story}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell the world about your craft journey, techniques used, and the heritage behind this creation..."
                      className="w-full bg-earth-50 border border-earth-200 rounded-xl px-4 py-3.5 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-colors resize-none"
                    />
                  </div>

                  {/* File Uploads */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-earth-700 uppercase tracking-wider mb-2">
                        <Upload size={14} className="inline mr-1" /> Product Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPhoto(e.target.files[0])}
                        className="w-full text-sm text-earth-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-forest-100 file:text-forest-700 hover:file:bg-forest-200 file:cursor-pointer file:transition-colors"
                      />
                      {photo && <p className="text-xs text-forest-600 mt-1">✓ {photo.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-earth-700 uppercase tracking-wider mb-2">
                        <Upload size={14} className="inline mr-1" /> Creation Video
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideo(e.target.files[0])}
                        className="w-full text-sm text-earth-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-forest-100 file:text-forest-700 hover:file:bg-forest-200 file:cursor-pointer file:transition-colors"
                      />
                      {video && <p className="text-xs text-forest-600 mt-1">✓ {video.name}</p>}
                    </div>
                  </div>

                  {/* GPS Detection */}
                  <div>
                    <label className="block text-sm font-bold text-earth-700 uppercase tracking-wider mb-2">
                      <MapPin size={14} className="inline mr-1" /> GPS Coordinates
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="lat"
                        value={form.lat}
                        onChange={handleChange}
                        placeholder="Latitude"
                        className="flex-1 bg-earth-50 border border-earth-200 rounded-xl px-4 py-3.5 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-colors font-mono text-sm"
                      />
                      <input
                        type="text"
                        name="lng"
                        value={form.lng}
                        onChange={handleChange}
                        placeholder="Longitude"
                        className="flex-1 bg-earth-50 border border-earth-200 rounded-xl px-4 py-3.5 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-colors font-mono text-sm"
                      />
                      <button
                        type="button"
                        onClick={detectGPS}
                        disabled={gpsLoading}
                        className="px-5 py-3.5 bg-earth-900 text-white rounded-xl font-bold text-sm hover:bg-earth-800 transition-colors disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
                      >
                        <MapPin size={16} />
                        {gpsLoading ? 'Detecting...' : 'Auto Detect'}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !form.artisanName || !form.village || !form.craftType}
                    className="w-full py-4 bg-forest-600 text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-forest-500 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-forest-600/20"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Registering on IPFS...
                      </>
                    ) : (
                      <>
                        <Send size={18} /> Register TruthMark
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ArtisanTruthMark;
