import { Hint } from "../types/hints.type";

export const Joker: Hint = {
  id: "JOKER",
  name: "Joker",
  description: "This joker reveals one letter of your word along with its exact position.",
  icon: "joker-card.png",
  safeLevel: 100,
  cost: 50
};

export const AI: Hint = {
  id: "AI",
  name: "AI",
  description: "The AI by generating a definition of your word. Be cautious, could be contemporary or outdated.",
  icon: "metal-computer-brain-with-wires.png",
  safeLevel: 75,
  cost: 100
};

export const Time: Hint = {
  id: "TIME",
  name: "Time",
  description: "Adds random additional time to your game. It’s up to you to decide if the risk is worth it.",
  icon: "more-time-clock-card.png",
  safeLevel: 50,
  cost: 25
};