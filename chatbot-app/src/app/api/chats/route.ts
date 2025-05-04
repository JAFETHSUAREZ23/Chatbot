import chats from "../../data/chats.json";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { User, Chat} from "../../types/index";

const SECRET = "frontend-secret-key";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No token" }, { status: 401 });
  }

  try {
    const user = verify(token, SECRET) as User;
    const userChats = (chats as Record<string, Chat[]>)[user.id] || [];
    return NextResponse.json({ chats: userChats });
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
