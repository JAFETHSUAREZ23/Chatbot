import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { User, Chat, Message } from "../../../types/index";
import fs from "fs";
import path from "path";

const SECRET = "frontend-secret-key";
const chatsFilePath = path.join(process.cwd(), "src", "app", "data", "chats.json");

function isValidSender(sender: unknown): sender is "user" | "bot" {
  return sender === "user" || sender === "bot";
}

function isValidConversation(conversation: unknown): conversation is Message[] {
  if (!Array.isArray(conversation)) return false;

  return conversation.every((msg) => {
    if (
      typeof msg !== "object" ||
      msg === null ||
      !("sender" in msg) ||
      !("message" in msg)
    ) {
      return false;
    }

    const { sender, message } = msg as Record<string, unknown>;
    return isValidSender(sender) && typeof message === "string";
  });
}

export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No token" }, { status: 401 });
  }

  try {
    const user = verify(token, SECRET) as User;
    const body = await req.json();
    const { chatId, conversation, title } = body;

    if (typeof chatId !== "string" || !isValidConversation(conversation)) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const fileContent = fs.readFileSync(chatsFilePath, "utf-8");
    const updatedChats: Record<string, Chat[]> = JSON.parse(fileContent);

    const userChats = updatedChats[user.id];
    if (!userChats) {
      return NextResponse.json({ message: "No chats found" }, { status: 404 });
    }

    const index = userChats.findIndex(chat => chat.id === chatId);
    if (index === -1) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    updatedChats[user.id][index].conversation = conversation;

    if (title && !updatedChats[user.id][index].title) {
      updatedChats[user.id][index].title = title;
    }

    fs.writeFileSync(chatsFilePath, JSON.stringify(updatedChats, null, 2));
    return NextResponse.json({ message: "Chat updated" });

  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ message: "Invalid token or server error" }, { status: 500 });
  }
}
