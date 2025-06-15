// app/api/chat/[userId]/route.ts

import { dbConnect } from "@/app/packages/mongoDb/dbConfig";
import { NextResponse, NextRequest } from "next/server";
import Chat from "@/app/packages/mongoDb/schema/chat";

export async function GET(request: NextRequest, {params}: {params: Promise<{ userId: string }>}) {
  const { userId } = await  params;
  try {
    await dbConnect();
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
    // console.log("Fetched chats for userId:", userId, "Chats count:", chats.length);
    return NextResponse.json({ chats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching chats by userId:", error);
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}
