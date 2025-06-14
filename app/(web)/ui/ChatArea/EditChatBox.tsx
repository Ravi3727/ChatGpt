'use client';
import React, { useContext, useRef, useState } from 'react';
import { ChatContext } from '../homePage/homePage';
import axios from 'axios';
import { chatDataSchema } from '@/app/packages/mongoDb/zod/chatShema';
import { useUser } from '@clerk/nextjs';
import { generate, generateTitle } from "./generateResponse";
import { readStreamableValue } from 'ai/rsc';



function EditChatBox({
  question,
  messageId,
  chatId,
  handleChatId,
}: {
  question: string;
  messageId: string;
  chatId: string;
  handleChatId: (chatId: string | null) => void;
}) {
  const { chats, setChats }: any = useContext(ChatContext);
  const [input, setInput] = useState(question || '');
  const textareaRef = useRef(null);
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);

    console.log("data", messageId, chatId, question, input, chats);
  const handleSend = async () => {
    if (!input.trim() || !isSignedIn) return;

    const result = chatDataSchema.safeParse({ question: input });
    if (!result.success) {
      console.error('Validation Error:', result.error.format());
      return;
    }

    setLoading(true);

    try {
      // Prepare context
      const contextMessages = chats.flatMap((chat: any) => [
        { role: 'user', content: chat.question },
        { role: 'assistant', content: chat.answer || chat.answers },
      ]);
      contextMessages.push({ role: 'user', content: input });

      // 🧠 Generate new answer
      const { output } = await generate(contextMessages);

      let generatedAnswer = '';
      for await (const delta of readStreamableValue(output)) {
        generatedAnswer += delta;
      }

      // 🧠 Generate new title
      const { text: generatedTitle } = await generateTitle(input);


      // 🧩 Construct updated chat object
      const updatedChat = {
        _id: messageId,
        question: input,
        answer: generatedAnswer,
      };

      // 🔁 Update chats state
      const updatedChats = chats.map((chat: any) =>
        chat._id === messageId ? updatedChat : chat
      );
      setChats(updatedChats);



      //  Update backend
      const res = await axios.patch('/api/editChat', {
        chatId,
        messageId,
        question: input,
        answer: generatedAnswer,
        title: generatedTitle,
        userId: user.id,
      });



      if (res.status === 200) {
        console.log('Chat updated successfully in backend');
      }

      // 🧠 Update chatsMap in localStorage
      const chatsMapRaw = localStorage.getItem('chatsMap');
      const chatsMap = chatsMapRaw ? JSON.parse(chatsMapRaw) : {};
      chatsMap[chatId] = updatedChats;
      localStorage.setItem('chatsMap', JSON.stringify(chatsMap));


      setInput('');
      handleChatId(null);
    } catch (error) {
      console.error('Error updating message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto w-full rounded-2xl px-4 py-2">
        <div className="flex flex-col">
          <div className="relative w-full">
            <textarea
              ref={textareaRef}
              rows={1}
              spellCheck="false"
              value={input}
              autoFocus
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything"
              className="w-full max-h-[200px] min-h-24 p-2 overflow-y-auto resize-none bg-transparent outline-none text-white placeholder-gray-400 text-md"
            />
          </div>

          <div className="w-32 ml-auto">
            <div className="flex gap-3 text-gray-400 mt-2 ml-auto">
              <div
                onClick={() => handleChatId(null)}
                className="cursor-pointer bg-customDark px-3 py-2 rounded-2xl text-white text-sm font-thin"
              >
                Cancel
              </div>
              <div
                onClick={handleSend}
                className="cursor-pointer bg-white px-3 py-2 rounded-2xl text-black text-sm"
              >
                {loading ? '...' : 'Send'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditChatBox;
