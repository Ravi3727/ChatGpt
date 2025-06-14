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
import { chatDataSchema } from '@/app/packages/mongoDb/zod/chatShema';
import SendButtonArrowSvg from '@/app/svg/sendButtonArrowSvg'
import { useUser } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import { useEditChats } from './EditChatsContext'
import { generate, generateTitle } from "./generateResponse";
import { readStreamableValue } from 'ai/rsc';
import { useRouter } from 'next/navigation';
import { set } from 'mongoose'
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

function ChatTextBox() {
  const router = useRouter();
  const { chats, setChats }: any = useContext(ChatContext);
  const [input, setInput] = useState('');
  const [showTools, setShowTools] = useState(false);
  const textareaRef = useRef(null);
  const toolsRef = useRef(null);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const { isSignedIn, user } = useUser();
  const params = useParams();
  const chatId = params.chatId;
  const { editingChatId, setEditingChatId } = useEditChats();
  const [generation, setGeneration] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!isSignedIn) {
      console.error("User is not signed in or user data is not loaded");
      return;
    }

    const validationResult = chatDataSchema.safeParse({ question: input });
    if (!validationResult.success) {
      console.error("Validation Error:", validationResult.error.format());
      return;
    }

    let currentChatId = chatId || 'new';

    // ✅ Get the current localStorage map
    const chatsMapRaw = localStorage.getItem('chatsMap');
    const chatsMap = chatsMapRaw ? JSON.parse(chatsMapRaw) : {};
    const currentChatHistory = chatsMap[currentChatId] || [];

    // 🔄 Construct context from all previous chats
    const contextMessages = currentChatHistory.flatMap(chat => [
      { role: 'user', content: chat.question },
      { role: 'assistant', content: chat.answer },
    ]);
    contextMessages.push({ role: 'user', content: input });

    setGeneration('');
    let generatedAnswer = '';

    try {
      const { output } = await generate(contextMessages);
      const { text } = await generateTitle(input);

      for await (const delta of readStreamableValue(output)) {
        generatedAnswer += delta;
        setGeneration(current => current + delta);
      }



      let finalChatId = currentChatId;

      // 🆕 Case: create a new chat first
      let newChat = {
        question: input,
        answer: generatedAnswer,
        questionId: ''
      };


      if (currentChatId === 'new') {
        const createRes = await axios.post(`/api/addChat`, {
          chatId: 'new',
          userId: user.id,
          question: input,
          answer: generatedAnswer,
          title: text
        });

        const createdChat = createRes.data.newChat;
        finalChatId = createdChat._id;

        // ✅ Save chatData exactly as received
        const fullChatData = createdChat.chatData;

        chatsMap[finalChatId] = fullChatData;
        localStorage.setItem('chatsMap', JSON.stringify(chatsMap));
        setChats(fullChatData);
        setInput('');

        // Optional: update URL if needed
        router.push(`/${finalChatId}`);

        return;
      }
      else {
        // ✅ Update existing chat
        const res = await axios.post(`/api/addChat`, {
          chatId: currentChatId,
          userId: user.id,
          question: input,
          answer: generatedAnswer,
          title: text
        });


        const updatedChat = res.data.updatedChats.chatData.at(-1); // New message just appended
        // console.log("Response from addChat API:", res.data);
        const updatedChatList = [...(chatsMap[finalChatId] || []), updatedChat];
        chatsMap[finalChatId] = updatedChatList;

        localStorage.setItem('chatsMap', JSON.stringify(chatsMap));
        setChats(updatedChatList);
        setInput('');
      }
    } catch (error) {
      console.error("Error during generation or saving:", error);
    }
  };


  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('chatsMap') || '{}');
    const loadedChats = stored[chatId] || [];
    setChats(loadedChats);
  }, [chatId]);


  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.overflowY = 'hidden';
      el.style.height = el.scrollHeight + 'px';
      if (el.scrollHeight > 200) el.style.overflowY = 'auto';
    }
  }, [input]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setShowTools(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const isImage = (file: File) => file.type.startsWith("image/");

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  
  return (
    <div className="w-full px-4 md:pb-4 md:pt-2 pb-2 pt-1 bottom-0 z-10">
      <div className="md:max-w-3xl w-full mx-auto  bg-chatBoxColor rounded-2xl md:px-4 md:py-2 px-2 py-1 shadow-lg">

        <div className="mt-4 flex flex-wrap gap-4">
          {files.map((file, idx) =>
            isImage(file) ? (
              <div key={idx} className="w-16 h-16 rounded-xl overflow-hidden border">
                <button
                onClick={() => removeFile(idx)}
                className="absolute top-1 right-1 bg-green bg-opacity-100 text-white rounded-full w-10 h-10 text-xl flex items-center justify-center z-100"
                title="Remove"
              >
                clear
              </button>
                <img
                  src={URL.createObjectURL(file)}

                  alt={file.name}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 border rounded-md text-xs bg-gray-100"
              >
                <button
                onClick={() => removeFile(idx)}
                className="absolute top-1 right-1 bg-black bg-opacity-100 text-white rounded-full w-10 h-10 text-xl flex items-center justify-center z-100"
                title="Remove"
              >
                clear
              </button>
                📄 {file.name}
              </div>
            )
          )}
        </div>



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
                  setInput('');
                }
              }}
              placeholder="Ask anything"
              className="w-full max-h-[50px] md:max-h-[200px] md:min-h-10 p-1 md:p-2 overflow-y-auto resize-none bg-transparent outline-none text-white placeholder-gray-400 text-md"
            />
          </div>

          {/* Toolbar row */}

          {editingChatId ? <div className='w-32 ml-auto z-50'>
            <div className='flex gap-1 md:gap-3 text-gray-400 mt-2 ml-auto'>
              <div onClick={() => setEditingChatId(null)} className='cursor-pointer bg-customDark md:px-3 md:py-2 p-1 rounded-2xl text-white text-sm font-thin'>
                Cancel
              </div>
              <div onClick={handleSend} className='cursor-pointer bg-white md:px-3 md:py-2 p-1 rounded-2xl text-black text-sm'>
                Send
              </div>
            </div>
          </div> :
            <div className="flex justify-between items-center mt-2 relative">
              <div className="flex items-center gap-1 md:gap-2" ref={toolsRef}>
                <button
                  onClick={() => {
                    setShowPlusMenu(!showPlusMenu);
                    setShowTools(false);
                  }}
                  className="text-white hover:bg-hoverEffect p-1 md:p-2 rounded-full"
                >
                  <Plus size={20} />
                </button>

                {/* Plus Button Dropdown */}
                {showPlusMenu && (
                  <div className={`absolute ${chats.length > 0 ? "bottom-10" : "top-12"} left-0 bg-[#353535] text-white rounded-2xl p-1 md:p-2 shadow-xl w-48 md:w-64 z-50`}>
                    <div
                      className="flex justify-between items-center hover:bg-hoverEffect p-1 md:p-2 rounded-lg cursor-pointer text-sm"
                      onMouseEnter={() => setShowAppsMenu(true)}

                    >
                      <div className='flex items-center gap-1 md:gap-2'>
                        <div>
                          <AddYourAppsSvg />
                        </div>
                        <span>Add from apps</span>

                      </div>
                      <span className="text-gray-400">{'>'}</span>
                    </div>

                    <div
                      onMouseLeave={() => setShowAppsMenu(false)}
                      className="hover:bg-hoverEffect p-1 md:p-2 rounded-lg cursor-pointer text-sm"
                    >
                      <label className="flex items-center gap-1 md:gap-2 cursor-pointer">
                        {/* Hidden file input */}
                        <input
                          type="file"
                          accept="image/*, .pdf, .doc, .docx, .txt, .csv, .xlsx, .pptx, .zip"
                          multiple
                          onChange={handleFileChange}  // You should define this function
                          className="hidden"
                        />

                        <div>
                          <AddPhotosAndFiles />
                        </div>
                        <div>
                          Add photos and files
                        </div>
                      </label>
                    </div>

                    {/* Nested Submenu  absolute left-64 top-0 bg-[#353535] text-white rounded-2xl p-2 shadow-xl w-72  z-50*/}
                    {showAppsMenu && (
                      <div className="absolute left:48 md:bottom-0 md:left-64 -md:top-0 bg-[#353535] text-white 
                      rounded-2xl p-1 md:p-2 shadow-xl w-60 md:w-72 z-50">
                        <div className="hover:bg-hoverEffect p-1 md:p-2 rounded-lg cursor-pointer text-sm">
                          <div className='flex items-center gap-1 md:gap-2'>
                            <div>
                              <GoogleDriveSvg />
                            </div>
                            <div className='text-sm'>
                              Connect Google Drive
                            </div>
                          </div>
                        </div>
                        <div className="hover:bg-hoverEffect p-1 md:p-2 rounded-lg cursor-pointer text-sm">
                          <div>
                            <div className='flex items-center gap-1 md:gap-2'>
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
                        <div className="hover:bg-hoverEffect p-1 md:p-2 rounded-lg cursor-pointer text-sm">
                          <div>
                            <div className='flex items-center gap-1 md:gap-2'>
                              <div>
                                <CloudeSvg />
                              </div>
                              <div className='flex flex-col'>
                                <div>
                                  Connect Microsoft OneDrive
                                </div>
                                <div className="text-sm md:text-xs text-gray-400">Work/School - Includes SharePoint</div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <button
                  className="text-white hover:bg-hoverEffect md:px-3 md:py-2 p-1 rounded-full flex items-center md:space-x-1"
                  onClick={() => setShowTools(!showTools)}
                >
                  <SlidersHorizontal size={16} />
                  <span className="text-sm hidden sm:inline">Tools</span>
                </button>

                {/* Dropdown Menu */}
                {showTools && (
                  <div className={`absolute ${chats.length > 0 ? "bottom-10" : "top-12"} left-12 bg-[#2b2b2b] text-white rounded-2xl p-1 md:p-3 shadow-b-xl w-48 md:w-64 z-50 space-y-1 md:space-y-2 text-xs md:text-sm`}>
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
                        <SendButtonArrowSvg />
                      </div> :
                      <div className="text-white hover:bg-navbarChatGptText bg-hoverEffect p-2 rounded-full">
                        <VoiceInputSvg />
                      </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

const ToolItem = ({ label, badge, icon: Icon }: any) => (
  <div className="flex justify-between items-center hover:bg-hoverEffect p-1 md:p-2 rounded-lg cursor-pointer text-sm">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </div>
    {badge && <span className="text-xs text-gray-400">{badge}</span>}
  </div>
);

export default ChatTextBox;
