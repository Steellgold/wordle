import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

// https://gist.github.com/Steellgold/084124512869d82f9b3a5ff0ab8adbba
export const minimize = (wLarge: string, wMobile: string, width: number) => {
  return width < 640 ? wMobile : wLarge;
}

// https://gist.github.com/Steellgold/de61bda61e10233fe0bfae5968bebe12
export const addZero = (i: number) => {
  return i < 10 ? `0${i}` : i;
}