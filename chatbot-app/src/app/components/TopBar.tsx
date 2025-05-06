'use client';

import { useState } from "react";
import SearchInput from "./SearchInput";
import { setSelectedChat } from "../hooks/useSelectedChat";
import { v4 as uuidv4 } from "uuid";


export default function TopBar({ onSearchChange }: { onSearchChange: (value: string) => void }) {
  const [searchActive, setSearchActive] = useState(false);

  const handleNewChat = () => {
    const newEmptyChat = {
      id: uuidv4(),
      title: "",
      conversation: [],
    };
  
    setSelectedChat(newEmptyChat);
  };
   
  

  return (
    <div className="p-3 border-bottom">
      <h4 className="fw-semi-bold mb-3 text-dark">C H A T A.I+</h4>
      <div className="d-flex align-items-center gap-2 mb-3">
        {!searchActive && (
          <button className="btn text-white  flex-grow-1 rounded-pill" onClick={handleNewChat} style={{backgroundColor: '#5661F6'}}>
            + New Chat
          </button>
        )}
        <SearchInput onFocusChange={setSearchActive} onSearchChange={onSearchChange} />
      </div>
    </div>
  );
}

