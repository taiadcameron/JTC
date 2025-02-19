import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Club } from "@/models/Clubs";

export async function GET(
  request: Request,
  { params }: { params: { clubId: string } }
) {
  try {
    await dbConnect();
    const clubId = request.url.split("/").pop();

    const club = await Club.findById(clubId).populate("owner");

    if (!club) {
      return new NextResponse(JSON.stringify({ message: "Club not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new NextResponse(JSON.stringify({ club }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Failed to fetch club", error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
