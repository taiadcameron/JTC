export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <nav className="space-y-4">
          <a href="/dashboard" className="block hover:text-gray-300">
            Overview
          </a>
          <a href="/dashboard/clubs" className="block hover:text-gray-300">
            My Clubs
          </a>
          <a href="/dashboard/events" className="block hover:text-gray-300">
            Events
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
