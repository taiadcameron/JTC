/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/clubs/[clubId]/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface Member {
  _id: string;
  username: string;
  email: string;
}

interface Event {
  _id: string;
  title: string;
  date: string;
  description: string;
}

interface Club {
  _id: string;
  name: string;
  description: string;
  owner: {
    username: string;
    email: string;
  };
  imageUrl?: string;
  members: Member[];
  admins: string[];
}

export default function ClubPage() {
  const { clubId } = useParams();
  const { data: session } = useSession();
  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  useEffect(() => {
    const fetchClubData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch club details
        const clubResponse = await fetch(`/api/clubs/${clubId}`);
        if (!clubResponse.ok) throw new Error("Failed to fetch club details");
        const clubData = await clubResponse.json();
        setClub(clubData.club);

        // Check localStorage first for membership status
        const storedMembershipStatus = localStorage.getItem(
          `club_${clubId}_membership`
        );
        if (storedMembershipStatus) {
          setIsMember(JSON.parse(storedMembershipStatus));
        } else if (session?.user?.email) {
          // If not in localStorage, fetch from server
          const membershipResponse = await fetch(
            `/api/clubs/${clubId}/membership-status`
          );
          if (membershipResponse.ok) {
            const membershipData = await membershipResponse.json();
            setIsMember(membershipData.isMember);
            localStorage.setItem(
              `club_${clubId}_membership`,
              JSON.stringify(membershipData.isMember)
            );
          }
        }

        // Fetch events
        const eventsResponse = await fetch(`/api/clubs/${clubId}/events`);
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData.events);
        }
      } catch (error: any) {
        setError(error.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchClubData();
    }
  }, [clubId, session]);

  const handleJoinLeaveClub = async () => {
    if (!session?.user?.email) {
      setError("You must be logged in to join or leave a club");
      return;
    }

    setJoinLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/clubs/${clubId}/${isMember ? "leave" : "join"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const newMemberStatus = !isMember;
        setIsMember(newMemberStatus);
        localStorage.setItem(
          `club_${clubId}_membership`,
          JSON.stringify(newMemberStatus)
        );

        // Always refresh club data after join/leave
        const clubResponse = await fetch(`/api/clubs/${clubId}`);
        if (clubResponse.ok) {
          const clubData = await clubResponse.json();
          setClub(clubData.club);
        }
      } else {
        const errorData = await response.json();
        setError(
          errorData.message || `Failed to ${isMember ? "leave" : "join"} club`
        );
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred");
    } finally {
      setJoinLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  if (!club) return <div className="text-center mt-8">Club not found</div>;

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Club Header */}
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-gray-900">
            {club.name}{" "}
            <span className="text-xl font-normal text-gray-600">
              ({club.members.length} members)
            </span>
          </h1>
          <p className="mt-4 text-gray-600">{club.description}</p>
        </div>

        {/* Club Info and Join/Leave Button */}
        <div className="p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Owner</p>
              <p className="font-medium">{club.owner?.username || "Unknown"}</p>
            </div>
            <button
              onClick={handleJoinLeaveClub}
              disabled={joinLoading}
              className={`${
                isMember
                  ? "bg-red-500 hover:bg-red-700"
                  : "bg-blue-500 hover:bg-blue-700"
              } text-white font-bold py-2 px-6 rounded-lg transition-colors ${
                joinLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {joinLoading
                ? "Processing..."
                : isMember
                ? "Leave Club"
                : "Join Club"}
            </button>
          </div>
          {isMember && (
            <p className="mt-2 text-green-600 font-medium">
              ✓ You are a member of this club
            </p>
          )}
        </div>

        {/* Events Section */}
        {events.length > 0 && (
          <div className="p-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <ul className="space-y-4">
              {events.map((event) => (
                <li key={event._id} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-gray-700">{event.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
