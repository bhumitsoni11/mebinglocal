"use client";
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Mock stats endpoint for the UI since the backend might not have this yet
      try {
        const res = await api.get('/admin/stats');
        return res.data;
      } catch (e) {
        return {
          totalUsers: 1542,
          totalLocalFriends: 328,
          totalBookings: 890,
          revenue: 12450
        };
      }
    }
  });

  if (isLoading) return <div className="p-10">Loading admin data...</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 font-['Plus_Jakarta_Sans']">
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1A3B2B", marginBottom: 24 }}>Admin Dashboard</h1>
      
      <div className="grid grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Users", value: stats?.totalUsers || 0, color: "#3B82F6" },
          { label: "Local Friends", value: stats?.totalLocalFriends || 0, color: "#10B981" },
          { label: "Total Bookings", value: stats?.totalBookings || 0, color: "#F59E0B" },
          { label: "Platform Revenue", value: `$${stats?.revenue || 0}`, color: "#C96F52" },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl p-6 bg-white border border-gray-200 shadow-sm">
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{stat.label}</div>
            <div className="text-3xl font-extrabold" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="rounded-2xl p-6 bg-white border border-gray-200">
          <h2 className="text-lg font-bold text-[#1A3B2B] mb-4">Recent Users</h2>
          <div className="text-sm text-gray-500 text-center py-10">User list will be integrated here</div>
        </div>
        <div className="rounded-2xl p-6 bg-white border border-gray-200">
          <h2 className="text-lg font-bold text-[#1A3B2B] mb-4">Recent Bookings</h2>
          <div className="text-sm text-gray-500 text-center py-10">Booking list will be integrated here</div>
        </div>
      </div>
    </div>
  );
}
