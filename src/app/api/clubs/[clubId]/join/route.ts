import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import { Club } from "@/models/Clubs";
import User from "@/models/User"; // Import the User model
// app/api/clubs/[clubId]/join/route.ts
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const url = new URL(req.url);
    const clubId = url.pathname.split("/")[3];

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update both club and user
    const [club] = await Promise.all([
      Club.findByIdAndUpdate(
        clubId,
        { $addToSet: { members: user._id } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        user._id,
        { $addToSet: { clubs: clubId } },
        { new: true }
      ),
    ]);

    if (!club) {
      return NextResponse.json({ message: "Club not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Club joined successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to join club", error: (error as Error).message },
      { status: 500 }
    );
  }
}
