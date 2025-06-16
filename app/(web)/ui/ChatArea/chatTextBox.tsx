"use client"
import type React from "react"
import { useContext, useEffect, useRef, useState } from "react"
import { Mic, SlidersHorizontal, Plus } from "lucide-react"
import { ChatContext } from "../homePage/homePage"
import CreateAnImage from "@/app/svg/createAnImage"
import SearchTheWeb from "@/app/svg/searchTheWeb"
import WriteOrCode from "@/app/svg/writeOrCode"
import RunDeepResearch from "@/app/svg/runDeepSearch"
import ThinkForLonger from "@/app/svg/thinkForLonger"
import AddYourAppsSvg from "@/app/svg/addYourAppsSvg"
import AddPhotosAndFiles from "@/app/svg/addPhotosAndFiles"
import GoogleDriveSvg from "@/app/svg/googleDriveSvg"
import CloudeSvg from "@/app/svg/cloudSvg"
import VoiceInputSvg from "@/app/svg/voiceInputSvg"
import axios from "axios"
import { chatDataSchema } from "@/app/packages/mongoDb/zod/chatShema"
import SendButtonArrowSvg from "@/app/svg/sendButtonArrowSvg"
import { useUser } from "@clerk/nextjs"
import { useParams } from "next/navigation"
import { useEditChats } from "./EditChatsContext"
import { generate, generateTitle, imageDataChat,fileDataChat } from "./generateResponse"
import { readStreamableValue } from "ai/rsc"
import { useRouter } from "next/navigation"
import Image from "next/image"

