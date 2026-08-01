// src/app/(dashboardGroup)/customer/_components/getMe-customer.tsx

import { IUser } from "@/types";
import { User, Mail, Shield, CheckCircle2, Clock } from "lucide-react";

interface GetMeCustomerProps {
    user: IUser;
}

export function GetMeCustomer({ user }: GetMeCustomerProps) {
    const formattedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : "N/A";

    return (
        <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 z-10 relative">
                {/* User Avatar Placeholder */}
                <div className="h-20 w-20 rounded-full bg-indigo-600/30 border-2 border-indigo-400/40 flex items-center justify-center shrink-0 shadow-inner">
                    <User className="h-10 w-10 text-indigo-300" />
                </div>

                {/* User Details */}
                <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
                            {user?.name || "Customer User"}
                        </h2>
                        <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium">
                            <CheckCircle2 className="h-3 w-3" />
                            {user?.status || "ACTIVE"}
                        </span>
                    </div>

                    <p className="text-sm text-slate-300 flex items-center gap-2 truncate">
                        <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                        {user?.email}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                            <Shield className="h-3.5 w-3.5 text-indigo-400" />
                            Role: <strong className="text-slate-200">{user?.role}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-indigo-400" />
                            Joined: <strong className="text-slate-200">{formattedDate}</strong>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}