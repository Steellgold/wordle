import { auth } from "@/auth";
import { NPAsyncComponent } from "@/lib/components/utils/component";
import { CustomCard } from "@/ui/custom-card";
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/card";
import { LoginButton } from "@/components/wordle/cards/button.login";

export const HomeSettings: NPAsyncComponent = async() => {
  const session = await auth();

  return (
    <div className="flex flex-col gap-2 md:flex-row mt-3">
      {!session ? (
        <CustomCard noHover className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Somethings missing</CardTitle>
            <CardDescription>Sign in to earn coins, play ranked games and more</CardDescription>
          </CardHeader>

          <CardFooter className="flex gap-2">
            <LoginButton mini provider={"GitHub"} />
            <LoginButton mini provider={"Google"} />
            <LoginButton mini provider={"Discord"} />
          </CardFooter>
        </CustomCard>
      ) : <LoginButton logout />}
    </div>
  )
}