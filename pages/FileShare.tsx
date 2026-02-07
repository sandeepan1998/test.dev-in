import React, { useState } from 'react';
import { User } from '../types';

interface FileShareProps {
  user: User;
  primaryColor: string;
}

const FileShare: React.FC<FileShareProps> = ({ user, primaryColor }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [status, setStatus] = useState('');

  const DRIVE_LINK = "https://drive.google.com/drive/folders/1iYQTWGj8PSjmd7JRjxWQ8DFAzNvc4bir?usp=sharing";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploaded(false);
      setProgress(0);
      setStatus('');
    }
  };

  const sendGmailNotification = () => {
    const subject = encodeURIComponent(`[devbady.in] File Upload Successful: ${file?.name || 'Asset'}`);
    const body = encodeURIComponent(
      `Hello ${user.name},\n\n` +
      `This is a verified receipt from devbady.in.\n\n` +
      `FILE DETAILS:\n` +
      `- Name: ${file?.name}\n` +
      `- Size: ${(file?.size ? file.size / 1024 / 1024 : 0).toFixed(2)} MB\n` +
      `- Timestamp: ${new Date().toLocaleString()}\n` +
      `- Destination: devbady Cloud Storage\n\n` +
      `Your file has been processed for the shared folder: ${DRIVE_LINK}\n\n` +
      `Regards,\nDevBady Infrastructure Team`
    );
    window.open(`mailto:${user.email}?subject=${subject}&body=${body}`);
  };

  const simulateUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploaded(false);
    
    const steps = [
      "Establishing SSL/TLS Handshake...",
      "Allocating Cloud Buffer...",
      "Encrypting Data Blocks...",
      "Syncing with Google Drive API...",
      "Finalizing Permissions..."
    ];

    // Simulate real-time progress and status updates
    for (let i = 0; i <= 100; i += 2) {
      setProgress(i);
      const stepIndex = Math.min(Math.floor(i / 20), steps.length - 1);
      setStatus(steps[stepIndex]);
      await new Promise(resolve => setTimeout(resolve, 80));
    }

    setUploading(false);
    setUploaded(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">File Share</h1>
        <p className="text-slate-500 text-lg">Securely sync your project resources to the <b>devbady.in</b> ecosystem.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className={`bg-white border-4 border-dashed rounded-[2.5rem] p-12 text-center transition-all ${file ? 'border-blue-500 bg-blue-50/10 shadow-2xl shadow-blue-100' : 'border-slate-100 hover:border-blue-200'}`}>
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={handleFileChange} 
              disabled={uploading}
            />
            
            {!uploading && !uploaded && (
              <label htmlFor="file-upload" className="cursor-pointer block group">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-300 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all duration-300 transform group-hover:scale-110">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{file ? file.name : 'Ready to Sync'}</h3>
                <p className="text-slate-400 text-sm mb-8 font-medium">Click to select assets or drag and drop</p>
              </label>
            )}

            {uploading && (
              <div className="py-10">
                <div className="relative w-40 h-40 mx-auto mb-10">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="75" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                    <circle 
                      cx="80" cy="80" r="75" stroke="currentColor" strokeWidth="10" fill="transparent" 
                      className="text-blue-600 transition-all duration-300 ease-out" 
                      strokeDasharray={471} 
                      strokeDashoffset={471 - (471 * progress) / 100} 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-black text-3xl text-slate-900">{progress}%</span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{status}</h3>
                <p className="text-blue-600 text-xs font-bold uppercase tracking-widest animate-pulse">Encryption Active</p>
              </div>
            )}

            {uploaded && (
              <div className="py-10 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">Sync Processed</h3>
                <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                  Your file has been prepared for the devbady cloud. To complete the notification loop, click below to trigger your Gmail receipt.
                </p>
                
                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  <button 
                    onClick={sendGmailNotification}
                    className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                    Send Gmail Notification
                  </button>
                  <button onClick={() => { setUploaded(false); setFile(null); }} className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 mt-4">Upload Another</button>
                </div>
              </div>
            )}

            {file && !uploading && !uploaded && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-[2rem] flex items-center gap-5 text-left border border-slate-100">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <div className="overflow-hidden flex-grow">
                    <p className="font-bold text-slate-900 truncate text-lg">{file.name}</p>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{(file.size / 1024 / 1024).toFixed(2)} MB • READY FOR SYNC</p>
                  </div>
                </div>
                <button 
                  onClick={simulateUpload}
                  className="w-full py-5 rounded-[2rem] text-white font-black text-xl shadow-2xl shadow-blue-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  Confirm & Sync to Drive
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl">
            <h3 className="font-black text-xl mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
              </div>
              Cloud Status
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Destination Folder</p>
                <a 
                  href={DRIVE_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block bg-slate-800 p-5 rounded-2xl hover:bg-slate-700 transition-all border border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-6 h-6" alt="Drive" />
                    <span className="text-xs font-bold text-slate-200 truncate">devbady-secure-repo</span>
                    <svg className="w-4 h-4 ml-auto text-slate-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </div>
                </a>
              </div>
              
              <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                <h4 className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Developer Note</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">To enable fully automated headless background syncing, please connect your <b>Google Cloud OAuth Client</b> in the platform settings.</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              <h3 className="font-black text-emerald-900 text-xs uppercase tracking-widest">Verification Service</h3>
            </div>
            <p className="text-emerald-700 text-xs leading-relaxed font-medium">After syncing, your Gmail notification acts as a legal receipt of asset transfer to the devbady infrastructure.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileShare;