/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface Post {
  title: string;
  _id: string;
  content: string;
  author: {
    username: string;
    email: string;
  };
  createdAt: string;
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);

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

        // Fetch posts
        const postsResponse = await fetch(`/api/clubs/${clubId}/posts`);
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData.posts);
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

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) {
      setError("You must be logged in to create a post");
      return;
    }

    setPostLoading(true);
    try {
      const response = await fetch(`/api/clubs/${clubId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: postTitle, content: postContent }),
      });

      if (response.ok) {
        setPostContent("");
        setPostTitle("");
        const postsResponse = await fetch(`/api/clubs/${clubId}/posts`);
        const postsData = await postsResponse.json();
        setPosts(postsData.posts);
      }
    } catch (error: any) {
      setError(error.message || "Failed to create post");
    } finally {
      setPostLoading(false);
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
              <p className="font-medium text-black">
                {club.owner?.username || "Unknown"}
              </p>
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
        </div>

        {/* event section */}
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

        {/* Posts Section */}
        <div className="p-6 border-t">
          <h2 className="text-xl font-semibold mb-4 text-black">Club Posts</h2>

          {isMember && (
            <form onSubmit={handleCreatePost} className="mb-6">
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full p-3 border rounded-lg mb-2 text-black"
                placeholder="Post title"
                required
              />
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-full p-3 border rounded-lg resize-none text-black"
                rows={4}
                placeholder="Share something with the club..."
                required
              />
              <button
                type="submit"
                disabled={postLoading}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {postLoading ? "Posting..." : "Post"}
              </button>
            </form>
          )}

          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div>
                    <div className="font-semibold text-black">
                      {post.author.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <h3 className="text-gray-700 whitespace-pre-wrap">
                  {post.title}
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
