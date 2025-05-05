'use client';

import { createContext, useContext, useState } from "react";

const ChatRefreshContext = createContext<{
  refreshFlag: number;
  triggerRefresh: () => void;
}>({
  refreshFlag: 0,
  triggerRefresh: () => {},
});

export function ChatRefreshProvider({ children }: { children: React.ReactNode }) {
  const [refreshFlag, setRefreshFlag] = useState(0);

  const triggerRefresh = () => setRefreshFlag(prev => prev + 1);

  return (
    <ChatRefreshContext.Provider value={{ refreshFlag, triggerRefresh }}>
      {children}
    </ChatRefreshContext.Provider>
  );
}

export const useChatRefresh = () => useContext(ChatRefreshContext);
