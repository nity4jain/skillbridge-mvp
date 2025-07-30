import { clsx } from "clsx";
import { type ClassValue } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
