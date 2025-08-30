"use client";
import { useFormState, useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/app/_actions/login-action";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full cursor-pointer" disabled={pending}>
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogIn className="h-4 w-4" />
      )}
      <span>{pending ? "در حال ورود ..." : "ورود"}</span>
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, {
    isSuccess: false,
    error: "",
  });

  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (state?.isSuccess) {
      router.push("/");
    }
  }, [state?.isSuccess, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        action={formAction}
        className="bg-white p-8 rounded-2xl shadow w-full max-w-md space-y-5"
      >
        <h1 className="text-2xl font-bold text-center">ورود به پنل کاربری</h1>

        <div className="space-y-1">
          <label className="text-sm font-medium">نام کاربری</label>
          <Input type="email" name="email" required />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">رمز عبور</label>
          <Input type="password" name="password" required />
        </div>

        {/* ✅ reCAPTCHA */}
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          ref={recaptchaRef}
          onChange={(value:any) => setToken(value || "")}
        />

        {/* 🔑 hidden input برای ارسال توکن به سرور */}
        <input type="hidden" name="g-recaptcha-response" value={token} />

        <SubmitButton />

        {state?.error && (
          <p className="text-xs text-red-500 text-center">{state.error}</p>
        )}
      </form>
    </div>
  );
}
