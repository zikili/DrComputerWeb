import mongoose from "mongoose";

export interface IPostComment {
    userId: string;
    content: string;
}

const PostCommentSchema = new mongoose.Schema<IPostComment>({
    userId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
});

export default PostCommentSchema;

