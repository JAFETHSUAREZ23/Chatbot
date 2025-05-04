import jwt from "jsonwebtoken";
import users from "../data/users.json";

const SECRET_KEY = "frontend-secret";

export function loginUser(email: string, password: string): string | null {
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return null;

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
  localStorage.setItem("token", token);
  return token;
}

export function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    return null;
  }
}
