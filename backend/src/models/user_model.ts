import mongoose from "mongoose";

export interface IUser {
  _id: string;
  email: string;
  password: string;
  tokens:string[];
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: {
    type: [String],
    required: false
  }
});

export default mongoose.model<IUser>("User", UserSchema);