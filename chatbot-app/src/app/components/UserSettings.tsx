'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "../types/index";
import { Image } from "react-bootstrap";


export default function UserSettings() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios.get("/api/auth/me").then(res => setUser(res.data.user));
  }, []);

  return (
    <div className="border-top mt-2 pt-3 px-3 mb-4">
      <button className="btn btn-outline-secondary w-100 mb-2 d-flex align-items-center gap-2">
        <i className="bi bi-gear" />
        Settings
      </button>
      {user && (
        <div className="d-flex align-items-center gap-2">
          <Image src="https://randomuser.me/api/portraits/men/36.jpg" alt="avatar" width={40} height={40} className="rounded-circle" /> 
          <span className="fw-bold text-black">{user.name}</span>
        </div>
      )}
    </div>
  );
}
