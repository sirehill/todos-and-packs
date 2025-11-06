"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-xl font-bold">Login (dev)</h1>
      <input
        className="w-full border rounded p-2"
        placeholder="you@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button
        className="px-3 py-2 rounded bg-slate-900 text-white"
        onClick={() => signIn("credentials", { email, callbackUrl: "/lists" })}
      >
        Continue
      </button>
      <p className="text-sm text-slate-500">Dev-only: creates an account with just your email.</p>
    </div>
  );
}
