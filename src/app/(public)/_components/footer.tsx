"use client";

import React from "react";
import Link from "next/link";
import { Wrench, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 text-white rounded-xl">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                FixIt<span className="text-indigo-600">Now</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your trusted marketplace for instant home services, maintenance, and expert repairs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services" className="hover:text-indigo-600 transition-colors">
                  Browse All Services
                </Link>
              </li>
              <li>
                <Link href="/technicians" className="hover:text-indigo-600 transition-colors">
                  Find Technicians
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-indigo-600 transition-colors">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Account</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="hover:text-indigo-600 transition-colors">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-indigo-600 transition-colors">
                  Join as a Provider
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Support</h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-500">24/7 Customer Care</li>
              <li className="text-slate-500">support@fixitnow.com</li>
              <li className="text-slate-500">+880 1700-000000</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} FixItNow. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for fast home repairs.
          </p>
        </div>
      </div>
    </footer>
  );
}