import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "NPR") {
  const formatter = new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (currency === "NPR") {
    return `Rs. ${amount.toLocaleString("en-NP")}`;
  }

  return formatter.format(amount);
}
