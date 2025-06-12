import {dbConnect} from "@/app/packages/mongoDb/dbConfig";
import { NextResponse } from "next/server";
import Chat from "@/app/packages/mongoDb/schema/chat";

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const { userId, question } = await request.json();
    console.log("Received data:", { userId, question });

    if (!userId || !question) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Sample answer (in practice, this could be generated or fetched from elsewhere)
    const answers = "This is a static answer from the API";

    // Create a new chat document
    const newChat = new Chat({
      userId,
      chatData: [{ question, answers }],
    });

    const savedChat = await newChat.save();

    return NextResponse.json(
      { message: "Chat created successfully", chat: savedChat },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
  }
}


// Fetch chats for a user
export async function GET(request: Request) {
    try{
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const chats = await Chat.find({ userId }).sort({ createdAt: -1 });

        return NextResponse.json({ chats }, { status: 200 });   

    }catch (error) {
        console.error("Error fetching chats:", error);
        return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
    }
}

// update a chat 

export async function PUT(request: Request) {
    try{
        await dbConnect();
        const { chatId, question, answer } = await request.json();

        if (!chatId || !question || !answer) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $push: { messages: { question, answer } } },
            { new: true }
        );

        if (!updatedChat) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Chat updated successfully", chat: updatedChat }, { status: 200 });
    }catch (error) {
        console.error("Error updating chat:", error);
        return NextResponse.json({ error: "Failed to update chat" }, { status: 500 });
    }
}
