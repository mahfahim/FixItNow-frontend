// src/app/(authGroup)/_components/login-form.tsx
"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

import { login } from "@/actions/auth.actions";
import { loginValidationSchema } from "@/act-schema/auth.schema";
import { ILoginUser } from "@/types/auth.types";
import { Role } from "@/types/enums";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";




function getRoleFromToken(token: string): Role | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const parsed = JSON.parse(jsonPayload);
    return parsed?.role || null;
  } catch {
    return null;
  }
}

export function LoginForm() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<ILoginUser>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ILoginUser, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ILoginUser]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    const validation = loginValidationSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof ILoginUser, string>> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof ILoginUser] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      try {
        const response = await login(formData);

        if (!response?.success) {
          toast.error(response?.message || "Invalid email or password.");
          return;
        }

        const accessToken = response?.data?.accessToken;
        const userRole = accessToken ? getRoleFromToken(accessToken) : null;

        toast.success("Welcome back!");


        switch (userRole) {
          case Role.ADMIN:
            router.push("/admin/");
            break;
          case Role.TECHNICIAN:
            router.push("/technician/");
            break;
          case Role.CUSTOMER:
            router.push("/customer");
            break;
          default:
            router.push("/");
            break;
        }

        router.refresh();
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Something went wrong. Please try again.";
        toast.error(errorMessage);
      }
    });
  };

  return (
    <Card className="w-full max-w-md bg-white border border-slate-200/80 shadow-xl rounded-2xl">
      <CardHeader className="space-y-1.5 text-center pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome back
        </CardTitle>
        <CardDescription className="text-slate-500 text-sm">
          Enter your credentials to access your FixItNow account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isPending}
                className="pl-11 h-11 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all rounded-lg"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                disabled={isPending}
                className="pl-11 h-11 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all rounded-lg"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-medium">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md shadow-indigo-100 transition-all duration-200"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-slate-100 p-6">
        <p className="text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
          >
            Sign up for free
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}