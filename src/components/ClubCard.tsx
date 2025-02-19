import React from "react";
import Link from "next/link";

interface ClubCardProps {
  club: {
    _id: string;
    name: string;
    description: string;
    owner?: {
      // Make owner optional
      username: string;
      email: string;
    };
    imageUrl?: string; // Add this if you plan to include club images
  };
}

const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  return (
    <Link href={`/clubs/${club._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105">
        {club.imageUrl && (
          <img
            src={club.imageUrl}
            alt={club.name}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2 text-gray-800">{club.name}</h2>
          <p className="text-gray-600 mb-4 line-clamp-3">{club.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            <span>{club.owner?.username}</span> {/* Use optional chaining */}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClubCard;
