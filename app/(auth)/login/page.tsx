import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your KM Drone Services dashboard.",
};

export default function LoginPage() {
  return (
    <div className="rounded-2xl glass-strong p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Sign in</h1>
      <p className="mt-1 text-sm text-fg-muted">Welcome back. Manage your bookings and farm.</p>
      <div className="mt-7">
        <LoginForm />
      </div>
      <p className="mt-5 text-sm text-fg-muted text-center">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-leaf-700 hover:underline font-medium">
          Create one
        </Link>
      </p>
      <p className="mt-2 text-sm text-fg-muted text-center">
        <Link href="/forgot-password" className="text-fg-dim hover:text-fg">
          Forgot password?
        </Link>
      </p>
    </div>
  );
}