function ChatTextBox() {
  const router = useRouter()
  const { chats, setChats } = useContext(ChatContext)
  const [input, setInput] = useState("")
  const [showTools, setShowTools] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const toolsRef = useRef<HTMLDivElement>(null)
  const [showPlusMenu, setShowPlusMenu] = useState(false)
  const [showAppsMenu, setShowAppsMenu] = useState(false)
  const { isSignedIn, user } = useUser()
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const chatId = params.chatId
  const { editingChatId, setEditingChatId } = useEditChats()
  const [files, setFiles] = useState<File[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleSend = async () => {
    setLoading(true)
    if (!input.trim()) return

    if (!isSignedIn) {
      return
    }

    const validationResult = chatDataSchema.safeParse({ question: input })
    if (!validationResult.success) {
      console.error("Validation Error:", validationResult.error.format())
      return
    }

    type ChatMessage = {
      question: string
      answer: string
    }
    const currentChatId = String(chatId || "new")

    const chatsMapRaw = localStorage.getItem("chatsMap")
    const chatsMap = chatsMapRaw ? JSON.parse(chatsMapRaw) : {}
    const currentChatHistory: ChatMessage[] = chatsMap[currentChatId] || []

    type ChatMessageSys = {
      role: "user" | "assistant"
      content: string
    }
    const contextMessages: ChatMessageSys[] = currentChatHistory.flatMap((chat): ChatMessageSys[] => [
      { role: "user", content: chat.question },
      { role: "assistant", content: chat.answer },
    ])

    contextMessages.push({ role: "user", content: input })

    let generatedAnswer = ""

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append(`file`, file)
      })
      setFiles([])

      const { text } = await generateTitle(input)
      let ImageURL

      const isFilePresent = formData.get("file") as File
      if (isFilePresent && isFilePresent.size > 0) {
        const res = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        ImageURL = res.data.url
        

        const fileType = ImageURL.split('.').pop().split('?')[0]; // To also handle query params
        console.log("File Type:", fileType === "pdf")
        if (fileType === "pdf") {
          const fileData = await fileDataChat(res.data.url, input)
          console.log("File Data Response:", fileData)
          // generatedAnswer = fileData;
        }
        const result = await imageDataChat(res.data.url, input)
        generatedAnswer = result
      } else {
        const { output } = await generate(contextMessages)
        for await (const delta of readStreamableValue(output)) {
          generatedAnswer += delta
        }
      }

      let finalChatId = currentChatId

      if (currentChatId === "new") {
        const createRes = await axios.post(`/api/addChat`, {
          chatId: "new",
          userId: user.id,
          question: input,
          answer: generatedAnswer,
          title: text,
          fileUrls: ImageURL,
        })
        const createdChat = createRes.data.newChat
        finalChatId = createdChat._id

        const fullChatData = createdChat.chatData

        chatsMap[finalChatId] = fullChatData
        localStorage.setItem("chatsMap", JSON.stringify(chatsMap))
        setChats(fullChatData)
        setInput("")
        setLoading(false)
        router.push(`/${finalChatId}`)

        return
      } else {
        const res = await axios.post(`/api/addChat`, {
          chatId: currentChatId,
          userId: user.id,
          question: input,
          answer: generatedAnswer,
          title: text,
          fileUrls: ImageURL,
        })

        const updatedChat = res.data.updatedChats.chatData.at(-1)

        const updatedChatList = [...(chatsMap[finalChatId] || []), updatedChat]
        chatsMap[finalChatId] = updatedChatList

        localStorage.setItem("chatsMap", JSON.stringify(chatsMap))
        setChats(updatedChatList)
        setInput("")
        setLoading(false)
      }
    } catch (error) {
      console.error("Error during generation or saving:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("chatsMap") || "{}")
    const chatIdStr = Array.isArray(chatId) ? chatId[0] : chatId || ""
    const loadedChats = stored[chatIdStr] || []
    setChats(Array.isArray(loadedChats) ? loadedChats : [])
  }, [chatId, setChats])

  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.overflowY = "hidden"
      el.style.height = Math.min(el.scrollHeight, isMobile ? 120 : 200) + "px"
      if (el.scrollHeight > (isMobile ? 120 : 200)) el.style.overflowY = "auto"
    }
  }, [input, isMobile])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setShowTools(false)
        setShowPlusMenu(false)
        setShowAppsMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files as FileList)])
    }
  }

  const isImage = (file: File) => file.type.startsWith("image/")

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-chatBoxColor rounded-2xl shadow-lg">
        {/* File Previews */}
        {files.length > 0 && (
          <div className="p-3 ">
            <div className="flex flex-wrap gap-2">
              {files.map((file, idx) =>
                isImage(file) ? (
                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-600">
                    <Image
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={file.name}
                      className="object-cover w-full h-full"
                      width={64}
                      height={64}
                    />
                    <button
                      onClick={() => removeFile(idx)}
                      className="absolute -top-1 -right-1 bg-gray-900 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    key={idx}
                    className="relative flex items-center gap-2 p-2 border border-gray-600 rounded-lg text-xs bg-gray-700"
                  >
                    <span>📄 {file.name}</span>
                    <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-white">
                      ×
                    </button>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 sm:p-4">
          <div className="flex flex-col space-y-3">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              spellCheck="false"
              value={input}
              autoFocus={!isMobile}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder={loading ? "Thinking..." : "Message ChatGPT"}
              disabled={loading}
              className="w-full resize-none bg-transparent outline-none text-white placeholder-gray-400 text-base leading-6"
            />

            {/* Controls */}
            {editingChatId ? (
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditingChatId(null)}
                  className="px-4 py-2 bg-gray-700 text-white text-sm rounded-full hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-white text-black text-sm rounded-full hover:bg-gray-100 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                {/* Left Controls */}
                <div className="flex items-center space-x-1" ref={toolsRef}>
                  {/* Plus Menu */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowPlusMenu(!showPlusMenu)
                        setShowTools(false)
                      }}
                      className="text-gray-400 hover:text-white hover:bg-hoverEffect p-2 rounded-full transition-colors"
                    >
                      <Plus size={20} />
                    </button>

                    {showPlusMenu && (
                      <div
                        className={`absolute ${chats.length > 0 ? "bottom-12" : "top-12"} left-0 bg-[#353535] text-white rounded-xl p-2 shadow-xl w-64 z-50`}
                      >
                        <div
                          className="flex justify-between items-center hover:bg-hoverEffect p-2 rounded-lg cursor-pointer text-sm"
                          onMouseEnter={() => setShowAppsMenu(true)}
                        >
                          <div className="flex items-center space-x-2">
                            <AddYourAppsSvg />
                            <span>Add from apps</span>
                          </div>
                          <span className="text-gray-400">›</span>
                        </div>

                        <label className="flex items-center space-x-2 hover:bg-hoverEffect p-2 rounded-lg cursor-pointer text-sm">
                          <input
                            type="file"
                            accept="image/*, .pdf, .doc, .docx, .txt, .csv, .xlsx, .pptx, .zip"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <AddPhotosAndFiles />
                          <span>Add photos and files</span>
                        </label>

                        {showAppsMenu && (
                          <div
                            className="absolute md:left-64 bottom-22 md:bottom-0 bg-[#353535] text-white rounded-xl p-2 shadow-xl w-72 z-50"
                            onMouseLeave={() => setShowAppsMenu(false)}
                          >
                            <div className="hover:bg-hoverEffect p-2 rounded-lg cursor-pointer text-sm">
                              <div className="flex items-center space-x-2">
                                <GoogleDriveSvg />
                                <span>Connect Google Drive</span>
                              </div>
                            </div>
                            <div className="hover:bg-hoverEffect p-2 rounded-lg cursor-pointer text-sm">
                              <div className="flex items-center space-x-2">
                                <CloudeSvg />
                                <div>
                                  <div>Connect Microsoft OneDrive</div>
                                  <div className="text-xs text-gray-400">Personal</div>
                                </div>
                              </div>
                            </div>

                            <div className="hover:bg-hoverEffect p-2 rounded-lg cursor-pointer text-sm">
                              <div className="flex items-center space-x-2">
                                <CloudeSvg />
                                <div className='flex flex-col'>
                                  <div>
                                    Connect Microsoft OneDrive
                                  </div>
                                  <div className="text-sm md:text-xs text-gray-400">Work/School - Includes SharePoint</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tools Menu */}
                  <div className="relative">
                    <button
                      className="text-gray-400 hover:text-white hover:bg-hoverEffect px-3 py-2 rounded-3xl flex items-center space-x-1 transition-colors text-sm"
                      onClick={() => setShowTools(!showTools)}
                    >
                      <SlidersHorizontal size={16} />
                      {!isMobile && <span>Tools</span>}
                    </button>

                    {showTools && (
                      <div
                        className={`absolute ${chats.length > 0 ? "bottom-12" : "top-12"} left-0 bg-[#2b2b2b] text-white rounded-xl p-2 shadow-xl w-64 z-50 space-y-1`}
                      >
                        <ToolItem label="Create an image" icon={CreateAnImage} />
                        <ToolItem label="Search the web" icon={SearchTheWeb} />
                        <ToolItem label="Write or code" icon={WriteOrCode} />
                        <ToolItem label="Run deep research" badge="5 left" icon={RunDeepResearch} />
                        <ToolItem label="Think for longer" icon={ThinkForLonger} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-white hover:bg-hoverEffect p-2 rounded-full transition-colors">
                    <Mic size={20} />
                  </button>

                  {input.trim().length > 0 ? (
                    <button
                      onClick={handleSend}
                      disabled={loading}
                      className="bg-white text-black rounded-full p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <SendButtonArrowSvg />
                    </button>
                  ) : (
                    <button className="text-gray-400 hover:text-white hover:bg-hoverEffect p-2 rounded-full transition-colors">
                      <VoiceInputSvg />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const ToolItem = ({
  label,
  badge,
  icon: Icon,
}: { label: string; badge?: string; icon: React.ComponentType<{ className?: string }> }) => (
  <div className="flex justify-between items-center hover:bg-hoverEffect p-2 rounded-lg cursor-pointer text-sm">
    <div className="flex items-center space-x-2">
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </div>
    {badge && <span className="text-xs text-gray-400">{badge}</span>}
  </div>
)

export default ChatTextBox
