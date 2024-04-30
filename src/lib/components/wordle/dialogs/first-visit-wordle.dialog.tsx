"use client";

import { useState, type ReactElement } from "react";
import Image from "next/image";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/ui/dialog";
import { Component } from "@/components/utils/component";

type WordleDialogProps = {
  isConnected?: boolean;
};

export const WordleDialog: Component<WordleDialogProps> = ({ isConnected = false }) => {
  const [hasVisitedWordle, setHasVisitedWordle] = useState(!isConnected);

  return (
    <Dialog open={hasVisitedWordle} onOpenChange={(open) => !open && setHasVisitedWordle(false)}>
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

          <DialogFooter className="mt-3">
            <Button onClick={() => setHasVisitedWordle(true)}>
              Got it!
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};