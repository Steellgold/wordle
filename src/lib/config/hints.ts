import { Hint } from "../types/hints.type";

export const Joker: Hint = {
  id: "JOKER",
  name: "Joker",
  description: "This joker card reveals one of the letters in your word and its position",
  icon: "joker-card"
};

export const AI: Hint = {
  id: "AI",
  name: "AI",
  description: "The AI will help you by generating a definition of your word, but be careful it may be recent or old, otherwise it would be too easy",
  icon: "human-and-robot-handshake"
};

export const Time: Hint = {
  id: "TIME",
  name: "Time",
  description: "Add additional time to your party, be careful this time is random and can be short or long, it's up to you to see if you want to take the risk of using this joker",
  icon: "more-time-clock-card"
};