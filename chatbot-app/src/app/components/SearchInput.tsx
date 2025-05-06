'use client';

import { useState, useRef } from "react";

interface SearchInputProps {
  onFocusChange?: (active: boolean) => void;
  onSearchChange?: (text: string) => void;
}

export default function SearchInput({ onFocusChange, onSearchChange }: SearchInputProps) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setSearchActive(true);
    onFocusChange?.(true);
  };
  const handleBlur = () => {
    // Accede directamente al input actual
    const currentValue = inputRef.current?.value ?? "";
    if (currentValue.trim() === "") {
      setSearchActive(false);
      onFocusChange?.(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    onSearchChange?.(value);
  };
  

  return (
    <div className="position-relative" 
      style={{ width: searchActive ? "200px" : "40px", transition: "width 0.3s ease" }}
      >
      <input
        ref={inputRef}
        type="text"
        className="form-control border-0 text-white bg-dark pe-2 rounded-pill"
        placeholder="Search..."
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        value={searchText}
        style={{
          height: "40px",
          width: "100%",
          paddingLeft: "30px", 
          backgroundColor: "black",
          boxShadow: searchActive
            ? "inset 1.5px 1.5px 3px #0e0e0e, inset -1.5px -1.5px 3px #5f5e5e"
            : "1.5px 1.5px 3px #0e0e0e, -1.5px -1.5px 3px rgba(95,94,94,0.25)",
          cursor: searchActive ? "text" : "pointer",
          transition: "all 0.3s ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "40px",
          height: "40px",
          padding: "8px",
          pointerEvents: "none",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          style={{ width: "100%", height: "100%", color: "white" }}
        >
          <path
            d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
            fill="none"
            stroke="currentColor"
            strokeWidth={32}
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth={32}
            d="M338.29 338.29L448 448"
          />
        </svg>
      </div>
    </div>
  );
}