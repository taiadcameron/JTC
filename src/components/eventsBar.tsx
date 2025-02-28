"use client";
import Image from "next/image";

import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useSession } from "next-auth/react";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
}

function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <Image
        src={event.image}
        alt={event.title}
        width={200}
        height={100}
        className="rounded-lg mb-2"
      />
      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
      <div className="flex items-center text-sm text-gray-400 mb-1">
        <FaCalendarAlt className="mr-2" />
        <span>{event.date}</span>
      </div>
      <div className="flex items-center text-sm text-gray-400 mb-1">
        <FaClock className="mr-2" />
        <span>{event.time}</span>
      </div>
      <div className="flex items-center text-sm text-gray-400">
        <FaMapMarkerAlt className="mr-2" />
        <span>{event.location}</span>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { data: session } = useSession();

  const events: Event[] = [
    {
      id: 1,
      title: "Tech Meetup",
      date: "2023-06-15",
      time: "18:00",
      location: "London Tech Hub",
      image: "/images/tech-meetup.jpg",
    },
    {
      id: 2,
      title: "Startup Pitch Night",
      date: "2023-06-20",
      time: "19:30",
      location: "Innovation Center",
      image: "/images/startup-pitch.jpg",
    },
    {
      id: 3,
      title: "AI Workshop",
      date: "2023-06-25",
      time: "10:00",
      location: "Digital Academy",
      image: "/images/ai-workshop.jpg",
    },
  ];

  return (
    <aside className="w-1/4  h-screen bg-gray-900 text-white p-4 flex flex-col overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
      </div>
      <div className="flex-grow">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
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
