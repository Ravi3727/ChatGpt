// app/api/chat/route.ts
import { dbConnect } from "@/app/packages/mongoDb/dbConfig";
import { NextResponse } from "next/server";
import Chat from "@/app/packages/mongoDb/schema/chat";


export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    await dbConnect();
    const {userId} = await params;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ chats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching chats by userId:", error);
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}

