'use client'
import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react'

type EditChatsContextType = {
  editingChatId: string | null;
  setEditingChatId: Dispatch<SetStateAction<string | null>>;
};

const defaultContext: EditChatsContextType = {
  editingChatId: null,
  setEditingChatId: () => {},
};

export const EditChats = createContext<EditChatsContextType>(defaultContext);

export const useEditChats = () => useContext(EditChats);

export function EditChatsProvider({ children }: { children: React.ReactNode }) {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);

  return (
    <EditChats.Provider value={{ editingChatId, setEditingChatId }}>
      {children}
    </EditChats.Provider>
  );
}
