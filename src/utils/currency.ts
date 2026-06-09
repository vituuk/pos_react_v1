import { getSettings } from "./settings";

export function formatPrice(priceInUSD: number): string {
  const settings = getSettings();
  if (settings.currency === "KHR") {
    const priceInKHR = Math.round(priceInUSD * settings.exchangeRate);
    return new Intl.NumberFormat("en-US").format(priceInKHR) + " ៛";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInUSD);
}
