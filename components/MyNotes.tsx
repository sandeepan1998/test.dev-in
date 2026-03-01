import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { User } from '../types';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: any;
}

export const MyNotes: React.FC<{ user: User }> = ({ user }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, `users/${user.id}/notes`));
    const unsub = onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note)));
      setLoading(false);
    });
    return () => unsub();
  }, [user.id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, `users/${user.id}/notes`), {
        title: newTitle,
        content: newContent,
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setNewTitle('');
      setNewContent('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-black p-12 border border-white/10 mt-10">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black tracking-tighter uppercase">My Notes</h2>
        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-[#ed1c24] hover:text-white transition-all">New Note</button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 font-black uppercase text-xs tracking-widest animate-pulse">Decrypting Notes...</div>
      ) : notes.length === 0 ? (
        <div className="border border-dashed border-white/10 py-32 text-center">
          <p className="text-gray-700 font-black uppercase text-xs tracking-[0.3em] italic">No active logs found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <div key={note.id} className="bg-[#111111] border border-white/10 p-8 hover:border-white/30 transition-all flex flex-col h-full">
              <h4 className="text-xl font-black tracking-tighter uppercase text-white mb-4 line-clamp-1">{note.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{note.content || 'No content.'}</p>
              <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest pt-4 border-t border-white/5">
                {note.createdAt?.toDate ? note.createdAt.toDate().toLocaleDateString() : 'Just now'}
              </p>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 p-10 w-full max-w-xl shadow-2xl">
            <h3 className="text-2xl font-black tracking-tighter uppercase mb-8 italic">New Log Entry</h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Log Title</label>
                <input required autoFocus placeholder="e.g. Meeting Notes" className="w-full bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-[#ed1c24] text-white transition-all font-medium placeholder:text-gray-700" value={newTitle} onChange={e => setNewTitle(e.target.value)} disabled={isSaving} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Log Content</label>
                <textarea rows={5} placeholder="Enter details..." className="w-full bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-[#ed1c24] text-white transition-all font-medium placeholder:text-gray-700 resize-none" value={newContent} onChange={e => setNewContent(e.target.value)} disabled={isSaving} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border border-white/20 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all" disabled={isSaving}>Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-[#ed1c24] hover:text-white transition-all disabled:opacity-50" disabled={isSaving}>{isSaving ? 'Encrypting...' : 'Save Log'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
