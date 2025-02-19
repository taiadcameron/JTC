// app/api/dashboard/clubs/route.ts
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

    const [ownedClubs, joinedClubs] = await Promise.all([
      Club.find({ owner: user._id }),
      Club.find({
        members: user._id,
        owner: { $ne: user._id },
      }),
    ]);

    return NextResponse.json({
      ownedClubs,
      joinedClubs,
    });
  } catch (error) {
    console.error("Error fetching user clubs:", error);
    return NextResponse.json(
      { message: "Failed to fetch clubs" },
      { status: 500 }
    );
  }
}
