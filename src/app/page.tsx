import { ReactElement } from "react";
import { auth } from "../auth";
import { WordleLayout } from "@/components/wordle/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { User as IconUser } from "lucide-react";
import { Separator } from "@/ui/separator";
import Image from "next/image";
import { HomeNormalStats } from "@/components/wordle/cards/stats/normal.stats";
import { HomeSettings } from "@/lib/components/wordle/cards/settings/settings";
import { cookies } from "next/headers";
import { User } from "@prisma/client";
import { db } from "@/lib/utils/prisma";

const Wordle = async(): Promise<ReactElement> => {
  const session = await auth();
  let userId: string | undefined = "";
  if (session) userId = session.user?.id ?? "";
  if (!session) userId = `guest${cookies().get("guestUserId")?.value}`;

  let guest: User | null = null;
  if (userId.startsWith("guest")) {
    guest = await db.user.findUnique({
      where: {
        id: userId
      }
    })
  }

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
                  <IconUser size={16} />
                )}

                &nbsp;
                {session?.user?.name ?? "Username"}
              </>
            ) : (
              <>
                {guest?.image ? (
                  <Image src={guest?.image} alt={"Guest Profile Picture"} width={20} height={20} className="rounded-full" />
                ) : (
                  <IconUser size={16} />
                )}
                &nbsp;
                &nbsp;Guest
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