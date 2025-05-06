import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { User, Chat, Message } from "../../../types/index";
import path from "path";
import fs from "fs";
import rawChats from "../../../data/chats.json";

const SECRET = "frontend-secret-key";
const chatsFilePath = path.join(process.cwd(), "src", "app", "data", "chats.json");

function isValidSender(sender: unknown): sender is "user" | "bot" {
  return sender === "user" || sender === "bot";
}

function isValidMessage(obj: unknown): obj is Message {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "sender" in obj &&
    "message" in obj &&
    isValidSender((obj as Record<string, unknown>).sender) &&
    typeof (obj as Record<string, unknown>).message === "string"
  );
}

function isValidChat(obj: unknown): obj is Chat {
    if (
      typeof obj !== "object" ||
      obj === null ||
      !("id" in obj) ||
      !("title" in obj) ||
      !("conversation" in obj)
    ) {
      return false;
    }
  
    const record = obj as Record<string, unknown>;
  
    const idValid = typeof record.id === "string";
    const titleValid = typeof record.title === "string";
    const conversation = record.conversation;
  
    if (!Array.isArray(conversation)) return false;
  
    const conversationValid = (conversation as unknown[]).every(isValidMessage);
  
    return idValid && titleValid && conversationValid;
  }
  
function sanitizeChats(raw: unknown): Record<string, Chat[]> {
  const result: Record<string, Chat[]> = {};

  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return result;
  }

  for (const [userId, chats] of Object.entries(raw)) {
    if (!Array.isArray(chats)) continue;

    const validChats = chats.filter(isValidChat);
    result[userId] = validChats;
  }

  return result;
}

export async function DELETE() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No token" }, { status: 401 });
  }

  try {
    const user = verify(token, SECRET) as User;
    const chats = sanitizeChats(rawChats);

    chats[user.id] = [];

    fs.writeFileSync(chatsFilePath, JSON.stringify(chats, null, 2));
    return NextResponse.json({ message: "All chats cleared" });
  } catch (err) {
    console.error("Error clearing chats:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
