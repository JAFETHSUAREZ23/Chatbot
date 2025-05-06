'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "../types/index";
import { Image } from "react-bootstrap";
import NextImage from "next/image";
import settings from "../asssests/settings.png";
import { useRouter } from "next/navigation";

export default function UserSettings() {
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();


  useEffect(() => {
    axios.get("/api/auth/me").then(res => setUser(res.data.user));
  }, []);


  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };


  return (
    <div className="border-top mt-2 pt-3 px-3 mb-4">
      <button className="btn btn-outline-secondary w-100 mb-2 d-flex align-items-center gap-2 text-dark rounded-pill ">
      <NextImage
                    src={settings}
                    alt="settings"
                    className="rounded-circle"
                    width="30"
                    height="30"
                   
                  />
                  Settings
      </button>
      {user && (
        <button className="btn btn-outline-secondary w-100 mb-2 d-flex align-items-center gap-2 text-dark rounded-pill"
        onClick={() => setShowModal(true)}
        >
          <Image src="https://randomuser.me/api/portraits/men/36.jpg" alt="avatar" width={30} height={30} className="rounded-circle" /> 
          <span className="fw-semi-bold text-black">{user.name}</span>
        </button>
      )}

        {showModal && (
        <div
       className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
       style={{ zIndex: 9999 }}
     >
       <div className="bg-white p-4 rounded shadow" style={{ width: "320px" }}>
         <div className="d-flex align-items-center mb-3">
           <Image
             src="https://randomuser.me/api/portraits/men/36.jpg"
             alt="avatar"
             width={50}
             height={50}
             className="rounded-circle me-3"
           />
           <div>
             <p className="mb-1 text-dark">
               <strong>Name:</strong> {user?.name}
             </p>
             <p className="mb-0 text-dark">
               <strong>Email:</strong> {user?.email}
             </p>
           </div>
         </div>
     
         <div className="d-flex justify-content-between mt-3">
           <button className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
             Close
           </button>
           <button className="btn btn-danger" onClick={handleLogout}>
             Log Out
           </button>
         </div>
       </div>
        </div>
     
      )}
    </div>
  );
}
