import { ReactElement } from "react";
import { auth } from "../auth";
import { WordleLayout } from "@/components/wordle/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { User } from "lucide-react";
import { Separator } from "@/ui/separator";
import Image from "next/image";
import { HomeNormalStats } from "@/components/wordle/cards/stats/normal.stats";
import { CustomCard } from "@/ui/custom-card";
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/card";
import { LoginButton } from "@/components/wordle/cards/button.login";

const Wordle = async(): Promise<ReactElement> => {
  const session = await auth();

  return (
    <WordleLayout>
      <Tabs defaultValue="normal">
        <TabsList className="flex justify-center overflow-x-auto">
          <TabsTrigger className="block sm:hidden" disabled value=""></TabsTrigger>
          <TabsTrigger className="block sm:hidden" disabled value=""></TabsTrigger>
          <TabsTrigger className="block sm:hidden" disabled value=""></TabsTrigger>
          <TabsTrigger value="normal">Normal</TabsTrigger>
          <TabsTrigger value="ranked" disabled>Ranked</TabsTrigger>
          <TabsTrigger value="daily" disabled>Daily</TabsTrigger>
          <TabsTrigger value="duo" disabled>Duo</TabsTrigger>
          <TabsTrigger value="settings">
            {session ? (
              <>
                {session?.user?.image ? (
                  <Image src={session?.user?.image} alt={session?.user?.name ?? "Username"} width={24} height={24} className="rounded-full" />
                ) : (
                  <User size={16} />
                )}

                &nbsp;
                {session?.user?.name ?? "Username"}
              </>
            ) : (
              <>
                <User size={16} />&nbsp;
                Settings
              </>
            )}
          </TabsTrigger>
        </TabsList>

        <Separator className="my-3" />
          
        <TabsContent value="normal">
          <HomeNormalStats />
        </TabsContent>

        <TabsContent value="ranked"></TabsContent>

        <TabsContent value="daily"></TabsContent>

        <TabsContent value="duo"></TabsContent>

        <TabsContent value="settings"></TabsContent>
      </Tabs>

      <div className="flex flex-col gap-4 md:flex-row mt-3">
        {!session ? (
          <CustomCard noHover className="px-2 w-full md:w-1/2">
            <CardHeader>
              <CardTitle>Somethings missing</CardTitle>
              <CardDescription>Sign in to earn coins, play ranked games and more</CardDescription>
            </CardHeader>

            <CardFooter className="flex gap-2">
              <LoginButton provider={"GitHub"} mini />
              <LoginButton provider={"Google"} mini />
              <LoginButton provider={"Discord"} mini />
            </CardFooter>
          </CustomCard>
        ) : <LoginButton logout />}
      </div>
    </WordleLayout>
  )
};

export default Wordle