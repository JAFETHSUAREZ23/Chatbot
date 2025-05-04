'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Chat, User } from "../types/index";

function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const fetchUserAndChats = async () => {
      try {
        const userRes = await axios.get("/api/auth/me");
        setUser(userRes.data.user);

        const chatRes = await axios.get("/api/chats");
        setChats(chatRes.data.chats);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchUserAndChats();
  }, []);

  if (!user) return <p>Cargando usuario...</p>;

  return (
    <div>
      <h1>Bienvenido, {user.name}</h1>
      <h2>Chats disponibles:</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id}>
            <Link href={`/chats/${chat.id}`}>
              <strong>{chat.title}</strong> ({chat.conversation.length} mensajes)
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatPage;
