"use client"
import React, { useEffect, useState } from 'react';
import ThreeDotsSvg from '@/app/svg/threeDotsSvg';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface ChatData {
  question: string;
  answers: string;
  _id: string;
}

interface Chat {
  _id: string;
  title: string;
  userId: string;
  chatData: ChatData[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}



function PreviousChats() {

  const [allChats, setAllChats] = useState<Chat[]>([]);
  const {user} =  useUser();
  const router = useRouter();


  useEffect(() => {
  if (!user) return;

  const fetchPreviousChats = async () => {
    try {
      console.log("Fetching previous chats for user:", user.id);
      const userId = user.id;
      const res = await axios.get(`/api/chat/${userId}`);

      console.log(res.data);
      setAllChats(res.data.chats);
    } catch (error) {
      console.error("Error fetching previous chats:", error);
    }
  };
  fetchPreviousChats();
}, [user]);



const setChatIdOnParam = (chatId: string) => {
  router.push(`/${chatId}`);
};


  // const demoChats: string[] = [
  //   'Hello Jee!',
  //   'What is life',
  //   'How do we survive',
  //   'Classic DSA',
  //   'Todays Weather',
  // ];

  return (
    <div className='p-2'>
      <div className='px-2 py-2 text-sideBarChat'>
        Chats
      </div>

      <div>
        {(allChats).map((chat, idx) => (
          <div key={chat._id} onClick={()=> setChatIdOnParam(chat?._id)} className='hover:cursor-pointer px-2 py-2 text-sm rounded-xl hover:bg-chatBoxColor flex justify-between items-center group relative'>
            <div>
             {chat?.title}
            </div>
            <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex text-3xl  items-center justify-center '>
              <ThreeDotsSvg/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreviousChats;
