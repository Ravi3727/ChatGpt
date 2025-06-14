import { z } from "zod";

export const chatDataSchema = z.object({
  question: z.string({
    required_error: "Question is required",
  }),
  answer: z.string().optional(),
  fileUrls: z.string().optional(),
});

export const chatsSchema = z.object({
  userId: z.string({
    required_error: "UserId is required",
  }),
  chatData: z.array(chatDataSchema),
    title: z.string().optional().default("Chat"),
  createdAt: z.date().optional(), 
});
