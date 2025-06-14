'use client'
import React, { use, useContext, useEffect, useState } from 'react'
import CopyIconSvg from '@/app/svg/copyIconSvg';
import EditIconSvg from '@/app/svg/editIconSvg';
import axios from 'axios';
import { useEditChats } from './EditChatsContext';
import EditChatBox from './EditChatBox';
import clsx from 'clsx';
import { ChatContext } from '../homePage/homePage'
import { useRouter } from 'next/navigation';

function DisplayChats() {
  const router = useRouter();
  const { chats }: any = useContext(ChatContext);
  const [toggleTick, setToggleTick] = useState(false);
  const [storedChatId, setStoredChatId] = useState<string | null>(null);
  const [allChats, setChats] = useState<any[]>([]);
  const [editingChat, setEditingChat] = useState('');

  const handleChatId = (chatId: string) => {
    setEditingChat(chatId);
  };
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setToggleTick(true);
    setTimeout(() => setToggleTick(false), 2000);
  };

  useEffect(() => {
    const chatId = localStorage.getItem('chatId');
    if (chatId) setStoredChatId(chatId);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      const chatsMapRaw = localStorage.getItem("chatsMap");
      const chatsMap = chatsMapRaw ? JSON.parse(chatsMapRaw) : {};
      const latestChats = chatsMap[storedChatId] || [];
       

      if (JSON.stringify(latestChats) !== JSON.stringify(allChats)) {
        setChats(latestChats);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [storedChatId, allChats]);



  const fetchChatByID = async () => {
    try {
      const chatsMapRaw = localStorage.getItem("chatsMap");
      const chatsMap = chatsMapRaw ? JSON.parse(chatsMapRaw) : {};

      if (chatsMap[storedChatId]) {
        setChats(chatsMap[storedChatId]);
        return;
      }

      const response = await axios.get(`/api/getChatByChatId/${storedChatId}`);
      const data = response.data;

      if (data?.chat?.chatData) {
        const formattedChats = data.chat.chatData.map((item: any) => ({
          ...item,
        }));

        // Save in chatsMap
        chatsMap[storedChatId] = formattedChats;
        localStorage.setItem("chatsMap", JSON.stringify(chatsMap));

        setChats(formattedChats);
      }
    } catch (error) {
      console.error("Error fetching chat by ID:", error);
    }
  };

  useEffect(() => {
    if (storedChatId && storedChatId !== "random" && storedChatId !== "undefined") {
      fetchChatByID();
    }
  }, [storedChatId]);




  return (
    <div className="flex flex-col gap-3 md:gap-4 w-full md:w-6/12 mx-auto px-2 py-1 md:px-5 md:py-2 h-full md:max-h-[70vh] overflow-y-auto">
      {allChats.map((chat: any) => (
        <div key={chat._id} className="text-white w-full flex flex-col md:gap-5">
          <div className='group flex flex-col'>
            {editingChat === chat._id ? (
              <div className='bg-chatBoxColor overflow-y-auto w-full rounded-2xl md:rounded-3xl text-start px-2 md:px-4 md:py-2 py-1 ml-auto break-words'>
                <EditChatBox
                  question={chat.question}
                  messageId={chat._id}
                  handleChatId={handleChatId} 
                  chatId={storedChatId || ''}
                />
              </div>
            ) : (
              <div
                className={clsx(
                  'bg-chatBoxColor overflow-y-auto max-w-[75%] w-fit rounded-2xl md:rounded-3xl text-start px-3 md:px-4 py-1 md:py-2 ml-auto break-words text-sm md:text-base',
                )}
              >
                <div>{chat.question}</div>
              </div>
            )}
            <div className='flex group-hover:opacity-100 opacity-0 w-12 transition justify-between text-sm text-gray-400 mt-2 ml-auto'>
              <div onClick={() => handleCopy(chat.question)} className='cursor-pointer'>
                {toggleTick ? <span className='text-white text-xl'>✓</span> : <CopyIconSvg />}
              </div>
              <div onClick={() => handleChatId(chat._id)} className='cursor-pointer'>
                <EditIconSvg />
              </div>
            </div>
          </div>
          <div className="max-w-full w-fit rounded-lg p-2  text-sm md:text-base md:p-3 mt-2 break-words mb-2 md:mb-20">
            <div className="ml-2">{chat.answer}</div>
          </div>
        </div>
      ))}

    </div>
  );
}
export default DisplayChats;