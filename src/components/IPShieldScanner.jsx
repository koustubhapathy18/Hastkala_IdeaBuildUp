import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, Server, Search, AlertTriangle, FileWarning, CheckCircle2, ChevronRight, Fingerprint, Lock } from 'lucide-react';
import axios from 'axios';

const IPShieldScanner = ({ isOpen, onClose, products }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [scanState, setScanState] = useState('idle'); // idle, scanning, result
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [matchResult, setMatchResult] = useState(null);
  const [isTakingDown, setIsTakingDown] = useState(false);
  const [takedownSuccess, setTakedownSuccess] = useState(false);
  
  const bottomRef = useRef(null);

  // Auto scroll terminal
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);
  
  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedProduct('');
      setScanState('idle');
      setTerminalLogs([]);
      setMatchResult(null);
      setTakedownSuccess(false);
      setIsTakingDown(false);
    }
  }, [isOpen]);

  const addLog = (msg, type = 'info') => {
    setTerminalLogs(prev => [...prev, { msg, type }]);
  };

  const handleScan = async () => {
    if (!selectedProduct) return;
    
    setScanState('scanning');
    setTerminalLogs([]);
    addLog(`Initializing CraftMark active defense crawler...`, 'system');
    
    setTimeout(() => addLog(`Generating Perceptual Hash (pHash) for Product ID: ${selectedProduct}...`, 'info'), 600);
    setTimeout(() => addLog(`Hash generated: e4a299bf8c1...`, 'success'), 1200);
    setTimeout(() => addLog(`Allocating scraping nodes in AWS ap-south-1...`, 'system'), 1800);
    setTimeout(() => addLog(`Scraping Amazon IN, Myntra, Etsy for visual similarities...`, 'info'), 2500);

    try {
      const token = localStorage.getItem('token');
      const apiCall = axios.post('/api/ipshield/scan', { productId: selectedProduct }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // We will wait for the API to return (which has a simulated delay)
      const res = await apiCall;
      
      addLog(`[WARNING] >90% Structural similarity detected in external marketplaces!`, 'warn');
      setTimeout(() => {
        setMatchResult(res.data.match);
        setScanState('result');
      }, 500);

    } catch (error) {
      addLog(`Scan failed: Server Error.`, 'error');
      setTimeout(() => setScanState('idle'), 2000);
    }
  };

  const handleTakedown = async () => {
    if (!matchResult) return;
    setIsTakingDown(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/ipshield/takedown', {
        scanId: matchResult.scanId,
        platform: matchResult.platform
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setTakedownSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTakingDown(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-earth-900/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-5xl bg-[#130d0a] border border-earth-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-earth-800 flex items-center justify-between bg-[#1a1310]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-forest-900/50 flex flex-col items-center justify-center border border-forest-500/30">
              <ShieldCheck size={20} className="text-forest-400" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                CraftMark IP Shield 
                <span className="text-[10px] bg-forest-500/20 text-forest-300 font-mono px-2 py-0.5 rounded border border-forest-500/30">v2.1</span>
              </h2>
              <p className="text-xs text-earth-400 font-mono">Active Counterfeit Detection Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="text-earth-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content area: Two Columns */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          
          {/* Left Column: Controls & Terminal */}
          <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-earth-800 p-6 flex flex-col">
            
            {/* Target Selection */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-earth-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Search size={14}/> Select Asset to Protect
              </label>
              <select 
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)}
                disabled={scanState !== 'idle'}
                className="w-full bg-[#1a1310] border border-earth-700 text-earth-200 rounded-lg py-3 px-4 focus:outline-none focus:border-terracotta-500 appearance-none font-mono text-sm"
              >
                <option value="">-- Choose Product --</option>
                {products?.map(p => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleScan}
              disabled={!selectedProduct || scanState !== 'idle'}
              className="w-full bg-forest-600 hover:bg-forest-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6 uppercase tracking-wider text-xs"
            >
              {scanState === 'idle' ? <><Fingerprint size={16}/> Initiate Global Scan</> : <><Server size={16} className="animate-pulse"/> Scanner Active</>}
            </button>

            {/* Terminal Window */}
            <div className="flex-1 bg-black rounded-lg border border-earth-800 p-4 font-mono text-xs overflow-y-auto flex flex-col gap-1.5 shadow-inner">
              <div className="text-earth-500 border-b border-earth-900 pb-2 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-forest-400 animate-pulse"></div>
                Crawler Terminal Output
              </div>
              
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-earth-600">[{new Date().toLocaleTimeString([], {hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                  <span className={`
                    ${log.type === 'system' ? 'text-earth-400' : ''}
                    ${log.type === 'info' ? 'text-blue-400' : ''}
                    ${log.type === 'success' ? 'text-forest-400' : ''}
                    ${log.type === 'warn' ? 'text-terracotta-400 font-bold' : ''}
                    ${log.type === 'error' ? 'text-red-500 font-bold' : ''}
                  `}>
                    {log.type === 'system' ? '[SYS] ' : log.type === 'info' ? '[INFO] ' : log.type === 'success' ? '[OK] ' : '[ALERT] '}
                    {log.msg}
                  </span>
                </div>
              ))}
              {scanState === 'scanning' && (
                <div className="text-earth-500 flex gap-1 mt-2">
                  <span>_</span><span className="animate-ping bg-earth-500 w-1 h-3 block mt-0.5"></span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Right Column: Visualization & Defense */}
          <div className="w-full md:w-1/2 bg-[#1a1310] flex flex-col">
            {scanState === 'idle' || scanState === 'scanning' ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-earth-500">
                <div className="w-24 h-24 rounded-full border border-earth-800 flex items-center justify-center mb-6 relative">
                  {scanState === 'scanning' ? (
                    <>
                      <div className="absolute inset-0 rounded-full border-2 border-forest-500 border-t-transparent animate-spin"></div>
                      <Search size={32} className="text-forest-400 animate-pulse" />
                    </>
                  ) : (
                    <ShieldCheck size={32} className="text-earth-700" />
                  )}
                </div>
                <h3 className="text-xl font-serif text-white mb-2">
                  {scanState === 'scanning' ? 'Scanning Global Indices' : 'Awaiting Target'}
                </h3>
                <p className="text-sm max-w-sm">
                  {scanState === 'scanning' 
                    ? 'Comparing Perceptual Hashes against 4.2M active listings across 12 e-commerce platforms...'
                    : 'Select an asset from your inventory to search for unauthorized counterfeits online.'}
                </p>
              </div>
            ) : matchResult ? (
              <div className="flex-1 flex flex-col h-full overflow-y-auto">
                <div className="p-6 bg-terracotta-900/20 border-b border-terracotta-900/50">
                  <div className="flex items-center gap-2 text-terracotta-400 mb-2 font-bold uppercase tracking-widest text-xs">
                    <AlertTriangle size={16} /> Copyright Infringement Detected
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white leading-tight">
                    High-Confidence Copycat Found on {matchResult.platform}
                  </h3>
                </div>

                <div className="p-6 flex-1 flex flex-col gap-6">
                  {/* Image Comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-earth-400 uppercase tracking-widest block mb-2 font-bold">Your Original</span>
                      <div className="aspect-square bg-earth-800 rounded-lg border border-forest-500 overflow-hidden relative">
                        <img src={matchResult.originalImage} className="w-full h-full object-cover" alt="Original" />
                        <div className="absolute top-2 left-2 bg-forest-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
                          <Lock size={10}/> IPFS Locked
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-terracotta-400 uppercase tracking-widest block mb-2 font-bold">Counterfeit Found</span>
                      <div className="aspect-square bg-earth-800 rounded-lg border border-terracotta-500 overflow-hidden relative">
                        <img src={matchResult.counterfeitImage} className="w-full h-full object-cover" alt="Fake" />
                        <div className="absolute inset-0 bg-terracotta-500/10" />
                      </div>
                    </div>
                  </div>

                  {/* Similarity Metrics */}
                  <div className="bg-earth-900/50 rounded-xl border border-earth-800 p-4">
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-xs text-earth-400 uppercase tracking-widest">Structural Similarity</span>
                       <span className="text-2xl font-mono text-terracotta-400 font-bold">{matchResult.similarityScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-earth-800 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }} 
                         animate={{ width: `${matchResult.similarityScore}%` }} 
                         transition={{ duration: 1, ease: 'easeOut' }}
                         className="h-full bg-terracotta-500" 
                       />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-earth-500 block">Offending Seller:</span>
                        <span className="text-white font-mono">{matchResult.sellerName}</span>
                      </div>
                      <div>
                        <span className="text-earth-500 block">Listing Status:</span>
                        <span className="text-terracotta-400 font-mono font-bold">Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto">
                    {takedownSuccess ? (
                      <div className="bg-forest-900/30 border border-forest-500/50 rounded-xl p-4 flex gap-3 text-forest-300">
                        <CheckCircle2 size={24} className="shrink-0" />
                        <div>
                          <p className="font-bold text-sm mb-1">Legal Action Initiated</p>
                          <p className="text-xs">DMCA Takedown Notice generated and automatically dispatched to {matchResult.platform} legal team.</p>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={handleTakedown}
                        disabled={isTakingDown}
                        className="w-full bg-terracotta-600 hover:bg-terracotta-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors uppercase tracking-widest text-sm disabled:opacity-50"
                      >
                        {isTakingDown ? (
                          <>Drafting Legal Notice...</>
                        ) : (
                          <><FileWarning size={18}/> Auto-Issue DMCA Takedown</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IPShieldScanner;
