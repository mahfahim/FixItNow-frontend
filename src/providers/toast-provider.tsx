// "use client";

// import React, { createContext, useContext, useCallback } from "react";
// import { Toaster, toast as baseToast } from "@/components/ui/toast";

// export type ToastType = "success" | "error" | "info" | "warning" | "loading";

// interface ToastOptions {
//     type?: ToastType;
//     title: string;
//     description?: string;
// }

// interface ToastContextType {
//     toast: (options: ToastOptions) => void;
//     success: (title: string, description?: string) => void;
//     error: (title: string, description?: string) => void;
//     info: (title: string, description?: string) => void;
//     warning: (title: string, description?: string) => void;
// }

// const ToastContext = createContext<ToastContextType | undefined>(undefined);

// export function ToastProvider({ children }: { children: React.ReactNode }) {
//     const addToast = useCallback(({ type = "info", title, description }: ToastOptions) => {
//         if (typeof baseToast?.add === "function") {
//             baseToast.add({
//                 title,
//                 description,
//                 type,
//             });
//         }
//     // }, 

//     const success = useCallback(
//         (title: string, description?: string) => addToast({ type: "success", title, description }),
//         [addToast]
//     );
//     const error = useCallback(
//         (title: string, description?: string) => addToast({ type: "error", title, description }),
//         [addToast]
//     );
//     const info = useCallback(
//         (title: string, description?: string) => addToast({ type: "info", title, description }),
//         [addToast]
//     );
//     const warning = useCallback(
//         (title: string, description?: string) => addToast({ type: "warning", title, description }),
//         [addToast]
//     );

//     return (
//         <ToastContext.Provider value={{ toast: addToast, success, error, info, warning }}>
//             {children}
//             {/* Base UI Toaster Viewport & Portal */}
//             <Toaster />
//         </ToastContext.Provider>
//     );
// }

// export function useToast() {
//     const context = useContext(ToastContext);
//     if (!context) {
//         throw new Error("useToast must be used within a ToastProvider");
//     }
//     return context;
// }