'use client';

import { useEffect, useState } from "react";
import axios from "axios";
/* import Link from "next/link"; */
import { Chat } from "../types/index";
import { setSelectedChat } from "../hooks/useSelectedChat";
import { useChatRefresh } from "../hooks/useChatRefresh";


export default function ChatList({ searchText = "" }: { searchText: string }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const { refreshFlag } = useChatRefresh();
  
  useEffect(() => {
    axios.get("/api/chats").then(res => setChats(res.data.chats));
  }, [refreshFlag]);

  const filtered = chats.filter(chat =>
    (chat.title || chat.conversation[0]?.message || "")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  if (!filtered.length) return <p className="text-muted px-3">No chats found</p>;

  return (
    <div className="overflow-auto" style={{ maxHeight: "60vh" }}>
      {filtered.map(chat => (
        <div key={chat.id} className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
          <button
            className="btn btn-link text-start text-dark text-decoration-none flex-grow-1"
            onClick={() => setSelectedChat(chat)}
          >
            {chat.title || chat.conversation[0]?.message || "Untitled Chat"}
          </button>
        </div>
      ))}
    </div>
  );
}
  