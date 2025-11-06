import "./globals.css";
import Link from "next/link";
import { auth } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packs & Lists — WIP",
  description: "Preview → Confirm → Commit"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <header className="border-b bg-white">
          <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
            <Link href="/" className="font-bold">Packs &amp; Lists</Link>
            <nav className="flex gap-3">
              <Link href="/lists" className="underline">Lists</Link>
              {session ? (
                <SignOutButton />
              ) : (
                <Link href="/login" className="px-3 py-1 rounded bg-slate-900 text-white">Login</Link>
              )}
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
