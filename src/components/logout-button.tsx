"use client";

import { useTransition } from "react";
import { logoutAction } from "@/app/_actions/logout-action";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      const result = await logoutAction();
      if (result.isSuccess) {
        router.push("/login");
      }
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="flex items-center gap-2 text-destructive py-4 px-8 bg-gray-400 rounded-2xl my-10 cursor-pointer"
    >
      <LogOut className="h-4 w-4" />
      <span>{isPending ? "در حال خروج ..." : "خروج"}</span>
    </button>
  );
}
