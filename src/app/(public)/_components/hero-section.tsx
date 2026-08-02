"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState<string>("");

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/services?search=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            router.push("/services");
        }
    };

    return (
        <section className="relative overflow-hidden bg-slate-900 text-white pt-20 pb-24 lg:pt-28 lg:pb-32">
            {/* Subtle Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-950 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto space-y-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide">
                        <ShieldCheck className="h-4 w-4 text-indigo-400" />
                        Verified & Certified Local Professionals
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                        Expert Home Services <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-sky-300 to-emerald-400">
                            On Demand
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
                        From instant plumbing and electrical fixes to deep cleaning and appliance repair. Connect with verified technicians near you in minutes.
                    </p>

                    {/* Search Box */}
                    <form
                        onSubmit={handleSearch}
                        className="mt-8 flex flex-col sm:flex-row items-center gap-2 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 max-w-2xl mx-auto shadow-2xl"
                    >
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="What service do you need today? (e.g., AC Repair)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 h-12 bg-transparent border-none text-white placeholder:text-slate-400 focus-visible:ring-0 text-sm"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto h-12 px-7 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30"
                        >
                            Search
                        </Button>
                    </form>

                    {/* Quick Metrics */}
                    <div className="pt-10 grid grid-cols-3 gap-4 border-t border-slate-800 max-w-xl mx-auto text-slate-300">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">4.9/5</div>
                            <div className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                                <Star className="h-3 w-3 text-amber-400 fill-amber-400" /> Average Rating
                            </div>
                        </div>
                        <div className="text-center border-x border-slate-800">
                            <div className="text-2xl font-bold text-white">500+</div>
                            <div className="text-xs text-slate-400 mt-0.5">Active Technicians</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">&lt; 30 min</div>
                            <div className="text-xs text-slate-400 mt-0.5">Response Time</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}