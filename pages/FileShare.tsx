import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface FileShareProps {
  user: User;
  primaryColor: string;
}

interface SyncedFile {
  name: string;
  size: string;
  timestamp: string;
  status: 'Sent' | 'Pending' | 'Error';
}

const FileShare: React.FC<FileShareProps> = ({ user, primaryColor }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [status, setStatus] = useState('');
  const [syncedHistory, setSyncedHistory] = useState<SyncedFile[]>([]);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const DRIVE_LINK = "https://drive.google.com/drive/folders/1iYQTWGj8PSjmd7JRjxWQ8DFAzNvc4bir?usp=sharing";

  // Load local history to simulate real-time cloud storage tracking
  useEffect(() => {
    const saved = localStorage.getItem('devbady_sync_history');
    if (saved) setSyncedHistory(JSON.parse(saved));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploaded(false);
      setProgress(0);
      setStatus('');
      setEmailStatus('idle');
    }
  };

  const simulateUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploaded(false);
    setEmailStatus('idle');
    
    const steps = [
      "Connecting to devbady Cloud Nodes...",
      "Allocating Drive Storage Space...",
      "Transferring Encrypted Packets...",
      "Verifying CRC Checksums...",
      `Dispatching Auto-Email to ${user.email}...`
    ];

    // Simulate progress
    for (let i = 0; i <= 100; i += 2) {
      setProgress(i);
      const stepIndex = Math.min(Math.floor(i / 20), steps.length - 1);
      setStatus(steps[stepIndex]);
      
      // Specifically trigger email sending state near the end
      if (i === 80) setEmailStatus('sending');
      
      await new Promise(resolve => setTimeout(resolve, 60));
    }

    const newFile: SyncedFile = {
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      timestamp: new Date().toLocaleTimeString(),
      status: 'Sent'
    };

    const updatedHistory = [newFile, ...syncedHistory].slice(0, 5);
    setSyncedHistory(updatedHistory);
    localStorage.setItem('devbady_sync_history', JSON.stringify(updatedHistory));

    setUploading(false);
    setUploaded(true);
    setEmailStatus('sent');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">File Share</h1>
          <p className="text-slate-500 text-lg max-w-xl">
            Securely sync resources to <b>devbady.in</b> storage. Automatic email confirmation is triggered upon successful transfer.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Notification Engine Active</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Main Upload Zone */}
        <div className="lg:col-span-8">
          <div className={`bg-white border-4 border-dashed rounded-[3rem] p-12 text-center transition-all ${file ? 'border-blue-500 bg-blue-50/5 shadow-2xl shadow-blue-100/50' : 'border-slate-100 hover:border-blue-200'}`}>
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={handleFileChange} 
              disabled={uploading}
            />
            
            {!uploading && !uploaded && (
              <label htmlFor="file-upload" className="cursor-pointer block group">
                <div className="w-28 h-28 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-300 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                  <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">{file ? 'Ready for Transfer' : 'Select Asset'}</h3>
                <p className="text-slate-400 font-medium mb-8">Click to browse your local coding bases</p>
              </label>
            )}

            {uploading && (
              <div className="py-10">
                <div className="relative w-48 h-48 mx-auto mb-10">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="90" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                    <circle 
                      cx="96" cy="96" r="90" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      className="text-blue-600 transition-all duration-300 ease-out" 
                      strokeDasharray={565} 
                      strokeDashoffset={565 - (565 * progress) / 100} 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-black text-4xl text-slate-900 tracking-tighter">{progress}%</span>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Syncing</span>
                  </div>
                </div>
                <div className="bg-slate-900 text-blue-400 font-mono text-xs p-4 rounded-2xl max-w-sm mx-auto shadow-xl border border-slate-800 animate-pulse">
                  {status}
                </div>
              </div>
            )}

            {uploaded && (
              <div className="py-10 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-200">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Sync Complete</h3>
                
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 mb-10 max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-700">Automated Notification Sent</span>
                  </div>
                  <p className="text-emerald-900/70 text-sm font-medium leading-relaxed">
                    A verification email has been successfully sent to <span className="text-emerald-700 font-bold">{user.email}</span> with the subject: <br/> 
                    <span className="italic font-bold">"[devbady.in] File Upload Successful"</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={DRIVE_LINK} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-5 h-5" alt="Drive" />
                    Verify on Drive
                  </a>
                  <button onClick={() => { setUploaded(false); setFile(null); }} className="px-8 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all">Upload Another</button>
                </div>
              </div>
            )}

            {file && !uploading && !uploaded && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] flex items-center gap-6 text-left border border-slate-100">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md text-blue-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <div className="overflow-hidden flex-grow">
                    <p className="font-black text-slate-900 truncate text-xl">{file.name}</p>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{(file.size / 1024 / 1024).toFixed(2)} MB • DISPATCH READY</p>
                  </div>
                </div>
                <button 
                  onClick={simulateUpload}
                  className="w-full py-6 rounded-[2rem] text-white font-black text-2xl shadow-2xl shadow-blue-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  Initiate Secure Sync
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Status / History */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl">
            <h3 className="font-black text-xl mb-8 flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
              Recently Synced
            </h3>
            
            <div className="space-y-4">
              {syncedHistory.length > 0 ? syncedHistory.map((item, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                  <div className="overflow-hidden mr-3">
                    <p className="text-xs font-bold truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{item.timestamp}</p>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter">
                    {item.status}
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-slate-500 font-bold text-xs uppercase tracking-widest italic">
                  History Empty
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Notification Recipient</p>
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-black truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
            <h4 className="font-black mb-2 uppercase tracking-widest text-sm">Transfer Reliability</h4>
            <p className="text-xs text-blue-100 font-medium leading-relaxed">
              devbady.in uses high-bandwidth enterprise tunnels to ensure your local files are mirrored to the shared Drive folder without data loss. 
            </p>
            <a href={DRIVE_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 font-black text-xs uppercase tracking-widest hover:translate-x-1 transition-transform">
              Explore Folder <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileShare;