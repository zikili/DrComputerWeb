import mongoose from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  age: number;
}

const UserSchema = new mongoose.Schema<IUser>({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<IUser>("Student", UserSchema);
