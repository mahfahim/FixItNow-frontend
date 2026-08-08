// src/app/(authGroup)/_components/register-form.tsx
"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, User, Shield } from "lucide-react";
import { toast } from "sonner";

import { register } from "@/actions/auth.actions";
import { registerValidationSchema } from "@/act-schema/auth.schema";
import { IRegisterUser } from "@/types/auth.types";
import { Role } from "@/types/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<IRegisterUser>({
    name: "",
    email: "",
    password: "",
    role: Role.CUSTOMER,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof IRegisterUser, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof IRegisterUser]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRoleChange = (value: string | null) => {
    if (value) {
      setFormData((prev) => ({ ...prev, role: value as Role }));
      if (errors.role) {
        setErrors((prev) => ({ ...prev, role: undefined }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    const validation = registerValidationSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof IRegisterUser, string>> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof IRegisterUser] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      try {
        const response = await register(formData);

        if (!response?.success) {
          toast.error(response?.message || "Registration failed. Please try again.");
          return;
        }

        toast.success("Account created successfully! Please sign in.");
        router.push("/login");
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Registration failed. Please try again.";
        toast.error(errorMessage);
      }
    });
  };

  return (
    <Card className="w-full max-w-md bg-white border border-slate-200/80 shadow-xl rounded-2xl">
      <CardHeader className="space-y-1.5 text-center pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
          Create an Account
        </CardTitle>
        <CardDescription className="text-slate-500 text-sm">
          Join FixItNow to book or offer professional services
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Field */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={isPending}
                className="pl-11 h-11 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all rounded-lg"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">{errors.name}</p>
            )}
          </div>

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
                placeholder="name@example.com"
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

          {/* Role Field  */}
          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-sm font-semibold text-slate-700">
              Register As
            </Label>
            <div className="relative">
              <Shield className="absolute left-3.5 top-3 h-5 w-5 text-slate-400 z-10 pointer-events-none" />
              <Select
                value={formData.role}
                onValueChange={handleRoleChange}
                disabled={isPending}
              >
                <SelectTrigger className="w-full pl-11 h-11 bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-lg">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.CUSTOMER}>
                    Customer (I need services)
                  </SelectItem>
                  <SelectItem value={Role.TECHNICIAN}>
                    Technician (I offer services)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.role && (
              <p className="text-xs text-red-500 font-medium">{errors.role}</p>
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
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-slate-100 p-6">
        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
          >
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}