export interface Message {
    sender: "user" | "bot";
    message: string;
    feedback?: "like" | "dislike";
}
  
export interface Chat {
  id: string;
  title: string;
  conversation: Message[];
  createdAt?: string;
}


export interface User {
  id: string;
  name: string;
  email: string;
}


