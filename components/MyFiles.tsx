import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { User } from '../types';

interface Folder {
  id: string;
  name: string;
  createdAt: any;
}

interface File {
  id: string;
  name: string;
  folderId?: string;
  size: string;
  createdAt: any;
}

export const MyFiles: React.FC<{ user: User }> = ({ user }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isSavingFolder, setIsSavingFolder] = useState(false);

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileSize, setNewFileSize] = useState('');
  const [newFileFolder, setNewFileFolder] = useState('');
  const [isSavingFile, setIsSavingFile] = useState(false);

  useEffect(() => {
    const foldersRef = collection(db, `users/${user.id}/folders`);
    const filesRef = collection(db, `users/${user.id}/files`);

    const unsubFolders = onSnapshot(query(foldersRef), (snapshot) => {
      setFolders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Folder)));
    });

    const unsubFiles = onSnapshot(query(filesRef), (snapshot) => {
      setFiles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as File)));
      setLoading(false);
    });

    return () => {
      unsubFolders();
      unsubFiles();
    };
  }, [user.id]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setIsSavingFolder(true);
    try {
      await addDoc(collection(db, `users/${user.id}/folders`), {
        name: newFolderName,
        createdAt: serverTimestamp()
      });
      setIsFolderModalOpen(false);
      setNewFolderName('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSavingFolder(false);
    }
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim() || !newFileSize.trim()) return;
    setIsSavingFile(true);
    try {
      await addDoc(collection(db, `users/${user.id}/files`), {
        name: newFileName,
        size: newFileSize,
        folderId: newFileFolder || null,
        createdAt: serverTimestamp()
      });
      setIsFileModalOpen(false);
      setNewFileName('');
      setNewFileSize('');
      setNewFileFolder('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSavingFile(false);
    }
  };

  return (
    <div className="bg-black p-12 border border-white/10 mt-10">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black tracking-tighter uppercase">My Files</h2>
        <div className="flex gap-4">
          <button onClick={() => setIsFolderModalOpen(true)} className="px-6 py-3 border border-white/20 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">New Folder</button>
          <button onClick={() => setIsFileModalOpen(true)} className="px-6 py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-[#ed1c24] hover:text-white transition-all">Add File</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 font-black uppercase text-xs tracking-widest animate-pulse">Loading Storage...</div>
      ) : folders.length === 0 && files.length === 0 ? (
        <div className="border border-dashed border-white/10 py-32 text-center">
          <p className="text-gray-700 font-black uppercase text-xs tracking-[0.3em] italic">Storage volume empty.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map(folder => (
            <div key={folder.id} className="bg-[#111111] border border-white/10 p-6 hover:border-[#ed1c24] transition-all">
              <div className="flex items-center gap-4 mb-4 text-[#ed1c24]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                <h4 className="text-lg font-black tracking-tighter uppercase text-white truncate">{folder.name}</h4>
              </div>
              <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">Folder</p>
            </div>
          ))}
          {files.map(file => (
            <div key={file.id} className="bg-[#111111] border border-white/10 p-6 hover:border-white/30 transition-all">
              <div className="flex items-center gap-4 mb-4 text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                <h4 className="text-lg font-black tracking-tighter uppercase text-white truncate">{file.name}</h4>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">{file.size}</p>
                {file.folderId && <p className="text-[#ed1c24] text-[9px] font-bold uppercase tracking-widest">In Folder</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Folder Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 p-10 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black tracking-tighter uppercase mb-8 italic">Initialize Folder</h3>
            <form onSubmit={handleCreateFolder} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Directory Name</label>
                <input required autoFocus placeholder="e.g. Project Alpha" className="w-full bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-[#ed1c24] text-white transition-all font-medium placeholder:text-gray-700" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} disabled={isSavingFolder} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsFolderModalOpen(false)} className="flex-1 py-4 border border-white/20 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all" disabled={isSavingFolder}>Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-[#ed1c24] hover:text-white transition-all disabled:opacity-50" disabled={isSavingFolder}>{isSavingFolder ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Modal */}
      {isFileModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 p-10 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black tracking-tighter uppercase mb-8 italic">Upload Asset</h3>
            <form onSubmit={handleCreateFile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset Name</label>
                <input required autoFocus placeholder="e.g. schematic.pdf" className="w-full bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-[#ed1c24] text-white transition-all font-medium placeholder:text-gray-700" value={newFileName} onChange={e => setNewFileName(e.target.value)} disabled={isSavingFile} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset Size</label>
                <input required placeholder="e.g. 2.4 MB" className="w-full bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-[#ed1c24] text-white transition-all font-medium placeholder:text-gray-700" value={newFileSize} onChange={e => setNewFileSize(e.target.value)} disabled={isSavingFile} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Target Directory (Optional)</label>
                <select className="w-full bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-[#ed1c24] text-white transition-all font-medium" value={newFileFolder} onChange={e => setNewFileFolder(e.target.value)} disabled={isSavingFile}>
                  <option value="" className="bg-black">Root Directory</option>
                  {folders.map(f => <option key={f.id} value={f.id} className="bg-black">{f.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsFileModalOpen(false)} className="flex-1 py-4 border border-white/20 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all" disabled={isSavingFile}>Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-[#ed1c24] hover:text-white transition-all disabled:opacity-50" disabled={isSavingFile}>{isSavingFile ? 'Uploading...' : 'Upload'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
