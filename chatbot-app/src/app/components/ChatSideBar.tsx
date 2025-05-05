'use client';

import { useState } from "react";
import TopBar from "./TopBar";
import ChatList from "./ChatList";
import UserSettings from "./UserSettings";

export default function ChatSidebar() {
  const [searchText, setSearchText] = useState("");

  return (
    <div
      className="d-flex flex-column border-end"
      style={{ width: "300px", height: "100vh" }}
    >
      <TopBar onSearchChange={setSearchText} />
      
      <div className="flex-grow-1 overflow-auto">
        <ChatList searchText={searchText} />
      </div>

      <UserSettings />
    </div>
  );
}

