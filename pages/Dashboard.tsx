import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, Tag } from 'lucide-react';

export default function Dashboard({ user }: { user: any }) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json()),
      fetch('/api/services').then(res => res.json())
    ]).then(([bookingsData, servicesData]) => {
      setBookings(bookingsData);
      setServices(servicesData);
      setLoading(false);
    });
  }, []);

  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || 'Unknown Service';

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome back, {user.name}</h1>
          <p className="text-slate-600 mt-2">Manage your upcoming popup experiences.</p>
        </div>

        {loading ? (
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
    </div>
  );
}
