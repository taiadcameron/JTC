// src/models/Events.ts
import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
});

export const Event =
  mongoose.models.Event || mongoose.model("Event", EventSchema);
