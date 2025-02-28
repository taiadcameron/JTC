// app/api/clubs/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Club from "@/models/Clubs";

export async function GET() {
  try {
    await dbConnect();
    const clubs = await Club.find({}).populate("owner", "username email");

    return NextResponse.json({ clubs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching clubs:", error);
    return NextResponse.json(
      { message: "Failed to fetch clubs" },
      { status: 500 }
    );
  }
}
