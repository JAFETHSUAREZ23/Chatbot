export interface Message {
    sender: "user" | "bot";
    message: string;
  }
  
  export interface Chat {
    id: string;
    title: string;
    conversation: Message[];
  }
  
  
  export interface User {
    id: string;
    name: string;
    email: string;
  }
  

