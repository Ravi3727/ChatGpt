'use client'
import React, { use, useContext, useEffect, useState } from 'react'
import { ChatContext } from '../homePage/homePage'
import CopyIconSvg from '@/app/svg/copyIconSvg';
import EditIconSvg from '@/app/svg/editIconSvg';
import axios from 'axios';


function DisplayChats() {
  const [isEdit, setIsEdit] = useState(false);
  const [toggleTick, setToggleTick] = useState(false);
  const [storedChatId, setStoredChatId] = useState<string | null>(null);
  const [chats , setChats] = useState<any[]>([]);
  // console.log('Chat ID from params disply me :', chatId);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setToggleTick(true);
    setTimeout(() => {
      setToggleTick(false);
    }
      , 2000);
  };
  useEffect(() => {
    const chatId = localStorage.getItem('chatId');
    if (chatId) {
      setStoredChatId(chatId);
    }
  }, []);




  console.log('Stored chat ID:', storedChatId);


  const fetchChatByID = async () => {
    try {
      const chatId = storedChatId;
      const response = await axios.get(`/api/getChatByChatId/${chatId}`);;


      if (!response) {
        throw new Error('Network response was not ok');
      }

      const data = await response.data;
      console.log('Fetched chat data:', data.chat.chatData);
      setChats(data.chat.chatData);
    } catch (error) {
      console.error('Error fetching chat by ID:', error);
      return null;
    }
  };
  useEffect(() => {
    if (storedChatId && storedChatId !== 'random' && storedChatId !== 'undefined') {
      fetchChatByID();
    }
  }, [storedChatId]);

  return (
    <div className="flex flex-col gap-8 w-7/12 mx-auto">
      {chats.map((chat: any) => (
        <div key={chat._id} className="text-white w-full flex flex-col gap-5">
          <div className='group flex flex-col '>
            <div className="bg-chatBoxColor max-w-[75%] w-fit rounded-3xl text-start px-4 py-2 ml-auto break-words">
              <div className="">{chat.question}</div>
              {isEdit &&
                <div className='w-32 ml-auto'>
                  <div className='flex gap-3 text-gray-400 mt-2 ml-auto'>
                    <div className='cursor-pointer bg-customDark px-3 py-2 rounded-2xl text-white text-sm font-thin' onClick={() => setIsEdit(false)}>
                      Cancel
                    </div>
                    <div className='cursor-pointer bg-white px-3 py-2 rounded-2xl text-black text-sm' >
                      Send
                    </div>
                  </div>
                </div>
              }
            </div>
            <div className='flex group-hover:opacity-100 opacity-0 w-12 transition justify-between text-sm text-gray-400 mt-2 ml-auto'>
              <div onClick={() => handleCopy(chat.question)} className='cursor-pointer'>
                {
                  toggleTick ? <span className='text-white text-xl'>✓</span> :
                    <CopyIconSvg />}
              </div>
              <div onClick={() => setIsEdit(!isEdit)} className='cursor-pointer'>

                <EditIconSvg />
              </div>
            </div>
          </div>

          <div className="max-w-full w-fit rounded-lg p-3 mt-2 break-words">
            <div className="ml-2">{chat.answers}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DisplayChats;
