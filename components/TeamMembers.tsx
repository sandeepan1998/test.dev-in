import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { User } from '../types';

interface Member {
  id: string;
  name: string;
  role: string;
  createdAt: any;
}

export const TeamMembers: React.FC<{ user: User }> = ({ user }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, `users/${user.id}/teamMembers`));
    const unsub = onSnapshot(q, (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member)));
      setLoading(false);
    });
    return () => unsub();
  }, [user.id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, `users/${user.id}/teamMembers`), {
        name: newName,
        role: newRole || 'Member',
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setNewName('');
      setNewRole('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-black p-12 border border-white/10 mt-10">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black tracking-tighter uppercase">Team Roster</h2>
        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-[#ed1c24] hover:text-white transition-all">Add Member</button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 font-black uppercase text-xs tracking-widest animate-pulse">Scanning Network...</div>
      ) : members.length === 0 ? (
        <div className="border border-dashed border-white/10 py-32 text-center">
          <p className="text-gray-700 font-black uppercase text-xs tracking-[0.3em] italic">No team members provisioned.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(member => (
            <div key={member.id} className="bg-[#111111] border border-white/10 p-6 flex items-center gap-6 hover:border-white/30 transition-all">
              <div className="w-12 h-12 bg-white/10 text-white flex items-center justify-center text-lg font-black shrink-0">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-lg font-black tracking-tighter uppercase text-white truncate">{member.name}</h4>
                <p className="text-[#ed1c24] text-[9px] font-bold uppercase tracking-widest truncate">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 p-10 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black tracking-tighter uppercase mb-8 italic">Provision Member</h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Operative Name</label>
                <input required autoFocus placeholder="e.g. Jane Doe" className="w-full bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-[#ed1c24] text-white transition-all font-medium placeholder:text-gray-700" value={newName} onChange={e => setNewName(e.target.value)} disabled={isSaving} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Assigned Role</label>
                <input placeholder="e.g. Engineer" className="w-full bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-[#ed1c24] text-white transition-all font-medium placeholder:text-gray-700" value={newRole} onChange={e => setNewRole(e.target.value)} disabled={isSaving} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border border-white/20 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all" disabled={isSaving}>Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-[#ed1c24] hover:text-white transition-all disabled:opacity-50" disabled={isSaving}>{isSaving ? 'Provisioning...' : 'Add Member'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
