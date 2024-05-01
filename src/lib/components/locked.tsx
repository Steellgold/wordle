import { Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert";
import { Component } from "./utils/component";

export const Locked: Component<{ title: string }> = ({ title }) => {
  return (
    <Alert>
      <Lock className="h-4 w-4" />
      <AlertTitle>Locked</AlertTitle>
      <AlertDescription>
        Unlock <strong>{title}</strong> by logging in
      </AlertDescription>
    </Alert>
  )
}