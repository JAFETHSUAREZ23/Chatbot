import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import users from "../../../data/users.json";

const SECRET = "frontend-secret-key"; 

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
  }

  const token = sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, 
    },
    SECRET
  );

  const response = NextResponse.json({ token });

  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, 
    path: "/",
  });

  return response;
}
