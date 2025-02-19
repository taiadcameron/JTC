// models/User.ts
import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    username: {
      type: String,
      required: [true, "Please provide a username"],
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "club_owner", "admin"],
      default: "student",
    },
    clubs: [{ type: Schema.Types.ObjectId, ref: "Club" }],
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", userSchema);

export default User;
