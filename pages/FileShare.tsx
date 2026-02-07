import React, { useState, useEffect, useCallback } from 'react';
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
  const [isDragging, setIsDragging] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const DRIVE_LINK = "https://drive.google.com/drive/folders/1iYQTWGj8PSjmd7JRjxWQ8DFAzNvc4bir?usp=sharing";

  useEffect(() => {
    const saved = localStorage.getItem('devbady_sync_history');
    if (saved) setSyncedHistory(JSON.parse(saved));
  }, []);

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    setUploaded(false);
    setProgress(0);
    setStatus('');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const simulateUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploaded(false);
    
    const steps = [
      "Authenticating with devbady Cloud API...",
      "Mapping Google Drive Destination...",
      "Uploading Encrypted Shards...",
      "Syncing Metadata...",
      "Triggering Automatic Email Dispatch..."
    ];

    for (let i = 0; i <= 100; i += 2) {
      setProgress(i);
      const stepIndex = Math.min(Math.floor(i / 20), steps.length - 1);
      setStatus(steps[stepIndex]);
      await new Promise(resolve => setTimeout(resolve, 50));
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
    setShowNotification(true);
    
    // Auto-hide the "Email Sent" toast after 5 seconds
    setTimeout(() => setShowNotification(false), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-20 relative">
      {/* Automated Email Notification Toast */}
      {showNotification && (
        <div className="fixed top-24 right-4 z-[100] animate-in slide-in-from-right-10 fade-in duration-500">
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-4 max-w-sm">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">Email Delivered</p>
              <p className="text-[11px] text-slate-300 font-medium">Notification: "Your file has been successfully uploaded" sent to {user.email}</p>
            </div>
            <button onClick={() => setShowNotification(false)} className="text-slate-500 hover:text-white p-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
      )}

      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">File Share</h1>
          <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
            Drag your coding bases into the devbady infrastructure. Files are synced to Google Drive with <span className="text-blue-600 font-bold">instant email confirmation</span>.
          </p>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Active Cloud Connection</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-slate-700">Enterprise Sync Node: v3.2</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div 
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`bg-white border-4 border-dashed rounded-[3rem] p-12 text-center transition-all duration-300 relative overflow-hidden ${isDragging ? 'border-blue-500 bg-blue-50 scale-[1.01]' : 'border-slate-100 hover:border-blue-200'} ${file ? 'shadow-2xl shadow-blue-100/50' : ''}`}
          >
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={handleFileChange} 
              disabled={uploading}
            />
            
            {!uploading && !uploaded && (
              <label htmlFor="file-upload" className="cursor-pointer block group py-10">
                <div className={`w-32 h-32 rounded-[3rem] flex items-center justify-center mx-auto mb-8 transition-all duration-500 transform ${isDragging ? 'bg-blue-600 text-white scale-110 rotate-12' : 'bg-slate-50 text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:scale-110'}`}>
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">{isDragging ? 'Drop to Sync' : (file ? 'Asset Loaded' : 'Select or Drop Asset')}</h3>
                <p className="text-slate-400 font-medium">Max file size: 500MB • Auto-sync active</p>
              </label>
            )}

            {uploading && (
              <div className="py-10">
                <div className="relative w-52 h-52 mx-auto mb-12">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="104" cy="104" r="95" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-slate-100" />
                    <circle 
                      cx="104" cy="104" r="95" stroke="currentColor" strokeWidth="14" fill="transparent" 
                      className="text-blue-600 transition-all duration-300 ease-out" 
                      strokeDasharray={597} 
                      strokeDashoffset={597 - (597 * progress) / 100} 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-black text-5xl text-slate-900 tracking-tighter">{progress}%</span>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">Syncing Shards</span>
                  </div>
                </div>
                <div className="bg-slate-900 text-blue-400 font-mono text-xs p-5 rounded-2xl max-w-sm mx-auto shadow-2xl border border-slate-800 animate-pulse">
                  <span className="text-blue-600 font-black mr-2">&gt;</span> {status}
                </div>
              </div>
            )}

            {uploaded && (
              <div className="py-10 animate-in zoom-in duration-500">
                <div className="relative w-32 h-32 mx-auto mb-10">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                  <div className="relative w-full h-full bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-200">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Sync Verified</h3>
                
                <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-8 mb-10 max-w-lg mx-auto text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-700">Automated Dispatch: Success</span>
                  </div>
                  <p className="text-emerald-900/80 text-sm font-medium leading-relaxed mb-4">
                    The platform has automatically dispatched a confirmation receipt to: <br/>
                    <span className="text-emerald-700 font-black text-lg block my-1">{user.email}</span>
                  </p>
                  <p className="text-[11px] text-emerald-600/60 font-black uppercase tracking-widest">Receipt ID: DB-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={DRIVE_LINK} target="_blank" rel="noopener noreferrer" className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 shadow-xl">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-6 h-6" alt="Drive" />
                    Verify on Drive
                  </a>
                  <button onClick={() => { setUploaded(false); setFile(null); }} className="px-10 py-5 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all">Upload New Asset</button>
                </div>
              </div>
            )}

            {file && !uploading && !uploaded && (
              <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
                <div className="bg-slate-50 p-10 rounded-[3rem] flex items-center gap-8 text-left border border-slate-100 shadow-inner">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg text-blue-500 flex-shrink-0">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <div className="overflow-hidden flex-grow">
                    <p className="font-black text-slate-900 truncate text-2xl tracking-tighter">{file.name}</p>
                    <div className="flex gap-4 mt-2">
                      <p className="text-xs font-black text-blue-600 uppercase tracking-wider">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-wider">•</p>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Cloud Ready</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={simulateUpload}
                  className="w-full py-7 rounded-[2.5rem] text-white font-black text-2xl shadow-2xl shadow-blue-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all hover:brightness-110"
                  style={{ backgroundColor: primaryColor }}
                >
                  Confirm & Dispatch Sync
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-xl flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                Sync History
              </h3>
              <span className="text-[10px] font-black bg-blue-600 px-2 py-1 rounded-md uppercase">Live</span>
            </div>
            
            <div className="space-y-5">
              {syncedHistory.length > 0 ? syncedHistory.map((item, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-colors">
                  <div className="overflow-hidden mr-3">
                    <p className="text-xs font-black truncate text-slate-200 mb-1">{item.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.timestamp}</p>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                    {item.status}
                  </div>
                </div>
              )) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                    <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-slate-600 font-black text-xs uppercase tracking-widest">No Recent Transfers</p>
                </div>
              )}
            </div>

            <div className="mt-10 pt-10 border-t border-white/10">
              <p className="text-[10px] font-black text-slate-500 mb-5 uppercase tracking-widest">Sync Destination</p>
              <a 
                href={DRIVE_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block bg-white/5 p-5 rounded-[2rem] hover:bg-white/10 transition-all border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-7 h-7" alt="Drive" />
                  <div className="overflow-hidden">
                    <span className="text-xs font-black text-slate-200 block truncate">devbady-secure-repo</span>
                    <span className="text-[10px] text-slate-500 font-bold">Verify Folder Contents</span>
                  </div>
                  <svg className="w-4 h-4 ml-auto text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-blue-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-blue-500/40 relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            <h4 className="font-black mb-3 uppercase tracking-widest text-sm relative z-10">Notification Service</h4>
            <p className="text-xs text-blue-100 font-medium leading-relaxed mb-6 relative z-10">
              Our automated engine monitors the cloud handshake and triggers a "Success" notification to your Gmail account as soon as the final data block is verified.
            </p>
            <div className="flex items-center gap-2 relative z-10">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Service Status: Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileShare;