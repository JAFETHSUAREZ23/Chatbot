import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Chat, User } from "../../../types/index";

const SECRET = "frontend-secret-key";
const chatsFilePath = path.join(process.cwd(), "src", "app", "data", "chats.json");

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ message: "No token" }, { status: 401 });

  try {
    const user = verify(token, SECRET) as User;
    const { chatId, title } = await req.json();

    if (!chatId || typeof title !== "string") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const fileData = fs.readFileSync(chatsFilePath, "utf-8");
    const chats: Record<string, Chat[]> = JSON.parse(fileData);

    const userChats = chats[user.id];
    if (!userChats) return NextResponse.json({ message: "No chats for user" }, { status: 404 });

    const index = userChats.findIndex(chat => chat.id === chatId);
    if (index === -1) return NextResponse.json({ message: "Chat not found" }, { status: 404 });

    chats[user.id][index].title = title;

    fs.writeFileSync(chatsFilePath, JSON.stringify(chats, null, 2));

    return NextResponse.json({ message: "Title updated" });
  } catch (err) {
    console.error("Edit title error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
