import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Club from "@/models/Clubs";

export async function GET(
  request: Request,
  {}: { params: { clubId: string } }
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
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ clubId: string }> }
) {
  try {
    await dbConnect();
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);

    // Await the params object
    const { clubId } = await params;

    const updatedClub = await Club.findByIdAndUpdate(
      clubId,
      { $set: updates },
      { new: true }
    );

    if (!updatedClub) {
      return new NextResponse(JSON.stringify({ message: "Club not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new NextResponse(
      JSON.stringify({
        message: "Club updated successfully",
        club: updatedClub,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: "Failed to update club",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
