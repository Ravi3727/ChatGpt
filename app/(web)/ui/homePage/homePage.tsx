'use client'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import Navbar from '../navbar/navbar'
import DisplayChats from '../ChatArea/displayChats'
import ChatTextBox from '../ChatArea/chatTextBox'
import { useParams } from 'next/navigation'

export const ChatContext = createContext();

function HomePage() {
  const [chats, setChats] = useState([]);
  const params = useParams();

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);

    };
    handleResize();
  }, []);

  useEffect(() => {
    let id = params.chatId || 'random';
    // console.log('Params chatId:', id);
    if (Array.isArray(id)) id = id[0];
    // console.log('Chat ID from params:', id);
    localStorage.setItem('chatId', id);
  }, [params.chatId]);


  const chatContextValue = useMemo(() => ({ chats, setChats }), [chats]);
  const hasChats = chats.length > 0;

  return (
    <ChatContext.Provider value={chatContextValue}>

      <div className="h-screen md:max-h-screen overflow-y-auto flex flex-col p-2 relative">
        <div className="h-10 w-full  md:flex left-0 md:items-center md:justify-center text-white ">
          <Navbar />
        </div>

        <div className={`md:flex md:mt-4 md:px-4 px-2 ${hasChats ? 'flex flex-col justify-between' : 'flex items-center justify-center flex-col md:gap-4'}`}>
          {params.chatId !== undefined ? (
            <div className="md:flex-1 overflow-y-auto md:w-full h-[70vh] w-[90vw] p-3 rounded-xl ">
              <DisplayChats />
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center gap-4 w-full h-screen'>
              {isMobile ? <div className="text-xl ml-18 w-72 md:w-full  md:text-3xl leading-10 text-white mb-4 font-sans z-10 ">Where should we begin?</div> :
                <div className="text-3xl leading-10 text-white mb-4 font-sans">Where should we begin?</div>
              }
              <ChatTextBox />
            </div>
          )}
          {params.chatId &&
            <div className="w-full z-10">
              <ChatTextBox />
              {params.chatId !== 'random' && <div className='text-white text-[12px] text-center md:mb-2'>
                ChatGPT can make mistakes. Check important info. <span className='underline'>See Cookie Preferences.</span>
              </div>}
            </div>}
        </div>
      </div>

    </ChatContext.Provider>
  );
}

export default HomePage;