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
import { Badge } from "../../ui/badge";

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
        <Card type={Time} />
        <Card type={AI} />
      </div>
    </div>
  );
};

const Card: Component<{ type: Hint }> = ({ type }) => {
  return (
    <CustomCard>
      <div className="flex items-center p-3">
        <Image src={`/_static/emojis/${type.icon}`} width={72} height={72} alt={type.name} />
        <div className="flex flex-col ml-3">
          <h3 className="text-xl font-semibold">{type.name}</h3>
          <p className="text-muted-foreground mt-2">{type.description}</p>
          <div className="flex gap-2 mt-3">
            <Badge variant={"outline"} className="text-muted-foreground">Safe Level:&nbsp;
              <span className={cn({
                "text-green-500": type.safeLevel == 100,
                "text-orange-500": type.safeLevel < 100,
                "text-yellow-500": type.safeLevel < 60,
                "text-red-500": type.safeLevel < 30,
                "text-gray-500": !type.safeLevel
              })}>
                {type.safeLevel}%
              </span>
            </Badge>

            <Badge variant={"outline"} className="text-muted-foreground">Cost:&nbsp;
              <span className="text-green-500">{type.cost} 🪙</span>
            </Badge>
          </div>
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