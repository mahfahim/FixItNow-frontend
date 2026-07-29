"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Mail, Lock } from "lucide-react"
import { toast } from "sonner"

import { loginUser } from "../_actions/auth.action"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    startTransition(async () => {
      const result = await loginUser({ email, password })

      if (!result?.success) {
        toast.error(result?.error ?? "Invalid email or password.")
        return
      }

      toast.success("Welcome back!")
      router.push("/")
    })
  }

  return (
    <Card className="w-full max-w-md border-muted/60 shadow-lg md:shadow-xl">
      <CardHeader className="space-y-2 text-center pb-6">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-base">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/70" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/70" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-11 mt-2 text-base font-semibold" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in to account"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t p-6">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:text-primary/80 hover:underline hover:underline-offset-4 transition-colors"
          >
            Sign up for free
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}