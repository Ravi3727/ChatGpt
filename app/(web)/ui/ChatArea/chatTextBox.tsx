'use client'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Mic, SlidersHorizontal, Plus } from 'lucide-react'
import { ChatContext } from '../homePage/homePage'
import CreateAnImage from '@/app/svg/createAnImage'
import SearchTheWeb from '@/app/svg/searchTheWeb'
import WriteOrCode from '@/app/svg/writeOrCode'
import RunDeepResearch from '@/app/svg/runDeepSearch'
import ThinkForLonger from '@/app/svg/thinkForLonger'
import AddYourAppsSvg from '@/app/svg/addYourAppsSvg'
import AddPhotosAndFiles from '@/app/svg/addPhotosAndFiles'
import GoogleDriveSvg from '@/app/svg/googleDriveSvg'
import CloudeSvg from '@/app/svg/cloudSvg'
import VoiceInputSvg from '@/app/svg/voiceInputSvg'
import axios from 'axios';
import {chatDataSchema} from '@/app/packages/mongoDb/zod/chatShema';
import SendButtonArrowSvg from '@/app/svg/sendButtonArrowSvg'
import { useUser } from '@clerk/nextjs'
function ChatTextBox() {
  const { chats, setChats }: any = useContext(ChatContext);
  const [input, setInput] = useState('');
  const [showTools, setShowTools] = useState(false);
  const textareaRef = useRef(null);
  const toolsRef = useRef(null);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const { isSignedIn, user } = useUser();

const handleSend = async () => {
  if (!input.trim()) return;
  if( !isSignedIn) {
    console.error("User is not signed in or user data is not loaded");
    return;
  }
  console.log("User ID:", user?.id);
  const result = chatDataSchema.safeParse({ question: input });

  if (!result.success) {
    console.error("Validation Error:", result.error.format());
    return; 
  }
  try {
    const res = await axios.post('/api/chat', { question: input ,userId: user?.id});

    if (res.status === 200) {
      const newChat = {
        question: input,
        answer: res.data.answer,
        id: Date.now().toString(),
      };
      setChats([...chats, newChat]);
      setInput('');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    // Optionally, show an error message to the user
  }
};


  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.overflowY = 'hidden';
      el.style.height = el.scrollHeight + 'px';
      if (el.scrollHeight > 200) el.style.overflowY = 'auto';
    }
  }, [input]);

  // Close tools menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setShowTools(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div className="w-full px-4 pb-4 pt-2 sticky bottom-0 z-10">
      <div className="max-w-3xl mx-auto w-full bg-chatBoxColor rounded-2xl px-4 py-2 shadow-lg">
        <div className="flex flex-col">
          {/* Auto-resizing textarea */}
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
              className="w-full max-h-[200px] min-h-10 p-2 overflow-y-auto resize-none bg-transparent outline-none text-white placeholder-gray-400 text-md"
            />
          </div>

          {/* Toolbar row */}
          <div className="flex justify-between items-center mt-2 relative">
            <div className="flex items-center gap-2" ref={toolsRef}>
              <button
                onClick={() => {
                  setShowPlusMenu(!showPlusMenu);
                  setShowTools(false);
                }}
                className="text-white hover:bg-hoverEffect p-2 rounded-full"
              >
                <Plus size={20} />
              </button>

              {/* Plus Button Dropdown */}
              {showPlusMenu && (
                <div className={`absolute ${chats.length > 0 ? "bottom-10" : "top-12"} left-0 bg-[#353535] text-white rounded-2xl p-2 shadow-xl w-64 z-50`}>
                  <div
                    className="flex justify-between items-center hover:bg-hoverEffect p-2 rounded-lg cursor-pointer text-sm"
                    onMouseEnter={() => setShowAppsMenu(true)}

                  >
                    <div className='flex items-center gap-2'>
                      <div>
                        <AddYourAppsSvg />
                      </div>
                      <span>Add from apps</span>

                    </div>
                    <span className="text-gray-400">{'>'}</span>
                  </div>

                  <div onMouseLeave={() => setShowAppsMenu(false)} className="hover:bg-hoverEffect p-2 rounded-lg cursor-pointer text-sm">
                    <div className='flex items-center gap-2'>
                      <div>
                        <AddPhotosAndFiles />
                      </div>
                      <div>
                        Add photos and files
                      </div>

                    </div>
                  </div>

                  {/* Nested Submenu */}
                  {showAppsMenu && (
                    <div className="absolute left-64 top-0 bg-[#353535] text-white rounded-2xl p-2 shadow-xl w-72  z-50">
                      <div className="hover:bg-hoverEffect p-2 rounded-lg cursor-pointer text-sm">
                        <div className='flex items-center gap-2'>
                          <div>
                            <GoogleDriveSvg />
                          </div>
                          <div className='text-sm'>
                            Connect Google Drive
                          </div>
                        </div>
                      </div>
                      <div className="hover:bg-hoverEffect p-2 rounded-lg cursor-pointer text-sm">
                        <div>
                          <div className='flex items-center gap-2'>
                            <div>
                              <CloudeSvg />
                            </div>
                            <div className='flex flex-col'>
                              <div>
                                Connect Microsoft OneDrive
                              </div>
                              <div className="text-xs text-gray-400">Personal</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="hover:bg-hoverEffect p-2 rounded-lg cursor-pointer text-sm">
                        <div>
                          <div className='flex items-center gap-2'>
                            <div>
                              <CloudeSvg />
                            </div>
                            <div className='flex flex-col'>
                              <div>
                                Connect Microsoft OneDrive
                              </div>
                              <div className="text-xs text-gray-400">Work/School - Includes SharePoint</div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button
                className="text-white hover:bg-hoverEffect px-3 py-2 rounded-full flex items-center space-x-1"
                onClick={() => setShowTools(!showTools)}
              >
                <SlidersHorizontal size={16} />
                <span className="text-sm hidden sm:inline">Tools</span>
              </button>

              {/* Dropdown Menu */}
              {showTools && (
                <div className={`absolute ${chats.length > 0 ? "bottom-10" : "top-12"} left-12 bg-[#2b2b2b] text-white rounded-2xl p-3 shadow-b-xl w-64 z-50 space-y-2`}>
                  <ToolItem label="Create an image" icon={CreateAnImage} />
                  <ToolItem label="Search the web" icon={SearchTheWeb} />
                  <ToolItem label="Write or code" icon={WriteOrCode} />
                  <ToolItem label="Run deep research" badge="5 left" icon={RunDeepResearch} />
                  <ToolItem label="Think for longer" icon={ThinkForLonger} />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button className="text-white hover:bg-hoverEffect p-2 rounded-full">
                <Mic size={20} />
              </button>
              <div className='hover:cursor-pointer'>
               { 
               input.trim().length > 0 ? 
               <div className='bg-white rounded-full p-2 '
                onClick={handleSend}>
                <SendButtonArrowSvg/>
               </div>:
               <div className="text-white hover:bg-navbarChatGptText bg-hoverEffect p-2 rounded-full">
                  <VoiceInputSvg />
               </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ToolItem = ({ label, badge, icon: Icon }: any) => (
  <div className="flex justify-between items-center hover:bg-hoverEffect p-2 rounded-lg cursor-pointer text-sm">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </div>
    {badge && <span className="text-xs text-gray-400">{badge}</span>}
  </div>
);

export default ChatTextBox;
