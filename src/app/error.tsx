// app/error.tsx

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global Error Caught:", error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
            <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                {/* Error Icon */}
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                    <AlertOctagon className="h-8 w-8" />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Something went wrong!
                </h1>

                {/* Description */}
                <p className="mt-2 text-sm text-slate-600">
                    An unexpected application error occurred. You can try recovering by clicking below or returning to homepage.
                </p>

                {/* Error Digest (if available) */}
                {error?.digest && (
                    <div className="mt-4 rounded-lg bg-slate-100 p-2.5 font-mono text-xs text-slate-500">
                        Error Digest: {error.digest}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex items-center justify-center gap-3">
                    <Button
                        onClick={() => reset()}
                        className="gap-2 bg-slate-900 hover:bg-slate-800"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Try Again
                    </Button>

                    <Link href="/">
                        <Button variant="outline" className="gap-2 border-slate-200 cursor-pointer">
                            <Home className="h-4 w-4" />
                            Go Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}