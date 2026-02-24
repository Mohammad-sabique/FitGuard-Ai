"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      ...form,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/profile");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-10 rounded-2xl w-96 space-y-6 shadow-2xl"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 bg-slate-800 rounded-lg outline-none"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 bg-slate-800 rounded-lg outline-none"
        />

        <button className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:scale-105 transition">
          Login
        </button>
      </form>
    </main>
  );
}