'use client';
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";


function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: "", 
    password: ""
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", credentials);
      if (res.status === 200) {
        router.push("/chats");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error de login");
      } else {
        setError("Error inesperado");
      }
    }
  };

  return (
    <div>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: "red" }}>{error}</p>}
            <input name="email" 
             type="email"
             placeholder="email"
             onChange={handleChange}/>
            <input 
            name="password" 
            type="password" 
            placeholder="password" 
            onChange={handleChange}/>
            <button> Login </button>
        </form>
    </div>
  );
}

export default LoginPage;