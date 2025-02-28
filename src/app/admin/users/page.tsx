// app/admin/users/page.tsx
"use client";
import { useState, useEffect } from "react";

interface User {
  _id: string;
  email: string;
  username: string;
  role: "admin" | "student";
  createdAt: string;
}

interface Club {
  _id: string;
  name: string;
  admins: string[];
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, clubsResponse] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/clubs"),
        ]);

        if (!usersResponse.ok || !clubsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const usersData = await usersResponse.json();
        const clubsData = await clubsResponse.json();

        setUsers(usersData.users || []);
        setClubs(clubsData.clubs || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers =
    users?.filter(
      (user) =>
        user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user._id === userId
              ? { ...user, role: newRole as User["role"] }
              : user
          )
        );
      }
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleClubAdminChange = async (userId: string, clubId: string) => {
    try {
      const response = await fetch(`/api/admin/clubs/${clubId}/admins`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const updatedClub = await response.json();
        setClubs(
          clubs.map((club) => (club._id === clubId ? updatedClub : club))
        );
      }
    } catch (error) {
      console.error("Failed to update club admins:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-2 text-gray-600">
          Manage users and club administrators
        </p>
      </div>

      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Club Admin For
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {user?.username}
                    </div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user?.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="border rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 text-black"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2 items-center">
                    <select
                      onChange={(e) =>
                        handleClubAdminChange(user._id, e.target.value)
                      }
                      className="border rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 text-black"
                      defaultValue=""
                    >
                      <option value="">Add as club admin</option>
                      {clubs?.map((club) => (
                        <option
                          key={club._id}
                          value={club._id}
                          disabled={club?.admins?.includes(user._id)}
                        >
                          {club?.name}
                        </option>
                      ))}
                    </select>
                    {clubs
                      ?.filter((club) => club?.admins?.includes(user._id))
                      .map((club) => (
                        <span
                          key={club._id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {club?.name}
                        </span>
                      ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
