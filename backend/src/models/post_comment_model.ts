import mongoose from "mongoose";

export interface IPostComment {
    _id:string;
    userName:string;
    postId: string;
    userId: string;
    content: string;
}

const PostCommentSchema = new mongoose.Schema<IPostComment>({


    postId:{
        type:String,
        required:true,
    },
    userId: {
        type: String,
        required: true,
    },
    userName:{
        type:String,
        required:true,
    },
    content: {
        type: String,
        required: true,
    }
});

export default mongoose.model<IPostComment>("PostComment", PostCommentSchema);

