export interface StoreSettings {
  storeName: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  currency: "USD" | "KHR";
  exchangeRate: number; // KHR per 1 USD (default 4100)
  taxRate: number; // default tax percentage (e.g. 10 for 10%)
  discountRate: number; // default discount percentage (e.g. 5 for 5%)
  receiptHeader: string;
  receiptFooter: string;
  allowOutOfStock: boolean;
  enableSounds: boolean;
  enableAutoPrint: boolean;
  theme: "light" | "dark" | "system";
  storeLogoUrl?: string; // Stored as standard URL or base64 Data URL
}

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Antigravity POS Store",
  storePhone: "+855 12 345 678",
  storeEmail: "contact@antigravitypos.com",
  storeAddress: "#123 Street 456, Phnom Penh, Cambodia",
  currency: "USD",
  exchangeRate: 4100,
  taxRate: 0,
  discountRate: 0,
  receiptHeader: "Thank you for shopping with us!",
  receiptFooter: "Please come again soon!",
  allowOutOfStock: false,
  enableSounds: true,
  enableAutoPrint: false,
  theme: "light",
  storeLogoUrl: "",
};

const SETTINGS_KEY = "pos_settings";

export function getSettings(): StoreSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<StoreSettings>): StoreSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));

  // Custom event to notify other components of settings changes
  window.dispatchEvent(new Event("settingsChanged"));
  return updated;
}
