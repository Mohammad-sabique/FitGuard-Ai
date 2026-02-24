"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-slate-800 bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link href="/" className="text-lg font-semibold tracking-wide">
          FitGuard AI
        </Link>

        <div className="flex gap-8 text-sm text-slate-400 items-center">
          
          {session && (
            <>
              <Link href="/profile" className="hover:text-white transition">
                Profile
              </Link>

              <Link href="/assessment" className="hover:text-white transition">
                Assessment
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hover:text-white transition"
              >
                Logout
              </button>
            </>
          )}

          {!session && (
            <>
              <Link href="/login" className="hover:text-white transition">
                Login
              </Link>

              <Link href="/register" className="hover:text-white transition">
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}