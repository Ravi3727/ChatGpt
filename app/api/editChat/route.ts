import { dbConnect } from "@/app/packages/mongoDb/dbConfig";
import { NextResponse } from "next/server";
import Chat from "@/app/packages/mongoDb/schema/chat";
import mongoose from "mongoose";


export async function PATCH(request: Request) {
  try {
    await dbConnect();

    const { chatId, messageId, question, answer, title } = await request.json();
    // console.log("Received data: Backend", chatId, messageId);
    if (!chatId || !messageId || !question || !answer || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedChat = await Chat.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(chatId),
        "chatData._id": new mongoose.Types.ObjectId(messageId),
      },
      {
        $set: {
          "chatData.$.question": question,
          "chatData.$.answers": answer,
          title,
        },
      },
      { new: true }
    );


    if (!updatedChat) {
      return NextResponse.json(
        { error: "Chat or message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Message and title updated successfully", chat: updatedChat },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}
