/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Post } from "@/models/Post";
import User from "@/models/User";
import Club from "@/models/Clubs"; // Make sure to import the Club model
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mode = request.nextUrl.searchParams.get("mode");

    let posts;

    if (mode === "user") {
      // Fetch the user
      const user = await User.findOne({ email: session.user.email });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Fetch clubs where the user is a current member
      const userClubs = await Club.find({ members: user._id }).select("_id");
      const userClubIds = userClubs.map((club: { _id: any }) => club._id);

      // Fetch posts only from the user's current clubs
      posts = await Post.find({ club: { $in: userClubIds } })
        .populate("author", "username email")
        .populate("club", "name")
        .sort({ createdAt: -1 });
    } else {
      // Fetch all posts
      posts = await Post.find({})
        .populate("author", "username email")
        .populate("club", "name")
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching posts" },
      { status: 500 }
    );
  }
}
