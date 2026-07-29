// src/app/(authGroup)/layout

import type React from "react"
import { Toaster } from "@/components/ui/sonner"

import "../globals.css"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="flex min-h-svh items-center justify-center bg-muted p-4">
            {children}
            <Toaster position="top-center" richColors />
        </main>
    )
}
