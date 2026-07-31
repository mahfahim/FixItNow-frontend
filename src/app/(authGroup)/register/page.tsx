// src/app/(authGroup)/register/page.tsx
import { Metadata } from "next";
import { RegisterForm } from "../_components/register-form";

export const metadata: Metadata = {
  title: "Register | FixItNow",
  description: "Create a new FixItNow account",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <RegisterForm />
    </main>
  );
}