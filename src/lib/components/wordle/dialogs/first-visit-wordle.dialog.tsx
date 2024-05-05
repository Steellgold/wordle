"use client";

import Image from "next/image";
import { Dialog, DialogContent } from "@/ui/dialog";
import { NPComponent } from "@/components/utils/component";
import { useVisitedStore } from "@/lib/store/visited.store";
import { domCookie } from "cookie-muncher";
import { useState } from "react";

export const WordleDialog: NPComponent = () => {
  const { visited, setVisited } = useVisitedStore();
  const [open, setOpen] = useState<boolean>(!visited);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setVisited(!open);
        domCookie.set({ name: "guestUserId", value: Math.random().toString(36).slice(2, 7) });
        setOpen(false);
      }}
    >
      <DialogContent className="max-w-xl p-0 overflow-hidden" black hiddenX>
        <div className="aspect-video relative flex items-center -mb-5">
          <Image
            src={"/_static/images/wordle.png"}
            alt="Wordle Picture"
            fill
            quality={100}
            objectFit="cover"
          />
        </div>

        <div className="p-5 mt-4">
          <h2 className="text-2xl font-semibold">Welcome to Wordle 🔤</h2>
          <p className="text-muted-foreground mt-2">
            Wordle is a word puzzle game that tests your vocabulary and word-guessing skills. The objective of the game is to guess a five-letter word by trying different words and receiving feedback on how close you are to the correct word.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};