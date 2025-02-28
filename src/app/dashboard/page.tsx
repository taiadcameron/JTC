"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EventsBar from "@/components/eventsBar";

interface Post {
  title: string;
  _id: string;
  content: string;
  club: { name: string; _id: string };
  author: { username: string };
}

interface Club {
  _id: string;
  name: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "user">("all");
  const [postContent, setPostContent] = useState("");
  const [selectedClub, setSelectedClub] = useState("");
  const [userClubs, setUserClubs] = useState<Club[]>([]);
  const [isPostFormVisible, setIsPostFormVisible] = useState(false);
  const [postTitle, setPostTitle] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }

    if (session?.user) {
      fetchPosts();
      fetchUserClubs();
    }
  }, [session, status, router, viewMode]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/dashboard/posts?mode=${viewMode}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setError("Failed to fetch posts. Please try again later.");
    }
  };

  const fetchUserClubs = async () => {
    try {
      const response = await fetch("/api/dashboard/clubs");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUserClubs([...data.ownedClubs, ...data.joinedClubs]);
    } catch (error) {
      console.error("Failed to fetch user clubs:", error);
    }
  };

  const CloseButton = () => (
    <button
      onClick={() => setIsPostFormVisible(false)}
      className=" text-gray-500 hover:text-gray-700"
    >
      x
    </button>
  );

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim() || !selectedClub) return;

    try {
      const response = await fetch(`/api/clubs/${selectedClub}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: postTitle,
          content: postContent,
        }),
      });

      if (response.ok) {
        setPostTitle("");
        setPostContent("");
        setSelectedClub("");
        setIsPostFormVisible(false);
        fetchPosts(); // Refresh posts after creating a new one
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="flex">
      <div className="space-y-6 p-6 w-full ">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* Post creation bar */}
        <div className="bg-white shadow-md rounded-lg p-4 relative">
          <input
            type="text"
            placeholder="Create a new post..."
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            onClick={() => setIsPostFormVisible(true)}
          />
          {isPostFormVisible && (
            <div className="mt-4">
              <form onSubmit={handlePostSubmit}>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full p-2 border rounded mb-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What's on your mind?"
                  rows={3}
                />
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="w-full p-2 border rounded mb-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a club</option>
                  {userClubs.map((club) => (
                    <option key={club._id} value={club._id}>
                      {club.name}
                    </option>
                  ))}
                </select>
                <div className="w-full flex justify-between">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    Post
                  </button>
                  <CloseButton />
                </div>
              </form>
            </div>
          )}
        </div>
        <div className="space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              viewMode === "all" ? "bg-blue-500 " : "bg-gray-200"
            }`}
            onClick={() => setViewMode("all")}
          >
            All Club Posts
          </button>
          <button
            className={`px-4 py-2 rounded ${
              viewMode === "user" ? "bg-blue-500 " : "bg-gray-200 text-black"
            }`}
            onClick={() => setViewMode("user")}
          >
            Your Club Posts
          </button>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {viewMode === "all" ? "All Club Posts" : "Your Club Posts"}
          </h2>
          {posts.map((post) => (
            <div key={post._id} className="bg-slate-600 rounded-lg shadow p-4">
              <p className="font-semibold">{post.author.username}</p>
              <p className="text-sm ">{post.club.name}</p>
              <p className="mt-2 font-bold">{post.title}</p>
              <p className="mt-2">{post.content}</p>
            </div>
          ))}
        </div>
      </div>

      <EventsBar />
    </div>
  );
}
