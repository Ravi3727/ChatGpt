"use client"
import { useEffect, useState } from "react"
import CopyIconSvg from "@/app/svg/copyIconSvg"
import EditIconSvg from "@/app/svg/editIconSvg"
import axios from "axios"
import EditChatBox from "./EditChatBox"
import clsx from "clsx"
import Image from "next/image"

type ChatItem = {
  _id: string
  question: string
  answer: string
  fileUrls?: string
}

type ChatMessage = {
  question: string
  answer: string
}

function DisplayChats() {
  const [toggleTick, setToggleTick] = useState(false)
  const [storedChatId, setStoredChatId] = useState<string | null>(null)
  const [allChats, setChats] = useState<ChatItem[]>([])
  const [editingChat, setEditingChat] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleChatId = (chatId: string | null) => {
    setEditingChat(chatId ?? "")
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setToggleTick(true)
    setTimeout(() => setToggleTick(false), 2000)
  }

  useEffect(() => {
    const chatId = localStorage.getItem("chatId")
    if (chatId) setStoredChatId(chatId)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const chatsMapRaw = localStorage.getItem("chatsMap")
      const chatsMap = chatsMapRaw ? JSON.parse(chatsMapRaw) : {}
      const latestChats = storedChatId ? chatsMap[storedChatId] || [] : []

      if (JSON.stringify(latestChats) !== JSON.stringify(allChats)) {
        setChats(latestChats)
      }
    }, 10)

    return () => clearInterval(interval)
  }, [storedChatId, allChats])

  useEffect(() => {
    if (storedChatId && storedChatId !== "random" && storedChatId !== "undefined") {
      const fetchChatByID = async () => {
        try {
          const chatsMapRaw = localStorage.getItem("chatsMap")
          const chatsMap = chatsMapRaw ? JSON.parse(chatsMapRaw) : {}

          if (chatsMap[storedChatId]) {
            setChats(chatsMap[storedChatId])
            return
          }

          const response = await axios.get(`/api/getChatByChatId/${storedChatId}`)
          const data = response.data

          if (data?.chat?.chatData) {
            const formattedChats = data.chat.chatData.map((item: ChatMessage) => ({
              ...item,
            }))

            chatsMap[storedChatId] = formattedChats
            localStorage.setItem("chatsMap", JSON.stringify(chatsMap))

            setChats(formattedChats)
          }
        } catch (error) {
          console.error("Error fetching chat by ID:", error)
        }
      }

      fetchChatByID()
    }
  }, [storedChatId])

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-6">
      {allChats.map((chat) => (
        <div key={chat?._id} className="text-white w-full">
          {/* User Message */}
          <div className="group flex flex-col items-end mb-6">
            {editingChat === chat?._id ? (
              <div className="w-full max-w-3xl bg-chatBoxColor rounded-2xl">
                <EditChatBox
                  question={chat?.question}
                  messageId={chat?._id}
                  handleChatId={handleChatId}
                  chatId={storedChatId || ""}
                />
              </div>
            ) : (
              <>
                <div
                  className={clsx(
                    "max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] bg-chatBoxColor rounded-2xl px-4 py-3 text-sm sm:text-base break-words",
                  )}
                >
                  {chat?.fileUrls && (
                    <div className="mb-3">
                      <Image
                        src={chat?.fileUrls || "/placeholder.svg"}
                        alt={chat?._id}
                        width={isMobile ? 250 : 400}
                        height={isMobile ? 250 : 400}
                        className="rounded-lg"
                      />
                    </div>
                  )}
                  <div>{chat?.question }</div>
                </div>

                {/* User Message Actions */}
                <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopy(chat?.question)}
                    className="p-1.5 hover:bg-chatBoxColor rounded-lg transition-colors"
                  >
                    {toggleTick ? <span className="text-white text-md">✓</span> : <CopyIconSvg />}
                  </button>
                  <button
                    onClick={() => handleChatId(chat?._id)}
                    className="p-1.5 hover:bg-chatBoxColor rounded-lg transition-colors"
                  >
                    <EditIconSvg />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* AI Response */}
          <div className="w-full mb-8">
            <div className="flex items-start space-x-3">
              {/* AI Avatar */}
            

              {/* AI Message */}
              <div className="flex-1 min-w-0">
                <div className="text-sm sm:text-base leading-7 break-words whitespace-pre-wrap">{chat?.answer}</div>

                {/* AI Message Actions */}
                <div className="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopy(chat?.answer)}
                    className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {toggleTick ? <span className="text-green-500 text-sm">✓</span> : <CopyIconSvg />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DisplayChats
