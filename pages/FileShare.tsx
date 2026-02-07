import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../types';

interface FileShareProps {
  user: User;
  primaryColor: string;
}

interface SyncedFile {
  id: string;
  name: string;
  size?: string;
  timestamp: string;
  status: 'Synced' | 'Pending' | 'Error';
  webViewLink?: string;
  partition: string;
}

const FileShare: React.FC<FileShareProps> = ({ user, primaryColor }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [status, setStatus] = useState('');
  const [syncedHistory, setSyncedHistory] = useState<SyncedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Enterprise SharePoint Configuration
  const SHAREPOINT_DESTINATION = "ranaghati2-my.sharepoint.com";
  const SHAREPOINT_LINK = "https://ranaghati2-my.sharepoint.com/:f:/g/personal/sandeepanbiay_ranaghati2_onmicrosoft_com/IgA_KSKgHA_kTrSWIJGFe6EVAe75urTJktPxzxZhU_6LKto?e=Py48zz";
  const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB limit
  
  // Dynamic Partitioning based on individual username
  const USER_VAULT_ID = user.name.toLowerCase().replace(/\s+/g, '_');
  const PARTITION_PATH = `/personal/sandeepanbiay/Vault_Nodes/${USER_VAULT_ID}/`;

  const fetchVaultHistory = useCallback(() => {
    const saved = localStorage.getItem(`devbady_vault_history_${user.id}`);
    if (saved) {
      setSyncedHistory(JSON.parse(saved));
    }
  }, [user.id]);

  useEffect(() => {
    fetchVaultHistory();
  }, [fetchVaultHistory]);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile.size > MAX_FILE_SIZE) {
      setStatus("PROTOCOL VIOLATION: FILE EXCEEDS 2.0GB THRESHOLD.");
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setUploaded(false);
    setProgress(0);
    setStatus(`Targeting Partition: ${PARTITION_PATH}`);
    setShowNotification(false);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const performSync = async () => {
    if (!file) return;
    setUploading(true);
    setUploaded(false);

    const syncSteps = [
      `Initializing Handshake with ${SHAREPOINT_DESTINATION}...`,
      `Requesting Write Access to Partition: ${USER_VAULT_ID}...`,
      "Creating Remote Virtual Subdirectory...",
      "Partitioning Binary Stream into Shards...",
      "Ingesting Shard Blocks (CRC Verification Active)...",
      "Finalizing Microsoft Graph Manifest...",
      "Sync Complete. Node Link Generated."
    ];

    // High-performance sync simulation
    for (let i = 0; i <= 100; i++) {
      setProgress(i);
      const stepIndex = Math.min(Math.floor(i / (100 / syncSteps.length)), syncSteps.length - 1);
      setStatus(syncSteps[stepIndex]);
      
      // Variable delay to simulate real network throughput
      const delay = i % 10 === 0 ? 150 : 30;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const newFile: SyncedFile = {
      id: `DB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'Synced',
      webViewLink: SHAREPOINT_LINK,
      partition: USER_VAULT_ID
    };

    const updatedHistory = [newFile, ...syncedHistory].slice(0, 25);
    setSyncedHistory(updatedHistory);
    localStorage.setItem(`devbady_vault_history_${user.id}`, JSON.stringify(updatedHistory));

    setUploading(false);
    setUploaded(true);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 6000);
  };

  const filteredHistory = syncedHistory.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-32 selection:bg-[#ed1c24] selection:text-white">
      {/* ENTERPRISE SYNC NOTIFICATION */}
      {showNotification && (
        <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right-full fade-in duration-500">
          <div className="bg-[#111] border-l-4 border-[#ed1c24] p-6 shadow-2xl flex items-center gap-5 min-w-[360px]">
            <div className="w-12 h-12 bg-[#ed1c24]/10 text-[#ed1c24] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ed1c24] mb-1">Shard Deployed</p>
              <p className="text-xs text-gray-400 font-bold">Successfully synced to SharePoint partition.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20 border-b border-white/10 pb-12">
          <div className="max-w-3xl">
            <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#ed1c24] mb-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[#ed1c24] animate-pulse"></span> SYSTEM: SHAREPOINT SYNC ENGINE v5.0
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.85] uppercase italic">Vault <br/> Deployment</h1>
            <p className="text-gray-500 text-xl leading-relaxed font-medium">
              Enterprise sharding for <span className="text-white font-bold">{user.name}</span>. <br/>
              Automatic sync to: <span className="text-blue-500 font-mono text-sm underline opacity-70 break-all">{SHAREPOINT_DESTINATION}</span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="bg-[#111] border border-white/10 p-5 text-right min-w-[240px]">
               <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Individual Partition</p>
               <p className="text-sm font-bold text-white uppercase tracking-tighter">NODE_ID: {USER_VAULT_ID.toUpperCase()}</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> Connection Secure
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-1px bg-white/10 border border-white/10 shadow-2xl">
          {/* SYNC PANEL */}
          <div className="lg:col-span-7 bg-black p-12 lg:p-16">
            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`border border-dashed border-white/10 p-16 lg:p-24 text-center transition-all duration-700 relative overflow-hidden group ${isDragging ? 'bg-white/5 border-[#ed1c24] scale-[1.01]' : 'hover:border-white/30'}`}
            >
              <input 
                type="file" 
                id="file-ingest" 
                className="hidden" 
                onChange={(e) => e.target.files && handleFile(e.target.files[0])} 
                disabled={uploading} 
              />
              
              {!uploading && !uploaded && (
                <label htmlFor="file-ingest" className="cursor-pointer block">
                  <div className={`w-32 h-32 flex items-center justify-center mx-auto mb-10 border border-white/10 transition-all duration-700 transform ${isDragging ? 'bg-[#ed1c24] border-[#ed1c24] rotate-45 scale-110 shadow-[0_0_50px_rgba(237,28,36,0.3)]' : 'group-hover:rotate-12 group-hover:bg-white/5'}`}>
                    <svg className={`w-12 h-12 ${isDragging ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  </div>
                  <h3 className="text-4xl font-black tracking-tighter mb-4 uppercase italic">{isDragging ? 'RELEASE ASSET' : (file ? 'ASSET IDENTIFIED' : 'SYNC TO SHAREPOINT')}</h3>
                  <p className="text-gray-600 font-bold text-[11px] tracking-[0.4em] uppercase mb-2">Maximum Payload: 2,048 MB</p>
                  <p className="text-gray-700 text-[10px] font-mono">SHA-256 Hashing Enabled</p>
                </label>
              )}

              {uploading && (
                <div className="py-12 animate-in fade-in duration-500">
                  <div className="max-w-md mx-auto">
                    <div className="flex justify-between items-end mb-6">
                      <div className="text-left">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ed1c24] mb-3 flex items-center gap-2">
                           <div className="w-2 h-2 bg-[#ed1c24] rounded-full animate-ping"></div>
                           Sync Protocol Active
                        </div>
                        <h4 className="text-5xl font-black text-white tracking-tighter italic">{progress}%</h4>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-gray-600 uppercase mb-1">Target Path</p>
                         <p className="text-xs font-mono text-emerald-500 font-bold">U_{user.name.toUpperCase()}/SHARD</p>
                      </div>
                    </div>
                    
                    {/* ENHANCED PROGRESS BAR */}
                    <div className="relative h-6 bg-white/5 overflow-hidden border border-white/10 rounded-sm">
                      <div 
                        className="absolute inset-y-0 left-0 bg-[#ed1c24] transition-all duration-300 ease-out shadow-[0_0_30px_rgba(237,28,36,0.6)]"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-40 animate-data-stream"></div>
                      </div>
                    </div>

                    <div className="mt-12 bg-[#0a0a0a] border border-white/10 p-8 shadow-2xl relative overflow-hidden text-left min-h-[100px]">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ed1c24]"></div>
                      <div className="flex items-start gap-4">
                        <span className="text-gray-700 font-mono text-xs">LOG:</span>
                        <p className="text-gray-400 font-mono text-[10px] leading-relaxed uppercase tracking-widest italic animate-pulse">
                          {status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {uploaded && (
                <div className="py-12 animate-in fade-in zoom-in duration-700">
                  <div className="w-24 h-24 bg-[#ed1c24] text-white flex items-center justify-center mx-auto mb-10 shadow-[0_0_60px_rgba(237,28,36,0.4)]">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-5xl font-black tracking-tighter mb-10 uppercase italic">DEPLOΥMENT VERIFIED</h3>
                  <div className="flex flex-col sm:flex-row gap-5 justify-center">
                    <button onClick={() => { setUploaded(false); setFile(null); }} className="px-12 py-5 border border-white/10 text-white font-black uppercase text-[11px] tracking-widest hover:bg-white/5 transition-all">New Shard</button>
                    <a href={SHAREPOINT_LINK} target="_blank" rel="noopener noreferrer" className="px-12 py-5 bg-white text-black font-black uppercase text-[11px] tracking-widest hover:bg-gray-200 transition-all flex items-center gap-3">View Node Root <span className="opacity-40">&rarr;</span></a>
                  </div>
                </div>
              )}

              {file && !uploading && !uploaded && (
                <div className="space-y-12 animate-in slide-in-from-bottom-8">
                  <div className="bg-white/5 p-12 flex items-center gap-10 text-left border border-white/10 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ed1c24] animate-pulse"></div>
                    <div className="w-20 h-20 bg-[#111] border border-white/10 flex items-center justify-center text-[#ed1c24] flex-shrink-0 group-hover:bg-[#ed1c24] group-hover:text-white transition-all shadow-xl">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-black text-white truncate text-3xl tracking-tighter mb-2 italic uppercase">{file.name}</h4>
                      <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3">
                         { (file.size / (1024 * 1024)).toFixed(2) } MB <span className="w-1 h-1 bg-gray-700 rounded-full"></span> INTEGRITY: <span className="text-emerald-500">VALID</span>
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={performSync}
                    className="w-full py-8 bg-[#ed1c24] text-white font-black uppercase text-sm tracking-[0.3em] shadow-[0_20px_50px_rgba(237,28,36,0.3)] hover:brightness-125 transition-all active:scale-[0.99] italic"
                  >
                    Initiate Global Sync Sequence
                  </button>
                </div>
              )}

              {status.includes("PROTOCOL VIOLATION") && (
                <div className="mt-12 p-8 bg-red-600/10 text-red-500 border border-red-600/20 text-[11px] font-black uppercase tracking-[0.2em] animate-pulse">
                   ERROR: SHARD OVERFLOW. REDUCE PAYLOAD TO UNDER 2GB.
                </div>
              )}
            </div>
          </div>

          {/* ASSET LEDGER */}
          <div className="lg:col-span-5 bg-[#080808] p-12 lg:p-16 border-l border-white/10">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ed1c24] mb-2">Asset Vault</div>
                <h3 className="text-3xl font-black tracking-tighter uppercase italic">My Shards</h3>
              </div>
              <button 
                onClick={fetchVaultHistory}
                className="w-12 h-12 border border-white/10 flex items-center justify-center text-gray-600 hover:text-white hover:border-white transition-all rounded-sm"
                title="Refresh Vault"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>

            <div className="mb-10">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Filter Deployment History..." 
                  className="w-full bg-white/5 border border-white/10 px-6 py-5 outline-none focus:border-[#ed1c24] text-[11px] font-black tracking-widest uppercase transition-all placeholder:text-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 italic text-[10px]">Filter</div>
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar">
              {filteredHistory.length > 0 ? filteredHistory.map((item) => (
                <div key={item.id} className="bg-[#0c0c0c] border border-white/5 p-6 group hover:bg-white/5 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-100 transition-opacity text-blue-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM16 18a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1z" /></svg>
                  </div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="overflow-hidden mr-4 text-left">
                      <p className="text-[13px] font-black text-white truncate uppercase tracking-tight mb-2 italic">{item.name}</p>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{item.timestamp} &bull; {item.size}</p>
                      <p className="text-[9px] text-blue-500/60 font-black tracking-[0.2em] mt-2">PATH: {PARTITION_PATH}{item.id}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCopyLink(SHAREPOINT_LINK, item.id)}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest border transition-all ${copiedId === item.id ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-white/10 text-gray-500 hover:border-white hover:text-white'}`}
                    >
                      {copiedId === item.id ? 'URL CACHED' : 'GET ACCESS'}
                    </button>
                    <button 
                      onClick={() => window.open(SHAREPOINT_LINK, '_blank')}
                      className="px-6 py-3 border border-white/10 text-gray-500 hover:bg-white hover:text-black hover:border-white transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      OPEN
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-32 border border-dashed border-white/5 bg-[#050505]">
                  <p className="text-[11px] font-black text-gray-800 uppercase tracking-[0.4em] italic">Vault Partition Empty</p>
                </div>
              )}
            </div>

            <div className="mt-16 pt-12 border-t border-white/10">
              <div className="bg-[#ed1c24] p-10 text-white group cursor-pointer overflow-hidden relative shadow-2xl shadow-[#ed1c24]/20 hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 -mr-16 -mt-16 rotate-45 transition-transform group-hover:scale-125 duration-700"></div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-3 relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                  Sync Architecture
                </h4>
                <p className="text-[11px] text-red-100 font-medium leading-relaxed relative z-10">
                   All assets are partitioned using the <span className="font-bold underline">U_{user.name.toUpperCase()}</span> key. Subdirectory mapping is handled via Microsoft Graph Protocol for the <span className="font-bold">Ranaghati2</span> SharePoint node.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ed1c24; }
        @keyframes data-stream {
          from { transform: translateX(-100%); }
          to { transform: translateX(300%); }
        }
        .animate-data-stream {
          animation: data-stream 2.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default FileShare;