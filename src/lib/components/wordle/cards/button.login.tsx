"use client";

import { Button } from "@/ui/button";
import { Component } from "@/components/utils/component";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { FaGoogle, FaGithub, FaDiscord } from "react-icons/fa";
import { SiZoom  } from "react-icons/si";

type LoginButtonProps = {
  provider: "GitHub" | "Google" | "Zoom" | "Discord"
}

export const LoginButton: Component<LoginButtonProps> = ({ provider }) => {
  const [loading, setLoading] = useState(false);
  
  const onClick = () => {
    if (loading) return;

    signIn("github")
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }

  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2"
    >
      {loading ?
        <Loader2 size={16} className="animate-spin mr-2" />
      : (
        <>
          {provider === "GitHub" && <FaGithub className="text-[#333]" size={16} />}
          {provider === "Google" && <FaGoogle className="text-[#DB4437]" size={16} />}
          {provider === "Zoom" && <SiZoom className="text-[#2D8CFF]" size={16} />}
          {provider === "Discord" && <FaDiscord className="text-[#7289DA]" size={16} />}
        </>
      )}
      Login with {provider}
    </Button>
  )
}