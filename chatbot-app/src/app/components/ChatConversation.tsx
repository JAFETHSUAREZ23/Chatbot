'use client';

import { useEffect, useState } from "react";
import { Chat, Message } from "../types";
import { useSelectedChat, setSelectedChat } from "../hooks/useSelectedChat";
import { v4 as uuidv4 } from "uuid";
import { Image } from "react-bootstrap";
import { useChatRefresh } from "../hooks/useChatRefresh";
import chatbot from "../asssests/chatbot.png";
import sendMsg from "../asssests/send.png";
import editIcon from "../asssests/edit.png";
import likeIcon from "../asssests/like.png";
import dislikeIcon from "../asssests/dislike.png";
import copyIcon from "../asssests/copy.png";

import NextImage from "next/image";
import '../styles/chatConversation.css'

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

export function parseBotMessage(message: string): React.ReactNode {
  const parts = message.split(/```/g); 
  return (
    <>
      {parts.map((part, index) => {
        const isCode = index % 2 === 1;
        if (isCode) {
          return (
            <pre
              key={index}
              className="bg-dark text-white p-2 rounded my-2"
              style={{ overflowX: "auto" }}
            >
              <code>{part.trim()}</code>
            </pre>
          );
        } else {
          const lines = part
            .split(/\n(?=\d+\.\s|[a-zA-Z]\.\s)/g)
            .map(line => line.trim())
            .filter(Boolean);

          const isOrdered = lines.every(line => /^\d+\.\s/.test(line));
          const isLettered = lines.every(line => /^[a-zA-Z]\.\s/.test(line));

          if ((isOrdered || isLettered) && lines.length > 1) {
            return (
              <ul key={index} className="mb-1 text-start text-dark">
                {lines.map((line, idx) => (
                  <li key={idx} className="text-dark">
                    {line.replace(/^(\d+\.|[a-zA-Z]\.)\s*/, "")}
                  </li>
                ))}
              </ul>
            );
          }

          return (
            <div key={index} className="text-start text-dark mb-1">
              {part}
            </div>
          );
        }
      })}
    </>
  );
}



export default function ChatConversation() {
  const chat = useSelectedChat(); 
  const [newMessage, setNewMessage] = useState("");
  const { triggerRefresh } = useChatRefresh();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");

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

      } else {
        const patchRes = await fetch("/api/chats/updateChat", {
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
      
        if (!patchRes.ok) {
          const text = await patchRes.text();
          throw new Error(`Error actualizando el chat: ${text}`);
        }
      
        triggerRefresh();
      }
      
    } catch (err) {
      console.error("Error al guardar en JSON:", err);
    }
  };

  const handleEditStart = (index: number, currentText: string) => {
    setEditingIndex(index);
    setEditedText(currentText);
  };

  const handleEditSave = async (index: number) => {
    if (!chat) return;
    const updated = [...chat.conversation];
    updated[index].message = editedText;
    const updatedChat: Chat = {
      ...chat,
      conversation: updated
    };
    setSelectedChat(updatedChat);
    setEditingIndex(null);

    await fetch("/api/chats/updateChat", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: chat.id,
        conversation: updatedChat.conversation,
        title: updatedChat.title
      }),
    });

    triggerRefresh();

  };

  const handleFeedback = async (feedback: "like" | "dislike") => {
    if (!chat) return;
  
    const lastIndex = [...chat.conversation].reverse().findIndex(msg => msg.sender === "bot");
    if (lastIndex === -1) return;
  
    const actualIndex = chat.conversation.length - 1 - lastIndex;
  
    const updatedConversation = chat.conversation.map((msg, index) =>
      index === actualIndex ? { ...msg, feedback } : msg
    );
  
    const updatedChat: Chat = {
      ...chat,
      conversation: updatedConversation,
    };
  
    setSelectedChat(updatedChat);
  
    await fetch("/api/chats/updateChat", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: chat.id,
        conversation: updatedChat.conversation,
        title: updatedChat.title,
      }),
    });
    triggerRefresh();

  };
  
  return (
    <main className="min-vh-100 d-flex flex-column container ">
      <div className="chat-container">
        {chat?.conversation
          .reduce((acc, msg, i, arr) => {
            if (msg.sender === "user") {
              const botMsg = arr[i + 1]?.sender === "bot" ? arr[i + 1] : null;
              acc.push({ user: msg, bot: botMsg, userIndex: i });
            }
            return acc;
          }, [] as { user: Chat["conversation"][0]; bot: Chat["conversation"][0] | null; userIndex: number }[])
          .map((pair, index) => {
            const isLastBotMessage =
              chat?.conversation[chat.conversation.length - 1] === pair.bot;
  
            return (
              <div key={index}>
                <div className="d-flex align-items-start mb-2 justify-content-start w-100">
                  <Image
                    src="https://randomuser.me/api/portraits/men/36.jpg"
                    alt="user"
                    className="rounded-circle me-2"
                    width="40"
                    height="40"
                  />
                  <div className="d-flex justify-content-between align-items-center bg-light rounded-3 px-3 py-2 w-100">
                    {editingIndex === pair.userIndex ? (
                      <input
                        className="form-control form-control-sm me-2"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        onBlur={() => handleEditSave(pair.userIndex)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleEditSave(pair.userIndex);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <>
                        <span className="text-dark">{pair.user.message}</span>
                        <NextImage
                          src={editIcon}
                          alt="edit"
                          width={20}
                          height={20}
                          style={{ cursor: "pointer", opacity: 0.6 }}
                          onClick={() => handleEditStart(pair.userIndex, pair.user.message)}
                          className="mt-3"
                        />
                      </>
                    )}
                  </div>
                </div>
  
                {pair.bot && (
                  <div className="d-flex align-items-start mb-3 justify-content-end w-100">
                    <div className="bg-light rounded-3 me-2 p-2" style={{ maxWidth: "80%" }}>
                      {/* <div className="text-start text-black mb-1">{pair.bot.message}</div> */}
                      {parseBotMessage(pair.bot.message)}

  
                      {isLastBotMessage && (
                        <div className="d-flex justify-content-start gap-3 mt-2">
                          <NextImage
                            src={likeIcon}
                            alt="like"
                            width={16}
                            height={16}
                            style={{
                              cursor: "pointer",
                              filter:
                                pair.bot?.feedback === "like"
                                  ? "invert(39%) sepia(100%) saturate(747%) hue-rotate(218deg)"
                                  : "none",
                            }}
                            onClick={() => handleFeedback("like")}
                          />
                          <NextImage
                            src={dislikeIcon}
                            alt="dislike"
                            width={20}
                            height={20}
                            style={{
                              cursor: "pointer",
                              filter:
                                pair.bot?.feedback === "dislike"
                                  ? "invert(39%) sepia(100%) saturate(747%) hue-rotate(0deg)"
                                  : "none",
                            }}
                            onClick={() => handleFeedback("dislike")}
                          />
                          <NextImage
                            src={copyIcon}
                            alt="copy"
                            width={16}
                            height={16}
                            style={{ cursor: "pointer" }}
                            onClick={() => pair.bot && navigator.clipboard.writeText(pair.bot.message)}
                          />
                        </div>
                      )}
                    </div>
  
                    <NextImage
                      src={chatbot}
                      alt="bot"
                      className="rounded-circle"
                      width="40"
                      height="40"
                    />
                  </div>
                )}
              </div>
            );
          })}
      </div>
  
      <form onSubmit={handleSend} className="d-flex justify-content-center mb-4">
        <div style={{ position: "relative", width: "70%" }}>
          <textarea
            className="form-control pe-5 rounded-pill shadow-sm textarea-style"
            rows={1}
            placeholder="🧠 What's in your mind?..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
  
          <button
            type="submit"
            className="btn btn-primary position-absolute d-flex align-items-center justify-content-center"
            style={{
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              padding: 0,
              backgroundColor: "#5661F6",
            }}
          >
            <NextImage
              src={sendMsg}
              alt="send"
              className="rounded-circle"
              width="20"
              height="20"
            />
          </button>
        </div>
      </form>
    </main>
  );
  
}


