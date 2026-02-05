
import React from 'react';
import { User, UserRole } from '../types';

interface DashboardProps {
  user: User;
  primaryColor: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, primaryColor }) => {
  const stats = [
    { label: 'Active Projects', value: '3', icon: '📁' },
    { label: 'Purchased Items', value: '12', icon: '🛒' },
    { label: 'Support Tickets', value: '0', icon: '🎟️' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-gray-500 capitalize">{user.role} Dashboard</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-bold text-lg">Recent Activity</h2>
              <button className="text-sm font-semibold" style={{ color: primaryColor }}>View All</button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold">
                      {i}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Downloaded "React Starter Kit"</p>
                      <p className="text-xs text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-bold text-lg">Your Subscriptions</h2>
            </div>
            <div className="p-20 text-center">
              <div className="text-4xl mb-4">💎</div>
              <p className="text-gray-500">You don't have any active subscriptions.</p>
              <button 
                className="mt-4 px-6 py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: primaryColor }}
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <button className="text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors font-medium text-sm">Update Profile</button>
              <button className="text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors font-medium text-sm">Security Settings</button>
              <button className="text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors font-medium text-sm">Billing Info</button>
              <button className="text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors font-medium text-sm">Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
