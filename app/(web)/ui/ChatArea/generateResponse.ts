'use server';

import { streamText,generateText } from 'ai';
import { google } from "@ai-sdk/google";
import { createStreamableValue } from 'ai/rsc';
import { readFileSync } from 'fs';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function generate(messages: ChatMessage[]) {
  const stream = createStreamableValue('');

  const formattedPrompt = messages.map(msg => {
    return `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`;
  }).join('\n') + '\nAI:';


    // console.log("Formatted Prompt:", formattedPrompt);
  (async () => {
    const { textStream } = streamText({
      model: google('models/gemini-2.0-flash-exp'),
      prompt: formattedPrompt,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}


export async function generateTitle(question: string) {
  const { text, finishReason, usage } = await generateText({
     model: google('models/gemini-2.0-flash-exp'),
        prompt: `Summarize the question in a concise title upto 3 words here is the question -> ${question}`,
  });

  return { text, finishReason, usage };
}


export const imageDataChat = async (
  imageUrl: string,
  question: string
) => {
  
  // console.log("Image URL:", imageUrl);
  // console.log("Question:", question);
  const { text } = await generateText({
    model: google('models/gemini-2.0-flash-exp'),
    system:question,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: new URL(imageUrl),
          },
        ],
      },
    ],
  });

  // console.log("Image Data Response:", text);
  return text;
};




export const fileDataChat = async (
  fileUrl: string,
  question: string
) => {
  
  // console.log("Image URL:", imageUrl);
  // console.log("Question:", question);
  const { text } = await generateText({
    model: google('models/gemini-2.0-flash-exp'),
    system:question,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "file",
            data: readFileSync(fileUrl),
            mimeType: "application/pdf",
          },
        ],
      },
    ],
  });

  console.log("Image Data Response:", text);
  return text;
};