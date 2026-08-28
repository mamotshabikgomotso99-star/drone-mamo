import Link from "next/link";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata = {
  title: "Reset password",
  description: "Choose a new KM Drone Services password.",
};

export default function ResetPasswordPage() {
  return (
    <div className="rounded-2xl glass-strong p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Reset password</h1>
      <p className="mt-1 text-sm text-fg-muted">Enter a new password to regain access.</p>
      <div className="mt-7">
        <ResetPasswordForm />
      </div>
      <p className="mt-5 text-sm text-fg-muted text-center">
        <Link href="/login" className="text-leaf-700 hover:underline font-medium">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}