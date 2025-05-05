'use client';

import { useEffect, useState } from "react";
import { Chat, Message } from "../types";
import { useSelectedChat, setSelectedChat } from "../hooks/useSelectedChat";
import { v4 as uuidv4 } from "uuid";
import { Image } from "react-bootstrap";
import { useChatRefresh } from "../hooks/useChatRefresh";


function isGreetingMessage(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  return (
    normalized === "hola" ||
    normalized === "como estas" ||
    normalized === "hola como estas" ||
    normalized === "necesito tu ayuda" ||
    normalized.includes("hola") && !normalized.includes("quiero") && !normalized.includes("cómo") ||
    normalized.includes("ayuda") && !normalized.includes("quiero")
  );
}

export default function ChatConversation() {
  const chat = useSelectedChat(); 
  const [newMessage, setNewMessage] = useState("");
  const { triggerRefresh } = useChatRefresh();


  useEffect(() => {
    if (!chat) {
      const emptyChat: Chat = {
        id: uuidv4(),
        title: "",
        conversation: []
      };
      setSelectedChat(emptyChat);
    }
  }, [chat]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chat || !newMessage.trim()) return;
  
    const userMsg = newMessage.trim();
    let botReply = "";
  
    const updatedConversation: Message[] = [
      ...chat.conversation,
      { sender: "user", message: userMsg }
    ];
  
    setNewMessage("");
  
    const isGreeting = isGreetingMessage(userMsg);
  
    if (isGreeting) {
      botReply = "🤖 Dime en qué puedo ayudarte.";
    } else {
      try {
        const res = await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg })
        });
  
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error HTTP ${res.status}: ${text}`);
        }
  
        const data = await res.json();
        botReply = data.reply || "🤖 Lo siento, no tengo una respuesta en este momento.";
      } catch (err) {
        console.error("Error al consultar la API:", err);
        botReply = "🤖 Hubo un error al procesar tu mensaje.";
      }
    }
  
    updatedConversation.push({ sender: "bot", message: botReply });
  
    const updatedChat: Chat = {
      ...chat,
      conversation: updatedConversation,
      title: chat.title || userMsg.slice(0, 30)
    };
  
    setSelectedChat(updatedChat);
  
    try {
      if (chat.conversation.length === 0) {
        const postRes = await fetch("/api/chats/createChat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstMessage: userMsg,
            botReply: botReply,
          }),
        });
      
        if (!postRes.ok) {
          const errText = await postRes.text();
          throw new Error(`Error creando nuevo chat: ${errText}`);
        }
      
        const data = await postRes.json();
        setSelectedChat(data.chat); 
        triggerRefresh();

      }else{
        await fetch("/api/chats/updateChat", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: updatedChat.id,
            conversation: updatedChat.conversation,
            title: updatedChat.title,
          }),
        });

      }
    } catch (err) {
      console.error("Error al guardar en JSON:", err);
    }
  };
  
  return (
    <main className="min-vh-100 d-flex flex-column container ">
    <div className="container py-4 flex-grow-1 overflow-auto">
      {chat?.conversation
        .reduce((acc, msg, i, arr) => {
          if (msg.sender === "user") {
            const botMsg = arr[i + 1]?.sender === "bot" ? arr[i + 1] : null;
            acc.push({ user: msg, bot: botMsg });
          }
          return acc;
        }, [] as { user: Chat["conversation"][0]; bot: Chat["conversation"][0] | null }[])
        .map((pair, index) => (
          <div key={index}>
            <div className="d-flex align-items-start mb-2 justify-content-start">
              <Image
                src="https://randomuser.me/api/portraits/men/36.jpg"
                alt="user"
                className="rounded-circle me-2"
                width="40"
                height="40"
              />
              <div className="p-2 bg-white border rounded-3 text-dark">
                {pair.user.message}
              </div>
            </div>
  
            {pair.bot && (
              <div className="d-flex align-items-start mb-3 justify-content-end">
                <div className="p-2 bg-primary text-white rounded-3 me-2 text-end">
                  {pair.bot.message}
                </div>
                <Image
                  src="https://randomuser.me/api/portraits/men/33.jpg"
                  alt="bot"
                  className="rounded-circle"
                  width="40"
                  height="40"
                />
              </div>
            )}
          </div>
        ))}
    </div>
  
    <form onSubmit={handleSend} className="d-flex gap-2 mb-5 ">
      <textarea
        className="form-control"
        rows={1}
        placeholder="Escribe un mensaje..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(e); 
          }
        }}
      />
      <button type="submit" className="btn btn-primary">
        Enviar
      </button>
    </form>

  </main>
  
  );
}


