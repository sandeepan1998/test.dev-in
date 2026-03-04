import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function Admin({ user }: { user: any }) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    
    Promise.all([
      fetch('/api/bookings', { headers }).then(res => res.json()),
      fetch('/api/admin/users', { headers }).then(res => res.json()),
      fetch('/api/services').then(res => res.json())
    ]).then(([bookingsData, usersData, servicesData]) => {
      setBookings(bookingsData);
      setUsers(usersData);
      setServices(servicesData);
      setLoading(false);
    });
  }, []);

  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || 'Unknown';
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Unknown';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage all system bookings and users.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Recent Bookings</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {bookings.map(booking => (
                  <div key={booking.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900">{getServiceName(booking.serviceId)}</h4>
                        <p className="text-sm text-slate-500">Booked by {getUserName(booking.userId)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 mt-4 grid grid-cols-2 gap-4">
                      <div><span className="font-medium">Date:</span> {format(new Date(booking.date), 'MMM d, yyyy')}</div>
                      <div><span className="font-medium">Size:</span> {booking.details.size}</div>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && <div className="p-6 text-center text-slate-500">No bookings found.</div>}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Registered Users</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {users.map(u => (
                  <div key={u.id} className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-slate-900">{u.name}</div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                    </div>
                    <span className={`text-xs font-bold uppercase ${u.role === 'admin' ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
