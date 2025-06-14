import mongoose, { Schema, Document } from "mongoose";


export interface ChatData {
    question: string;
    answers: string;
}
export interface Chats extends Document {
    userId: string;
    chatData: ChatData[];
    createdAt: Date;
    title: string;
}

const ChatsSchema: Schema<Chats> = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Title is required"],
        default: "Chat"
    },
    userId: {
        type: String,
        required: [true, "UserId is required"]
    },
    chatData: [{
        question: {
            type: String,
            required: [true, "Question is required"],
        },
        answer: {
            type: String,
            required: [false, "Statement of question is required"],
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
},
    {
        timestamps: true,
    });


const ChatsModel = (mongoose.models.Problem as mongoose.Model<Chats>) || mongoose.model<Chats>("Chat", ChatsSchema);

export default ChatsModel;