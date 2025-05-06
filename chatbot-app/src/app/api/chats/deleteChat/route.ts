import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { User, Chat } from "../../../types/index";

const SECRET = "frontend-secret-key";
const chatsFilePath = path.join(process.cwd(), "src", "app", "data", "chats.json");

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "No token" }, { status: 401 });
  }

  try {
    const { chatId } = await req.json();
    if (!chatId) {
      return NextResponse.json({ message: "Missing chatId" }, { status: 400 });
    }

    const user = verify(token, SECRET) as User;

    const fileContent = fs.readFileSync(chatsFilePath, "utf-8");
    const chats: Record<string, Chat[]> = JSON.parse(fileContent);

    if (!chats[user.id]) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedChats = chats[user.id].filter(chat => chat.id !== chatId);
    chats[user.id] = updatedChats;

    fs.writeFileSync(chatsFilePath, JSON.stringify(chats, null, 2));

    return NextResponse.json({ message: "Chat deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
