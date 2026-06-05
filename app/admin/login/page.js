"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const login = async (event) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") })
    });
    if (!response.ok) {
      setError("Invalid admin credentials.");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <main className="admin-login">
      <form className="admin-login-card" onSubmit={login}>
        <Image src="/assets/logo-3d.png" alt="Zee Brows logo" width={112} height={112} priority />
        <span className="eyebrow">Private Dashboard</span>
        <h1>Zee Brows Admin</h1>
        <label>
          <span>Email</span>
          <input defaultValue="admin@zeebrows.com" name="email" type="email" />
        </label>
        <label>
          <span>Password</span>
          <input defaultValue="admin123" name="password" type="password" />
        </label>
        <button className="btn" type="submit"><Lock size={18} /> Login</button>
        {error ? <p className="admin-error">{error}</p> : null}
        <p>Uses an HTTP-only admin session cookie. Set ADMIN_EMAIL and ADMIN_PASSWORD in Vercel.</p>
      </form>
    </main>
  );
}
