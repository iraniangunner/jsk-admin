"use client";

import { useFormState, useFormStatus } from "react-dom";
import { logoutAction } from "@/app/_actions/logout-action";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { useEffect } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 text-destructive py-4 px-8 bg-gray-400 rounded-2xl my-10 cursor-pointer disabled:opacity-50"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      <span>{pending ? "در حال خروج..." : "خروج"}</span>
    </button>
  );
}

export default function LogoutButton() {
  const [state, formAction] = useFormState(logoutAction, {
    isSuccess: false,
    error: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (state.isSuccess) {
      router.push("/login");
    }
  }, [state.isSuccess, router]);

  return (
    <form action={formAction}>
      <SubmitButton />
      {state.error && (
        <p className="text-red-500 text-sm mt-2">{state.error}</p>
      )}
    </form>
  );
}
