'use client'
import { createContext, useContext, useState } from 'react'

export const EditChats = createContext({
  editingChatId: null,
  setEditingChatId: (id: string | null) => {},
})

export const useEditChats = () => useContext(EditChats);

export function EditChatsProvider({ children }: { children: React.ReactNode }) {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);

  return (
    <EditChats.Provider value={{ editingChatId, setEditingChatId }}>
      {children}
    </EditChats.Provider>
  );
}