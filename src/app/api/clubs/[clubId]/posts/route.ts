/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Post } from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";

export async function POST(
  request: Request,
  { params }: { params: { clubId: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const { title, content } = await request.json();
    const { clubId } = await params; // Await the params

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database using session email
    const user = await User.findOne({ email: session.user.email });

    const post = await Post.create({
      title,
      content,
      club: clubId,
      author: user._id,
      createdAt: new Date(),
    });

    // Return the created post with populated author
    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "username email"
    );

    return NextResponse.json({ post: populatedPost }, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { clubId: string } }
) {
  try {
    await dbConnect();
    const { clubId } = await params;

    const posts = await Post.find({ club: clubId })
      .select("title content author createdAt")
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ posts });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
