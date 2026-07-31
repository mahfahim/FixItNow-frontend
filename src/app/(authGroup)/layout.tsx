import React from "react";
import Link from "next/link";
import { Wrench } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-100 p-4 sm:p-6">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md group-hover:scale-105 transition-transform">
            <Wrench className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Fix<span className="text-indigo-600">ItNow</span>
          </span>
        </Link>
      </div>
      <div className="w-full flex justify-center">{children}</div>
    </div>
  );
}