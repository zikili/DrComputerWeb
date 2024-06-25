import mongoose from "mongoose";

export interface IAuthUser {
  _id: string;
  email: string;
  password: string;
  tokens: string[];
}

const AuthUserSchema = new mongoose.Schema<IAuthUser>({
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
    required: false,
  },
});

export default mongoose.model<IAuthUser>("AuthUser", AuthUserSchema);
