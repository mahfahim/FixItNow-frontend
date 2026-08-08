// src/app/(public)/page.tsx
import Link from "next/link";
import {
    Wrench,
    ShieldCheck,
    Clock,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    UserCheck,
    CreditCard,
    Award,
    HelpCircle
} from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">

            {/* 1. HERO SECTION */}
            <section className="relative bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-900/40 via-slate-900 to-slate-950 z-0" />
                <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
                            <Sparkles className="h-4 w-4" />
                            Smart Home Solutions Platform
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                            Welcome to <br />
                            <span className="text-indigo-400">FixItNow</span>
                        </h1>
                        <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
                            FixItNow is an on-demand service management platform connecting clients with background-checked home service professionals quickly and securely.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Link
                                href="/services"
                                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all text-sm"
                            >
                                Browse Services
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>

                        </div>
                    </div>

                    {/* Platform Commitment Card */}
                    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <ShieldCheck className="h-6 w-6 text-emerald-400" />
                            Our Standard Guarantees
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { title: "Identity Verified Experts", desc: "Strict background checks and NID verification for safety." },
                                { title: "Standard Upfront Pricing", desc: "Transparent cost estimates before work begins." },
                                { title: "Scheduled Timeliness", desc: "Service delivery aligned strictly with your chosen slot." },
                                { title: "Service Support", desc: "Dedicated support team ensuring complete job resolution." },
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                                        <p className="text-xs text-slate-400">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* 2. ABOUT FIXITNOW - STATIC FEATURE CARDS */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold mb-3">
                        <HelpCircle className="h-3.5 w-3.5" />
                        About FixItNow
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Why Choose Our Platform
                    </h2>
                    <p className="text-slate-500 mt-2 text-sm">
                        We simplify home maintenance by organizing skilled professionals and transparent booking workflows.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            title: "Smart Matching",
                            desc: "Intelligent booking system matches your issue with nearby qualified service providers.",
                            icon: UserCheck,
                            color: "bg-blue-50 text-blue-600",
                        },
                        {
                            title: "Upfront Costing",
                            desc: "Clear fee structure with no unexpected surcharges or hidden service costs.",
                            icon: CreditCard,
                            color: "bg-emerald-50 text-emerald-600",
                        },
                        {
                            title: "Vetted Professionals",
                            desc: "Technicians pass technical skill assessments before accepting platform requests.",
                            icon: Award,
                            color: "bg-purple-50 text-purple-600",
                        },
                        {
                            title: "Quality Assurance",
                            desc: "Track status updates, leave reviews, and receive ongoing customer assistance.",
                            icon: ShieldCheck,
                            color: "bg-amber-50 text-amber-600",
                        },
                    ].map((card, idx) => {
                        const IconComp = card.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color} mb-4`}>
                                        <IconComp className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{card.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 3. HOW IT WORKS */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            How FixItNow Works
                        </h2>
                        <p className="text-slate-500 text-sm mt-2">
                            A streamlined process designed to complete repairs efficiently.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Select & Schedule",
                                desc: "Choose the service category you require and set a convenient time slot and location.",
                                icon: Wrench,
                            },
                            {
                                step: "02",
                                title: "Expert Assignment",
                                desc: "FixItNow assigns a verified local technician who confirms your appointment request.",
                                icon: Clock,
                            },
                            {
                                step: "03",
                                title: "Job Completion & Payment",
                                desc: "The technician inspects and completes the work. Pay securely after verifying satisfaction.",
                                icon: ShieldCheck,
                            },
                        ].map((item, idx) => {
                            const IconComp = item.icon;
                            return (
                                <div key={idx} className="relative bg-slate-50 p-8 rounded-2xl border border-slate-200/60 text-center">
                                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-extrabold rounded-full shadow-md">
                                        Step {item.step}
                                    </span>
                                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-5 mt-2">
                                        <IconComp className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. CALL TO ACTION / BANNER */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="bg-linear-to-r from-indigo-600 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-3 text-center md:text-left">
                        <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Get Started?</h2>
                        <p className="text-indigo-100 text-sm max-w-lg">
                            Explore available categories or contact our support team to learn more about FixItNow services.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <Link
                            href="/services"
                            className="px-6 py-3 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm text-center shadow-md transition-all"
                        >
                            Explore Services
                        </Link>

                    </div>
                </div>
            </section>

        </div>
    );
}