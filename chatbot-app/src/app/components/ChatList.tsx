'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { Chat } from "../types/index";
import { useSelectedChat, setSelectedChat } from "../hooks/useSelectedChat";
import { useChatRefresh } from "../hooks/useChatRefresh";
import NextImage from "next/image";
import chatDefault from "../asssests/chat.png";
import editIcon from "../asssests/edit.png";
import trashIcon from "../asssests/trash.png";
import { parseISO, differenceInDays } from "date-fns";
import '../styles/chatList.css'
export default function ChatList({ searchText = "" }: { searchText: string }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const selectedChat = useSelectedChat();
  const { refreshFlag, triggerRefresh } = useChatRefresh();
  const [editId, setEditId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");

  useEffect(() => {
    axios.get("/api/chats").then((res) => setChats(res.data.chats));
  }, [refreshFlag]);

  const filtered = chats.filter((chat) =>
    (chat.title || chat.conversation[0]?.message || "")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const recentChats = filtered.filter(
    (chat) => !chat.createdAt || differenceInDays(new Date(), parseISO(chat.createdAt)) <= 7
  );

  const oldChats = filtered.filter(
    (chat) => chat.createdAt && differenceInDays(new Date(), parseISO(chat.createdAt)) >= 6
  );
  
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/chats/deleteChat", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: id }),
      });

      if (res.ok) {
        triggerRefresh();
      } else {
        const error = await res.json();
        console.error("Error deleting chat:", error.message);
      }
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  };

  const handleEdit = async (chatId: string) => {
    try {
      const res = await fetch("/api/chats/editTitle", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, title: newTitle }),
      });

      if (res.ok) {
        setEditId(null);
        triggerRefresh();
      } else {
        const data = await res.json();
        console.error("Error:", data.message);
      }
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await fetch("/api/chats/clearAll", {
        method: "DELETE",
      });

      if (res.ok) {
        triggerRefresh();
      } else {
        const data = await res.json();
        console.error("Error clearing chats:", data.message);
      }
    } catch (err) {
      console.error("Error clearing chats:", err);
    }
  };

  const renderChat = (chat: Chat) => {
    const isActive = selectedChat?.id === chat.id;
    return (
      <div
        key={chat.id}
        className={`d-flex justify-content-between align-items-center px-3 py-2 ${isActive ? "bg-light" : ""}`}
      >
        <div className="d-flex align-items-center gap-2 flex-grow-1">
          <NextImage
            src={chatDefault}
            alt="chatDefault"
            className="rounded-circle"
            width="20"
            height="20"
            style={{
              filter: isActive
                ? "invert(39%) sepia(100%) saturate(747%) hue-rotate(218deg)"
                : "none",
            }}
          />

          {editId === chat.id ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEdit(chat.id);
              }}
              className="d-flex flex-grow-1 gap-2 align-items-center"
            >
              <input
                className="form-control form-control-sm"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn btn-sm btn-success">✔</button>
              <button type="button" className="btn btn-sm btn-secondary" onClick={() => setEditId(null)}>✖</button>
            </form>
          ) : (
            <button
              className={`btn btn-link text-start text-decoration-none flex-grow-1 ${isActive ? "text-primary" : "text-dark"}`}
              onClick={() => setSelectedChat(chat)}
            >
              {(chat.title.length > 15 ? chat.title.slice(0, 15) + "..." : chat.title) ||
                chat.conversation[0]?.message ||
                "Untitled Chat"}
            </button>
          )}
        </div>

        {isActive && (
          <div className="d-flex gap-1">
            <button
              className="btn p-0 bg-transparent"
              title="Delete"
              onClick={() => handleDelete(chat.id)}
            >
              <NextImage
                src={trashIcon}
                alt="trashIcon"
                className="rounded-circle"
                width="20"
                height="20"
                style={{
                  filter: isActive
                    ? "invert(39%) sepia(100%) saturate(747%) hue-rotate(218deg)"
                    : "none",
                }}
              />
            </button>

            <button
              className="btn p-0 bg-transparent"
              title="Edit"
              onClick={() => {
                setEditId(chat.id);
                setNewTitle(chat.title);
              }}
            >
              <NextImage
                src={editIcon}
                alt="editIcon"
                className="rounded-circle"
                width="20"
                height="20"
                style={{
                  filter: isActive
                    ? "invert(39%) sepia(100%) saturate(747%) hue-rotate(218deg)"
                    : "none",
                }}
              />
            </button>
          </div>
        )}
      </div>
    );
  };

  if (!filtered.length) return <p className="text-muted px-3">No chats found</p>;

  return (
    <div className=" listChat" >
      <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom mb-2">
        <span className="text-secondary fw-medium">Your conversations</span>
        <button className="btn text-primary p-0" style={{ fontWeight: 500 }} onClick={handleClearAll}>
          Clear All
        </button>
      </div>

      {recentChats.length > 0 && recentChats.map(renderChat)}

      {oldChats.length > 0 && (
        <>
          <p className="px-3 mt-3 text-muted small">Last 7 days</p>
          {oldChats.map(renderChat)}
        </>
      )}
    </div>
  );
}