import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, Tag, Folder, File as FileIcon, StickyNote, Users, Plus, X } from 'lucide-react';
import { collection, query, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export default function Dashboard({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Bookings state
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Firestore states
  const [folders, setFolders] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadingTeam, setLoadingTeam] = useState(true);

  // Modal states
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // Form states
  const [folderName, setFolderName] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileFolderId, setFileFolderId] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch bookings
    Promise.all([
      fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json()),
      fetch('/api/services').then(res => res.json())
    ]).then(([bookingsData, servicesData]) => {
      setBookings(bookingsData);
      setServices(servicesData);
      setLoadingBookings(false);
    });

    // Fetch Firestore data
    fetchFilesData();
    fetchNotesData();
    fetchTeamData();
  }, [user.id]);

  const fetchFilesData = async () => {
    setLoadingFiles(true);
    try {
      const foldersSnap = await getDocs(query(collection(db, `users/${user.id}/folders`), orderBy('createdAt', 'desc')));
      const filesSnap = await getDocs(query(collection(db, `users/${user.id}/files`), orderBy('createdAt', 'desc')));
      setFolders(foldersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setFiles(filesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
    setLoadingFiles(false);
  };

  const fetchNotesData = async () => {
    setLoadingNotes(true);
    try {
      const notesSnap = await getDocs(query(collection(db, `users/${user.id}/notes`), orderBy('createdAt', 'desc')));
      setNotes(notesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
    setLoadingNotes(false);
  };

  const fetchTeamData = async () => {
    setLoadingTeam(true);
    try {
      const teamSnap = await getDocs(query(collection(db, `users/${user.id}/teamMembers`), orderBy('createdAt', 'desc')));
      setTeamMembers(teamSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
    setLoadingTeam(false);
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, `users/${user.id}/folders`), {
        name: folderName,
        createdAt: serverTimestamp()
      });
      setFolderName('');
      setIsFolderModalOpen(false);
      fetchFilesData();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, `users/${user.id}/files`), {
        name: fileName,
        folderId: fileFolderId || null,
        size: fileSize,
        createdAt: serverTimestamp()
      });
      setFileName('');
      setFileFolderId('');
      setFileSize('');
      setIsFileModalOpen(false);
      fetchFilesData();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, `users/${user.id}/notes`), {
        title: noteTitle,
        content: noteContent,
        createdAt: serverTimestamp()
      });
      setNoteTitle('');
      setNoteContent('');
      setIsNoteModalOpen(false);
      fetchNotesData();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, `users/${user.id}/teamMembers`), {
        name: memberName,
        role: memberRole,
        createdAt: serverTimestamp()
      });
      setMemberName('');
      setMemberRole('');
      setIsTeamModalOpen(false);
      fetchTeamData();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || 'Unknown Service';

  const tabs = [
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'files', label: 'My Files', icon: Folder },
    { id: 'notes', label: 'My Notes', icon: StickyNote },
    { id: 'team', label: 'Team Members', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome back, {user.name}</h1>
          <p className="text-slate-600 mt-2">Manage your upcoming popup experiences and workspace.</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                    ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'bookings' && (
          <div>
            {loadingBookings ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4">No bookings yet</h3>
                <p className="text-slate-600 mb-8">Ready to plan your first unforgettable popup experience?</p>
                <a href="#/planner" className="inline-flex justify-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700">
                  Start Planning
                </a>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${booking.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-slate-900">{getServiceName(booking.serviceId)}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3 text-sm text-slate-600 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>{format(new Date(booking.date), 'MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-slate-400" />
                        <span>{booking.details.size} Size</span>
                      </div>
                    </div>

                    {booking.details.notes && (
                      <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 italic border border-slate-100">
                        "{booking.details.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'files' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">My Files</h2>
              <div className="flex gap-3">
                <button onClick={() => setIsFolderModalOpen(true)} className="inline-flex items-center justify-center py-2 px-4 border border-slate-300 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
                  <Folder className="w-4 h-4 mr-2" /> New Folder
                </button>
                <button onClick={() => setIsFileModalOpen(true)} className="inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4 mr-2" /> Add File
                </button>
              </div>
            </div>

            {loadingFiles ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : folders.length === 0 && files.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                <Folder className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No files or folders</h3>
                <p className="text-slate-600">Create a folder or upload a file to get started.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {folders.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Folders</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {folders.map(folder => (
                        <div key={folder.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3 hover:border-indigo-300 cursor-pointer transition-colors">
                          <Folder className="w-8 h-8 text-indigo-500" />
                          <span className="font-medium text-slate-900 truncate">{folder.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {files.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Files</h3>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <ul className="divide-y divide-slate-200">
                        {files.map(file => (
                          <li key={file.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                            <div className="flex items-center gap-3">
                              <FileIcon className="w-6 h-6 text-slate-400" />
                              <div>
                                <p className="text-sm font-medium text-slate-900">{file.name}</p>
                                {file.folderId && (
                                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Folder className="w-3 h-3" /> {folders.find(f => f.id === file.folderId)?.name || 'Unknown Folder'}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className="text-sm text-slate-500">{file.size}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">My Notes</h2>
              <button onClick={() => setIsNoteModalOpen(true)} className="inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" /> New Note
              </button>
            </div>

            {loadingNotes ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : notes.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                <StickyNote className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No notes yet</h3>
                <p className="text-slate-600">Jot down your ideas and plans here.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {notes.map(note => (
                  <div key={note.id} className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{note.title}</h3>
                    <p className="text-slate-700 text-sm whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'team' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Team Members</h2>
              <button onClick={() => setIsTeamModalOpen(true)} className="inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" /> Add Member
              </button>
            </div>

            {loadingTeam ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                <Users className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No team members</h3>
                <p className="text-slate-600">Add members to collaborate on your events.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <ul className="divide-y divide-slate-200">
                  {teamMembers.map(member => (
                    <li key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{member.name}</p>
                          {member.role && <p className="text-xs text-slate-500">{member.role}</p>}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      
      {/* New Folder Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">New Folder</h3>
              <button onClick={() => setIsFolderModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateFolder} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">Folder Name</label>
                <input
                  type="text"
                  required
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Invoices"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsFolderModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? 'Creating...' : 'Create Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add File Modal */}
      {isFileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Add File</h3>
              <button onClick={() => setIsFileModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateFile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">File Name</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Contract.pdf"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Folder (Optional)</label>
                <select
                  value={fileFolderId}
                  onChange={(e) => setFileFolderId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">No Folder</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Size (Optional)</label>
                <input
                  type="text"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 2.4 MB"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsFileModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Add File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">New Note</h3>
              <button onClick={() => setIsNoteModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateNote} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Note title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                <textarea
                  required
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Write your note here..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsNoteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Add Team Member</h3>
              <button onClick={() => setIsTeamModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateMember} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role (Optional)</label>
                <input
                  type="text"
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Event Coordinator"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsTeamModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
