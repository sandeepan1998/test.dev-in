import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, addDays, startOfToday } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

export default function Planner({ user }: { user: any }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialServiceId = searchParams.get('service') || '';

  const [services, setServices] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceId: initialServiceId,
    size: 'Medium',
    theme: 'Classic',
    date: format(addDays(startOfToday(), 7), 'yyyy-MM-dd'),
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        if (!initialServiceId && data.length > 0) {
          setFormData(prev => ({ ...prev, serviceId: data[0].id }));
        }
      });
  }, [initialServiceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=/planner');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          serviceId: formData.serviceId,
          date: formData.date,
          details: {
            size: formData.size,
            theme: formData.theme,
            notes: formData.notes
          }
        })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        alert('Failed to book. Please try again.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500 mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Booking Confirmed!</h2>
          <p className="text-slate-600 mb-8">We've received your request and will send a confirmation email shortly.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Plan Your Popup</h1>
          <p className="text-lg text-slate-600">Customize your experience and secure your date.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-100">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 py-4 text-center font-bold text-sm ${step === s ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}>
                Step {s}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Select Service & Theme</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Base Package</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {services.map(service => (
                      <div 
                        key={service.id}
                        onClick={() => setFormData({ ...formData, serviceId: service.id })}
                        className={`cursor-pointer border rounded-xl p-4 transition-all ${formData.serviceId === service.id ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-indigo-300'}`}
                      >
                        <div className="font-bold text-slate-900 mb-1">{service.name}</div>
                        <div className="text-indigo-600 font-semibold">${service.price}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Event Size</label>
                  <select 
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                  >
                    <option>Intimate (2-10 people)</option>
                    <option>Medium (11-50 people)</option>
                    <option>Large (51-150 people)</option>
                    <option>Massive (150+ people)</option>
                  </select>
                </div>

                <div className="pt-6 flex justify-end">
                  <button type="button" onClick={() => setStep(2)} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">Next Step</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Schedule Date</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="date" 
                      min={format(addDays(startOfToday(), 3), 'yyyy-MM-dd')}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10 p-3 border"
                      required
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Bookings must be made at least 3 days in advance.</p>
                </div>

                <div className="pt-6 flex justify-between">
                  <button type="button" onClick={() => setStep(1)} className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">Back</button>
                  <button type="button" onClick={() => setStep(3)} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">Next Step</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Final Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Special Requests / Notes</label>
                  <textarea 
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                    placeholder="Any specific dietary requirements, location details, or special requests?"
                  ></textarea>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-4">Booking Summary</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between"><dt className="text-slate-500">Service:</dt><dd className="font-medium text-slate-900">{services.find(s => s.id === formData.serviceId)?.name}</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-500">Size:</dt><dd className="font-medium text-slate-900">{formData.size}</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-500">Date:</dt><dd className="font-medium text-slate-900">{format(new Date(formData.date), 'MMMM d, yyyy')}</dd></div>
                    <div className="flex justify-between pt-4 border-t border-slate-200 mt-4"><dt className="font-bold text-slate-900">Total Estimated:</dt><dd className="font-bold text-indigo-600">${services.find(s => s.id === formData.serviceId)?.price}</dd></div>
                  </dl>
                </div>

                <div className="pt-6 flex justify-between items-center">
                  <button type="button" onClick={() => setStep(2)} className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">Back</button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : user ? 'Confirm Booking' : 'Login to Book'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
