import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
    username: string;
    email: string;
    createdAt: Date;
    clerk_id: string;
}

const UserSchema: Schema<User> = new mongoose.Schema({
    clerk_id: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: [true, "username is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},
{
  timestamps: true,
});


const UserModel = (mongoose.models.Problem as mongoose.Model<User>) || mongoose.model<User>("Users", UserSchema);

export default UserModel;