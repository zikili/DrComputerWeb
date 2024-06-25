import mongoose from "mongoose";

export interface IStudent {
  _id: string;
  name: string;
  age: number;
}

const StudentSchema = new mongoose.Schema<IStudent>({
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

export default mongoose.model<IStudent>("Student", StudentSchema);