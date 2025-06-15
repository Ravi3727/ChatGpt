import { dbConnect } from "@/app/packages/mongoDb/dbConfig";
import Chat from "@/app/packages/mongoDb/schema/chat";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { title, userId, question, chatId, answer,fileUrls } = await request.json();
    // console.log("Received data:", { title, userId, question, chatId, answer });
    // Validate inputs  
    console.log("Received data: backend ", fileUrls );
    if (!userId || !question || !answer) {
      return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
    }

    const chatDataSchema = z.object({
      question: z.string().min(1, "Question is required"),
      answer: z.string().min(1, "Answer is required"),
      fileUrls: z.string().optional()
    });

    const parsedData = chatDataSchema.safeParse({ question, answer: answer , fileUrls });
    if (!parsedData.success) {
      return new Response(JSON.stringify({ error: "Validation failed", details: parsedData.error.format() }), { status: 400 });
    }

    const chatData = parsedData.data;
    // console.log("Parsed chat data:", chatData);
    // If chatId is "new" or not provided, create a new chat
    if (!chatId || chatId === 'new' || chatId === undefined) {

      const newChat = await Chat.create({
        userId,
        title: title,
        chatData: [chatData],
      });
      return new Response(JSON.stringify({ newChat }), { status: 201 });
    }

    // Check if chat exists
    const existingChat = await Chat.findById(chatId);

    if (!existingChat) {
      // If chatId was given but no chat exists, create a new one

      const newChat = await Chat.create({
        userId,
        title: title,
        chatData: [chatData],
      });
      return new Response(JSON.stringify({ newChat }), { status: 201 });
    }

    // If chat exists, push new chat data
    const updatedChats  = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { chatData } },
      { new: true }
    );

    return new Response(JSON.stringify({ updatedChats }), { status: 200 });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
