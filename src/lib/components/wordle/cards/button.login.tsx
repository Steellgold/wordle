"use client";

import { Button } from "@/ui/button";
import { Component } from "@/components/utils/component";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

type LoginButtonProps = {
  provider?: "GitHub" | "Google" | "Discord";
  logout?: boolean;
  mini?: boolean;
}

export const LoginButton: Component<LoginButtonProps> = ({ provider, logout, mini }) => {
  const [loading, setLoading] = useState(false);
  if (!provider && !logout) return <></>;
  
  const onClick = (action: "login" | "logout") => {
    if (loading) return;
    setLoading(true);

    if (action === "login") {
      signIn(provider === "GitHub" ? "github" : provider === "Google" ? "google" : "discord")
        .then(() => setLoading(true))
        .catch(() => setLoading(false));
    } else {
      signOut()
        .then(() => setLoading(false))
        .catch(() => setLoading(true));
    }
  }

  return (
    <Button
      onClick={() => onClick(logout ? "logout" : "login")}
      disabled={loading || (!logout && !provider) || provider == "Google"}
      className="flex items-center gap-2 w-full"
      variant={provider === "GitHub" ? "github" : provider === "Discord" ? "discord" : "default"}
    >
      {loading ?
        <>
          {provider !== "Discord" && <Loader2 size={16} className="animate-spin mr-2" />}
          {provider == "Discord" && <FaDiscord size={16} className="mr-2 animate-spinner" />}
        </>
      : (
        <>
          {!logout ? (
            <>
              {provider === "GitHub" && <FaGithub className="text-[#fff]" size={16} />}
              {provider === "Google" && <FcGoogle size={16} />}
              {provider === "Discord" && <FaDiscord className="text-[#fff]" size={16} />}
            </>
          ) : (
            <LogOut className="text-[#333]" size={16} />
          )}
        </>
      )}
      {logout ? "Logout" : (
        <>
          {!mini && <>Login with {provider}</>}
        </>
      )}
    </Button>
  )
}