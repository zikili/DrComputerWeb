import mongoose from "mongoose";

export interface IPost {
    _id: string;
    owner: string;
    type: string;
    gpu: string;
    cpu: string;
    motherboard: string;
    memory: string;
    ram: string;
    image: string;
    comments: number;
}

const PostSchema = new mongoose.Schema<IPost>({
    owner: {
        type: String,
        required:false,
    },
    type: {
        type: String,
        required: true,
    },
    gpu: {
        type: String,
        required: true,
    },
    cpu: {
        type: String,
        required: true,
    },
    motherboard: {
        type: String,
        required: true,
    },
    memory: {
        type: String,
        required: true,
    },
    ram: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    comments: {
        type: Number,
        required:true  // Using the schema itself, not the model
    }
});

export default mongoose.model<IPost>("Post", PostSchema);
