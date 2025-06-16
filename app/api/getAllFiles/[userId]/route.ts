import { dbConnect } from "@/app/packages/mongoDb/dbConfig";
import Chat from "@/app/packages/mongoDb/schema/chat";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Promise<{ userId: string }>}) {
  try {
    await dbConnect();

    const { userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const chats = await Chat.find({ userId });

    const fileUrls: string[] = [];

    for (const chat of chats) {
      for (const entry of chat.chatData) {
        if (entry.fileUrls && typeof entry.fileUrls === "string" && entry.fileUrls.trim() !== "") {
          fileUrls.push(entry.fileUrls);
        }
      }
    }
    // console.log("Fetched fileUrls for userId:", userId, "File URLs count:", fileUrls);

    return NextResponse.json({ fileUrls }, { status: 200 });
  } catch (error) {
    console.error("Error fetching fileUrls:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
