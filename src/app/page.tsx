"use client";
import React, { useState, useEffect } from "react";
import ClubCard from "@/components/ClubCard";

interface Club {
  _id: string;
  name: string;
  description: string;
  owner: {
    username: string;
    email: string;
  };
  imageUrl?: string;
}

const Home = () => {
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch("/api/clubs");
        if (response.ok) {
          const data = await response.json();
          setClubs(data.clubs);
        } else {
          console.error("Failed to fetch clubs");
        }
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };

    fetchClubs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Discover Clubs
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <ClubCard key={club._id} club={club} />
        ))}
      </div>
    </div>
  );
};

export default Home;
