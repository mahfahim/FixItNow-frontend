// src/app/layout.tsx 

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "@/app/globals.css";
import { ToastProvider } from "@/providers/toast-provider";
import QueryProvider from "@/providers/query-provider";
// import { AuthProvider } from "@/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FixItNow | Professional On-Demand Home Services",
  description: "Book trusted technicians for plumbing, electrical, appliance repair, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased`}
        suppressHydrationWarning
      >
        {/* <AuthProvider> */}
        <QueryProvider>
          <ToastProvider>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-slate-50">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              {children}
            </Suspense>
          </ToastProvider>
        </QueryProvider>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}