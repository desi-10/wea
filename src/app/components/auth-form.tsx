"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    // Simulate auth for demo purposes since user opted out of integrations
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Login" : "Sign Up"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Enter your credentials to access your account"
            : "Enter your details to create an account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading
              ? "Processing..."
              : mode === "login"
              ? "Sign In"
              : "Sign Up"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                {`Don't have an account?`}
                <Link
                  href="/signup"
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href="/"
                  className="text-primary hover:underline font-medium"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
