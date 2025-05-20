import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode("frontend-secret-key");

export async function middleware(request: NextRequest) {

  const token = request.cookies.get("token")?.value;

  const protectedRoutes = ["/chats", "/user"];

  const isProtected = protectedRoutes.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isProtected) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    if(payload){
      return NextResponse.next();
    }
  } catch (err) {
   if(err){
    return NextResponse.redirect(new URL("/login", request.url));
   }
  }
  
}

export const config = {
  matcher: ["/chats","/chats/:path*", "/user/:path*"],
};
