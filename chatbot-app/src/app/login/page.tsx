'use client';
import { useState } from "react";

function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: "", 
    password: ""
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log(credentials);
    
  }

  return (
    <div>
        <form onSubmit={handleSubmit}>
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