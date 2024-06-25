import mongoose from "mongoose";

export interface IPost {
  _id: string;
  title: string;
  message: string;
  owner: string;
}

const PostSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IPost>("Post", PostSchema);