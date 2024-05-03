import { Component } from "@/lib/components/utils/component";
import { cn } from "@/lib/utils";

export const Case: Component<{
  letter: string | null;
  status: "well-placed" | "misplaced" | "hint" | "not-present" | unknown;
  isJoker: boolean;
}> = ({ letter, status, isJoker }) => {
  return (
    <div className={cn(
      "border border-[2px] w-16 h-16 flex justify-center items-center", {
        "bg-[#20603f]": status == "well-placed" && !isJoker,
        "bg-[#ff6a41]/70": status === "misplaced",
        "bg-[#853290]": status === "hint" || isJoker
      }
    )}>
      {letter && letter.toUpperCase()}
    </div>
  );
}