"use client";

import type { PropsWithChildren } from "react";
import { Component } from "@/lib/components/utils/component";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/lib/components/ui/dialog";
import { Button } from "@/lib/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/lib/components/ui/badge";

export const DailyNewPartyContent: Component<PropsWithChildren> = ({ children }) => {
  return (
    <div className="mt-5">
      <DialogHeader className="mb-3">
        <DialogTitle>Daily wordle ⌛</DialogTitle>
        <DialogDescription>
          Guess the word of the day, without jokers!
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="mt-5">
        <Button disabled variant="daily">
          Play daily <Badge variant={"secondary"} className="ml-2">Coming soon</Badge>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </DialogFooter>
    </div>
  );
};