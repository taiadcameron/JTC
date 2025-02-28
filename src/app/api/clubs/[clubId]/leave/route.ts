import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Club from "@/models/Clubs";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const url = new URL(req.url);
    const pathname = url.pathname;
    const pathParts = pathname.split("/");
    const clubId = pathParts[3];

    if (!clubId) {
      return NextResponse.json(
        { message: "Club ID not found in URL" },
        { status: 400 }
      );
    }

    const userEmail = session.user.email;

    // Find the user by email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const club = await Club.findByIdAndUpdate(
      clubId,
      { $pull: { members: user._id } }, // Changed $addToSet to $pull
      { new: true }
    );

    if (!club) {
      return NextResponse.json({ message: "Club not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Left club successfully" },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to leave club", error: error.message },
      { status: 500 }
    );
  }
}
