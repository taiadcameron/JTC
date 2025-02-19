import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Event } from "@/models/Events"; // Make sure you have this model

export async function GET(request: Request) {
  try {
    await dbConnect();

    // Extract clubId from the URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");
    const clubId = pathSegments[pathSegments.length - 2]; // Assuming the clubId is the second-to-last segment

    if (!clubId) {
      return NextResponse.json(
        { error: "Club ID not provided" },
        { status: 400 }
      );
    }

    const events = await Event.find({ club: clubId }).sort({ date: 1 });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: "Failed to fetch events", error: (error as Error).message },
      { status: 500 }
    );
  }
}
