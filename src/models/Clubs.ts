import mongoose, { Schema, Document, model, models } from "mongoose";

interface IClub extends Document {
  name: string;
  description: string;
  imageUrl?: string;
  owner: mongoose.Schema.Types.ObjectId;
  members: mongoose.Schema.Types.ObjectId[];
  events: mongoose.Schema.Types.ObjectId[];
  category: string;
  isPrivate: boolean;
  meetingTimes?: string[];
}

const ClubSchema: Schema = new Schema(
  {
    name: { type: String, required: true, maxlength: 60 },
    description: { type: String, required: true, maxlength: 400 },
    imageUrl: { type: String },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    category: {
      type: String,
      required: true,
      enum: ["academic", "sports", "cultural", "tech", "other"],
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    meetingTimes: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Club = models.Club || model<IClub>("Club", ClubSchema);
export default Club;

export type { IClub };
