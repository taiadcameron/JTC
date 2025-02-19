import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { Club } from "@/models/Clubs";

export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ isMember: false });
  }

  try {
    await dbConnect();

    // Extract clubId from the URL
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");
    const clubId = pathSegments[pathSegments.length - 2]; // Assuming the clubId is the second-to-last segment

    if (!clubId) {
      return NextResponse.json(
        { error: "Club ID not provided" },
        { status: 400 }
      );
    }

    const club = await Club.findById(clubId);

    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    const isMember = club.members.includes(session.user.email);
    return NextResponse.json({ isMember });
  } catch (error) {
    console.error("Error checking membership status:", error);
    return NextResponse.json(
      { error: "Failed to check membership status" },
      { status: 500 }
    );
  }
}
