"use client"
import type React from "react"
import { useContext, useRef, useState } from "react"
import { ChatContext } from "../homePage/homePage"
import axios from "axios"
import { chatDataSchema } from "@/app/packages/mongoDb/zod/chatShema"
import { useUser } from "@clerk/nextjs"
import { generate, generateTitle } from "./generateResponse"
import { readStreamableValue } from "ai/rsc"

export type ChatType = {
  _id: string
  question: string
  answer: string
  fileUrls?: string
}

export type ChatContextType = {
  chats: ChatType[]
  setChats: React.Dispatch<React.SetStateAction<ChatType[]>>
}

function EditChatBox({
  question,
  messageId,
  chatId,
  handleChatId,
}: {
  question: string
  messageId: string
  chatId: string
  handleChatId: (chatId: string | null) => void
}) {
  const { chats, setChats } = useContext(ChatContext)
  const [input, setInput] = useState(question || "")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { isSignedIn, user } = useUser()
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || !isSignedIn) return

    const result = chatDataSchema.safeParse({ question: input })
    if (!result.success) {
      console.error("Validation Error:", result.error.format())
      return
    }

    setLoading(true)
    type ChatMessageSys = {
      role: "user" | "assistant"
      content: string
    }
    try {
      const contextMessages: ChatMessageSys[] = chats.flatMap((chat): ChatMessageSys[] => [
        { role: "user", content: chat.question },
        { role: "assistant", content: chat.answer },
      ])

      contextMessages.push({ role: "user", content: input })

      const { output } = await generate(contextMessages)

      let generatedAnswer = ""
      for await (const delta of readStreamableValue(output)) {
        generatedAnswer += delta
      }
      const { text: generatedTitle } = await generateTitle(input)

      const updatedChat = {
        _id: messageId,
        question: input,
        answer: generatedAnswer,
      }

      const updatedChats = chats.map((chat) => (chat._id === messageId ? updatedChat : chat))
      setChats(updatedChats)

      const res = await axios.patch("/api/editChat", {
        chatId,
        messageId,
        question: input,
        answer: generatedAnswer,
        title: generatedTitle,
        userId: user.id,
      })

      if (res.status === 200) {
        console.log("Chat updated successfully in backend")
      }

      const chatsMapRaw = localStorage.getItem("chatsMap")
      const chatsMap = chatsMapRaw ? JSON.parse(chatsMapRaw) : {}
      chatsMap[chatId] = updatedChats
      localStorage.setItem("chatsMap", JSON.stringify(chatsMap))

      setInput("")
      handleChatId(null)
    } catch (error) {
      console.error("Error updating message:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full p-4">
      <div className="space-y-4">
        <textarea
          ref={textareaRef}
          rows={3}
          spellCheck="false"
          value={input}
          autoFocus
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Edit your message..."
          className="w-full min-h-[80px] max-h-[200px] p-3 resize-none bg-transparent rounded-xl outline-none text-white placeholder-gray-400 text-sm sm:text-base  transition-colors"
        />

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => handleChatId(null)}
            className="px-4 py-2 bg-customDark  text-white text-sm rounded-full hover:bg-customDark cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-4 py-2 bg-white text-black text-sm rounded-full hover:bg-gray-100 cursor-pointer transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditChatBox
