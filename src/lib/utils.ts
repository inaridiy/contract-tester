import { type ClassValue, clsx } from "clsx";
import _curry from "just-curry-it";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const iff = <T, U>(arg: T, f: (a: NonNullable<T>) => U): U | undefined =>
  arg !== null && arg !== undefined ? f(arg) : undefined;

export const inRange = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(value, max));
};

export const curry = _curry;
