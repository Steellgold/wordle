import { PropsWithChildren, type ReactElement } from "react";
import Image from "next/image";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/ui/dialog";
import { Component } from "@/components/utils/component";
import { CustomCard } from "@/ui/custom-card";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/ui/drawer"
import { Hint } from "@/lib/types/hints.type";
import { AI, Joker, Time } from "@/lib/config/hints";
import { cn } from "@/lib/utils";

type HintsDialog = {
  isConnected?: boolean;
  isMobile?: boolean;
};

export const HintsDialog: Component<HintsDialog & PropsWithChildren> = ({ isConnected = false, isMobile = false, children }) => {
  if (!isConnected) {
    return (
      <p>
        You need to see your hints!
      </p>
    )
  }

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger>
          {children}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Hints</DrawerTitle>
            <DrawerDescription>You can use jokers to help you find the word, each joker has a specific use.</DrawerDescription>
            <DrawerClose />
          </DrawerHeader>
            
          <Content mobile />
          
          <DrawerFooter>
            <Footer />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent>
        <Content />
        
        <DialogFooter>
          <Footer />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const Content: Component<{ mobile?: boolean }> = ({ mobile = false }) => {
  return (
    <div className="overflow-y-auto">
      {!mobile && <>
        <h2 className="text-2xl font-semibold">Hints</h2>
        <p className="text-muted-foreground mt-2">You can use jokers to help you find the word, each joker has a specific use.</p>
      </>}

      <div className={cn("flex flex-col gap-4", {
        "p-5": mobile
      })}>
        <Card type={Joker} />
        <Card type={AI} />
        <Card type={Time} />
      </div>
    </div>
  );
};

const Card: Component<{ type: Hint }> = ({ type }) => {
  return (
    <CustomCard>
      <div className="flex items-center p-3">
        <Image src={`/_static/emojis/${
            type.id === "JOKER" ? "joker-card.png"
              : type.id === "AI" ? "human-and-robot-handshake.png"
                : type.id === "TIME" ? "more-time-clock-card.png"
                : "joker-card.png"
        }`} width={72} height={72} alt={type.name} />
        <div className="flex flex-col ml-3">
          <h3 className="text-xl font-semibold">{type.name}</h3>
          <p className="text-muted-foreground mt-2">{type.description}</p>
          <p className="text-muted-foreground/50 mt-2">Number of hint jokers left: <strong>{Math.floor(Math.random() * 3)}</strong></p>
        </div>
      </div>
    </CustomCard>
  );
}

const Footer = (): ReactElement => {
  return (
    <Button>
      No, thanks
    </Button>
  );
}