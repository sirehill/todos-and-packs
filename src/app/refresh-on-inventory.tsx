"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RefreshOnInventory() {
  const router = useRouter();
  useEffect(() => {
    const on = () => router.refresh();
    window.addEventListener("pl:inventory" as any, on as any);
    return () => window.removeEventListener("pl:inventory" as any, on as any);
  }, [router]);
  return null;
}
