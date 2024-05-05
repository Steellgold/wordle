import { AsyncComponent, NPAsyncComponent } from "@/components/utils/component";
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert";
import { auth } from "@/auth";
import { LoginButton } from "./button.login";
import { MonitorSmartphone, Store, Users } from "lucide-react";

export const NotLoggedCard: NPAsyncComponent = async () => {
  const session = await auth();

  return (
    <Alert className="mt-5">
      <AlertTitle>Not Logged In</AlertTitle>
      <AlertDescription>
        Some features are only available to logged in users. Please log in to access them or ignore this message if you don&apos;t want to log in.
      </AlertDescription>

      <div className="flex justify-end mt-3">
        {!session && <LoginButton provider="GitHub" />}
        {!session && <LoginButton provider="Google" />}
        {!session && <LoginButton provider="Discord" />}
      </div>
    </Alert>
  );
}