"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wrench, Menu, X, User, ArrowRight } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
              <Wrench className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              FixIt<span className="text-indigo-600">Now</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/services"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Browse Services
            </Link>
            <Link
              href="/technicians"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Find Technicians
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Categories
            </Link>

          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <User className="mr-2 h-4 w-4" />
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-100 transition-all"
            >
              Get Started
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/services"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 rounded-md hover:bg-slate-50"
          >
            Browse Services
          </Link>
          <Link
            href="/technicians"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 rounded-md hover:bg-slate-50"
          >
            Find Technicians
          </Link>
          <Link
            href="/categories"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 rounded-md hover:bg-slate-50"
          >
            Categories
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center w-full h-10 px-4 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center w-full h-10 px-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}