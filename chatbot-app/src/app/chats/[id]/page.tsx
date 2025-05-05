'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Chat, User, Message } from "../../types/index";

export default function ChatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [chat, setChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await axios.get("/api/auth/me");
      setUser(userRes.data.user);

      const chatRes = await axios.get("/api/chats");
      const found = chatRes.data.chats.find((c: Chat) => c.id === id);
      setChat(found);
    };

    fetchData();
  }, [id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !chat) return;

    const updatedChat: Chat = {
      ...chat,
      conversation: [
        ...chat.conversation,
        { sender: "user", message },
        { sender: "bot", message: "🤖 Dime en qué puedo ayudarte." }
      ]
    };

    setChat(updatedChat);
    setMessage("");
  };

  if (!chat || !user) return <p>Cargando...</p>;

  return (
    <div>
      <h1>{chat.title}</h1>
      <ul>
        {chat.conversation.map((msg: Message, i: number) => (
          <li key={i}>
            <strong>{msg.sender === "user" ? user.name : "Bot"}:</strong> {msg.message}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSend}>
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje"
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}



