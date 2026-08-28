import Link from "next/link";
import { RegisterForm } from "./RegisterForm";

export const metadata = {
  title: "Create account",
  description: "Create your KM Drone Services account.",
};

export default function RegisterPage() {
  return (
    <div className="rounded-2xl glass-strong p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Create account</h1>
      <p className="mt-1 text-sm text-fg-muted">Book your first drone service in minutes.</p>
      <div className="mt-7">
        <RegisterForm />
      </div>
      <p className="mt-5 text-sm text-fg-muted text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-leaf-700 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}