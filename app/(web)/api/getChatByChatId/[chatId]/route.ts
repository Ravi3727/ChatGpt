// app/api/chat/[chatId]/route.ts
import { dbConnect } from "@/app/packages/mongoDb/dbConfig";
import { NextResponse } from "next/server";
import Chat from "@/app/packages/mongoDb/schema/chat";

// ✅ GET chat by chatId
export async function GET(request: Request, { params }: { params: { chatId: string } }) {
  try {
    await dbConnect();
    const chatId  = params.chatId;

    if (!chatId) {
      return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({ chat }, { status: 200 });
  } catch (error) {
    console.error("Error fetching chat by ID:", error);
    return NextResponse.json({ error: "Failed to fetch chat" }, { status: 500 });
  }
}
