import { NPAsyncComponent, NPComponent } from "@/components/utils/component";
import { CustomCard } from "@/ui/custom-card";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Alert, AlertDescription } from "@/ui/alert";
import { Badge } from "@/lib/components/ui/badge";
import { Suspense } from "react";
import { Skeleton } from "@/lib/components/ui/skeleton";
import { Button } from "@/ui/button";
import { ShoppingBag } from "lucide-react";
import { Separator } from "@/ui/separator";
import { auth } from "@/auth";
import { db } from "@/lib/utils/prisma";

export const HomeNormalStats: NPAsyncComponent = async() => {
  const session = await auth();
  
  const user = await db.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      games: {
        where: {
          type: "SOLO"
        }
      }
    }
  });

  if (!user) return <></>;

  const totalWins = user.games.filter(game => game.result == "WORDLE_WIN").length || 0;
  const totalLoses = user.games.filter(game => game.result == "WORDLE_LOSE" || game.result == "WORDLE_ABORT").length || 0;
  const percentageWins = totalWins == 0 ? 0 : (totalWins / user.games.length * 100);
  const percentageLoses = totalLoses == 0 ? 0 : (totalLoses / user.games.length * 100);

  const categories = user.games.map(p => p.categoryId);
  const mostPlayedCategory = categories.sort((a, b) => categories.filter(v => v === a).length - categories.filter(v => v === b).length).pop();

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      <CustomCard noHover className="lg:w-1/2">
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
          <CardDescription>Check your statistics for this game mode</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <Alert>
            <AlertDescription className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                You have
                <Badge variant={"outline"} className="ml-1">{user.coins}&nbsp;🪙</Badge>
              </div>
              <Button variant={"secondary"} size={"realSm"} disabled>
                <ShoppingBag size={13} className="mr-1" />
                Open shop
              </Button>
            </AlertDescription>
          </Alert>

          <Separator className="my-1 w-full" />

          <Alert>
            <AlertDescription>
              <Suspense fallback={<Skeleton className="w-10 h-4" />}>
                <Badge variant={"outline"}>{user.games.length}</Badge> games played
              </Suspense>
              games played
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription className="flex justify-between">
              <Badge variant={"success"}>{totalWins} wins {totalWins >= 1 && `(${percentageWins}%)`}</Badge>

              <Separator className="my-3 w-4/12" />

              <Badge variant={"fail"}>{totalLoses} loses {totalLoses >= 1 && `(${percentageLoses}%)`}</Badge>
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
      </CustomCard>
    </div>
  )
}