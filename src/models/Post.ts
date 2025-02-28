import mongoose, { Schema, Document } from "mongoose";
import Club from "./Clubs";

interface IPost extends Document {
  title: string;
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  club: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },

  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Club.modelName,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export { Post };
export type { IPost };
