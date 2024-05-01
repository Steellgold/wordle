import { ReactElement } from "react";
import { auth } from "../auth";
import { WordleLayout } from "@/components/wordle/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { User } from "lucide-react";
import { Separator } from "@/ui/separator";
import Image from "next/image";
import { HomeNormalStats } from "@/components/wordle/cards/stats/normal.stats";
import { HomeSettings } from "@/lib/components/wordle/cards/settings/settings";

const Wordle = async(): Promise<ReactElement> => {
  const session = await auth();

  return (
    <WordleLayout>
      <Tabs defaultValue="normal">
        <TabsList className="flex justify-center">
          <TabsTrigger value="normal">Normal</TabsTrigger>
          <TabsTrigger disabled value="ranked">Ranked</TabsTrigger>
          <TabsTrigger disabled value="daily">Daily</TabsTrigger>
          <TabsTrigger disabled value="duo">Duo</TabsTrigger>
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
                Login
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

        <TabsContent value="settings">
          <HomeSettings />
        </TabsContent>
      </Tabs>
    </WordleLayout>
  )
};

export default Wordle