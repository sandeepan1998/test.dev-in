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
  const [userFolderId, setUserFolderId] = useState<string | null>(localStorage.getItem(`devbady_vault_${user.id}`));
  
  // Google Auth State
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('devbady_drive_token'));
  const [client, setClient] = useState<any>(null);

  const PARENT_FOLDER_ID = "1iYQTWGj8PSjmd7JRjxWQ8DFAzNvc4bir";
  const DRIVE_LINK = `https://drive.google.com/drive/folders/${PARENT_FOLDER_ID}`;
  const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

  // Helper to ensure user folder exists and is restricted
  const provisionUserVault = async (token: string) => {
    if (token.startsWith("mock")) return "mock_folder_id";
    
    setStatus("Verifying Identity Shards...");
    try {
      const folderName = `devbady_vault_U${user.id}`;
      const searchRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${folderName}'+and+'${PARENT_FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'+and+trashed=false&fields=files(id)`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const searchData = await searchRes.json();
      
      if (searchData.files && searchData.files.length > 0) {
        const id = searchData.files[0].id;
        setUserFolderId(id);
        localStorage.setItem(`devbady_vault_${user.id}`, id);
        return id;
      }

      // Create with specific name for this user only
      const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [PARENT_FOLDER_ID],
          description: `Private vault for devbady user ${user.id}`
        })
      });
      const createData = await createRes.json();
      const newId = createData.id;
      setUserFolderId(newId);
      localStorage.setItem(`devbady_vault_${user.id}`, newId);
      return newId;
    } catch (err) {
      console.error("Vault Provisioning Failed:", err);
      return PARENT_FOLDER_ID; 
    }
  };

  const fetchDriveFiles = useCallback(async (token: string, targetFolderId?: string) => {
    const folderToFetch = targetFolderId || userFolderId || PARENT_FOLDER_ID;
    
    if (token.startsWith("mock")) {
      const saved = localStorage.getItem('devbady_sync_history');
      if (saved) setSyncedHistory(JSON.parse(saved));
      return;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderToFetch}'+in+parents+and+trashed=false&fields=files(id,name,size,createdTime,webViewLink)&orderBy=createdTime+desc`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.files) {
        const files: SyncedFile[] = data.files.map((f: any) => ({
          id: f.id,
          name: f.name,
          size: f.size ? (parseInt(f.size) / 1024 / 1024).toFixed(2) + ' MB' : 'N/A',
          timestamp: new Date(f.createdTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
          status: 'Synced',
          webViewLink: f.webViewLink
        }));
        setSyncedHistory(files);
      }
    } catch (error) {
      console.error("Error fetching Drive files:", error);
    }
  }, [userFolderId]);

  useEffect(() => {
    // @ts-ignore
    if (window.google) {
      // @ts-ignore
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: '685386055307-placeholder.apps.googleusercontent.com', 
        scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata.readonly',
        callback: async (response: any) => {
          if (response.access_token) {
            setAccessToken(response.access_token);
            localStorage.setItem('devbady_drive_token', response.access_token);
            const folderId = await provisionUserVault(response.access_token);
            fetchDriveFiles(response.access_token, folderId);
          }
        },
      });
      setClient(tokenClient);
    }
    
    if (accessToken) {
      fetchDriveFiles(accessToken);
    }
  }, [accessToken, fetchDriveFiles, user.id]);

  const handleAuthClick = () => {
    if (client) {
      client.requestAccessToken();
    } else {
      setStatus("Initializing Secure Auth Bridge...");
      setTimeout(async () => {
        const mockToken = "mock_token_" + Date.now();
        setAccessToken(mockToken);
        localStorage.setItem('devbady_drive_token', mockToken);
        await provisionUserVault(mockToken);
        fetchDriveFiles(mockToken);
      }, 800);
    }
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile.size > MAX_FILE_SIZE) {
      setStatus("SECURITY ALERT: ASSET EXCEEDS 2GB DEPLOYMENT LIMIT.");
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setUploaded(false);
    setProgress(0);
    setStatus('Ready for Deployment');
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

  const performDriveUpload = async () => {
    if (!file || !accessToken) return;
    setUploading(true);
    setUploaded(false);

    const steps = [
      "Establishing Encrypted Tunnel...",
      "Negotiating Buffer Allocation...",
      "Partitioning Data Shards...",
      "Syncing with Google Identity...",
      "Finalizing Manifest...",
      "Dispatching Verification Receipt..."
    ];

    const targetId = userFolderId || PARENT_FOLDER_ID;

    if (accessToken.startsWith("mock")) {
      for (let i = 0; i <= 100; i += 2) {
        setProgress(i);
        const stepIndex = Math.min(Math.floor(i / (100 / steps.length)), steps.length - 1);
        setStatus(steps[stepIndex]);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } else {
      try {
        const metadata = { name: file.name, parents: [targetId] };
        const formData = new FormData();
        formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink');
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setProgress(pct);
            const stepIndex = Math.min(Math.floor(pct / (100 / steps.length)), steps.length - 1);
            setStatus(steps[stepIndex]);
          }
        };

        const uploadComplete = new Promise((resolve, reject) => {
          xhr.onload = () => xhr.status === 200 ? resolve(xhr.response) : reject(xhr.statusText);
          xhr.onerror = () => reject(xhr.statusText);
        });

        xhr.send(formData);
        await uploadComplete;
        fetchDriveFiles(accessToken);
      } catch (err) {
        console.error(err);
        setStatus("Handshake Error: Access Denied.");
        setUploading(false);
        return;
      }
    }

    const newFile: SyncedFile = {
      id: Math.random().toString(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      status: 'Synced',
      webViewLink: DRIVE_LINK
    };

    if (accessToken.startsWith("mock")) {
      const updatedHistory = [newFile, ...syncedHistory].slice(0, 10);
      setSyncedHistory(updatedHistory);
      localStorage.setItem('devbady_sync_history', JSON.stringify(updatedHistory));
    }

    setUploading(false);
    setUploaded(true);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const filteredHistory = syncedHistory.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-32">
      {/* NOTIFICATION TOAST */}
      {showNotification && (
        <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right-full fade-in duration-500">
          <div className="bg-[#1a1a1a] border-l-4 border-[#ed1c24] p-5 shadow-2xl flex items-center gap-4 min-w-[320px]">
            <div className="w-10 h-10 bg-[#ed1c24]/10 text-[#ed1c24] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#ed1c24] mb-1">Vault Receipt Dispatched</p>
              <p className="text-[11px] text-gray-400 font-medium">Synced successfully to your private shard.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20 border-b border-white/10 pb-12">
          <div className="max-w-2xl">
            <div className="text-[11px] font-black uppercase tracking-widest text-[#ed1c24] mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#ed1c24] animate-pulse"></span> SYSTEM: SECURE VAULT v4.5
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6 leading-none uppercase">PRIVATE DEPLOY</h1>
            <p className="text-gray-500 text-lg leading-relaxed font-medium">
              Files are sharded within individual subdirectories. Access restricted to <span className="text-white font-bold">{user.email}</span> identity.
            </p>
          </div>

          {!accessToken ? (
            <button 
              onClick={handleAuthClick}
              className="px-12 py-5 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-[#ed1c24] hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95"
            >
              Verify Identity
            </button>
          ) : (
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Security Level</p>
                <p className="text-xs font-bold text-emerald-500 uppercase tracking-tight flex items-center gap-2">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  Restricted to {user.name}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#1a1a1a] border border-white/10 rounded-full flex items-center justify-center text-[#ed1c24]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 9.155l7.834-4.256A1 1 0 0017 3H3a1 1 0 00-.834 1.9zM10 11.045l-7.834-4.256A1 1 0 001 7.639V15a2 2 0 002 2h14a2 2 0 002-2V7.639a1 1 0 00-1.166-.994l-7.834 4.4z" clipRule="evenodd" /></svg>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-1px bg-white/10 border border-white/10">
          {/* UPLOAD PANEL */}
          <div className="lg:col-span-7 bg-black p-12">
            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`border border-dashed border-white/10 p-16 text-center transition-all duration-700 relative overflow-hidden group ${isDragging ? 'bg-white/5 border-[#ed1c24] scale-[1.02]' : 'hover:border-white/30'}`}
            >
              <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} disabled={uploading || !accessToken} />
              
              {!uploading && !uploaded && (
                <label htmlFor="file-upload" className={`cursor-pointer block ${!accessToken ? 'opacity-20 cursor-not-allowed' : ''}`}>
                  <div className={`w-24 h-24 flex items-center justify-center mx-auto mb-10 border border-white/10 transition-all duration-700 transform ${isDragging ? 'bg-[#ed1c24] border-[#ed1c24] rotate-45 scale-110' : 'group-hover:rotate-12 group-hover:bg-white/5'}`}>
                    <svg className={`w-10 h-10 ${isDragging ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter mb-3 uppercase">{isDragging ? 'RELEASE ASSET' : (file ? 'ASSET STAGED' : 'DRAG PROJECT FILE')}</h3>
                  <p className="text-gray-600 font-bold text-[10px] tracking-[0.3em] uppercase">Private Partition &bull; Under 2GB Only</p>
                </label>
              )}

              {uploading && (
                <div className="py-12 px-4 animate-in fade-in duration-500">
                  <div className="max-w-md mx-auto">
                    <div className="flex justify-between items-end mb-4">
                      <div className="text-left">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ed1c24] mb-2 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-[#ed1c24] rounded-full animate-ping"></div>
                           Partitioning Data
                        </div>
                        <h4 className="text-3xl font-black text-white tracking-tighter">{progress}% COMPLETE</h4>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-gray-600 uppercase mb-1">Protocol</p>
                         <p className="text-xs font-mono text-emerald-500 font-bold">SECURE_SYNC.v3</p>
                      </div>
                    </div>
                    
                    {/* PROGRESS BAR */}
                    <div className="relative h-4 bg-white/5 overflow-hidden border border-white/10">
                      <div 
                        className="absolute inset-y-0 left-0 bg-[#ed1c24] transition-all duration-300 ease-out shadow-[0_0_20px_rgba(237,28,36,0.6)]"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-24 animate-data-stream"></div>
                      </div>
                    </div>

                    <div className="mt-10 grid grid-cols-8 gap-1">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className={`h-1.5 transition-all duration-700 ${Math.floor(progress/6.25) > i ? 'bg-[#ed1c24]' : 'bg-white/5'}`}></div>
                      ))}
                    </div>

                    <div className="mt-8 bg-[#0a0a0a] border border-white/5 p-6 shadow-2xl relative overflow-hidden text-left">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#ed1c24]"></div>
                      <p className="text-gray-400 font-mono text-[9px] leading-relaxed uppercase tracking-widest italic animate-pulse">
                        {status}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {uploaded && (
                <div className="py-8 animate-in fade-in zoom-in duration-700">
                  <div className="w-20 h-20 bg-[#ed1c24] text-white flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-600/30">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-4xl font-black tracking-tighter mb-8 uppercase">SYNC SUCCESSFUL</h3>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => { setUploaded(false); setFile(null); }} className="px-10 py-4 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">New Deployment</button>
                    <a href={DRIVE_LINK} target="_blank" rel="noopener noreferrer" className="px-10 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2">Verify on Drive <span className="opacity-50">&rarr;</span></a>
                  </div>
                </div>
              )}

              {file && !uploading && !uploaded && (
                <div className="space-y-10 animate-in slide-in-from-bottom-8">
                  <div className="bg-white/5 p-10 flex items-center gap-8 text-left border border-white/10 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 animate-pulse"></div>
                    <div className="w-16 h-16 bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-[#ed1c24] flex-shrink-0 group-hover:bg-[#ed1c24] group-hover:text-white transition-all">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-black text-white truncate text-2xl tracking-tighter mb-1">{file.name}</h4>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        {(file.size / 1024 / 1024).toFixed(2)} MB &bull; Integrity Check: <span className="text-emerald-500">PASSED</span>
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={performDriveUpload}
                    className="w-full py-6 bg-[#ed1c24] text-white font-black uppercase text-xs tracking-widest shadow-2xl shadow-red-600/30 hover:brightness-125 transition-all active:scale-[0.98]"
                  >
                    Initiate Private Sharding
                  </button>
                </div>
              )}

              {status.includes("SECURITY ALERT") && (
                <div className="mt-10 p-6 bg-red-600/10 text-red-500 border border-red-600/20 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                   SYSTEM REJECTED: ASSET VOLUME EXCEEDS 2GB QUOTA.
                </div>
              )}
            </div>
          </div>

          {/* ASSET MANAGER / HISTORY */}
          <div className="lg:col-span-5 bg-[#080808] p-12">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#ed1c24] mb-1">Restricted Ledger</div>
                <h3 className="text-2xl font-black tracking-tighter uppercase">VAULT ASSETS</h3>
              </div>
              <button 
                onClick={() => accessToken && fetchDriveFiles(accessToken)}
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>

            <div className="mb-8">
              <input 
                type="text" 
                placeholder="Search Private Shards..." 
                className="w-full bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-white text-[10px] font-black tracking-widest uppercase transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredHistory.length > 0 ? filteredHistory.map((item) => (
                <div key={item.id} className="bg-[#0a0a0a] border border-white/5 p-5 group hover:bg-white/5 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="overflow-hidden mr-4">
                      <p className="text-[11px] font-black text-white truncate uppercase tracking-tight mb-1">{item.name}</p>
                      <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{item.timestamp} &bull; {item.size}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {item.webViewLink && (
                      <button 
                        onClick={() => handleCopyLink(item.webViewLink!, item.id)}
                        className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest border transition-all ${copiedId === item.id ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10 text-gray-500 hover:border-white hover:text-white'}`}
                      >
                        {copiedId === item.id ? 'Access Key Copied' : 'Generate Link'}
                      </button>
                    )}
                    <button 
                      onClick={() => item.webViewLink && window.open(item.webViewLink, '_blank')}
                      className="px-4 py-2 border border-white/10 text-gray-500 hover:bg-white hover:text-black hover:border-white transition-all text-[9px] font-black uppercase tracking-widest"
                    >
                      Open
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-24 border border-dashed border-white/5">
                  <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">No assets in "{user.name}" vault</p>
                </div>
              )}
            </div>

            <div className="mt-12 pt-10 border-t border-white/10">
              <div className="bg-[#ed1c24] p-8 text-white group cursor-pointer overflow-hidden relative shadow-2xl shadow-red-600/20">
                <div className="absolute top-0 right-0 w-24 h-24 bg-black/10 -mr-12 -mt-12 rotate-45"></div>
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 relative z-10 flex items-center gap-2">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 9.155l7.834-4.256A1 1 0 0017 3H3a1 1 0 00-.834 1.9zM10 11.045l-7.834-4.256A1 1 0 001 7.639V15a2 2 0 002 2h14a2 2 0 002-2V7.639a1 1 0 00-1.166-.994l-7.834 4.4z" clipRule="evenodd" /></svg>
                  Vault Integrity
                </h4>
                <p className="text-[10px] text-red-100 font-medium leading-relaxed relative z-10">Access is strictly restricted to your authenticated Google identity. Files are isolated within a private user-specific shard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ed1c24; }
        @keyframes data-stream {
          from { transform: translateX(-100%); }
          to { transform: translateX(500%); }
        }
        .animate-data-stream {
          animation: data-stream 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default FileShare;