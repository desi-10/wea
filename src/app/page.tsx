"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { sanitizePassword } from "@/lib/auth-utils";
import { sanitizeEmail } from "@/lib/normalize";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const safeEmail = sanitizeEmail(email);
      const safePassword = sanitizePassword(password);

      if (!safeEmail || !safePassword) {
        setError("Invalid email or password");
        return;
      }

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: safeEmail,
          password: safePassword,
        }),
      });

      if (!res.ok) {
        setError("Invalid email or password");
        return;
      }

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="space-y-1 mb-4">
          <h1 className="text-2xl font-bold text-center">Welcome back</h1>
          <p className="text-center">
            Enter your credentials to access your account
          </p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="space-y-4 mb-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
