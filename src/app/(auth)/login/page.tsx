'use client';
import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginAction } from '@/app/_actions/login-action';

type LoginFormInputs = { email: string; password: string };

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: LoginFormInputs) => {
    startTransition(async () => {
      try {
        await loginAction(data);
        // بعد از موفقیت: می‌تونی اینجا ریدایرکت سمت کلاینت کنی
        window.location.href = '/dashboard';
      } catch (e: any) {
        alert(e?.message ?? 'Login failed');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl shadow w-full max-w-md space-y-5">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <Input type="password" {...register('password', { required: 'Password is required' })} />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Logging in…' : 'Login'}
        </Button>
      </form>
    </div>
  );
}
