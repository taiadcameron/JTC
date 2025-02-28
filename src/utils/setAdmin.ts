import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function setAdminRole(email: string) {
  try {
    await dbConnect();

    // finds email of user and sets as admin
    const result = await User.findOneAndUpdate(
      { email: email },
      { $set: { role: "admin" } },
      { new: true }
    );

    if (result) {
      console.log("Admin role set successfully");
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error setting admin role:", error);
  }
}
