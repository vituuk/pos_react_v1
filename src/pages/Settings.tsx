import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Store,
  CreditCard,
  Receipt,
  Palette,
  Upload,
  Trash2,
  RefreshCw,
  Save,
  Info
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSettings, saveSettings, DEFAULT_SETTINGS } from "@/utils/settings";
import type { StoreSettings } from "@/utils/settings";

type TabId = "general" | "pos" | "receipt" | "appearance";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load settings on mount
  useEffect(() => {
    setSettings(getSettings());
  }, []);

  // Sync theme changes with next-themes if settings.theme updates
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setSettings(prev => ({ ...prev, theme: newTheme }));
    setTheme(newTheme);
  };

  const handleInputChange = (key: keyof StoreSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("settings.logoSizeError", "Logo size must be less than 2MB"));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      handleInputChange("storeLogoUrl", base64String);
      toast.success(t("settings.logoUploaded", "Logo uploaded successfully"));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    handleInputChange("storeLogoUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info(t("settings.logoRemoved", "Logo removed"));
  };

  const handleSave = () => {
    saveSettings(settings);
    toast.success(t("settings.saveSuccess", "Settings saved successfully!"));
  };

  const handleReset = () => {
    if (window.confirm(t("auth.logoutConfirm", "Are you sure? This will restore defaults."))) {
      setSettings(DEFAULT_SETTINGS);
      saveSettings(DEFAULT_SETTINGS);
      setTheme(DEFAULT_SETTINGS.theme);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success(t("settings.resetSuccess", "Settings reset to defaults!"));
    }
  };

  const tabs = [
    { id: "general" as TabId, label: t("settings.tabGeneral", "Store Details"), icon: Store },
    { id: "pos" as TabId, label: t("settings.tabPos", "POS & Checkout"), icon: CreditCard },
    { id: "receipt" as TabId, label: t("settings.tabReceipt", "Receipt Style"), icon: Receipt },
    { id: "appearance" as TabId, label: t("settings.tabAppearance", "Appearance"), icon: Palette },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-2 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("settings.title", "General Settings")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("settings.subtitle", "Configure store details, currency, default tax rates, and system parameters.")}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2 border border-border hover:bg-muted text-foreground transition-all"
          >
            <RefreshCw size={15} />
            {t("settings.resetBtn", "Reset Defaults")}
          </Button>
          <Button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-xs hover:shadow-md transition-all font-semibold rounded-[8px]"
          >
            <Save size={15} />
            {t("settings.saveBtn", "Save Settings")}
          </Button>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Navigation Sidebar */}
        <div className="flex flex-col gap-1.5 md:col-span-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                  }`}
              >
                <Icon size={18} className={isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Tab Content Area */}
        <div className="md:col-span-3">
          <Card className="border border-border/80 bg-card rounded-xl shadow-xs overflow-hidden">
            <CardContent className="p-6 md:p-8">

              {/* Tab 1: General Store Details */}
              {activeTab === "general" && (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                  <h3 className="text-lg font-semibold border-b border-border/50 pb-2">{t("settings.tabGeneral", "Store Details")}</h3>

                  {/* Store Logo Row */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border border-dashed border-border bg-muted/20">
                    <div className="w-24 h-24 rounded-full overflow-hidden border border-border bg-card flex items-center justify-center shrink-0 shadow-sm relative group">
                      {settings.storeLogoUrl ? (
                        <img src={settings.storeLogoUrl} alt="Logo preview" className="w-full h-full object-contain p-1" />
                      ) : (
                        <Store size={36} className="text-muted-foreground/60" />
                      )}
                    </div>

                    <div className="flex flex-col gap-2.5 items-center sm:items-start text-center sm:text-left">
                      <Label className="text-sm font-semibold text-foreground">{t("settings.logoLabel", "Store Logo Image")}</Label>
                      <p className="text-xs text-muted-foreground">{t("settings.logoHelp", "Upload a custom PNG or JPG store logo (Max 2MB).")}</p>

                      <div className="flex gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleLogoUpload}
                          accept="image/*"
                          className="hidden"
                          id="logo-upload-input"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 text-xs py-1"
                        >
                          <Upload size={12} />
                          {t("settings.logoUploadBtn", "Change Logo")}
                        </Button>
                        {settings.storeLogoUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveLogo}
                            className="flex items-center gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs py-1"
                          >
                            <Trash2 size={12} />
                            {t("settings.logoRemoveBtn", "Remove Logo")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">{t("settings.storeName", "Store Name")}</Label>
                      <Input
                        id="storeName"
                        value={settings.storeName}
                        onChange={(e) => handleInputChange("storeName", e.target.value)}
                        placeholder="e.g. Antigravity POS"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storePhone">{t("settings.storePhone", "Store Phone")}</Label>
                      <Input
                        id="storePhone"
                        value={settings.storePhone}
                        onChange={(e) => handleInputChange("storePhone", e.target.value)}
                        placeholder="e.g. +855 12 345 678"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storeEmail">{t("settings.storeEmail", "Store Email")}</Label>
                      <Input
                        id="storeEmail"
                        type="email"
                        value={settings.storeEmail}
                        onChange={(e) => handleInputChange("storeEmail", e.target.value)}
                        placeholder="e.g. support@store.com"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storeAddress">{t("settings.storeAddress", "Store Address")}</Label>
                      <Input
                        id="storeAddress"
                        value={settings.storeAddress}
                        onChange={(e) => handleInputChange("storeAddress", e.target.value)}
                        placeholder="e.g. Phnom Penh, Cambodia"
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: POS & Checkout Settings */}
              {activeTab === "pos" && (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                  <h3 className="text-lg font-semibold border-b border-border/50 pb-2">{t("settings.tabPos", "POS & Checkout")}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Currency Setting */}
                    <div className="space-y-2">
                      <Label htmlFor="currency-select">{t("settings.currency", "Default Currency")}</Label>
                      <Select
                        value={settings.currency}
                        onValueChange={(value: "USD" | "KHR") => handleInputChange("currency", value)}
                      >
                        <SelectTrigger id="currency-select" className="w-full rounded-lg">
                          <SelectValue placeholder="Choose Currency" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                          <SelectItem value="KHR">KHR (៛) - Khmer Riel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Exchange Rate Setting */}
                    <div className="space-y-2">
                      <Label htmlFor="exchangeRate">{t("settings.exchangeRate", "Exchange Rate (USD to KHR)")}</Label>
                      <Input
                        id="exchangeRate"
                        type="number"
                        min="1"
                        value={settings.exchangeRate}
                        onChange={(e) => handleInputChange("exchangeRate", parseFloat(e.target.value) || 0)}
                        className="rounded-lg"
                      />
                    </div>

                    {/* Default Tax Rate */}
                    <div className="space-y-2">
                      <Label htmlFor="taxRate">{t("settings.taxRate", "Default Tax Rate (%)")}</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        min="0"
                        max="100"
                        value={settings.taxRate}
                        onChange={(e) => handleInputChange("taxRate", parseFloat(e.target.value) || 0)}
                        className="rounded-lg"
                      />
                    </div>

                    {/* Default Discount Rate */}
                    <div className="space-y-2">
                      <Label htmlFor="discountRate">{t("settings.discountRate", "Default Discount Rate (%)")}</Label>
                      <Input
                        id="discountRate"
                        type="number"
                        min="0"
                        max="100"
                        value={settings.discountRate}
                        onChange={(e) => handleInputChange("discountRate", parseFloat(e.target.value) || 0)}
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <h4 className="text-sm font-semibold text-foreground">{t("settings.checkoutRules", "Checkout Rules & Behaviors")}</h4>

                    {/* Toggle: Allow Checkout Out of Stock */}
                    <label className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.allowOutOfStock}
                        onChange={(e) => handleInputChange("allowOutOfStock", e.target.checked)}
                        className="mt-1 h-4 w-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{t("settings.allowOutOfStock", "Allow Checkout When Out of Stock")}</span>
                        <span className="text-xs text-muted-foreground">{t("settings.allowOutOfStockHelp", "If enabled, cashiers can complete checkouts even when inventory counts reach zero.")}</span>
                      </div>
                    </label>

                    {/* Toggle: Enable Sound Effects */}
                    <label className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.enableSounds}
                        onChange={(e) => handleInputChange("enableSounds", e.target.checked)}
                        className="mt-1 h-4 w-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{t("settings.enableSounds", "Enable Checkout Sound Effects")}</span>
                        <span className="text-xs text-muted-foreground">{t("settings.enableSoundsHelp", "Plays a high-fidelity checkout sound effect immediately upon transaction completion.")}</span>
                      </div>
                    </label>

                    {/* Toggle: Auto Print */}
                    <label className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.enableAutoPrint}
                        onChange={(e) => handleInputChange("enableAutoPrint", e.target.checked)}
                        className="mt-1 h-4 w-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{t("settings.enableAutoPrint", "Auto-Print Receipt After Payment")}</span>
                        <span className="text-xs text-muted-foreground">{t("settings.enableAutoPrintHelp", "Launches the browser print preview automatically when a customer payment finishes.")}</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Tab 3: Receipt Template Settings */}
              {activeTab === "receipt" && (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                  <h3 className="text-lg font-semibold border-b border-border/50 pb-2">{t("settings.tabReceipt", "Receipt Style")}</h3>

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Input Controls (Left) */}
                    <div className="lg:col-span-3 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="receiptHeader">{t("settings.receiptHeader", "Receipt Header Message")}</Label>
                        <textarea
                          id="receiptHeader"
                          rows={3}
                          value={settings.receiptHeader}
                          onChange={(e) => handleInputChange("receiptHeader", e.target.value)}
                          placeholder="e.g. Thank you for shopping with us!"
                          className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-2xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="receiptFooter">{t("settings.receiptFooter", "Receipt Footer Message")}</Label>
                        <textarea
                          id="receiptFooter"
                          rows={3}
                          value={settings.receiptFooter}
                          onChange={(e) => handleInputChange("receiptFooter", e.target.value)}
                          placeholder="e.g. Please come again!"
                          className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-2xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>

                      <div className="flex gap-2 items-center p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs">
                        <Info size={14} className="shrink-0" />
                        <span>{t("settings.receiptHint", "This header and footer appear at the top and bottom of thermal invoice printouts.")}</span>
                      </div>
                    </div>

                    {/* Receipt Mockup Preview (Right) */}
                    <div className="lg:col-span-2 flex justify-center">
                      <div className="w-full max-w-[260px] bg-white text-gray-800 border border-gray-200 rounded-lg p-4 shadow-sm font-mono text-[10px] space-y-3 relative select-none">
                        {/* Thermal Top Border */}
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-200 to-transparent bg-[length:6px_6px]" />

                        <div className="text-center space-y-1">
                          {settings.storeLogoUrl ? (
                            <img src={settings.storeLogoUrl} alt="Logo" className="w-8 h-8 rounded-full mx-auto object-cover border border-gray-100" />
                          ) : null}
                          <h4 className="font-bold text-[12px] tracking-wide uppercase">{settings.storeName || "STORE NAME"}</h4>
                          <p className="text-[8px] text-gray-500 leading-tight">
                            {settings.storeAddress || "Phnom Penh, Cambodia"}<br />
                            Tel: {settings.storePhone || "+855 12 345 678"}
                          </p>
                        </div>

                        <div className="border-t border-b border-dashed border-gray-300 py-1 text-[8px] text-gray-500 flex justify-between">
                          <span>INVOICE: #INV-0042</span>
                          <span>{new Date().toLocaleDateString(i18n.language === "kh" ? "km-KH" : "en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between font-bold">
                            <span>ITEMS</span>
                            <span>QTY / TOTAL</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Double Cheeseburger</span>
                            <span>1x  $5.99</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Coca-Cola Zero</span>
                            <span>2x  $3.00</span>
                          </div>
                        </div>

                        <div className="border-t border-dashed border-gray-300 pt-1 text-[9px] space-y-0.5">
                          <div className="flex justify-between">
                            <span>SUBTOTAL:</span>
                            <span>$8.99</span>
                          </div>
                          {settings.taxRate > 0 && (
                            <div className="flex justify-between">
                              <span>TAX ({settings.taxRate}%):</span>
                              <span>${(8.99 * settings.taxRate / 100).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-[10px]">
                            <span>TOTAL:</span>
                            <span>${(8.99 * (1 + settings.taxRate / 100)).toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="border-t border-dashed border-gray-300 pt-2 text-center text-[8px] text-gray-500 whitespace-pre-line leading-relaxed">
                          {settings.receiptHeader || "Thank you for shopping!"}
                          <br /><br />
                          {settings.receiptFooter || "Please come again!"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Appearance & Theme Settings */}
              {activeTab === "appearance" && (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                  <h3 className="text-lg font-semibold border-b border-border/50 pb-2">{t("settings.tabAppearance", "Appearance")}</h3>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">{t("settings.theme", "Application Theme")}</Label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Light Card */}
                      <button
                        onClick={() => handleThemeChange("light")}
                        className={`flex flex-col gap-3 p-4 rounded-xl border text-left transition-all ${settings.theme === "light"
                            ? "border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 shadow-xs ring-1 ring-blue-600"
                            : "border-border bg-card hover:bg-muted/30"
                          }`}
                      >
                        <div className="h-16 w-full rounded-lg bg-white border border-gray-200 shadow-2xs flex flex-col p-1.5 gap-1 select-none pointer-events-none">
                          <div className="w-1/2 h-2.5 rounded bg-gray-200" />
                          <div className="w-2/3 h-2 rounded bg-gray-100" />
                          <div className="w-full mt-auto flex gap-1">
                            <div className="w-4 h-4 rounded-full bg-blue-500" />
                            <div className="w-4 h-4 rounded-full bg-slate-200" />
                            <div className="w-4 h-4 rounded-full bg-slate-100" />
                          </div>
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="text-xs font-semibold text-foreground">{t("settings.themeLight", "Light Theme")}</span>
                          <span className="text-[10px] text-muted-foreground">{t("settings.themeLightDesc", "Classic white clean display.")}</span>
                        </div>
                      </button>

                      {/* Dark Card */}
                      <button
                        onClick={() => handleThemeChange("dark")}
                        className={`flex flex-col gap-3 p-4 rounded-xl border text-left transition-all ${settings.theme === "dark"
                            ? "border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 shadow-xs ring-1 ring-blue-600"
                            : "border-border bg-card hover:bg-muted/30"
                          }`}
                      >
                        <div className="h-16 w-full rounded-lg bg-[#0F172A] border border-gray-800 shadow-2xs flex flex-col p-1.5 gap-1 select-none pointer-events-none">
                          <div className="w-1/2 h-2.5 rounded bg-gray-800" />
                          <div className="w-2/3 h-2 rounded bg-gray-700" />
                          <div className="w-full mt-auto flex gap-1">
                            <div className="w-4 h-4 rounded-full bg-blue-500" />
                            <div className="w-4 h-4 rounded-full bg-gray-800" />
                            <div className="w-4 h-4 rounded-full bg-gray-750" />
                          </div>
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="text-xs font-semibold text-foreground">{t("settings.themeDark", "Dark Theme")}</span>
                          <span className="text-[10px] text-muted-foreground">{t("settings.themeDarkDesc", "Comfortable dark reading mode.")}</span>
                        </div>
                      </button>

                      {/* System Card */}
                      <button
                        onClick={() => handleThemeChange("system")}
                        className={`flex flex-col gap-3 p-4 rounded-xl border text-left transition-all ${settings.theme === "system"
                            ? "border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 shadow-xs ring-1 ring-blue-600"
                            : "border-border bg-card hover:bg-muted/30"
                          }`}
                      >
                        <div className="h-16 w-full rounded-lg bg-linear-to-r from-white to-[#0F172A] border border-border shadow-2xs flex flex-col p-1.5 gap-1 select-none pointer-events-none relative overflow-hidden">
                          <div className="w-1/2 h-2.5 rounded bg-slate-300 dark:bg-slate-700" />
                          <div className="w-2/3 h-2 rounded bg-slate-200 dark:bg-slate-800" />
                          <div className="w-full mt-auto flex gap-1">
                            <div className="w-4 h-4 rounded-full bg-blue-500" />
                          </div>
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="text-xs font-semibold text-foreground">{t("settings.themeSystem", "System Default")}</span>
                          <span className="text-[10px] text-muted-foreground">{t("settings.themeSystemDesc", "Matches OS lighting preferences.")}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
