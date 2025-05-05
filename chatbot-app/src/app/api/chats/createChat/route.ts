import chats from "../../../data/chats.json";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { User, Chat, Message } from "../../../types/index";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const SECRET = "frontend-secret-key";
const chatsFilePath = path.join(process.cwd(), "src", "app", "data", "chats.json");

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No token" }, { status: 401 });
  }

  try {
    const user = verify(token, SECRET) as User;
    const { firstMessage, botReply } = await req.json();

    if (
      typeof firstMessage !== "string" ||
      !firstMessage.trim() ||
      typeof botReply !== "string" ||
      !botReply.trim()
    ) {
      return NextResponse.json({ message: "Invalid message(s)" }, { status: 400 });
    }

    const userMsg: Message = { sender: "user", message: firstMessage.trim() };
    const botMsg: Message = { sender: "bot", message: botReply.trim() };

    const newChat: Chat = {
      id: uuidv4(),
      title: userMsg.message.slice(0, 30),
      conversation: [userMsg, botMsg],
    };

    const updatedChats: Record<string, Chat[]> = { ...chats } as Record<string, Chat[]>;

    if (!updatedChats[user.id]) {
      updatedChats[user.id] = [];
    }

    updatedChats[user.id].unshift(newChat);

    fs.writeFileSync(chatsFilePath, JSON.stringify(updatedChats, null, 2));

    return NextResponse.json({ chat: newChat });
  } catch (err) {
    console.error("Error creando chat:", err);
    return NextResponse.json({ message: "Invalid token or internal error" }, { status: 500 });
  }
}
