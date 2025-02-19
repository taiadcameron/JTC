"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Club {
  _id: string;
  name: string;
  description: string;
  category: string;
  isPrivate: boolean;
  members: string[];
}

export default function ClubDashboard() {
  const { data: session } = useSession();
  const [ownedClubs, setOwnedClubs] = useState<Club[]>([]);
  const [joinedClubs, setJoinedClubs] = useState<Club[]>([]);

  useEffect(() => {
    const fetchUserClubs = async () => {
      try {
        const response = await fetch("/api/dashboard/clubs");
        const data = await response.json();
        setOwnedClubs(data.ownedClubs);
        setJoinedClubs(data.joinedClubs);
      } catch (error) {
        console.error("Failed to fetch clubs:", error);
      }
    };

    if (session?.user) {
      fetchUserClubs();
    }
  }, [session]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Clubs</h1>
        <Link
          href="/clubs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create New Club
        </Link>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Clubs I Own</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ownedClubs.map((club) => (
            <ClubManageCard key={club._id} club={club} isOwner={true} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Clubs I've Joined</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {joinedClubs.map((club) => (
            <ClubManageCard key={club._id} club={club} isOwner={false} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ClubManageCard({ club, isOwner }: { club: Club; isOwner: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold text-lg mb-2">{club.name}</h3>
      <p className="text-gray-600 mb-4">{club.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {club.members.length} members
        </span>
        <div className="space-x-2">
          {isOwner ? (
            <Link
              href={`/clubs/${club._id}/edit`}
              className="bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200"
            >
              Manage
            </Link>
          ) : (
            <Link
              href={`/clubs/${club._id}`}
              className="bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200"
            >
              View
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
