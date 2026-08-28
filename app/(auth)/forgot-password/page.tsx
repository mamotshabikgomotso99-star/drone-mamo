import Link from "next/link";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata = {
  title: "Forgot password",
  description: "Reset your KM Drone Services password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-2xl glass-strong p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Forgot password</h1>
      <p className="mt-1 text-sm text-fg-muted">
        We&apos;ll email you a reset link if an account exists.
      </p>
      <div className="mt-7">
        <ForgotPasswordForm />
      </div>
      <p className="mt-5 text-sm text-fg-muted text-center">
        Remembered it?{" "}
        <Link href="/login" className="text-leaf-700 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}