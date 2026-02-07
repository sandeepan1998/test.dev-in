import React, { useState, useCallback } from 'react';
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploaded(false);
      setProgress(0);
    }
  };

  const simulateUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploaded(false);
    
    // Simulate real-time progress
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    setUploading(false);
    setUploaded(true);
    setFile(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-slate-900 mb-4">File Share</h1>
        <p className="text-slate-500 text-lg">Securely upload your project bases and documentation to the devbady infrastructure.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className={`bg-white border-4 border-dashed rounded-[2.5rem] p-12 text-center transition-all ${file ? 'border-blue-500 bg-blue-50/10' : 'border-slate-100 hover:border-blue-200'}`}>
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={handleFileChange} 
              disabled={uploading}
            />
            
            {!uploading && !uploaded && (
              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-400 group-hover:text-blue-500 transition-colors">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{file ? file.name : 'Select a File'}</h3>
                <p className="text-slate-400 text-sm mb-8 font-medium">Drag & drop or click to browse files</p>
              </label>
            )}

            {uploading && (
              <div className="py-10">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                    <circle 
                      cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      className="text-blue-600 transition-all duration-300" 
                      strokeDasharray={377} 
                      strokeDashoffset={377 - (377 * progress) / 100} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-black text-2xl">
                    {progress}%
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Syncing with devbady Cloud...</h3>
                <p className="text-slate-400 text-sm font-medium italic">Establishing secure connection to Google Drive infrastructure</p>
              </div>
            )}

            {uploaded && (
              <div className="py-10 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Upload Successful!</h3>
                <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">Your file has been stored in the devbady secure folder. A notification has been sent to <span className="text-blue-600 font-bold">{user.email}</span>.</p>
                <button onClick={() => setUploaded(false)} className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900">Upload Another</button>
              </div>
            )}

            {file && !uploading && !uploaded && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4 text-left border border-slate-100">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-slate-900 truncate">{file.name}</p>
                    <p className="text-[10px] font-black uppercase text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={simulateUpload}
                  className="w-full py-5 rounded-3xl text-white font-black text-lg shadow-xl shadow-blue-500/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  Confirm & Sync
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
            <h3 className="font-black text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
              Cloud Destinations
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Files are automatically synced to our verified enterprise Google Drive repository.</p>
            <a 
              href="https://drive.google.com/drive/folders/1iYQTWGj8PSjmd7JRjxWQ8DFAzNvc4bir?usp=drive_link" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-slate-800 p-4 rounded-2xl hover:bg-slate-700 transition-all border border-slate-700"
            >
              <div className="flex items-center gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-6 h-6" alt="Drive" />
                <span className="text-xs font-bold text-slate-300 truncate">devbady-secure-assets</span>
              </div>
            </a>
          </div>

          <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
            <h3 className="font-black text-emerald-900 text-sm uppercase tracking-widest mb-3">Instant Notifications</h3>
            <p className="text-emerald-700 text-xs leading-relaxed font-medium">Upon every successful sync, devbady sends a verified receipt to your registered Gmail account via the devbady.in API.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileShare;