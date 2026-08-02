// src/app/(public)/layout.tsx
import React from "react";
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Page Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <Footer />
        </div>
    );
}