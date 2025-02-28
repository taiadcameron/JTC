"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ClubManageCard } from "@/components/ClubManageCard";

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
  const [allClubs, setAllClubs] = useState<Club[]>([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const [userClubsResponse, allClubsResponse] = await Promise.all([
          fetch("/api/dashboard/clubs"),
          fetch("/api/clubs"),
        ]);
        const userClubsData = await userClubsResponse.json();
        const allClubsData = await allClubsResponse.json();

        setOwnedClubs(userClubsData.ownedClubs);
        setJoinedClubs(userClubsData.joinedClubs);
        setAllClubs(allClubsData.clubs);
      } catch (error) {
        console.error("Failed to fetch clubs:", error);
      }
    };

    if (session?.user) {
      fetchClubs();
    }
  }, [session]);

  const handleUpdateClub = async (clubId: string, formData: FormData) => {
    try {
      const response = await fetch(`/api/clubs/${clubId}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const { club: updatedClub } = await response.json();
        setOwnedClubs((prevClubs) =>
          prevClubs.map((club) =>
            club._id === updatedClub._id ? updatedClub : club
          )
        );
        setAllClubs((prevClubs) =>
          prevClubs.map((club) =>
            club._id === updatedClub._id ? updatedClub : club
          )
        );
      } else {
        console.error("Failed to update club");
      }
    } catch (error) {
      console.error("Error updating club:", error);
    }
  };

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
            <ClubManageCard
              key={club._id}
              club={club}
              isOwner={true}
              onUpdateClub={handleUpdateClub}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Clubs Ive Joined</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {joinedClubs.map((club) => (
            <ClubManageCard
              key={club._id}
              club={club}
              isOwner={false}
              onUpdateClub={handleUpdateClub}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">All Clubs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allClubs.map((club) => (
            <ClubManageCard
              key={club._id}
              club={club}
              isOwner={ownedClubs.some(
                (ownedClub) => ownedClub._id === club._id
              )}
              onUpdateClub={handleUpdateClub}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
