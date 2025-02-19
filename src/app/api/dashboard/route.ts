/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import { Club } from "@/models/Clubs";
import User from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const user = await User.findOne({ email: session.user.email });

    const [ownedClubs, joinedClubs, upcomingEvents] = await Promise.all([
      Club.countDocuments({ owner: user._id }),
      Club.countDocuments({ members: user._id }),
      // Add Event count query here when implemented
    ]);

    return NextResponse.json({
      clubsOwned: ownedClubs,
      clubsJoined: joinedClubs,
      upcomingEvents: 0, // Will be updated when events are implemented
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
