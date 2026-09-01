"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { ReactElement } from "react";

interface LoginFormProps {
  google: boolean;
  github: boolean;
  email: boolean;
}

export function LoginForm({ google, github, email }: LoginFormProps): ReactElement {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {google ? (
        <Button
          type="button"
          onClick={() => {
            void signIn("google", { callbackUrl: "/dashboard" });
          }}
        >
          Continue with Google
        </Button>
      ) : null}
      {github ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            void signIn("github", { callbackUrl: "/dashboard" });
          }}
        >
          Continue with GitHub
        </Button>
      ) : null}
      {email ? (
        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void signIn("resend", { email: address, callbackUrl: "/dashboard" }).then(
              () => {
                setMessage("Check your email for a sign-in link.");
              },
            );
          }}
        >
          <Label htmlFor="email">Email magic link</Label>
          <Input
            id="email"
            type="email"
            required
            value={address}
            onChange={(event) => {
              setAddress(event.target.value);
            }}
            placeholder="you@email.com"
          />
          <Button type="submit" variant="outline">
            Send link
          </Button>
        </form>
      ) : null}
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
