"use client";

import { useTransition } from "react";
import { logoutAction } from "@/app/_actions/logout-action";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logoutAction();
        // بعد از لاگ‌اوت، هدایت بدون رفرش کامل
        window.location.href = "/login";
      } catch (err) {
        console.error("Logout failed", err);
      }
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}
