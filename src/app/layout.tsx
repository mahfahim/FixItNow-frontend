// src/app/layout.tsx 
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
// import { AuthProvider } from "@/providers/auth-provider";
// import { ToastProvider } from "@/providers/toast-provider";

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
        {/* <ToastProvider> */}
        {children}
        {/* </ToastProvider> */}
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}