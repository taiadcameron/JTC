"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import {
  FaHome,
  FaCommentAlt,
  FaBookmark,
  FaBook,
  FaCompass,
  FaUserEdit,
} from "react-icons/fa";
import { useSession } from "next-auth/react";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const iconMap: { [key: string]: IconType } = {
  Home: FaHome,
  MessageCircle: FaCommentAlt,
  Bookmark: FaBookmark,
  BookImage: FaBook,
  Compass: FaCompass,
  UserPen: FaUserEdit,
};

function ClientSidebar({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();

  return (
    <ul>
      {navItems.map((item) => {
        const Icon = iconMap[item.icon];
        const isActive = pathname === item.href;
        return (
          <li key={item.href} className="mb-4">
            <Link
              href={item.href}
              className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-blue-700 hover:text-white"
              }`}
            >
              <Icon className="mr-3" />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function Sidebar() {
  const { data: session } = useSession();

  const navItems = [
    { href: "/dashboard", icon: "Home", label: "Home" },
    { href: "/messages", icon: "MessageCircle", label: "Messages" },
    { href: "/bookmarks", icon: "Bookmark", label: "Bookmarks" },
    { href: "/events", icon: "BookImage", label: "Events" },
    { href: "/clubs", icon: "Compass", label: "Clubs" },
    { href: "/profile", icon: "UserPen", label: "Profile" },
  ];

  return (
    <aside className="w-1/6 h-screen bg-gray-900 text-white p-4 flex flex-col ">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">JTC</h2>
      </div>
      <nav className="flex-grow overflow-y-auto">
        <ClientSidebar navItems={navItems} />
      </nav>
      {session && (
        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="flex items-center mb-4">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
            )}
            <div className="flex-grow">
              <div className="font-semibold">{session.user?.name}</div>
              <div className="text-sm text-gray-400">{session.user?.email}</div>
            </div>
            <button className="text-gray-400 hover:text-white">...</button>
          </div>
        </div>
      )}
    </aside>
  );
}
