"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      status === "authenticated" &&
      (!session?.user?.role || session.user.role !== "admin")
    ) {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="p-4">Loading...</div>;
  }

  if (!session?.user?.role || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="w-full flex flex-col bg-gray-800 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className=" flex gap-8">
          <a href="/admin" className="block hover:text-gray-300">
            Dashboard
          </a>
          <a href="/admin/users" className="block hover:text-gray-300">
            Manage Users
          </a>
          <a href="/admin/clubs" className="block hover:text-gray-300">
            Club Requests
          </a>
        </nav>
      </div>
      <main className="flex-1 p-8 bg-white">{children}</main>
    </div>
  );
}
