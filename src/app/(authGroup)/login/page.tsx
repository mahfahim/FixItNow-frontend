//src/app/(authGroup)/login/page.tsx
import { Metadata } from "next";
import { LoginForm } from "../_components/login-form";

export const metadata: Metadata = {
  title: "Login | FixItNow",
  description: "Sign in to your FixItNow account",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <LoginForm />
    </main>
  );
}