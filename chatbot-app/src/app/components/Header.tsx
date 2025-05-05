'use client';

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-light py-3 border-bottom">
    <div className="container">
      <div className="row align-items-center">
        <div className="col">
          <Link href="/" className="text-decoration-none text-dark fs-4 fw-bold">
          ChatBotAI
          </Link>
        </div>
        <div className="col text-end">
          <Link href="/login">
            <button className="btn btn-primary">Login</button>
          </Link>
        </div>
      </div>
    </div>
  </header>
  );
}




