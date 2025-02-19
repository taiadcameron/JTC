// app/admin/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface DashboardStats {
  totalUsers: number;
  totalClubs: number;
  pendingRequests: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalClubs: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {session?.user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="bg-blue-50"
          textColor="text-blue-700"
        />
        <StatCard
          title="Active Clubs"
          value={stats.totalClubs}
          icon="🏢"
          color="bg-green-50"
          textColor="text-green-700"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon="📝"
          color="bg-yellow-50"
          textColor="text-yellow-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <ActionButton label="Manage Users" href="/admin/users" icon="👥" />
            <ActionButton label="Club Requests" href="/admin/clubs" icon="📋" />
            <ActionButton
              label="System Settings"
              href="/admin/settings"
              icon="⚙️"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <ActivityItem
              title="New Club Request"
              description="Chess Club pending approval"
              time="2 hours ago"
            />
            <ActivityItem
              title="User Role Updated"
              description="John Doe assigned as club owner"
              time="5 hours ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  textColor,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
  textColor: string;
}) {
  return (
    <div className={`${color} rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
    </div>
  );
}

function ActionButton({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <span className="text-xl mr-3">{icon}</span>
      <span className="text-gray-700">{label}</span>
    </a>
  );
}

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="border-l-4 border-blue-500 pl-4">
      <h4 className="font-medium text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  );
}
