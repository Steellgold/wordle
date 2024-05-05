import { NPAsyncComponent } from "@/components/utils/component";
import { CustomCard } from "@/ui/custom-card";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert";
import { Badge } from "@/lib/components/ui/badge";
import { Suspense } from "react";
import { Skeleton } from "@/lib/components/ui/skeleton";
import { Button } from "@/ui/button";
import { ArrowRight, HelpCircle, ShoppingBag } from "lucide-react";
import { Separator } from "@/ui/separator";
import { auth } from "@/auth";
import { db } from "@/lib/utils/prisma";
import { Locked } from "@/lib/components/locked";
import Link from "next/link";
import { Game } from "@prisma/client";
import { CreateWordleButton } from "@/lib/components/wordle/create-button/create-button";
import { cookies } from "next/headers";

export const HomeNormalStats: NPAsyncComponent = async() => {
  const session = await auth();
  let userId: string | undefined = "";
  if (session) userId = session.user?.id ?? "";
  if (!session) userId = `guest${cookies().get("guestUserId")?.value}`;
  
  const user = !session ? null : await db.user.findUnique({
    where: { id: userId },
    include: { games: { where: { type: "SOLO" } } }
  })

  const alreadyGameOpened: Game | null = user?.games.find(game => game.isLive) ?? null;

  const totalWins = (user?.games ?? []).filter(game => game.result == "WORDLE_WIN").length || 0;
  const totalLoses = (user?.games ?? []).filter(
    game => game.result == "WORDLE_LOSE" ||
    game.result == "WORDLE_ABORT" ||
    game.result == "WORDLE_TIMEOUT"
  ).length || 0;
  const percentageWins = totalWins == 0 ? 0 : (totalWins / (user?.games ?? []).length * 100);
  const percentageLoses = totalLoses == 0 ? 0 : (totalLoses / (user?.games ?? []).length * 100);

  const categories = (user?.games ?? []).map(p => p.categoryId);
  const mostPlayedCategory = categories.sort((a, b) => categories.filter(v => v === a).length - categories.filter(v => v === b).length).pop();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col md:flex-row gap-2">
        <CustomCard noHover className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Check your statistics for this game mode</CardDescription>
          </CardHeader>

          {session ? (
            <CardContent className="flex flex-col gap-2">
              <Alert>
                <AlertDescription className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    You have <Badge variant={"outline"} className="ml-1">{user?.coins ?? 0}&nbsp;🪙</Badge>
                  </div>
                    
                  <Button variant={"secondary"} size={"realSm"} disabled>
                    <ShoppingBag size={13} className="mr-1" />
                    Open shop
                  </Button>
                </AlertDescription>  
              </Alert>

              <Separator className="my-4 w-full" />

              <Alert>
                <AlertDescription>
                  <Suspense fallback={<Skeleton className="w-10 h-4" />}>
                    <Badge variant={"outline"}>{(user?.games ?? []).length}</Badge> games played
                  </Suspense>
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertDescription className="flex flex-col">
                  <div>
                    <Badge variant={"outline"}>{totalWins} wins</Badge>
                    {percentageWins > 0 && <>&nbsp;for a <Badge variant={"outline"}>{percentageWins.toFixed(2)}%</Badge> win rate</>}
                  </div>
                      
                  <Separator className="my-2 w-full" />

                  <div>
                    <Badge variant={"outline"}>{totalLoses} loses</Badge>
                    {percentageLoses > 0 && <>&nbsp;you have a <Badge variant={"outline"}>{percentageLoses.toFixed(2)}%</Badge> lose rate</>}
                  </div>
                </AlertDescription>
              </Alert>

              {mostPlayedCategory ? (
                <Alert>
                  <AlertDescription>
                    Most played category: <Badge variant={"outline"}>{mostPlayedCategory}</Badge>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertDescription>
                    No category played yet
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          ) : (
            <CardContent>
              <Locked title={"statistics"} />
            </CardContent>
          )}
        </CustomCard>
        
        <CustomCard noHover className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>🕹️ Play</CardTitle>
            <CardDescription>Start a new game, complete quests and earn coins</CardDescription>
          </CardHeader>

          {alreadyGameOpened && (
            <CardContent>
              <Alert>
                <AlertTitle>Game in progress</AlertTitle>
                <AlertDescription>You have a game in progress, you can&apos;t start a new one</AlertDescription>

                <Button variant={"default"} asChild className="mt-1.5 w-full">
                  <Link href={`/${alreadyGameOpened.id}`}>
                    Open game <ArrowRight size={13} className="ml-1" />
                  </Link>
                </Button>
              </Alert>
            </CardContent>
          )}

          <CardFooter className="gap-2">
            <CreateWordleButton alreadyGameOpened={alreadyGameOpened != null} session={session} gameType={"SOLO"} />
            <Button variant={"secondary"} disabled>
              <HelpCircle size={13} className="mr-1" />
              How to play
            </Button>
          </CardFooter>
        </CustomCard>
      </div>
    </div>
  )
}