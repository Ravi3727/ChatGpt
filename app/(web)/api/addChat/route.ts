// app/api/chat/[chatId]/route.ts
import { dbConnect } from "@/app/packages/mongoDb/dbConfig";
import { NextResponse } from "next/server";
import Chat from "@/app/packages/mongoDb/schema/chat";


// ✅ POST: Add or update a chat
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { userId, question, chatId } = await request.json();

    if (!userId || !question) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const answers = "This is a static answer from the API";
    const title = "Chat Title"; 

    if (chatId) {
      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { chatData: { question, answers } } },
        { new: true }
      );

      if (!updatedChat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }

      return NextResponse.json(
        { message: "Message added to existing chat", chat: updatedChat },
        { status: 200 }
      );
    } else {
      const newChat = new Chat({
        title,
        userId,
        chatData: [{ question, answers }],
      });

      const savedChat = await newChat.save();

      return NextResponse.json(
        { message: "New chat created", chat: savedChat },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error processing chat:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}