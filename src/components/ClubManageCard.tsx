// src/components/ClubManageCard.tsx
import React, { useState } from "react";
import Link from "next/link";
import { ClubEditPopup } from "./ClubEditPopup";
import { Club } from "@/types/Club";
interface ClubManageCardProps {
  club: Club;
  isOwner: boolean;
  onUpdateClub: (clubId: string, formData: FormData) => Promise<void>;
}

export function ClubManageCard({
  club,
  isOwner,
  onUpdateClub,
}: ClubManageCardProps) {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  const handleManageClick = () => {
    setIsEditPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsEditPopupOpen(false);
  };

  const handleSaveClub = async (clubId: string, formData: FormData) => {
    await onUpdateClub(clubId, formData);
    setIsEditPopupOpen(false);
  };

  return (
    <div className="bg-gray-400 rounded-lg shadow p-4">
      <h3 className="font-bold text-lg mb-2">{club.name}</h3>
      <p className="text-gray-600 mb-4">{club.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {club.members.length} members
        </span>
        <div className="space-x-2">
          {isOwner ? (
            <button
              onClick={handleManageClick}
              className="bg-black px-3 py-1 rounded-md hover:bg-gray-200"
            >
              Manage
            </button>
          ) : (
            <Link
              href={`/clubs/${club._id}`}
              className="bg-black px-3 py-1 rounded-md hover:bg-gray-200"
            >
              View
            </Link>
          )}
        </div>
      </div>
      {isEditPopupOpen && (
        <ClubEditPopup
          club={club}
          onClose={handleClosePopup}
          onSave={handleSaveClub}
        />
      )}
    </div>
  );
}
