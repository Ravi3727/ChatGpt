import mongoose, { Schema, Document } from "mongoose";


export interface ChatData {
    question: string;
    answers: string;
}
export interface Chats extends Document {
    userId: string;
    chatData: ChatData[];
    createdAt: Date;
}

const ChatsSchema: Schema<Chats> = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "UserId is required"]
    },
    chatData: [{
        question: {
            type: String,
            required: [true, "Question is required"],
        },
        answers: {
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


const ChatsModel = (mongoose.models.Problem as mongoose.Model<Chats>) || mongoose.model<Chats>("Chats", ChatsSchema);

export default ChatsModel;