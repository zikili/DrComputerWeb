import mongoose from "mongoose";

export interface IUser {
  _id: string;
  username: string;
  image: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  _id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>("User", UserSchema);
