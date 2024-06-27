//TODO remove this scheme

import mongoose from "mongoose";

export interface IUser {
  _id: string;
  image: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  _id:{ 
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>("User", UserSchema);
