"use client";

import { Component } from "@/lib/components/utils/component";
import { Button } from "../../ui/button";
import { useState } from "react";
import { Session } from "next-auth";
import { GAME_TYPE } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { createGame } from "./create-button.action";

type CreateWordleButtonProps = {
  alreadyGameOpened: boolean;
  session: Session | null;
  gameType: GAME_TYPE;
};

export const CreateWordleButton: Component<CreateWordleButtonProps> = ({ alreadyGameOpened, session, gameType }) => {
  const [loading, setLoading] = useState(false);

  return (
    <form className="w-full" onSubmit={async(e) => {
      setLoading(true)
      e.preventDefault()
      await createGame({ gameType, session })
    }}>
      <Button
        className="w-full"
        variant={"default"}
        disabled={alreadyGameOpened || loading}
      >
        {loading && <><Loader2 className="animate-spin h-4 w-4" />&nbsp;</>}
        {loading ? "Creating the game" : "Play now"} {!loading && <>{session ? "🔥" : "🧑‍🦯"}</>}
      </Button>
    </form>
  );
}