// app/api/admin/setup/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, secretKey } = await req.json();

    if (secretKey !== process.env.ADMIN_SETUP_KEY) {
      return NextResponse.json(
        { error: "Invalid secret key" },
        { status: 401 }
      );
    }

    await dbConnect();

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Admin role set successfully",
      user: updatedUser,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to set admin role" },
      { status: 500 }
    );
  }
}
