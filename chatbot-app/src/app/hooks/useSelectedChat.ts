
import { useState } from "react";
import { Chat } from "../types/index";

let _chat: Chat | null = null;
const listeners: ((chat: Chat | null) => void)[] = [];

export const setSelectedChat = (chat: Chat | null) => {
  _chat = chat;
  listeners.forEach(fn => fn(chat));
};

export const useSelectedChat = (): Chat | null => {
  const [chat, setChat] = useState<Chat | null>(_chat);

  if (!listeners.includes(setChat)) {
    listeners.push(setChat);
  }

  return chat;
};
