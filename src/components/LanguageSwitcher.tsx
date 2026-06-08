import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const languages = [
  { code: "en", label: "English", flagPath: "/flag/en.png" },
  { code: "kh", label: "Khmer",   flagPath: "/flag/kh.png" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = languages.find((l) => l.code === i18n.language) ?? languages[0];

  const switchTo = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex items-center justify-between gap-1 h-10 rounded-[20px] px-2 w-[130px] text-sm font-medium bg-gray-300 text-white hover:bg-gray-200 hover:text-gray-800 transition-colors"
        >
          {/* Flag only — bigger w/h, matching reference image */}
          <span className="flex items-center justify-center w-[36px] h-[24px] overflow-hidden rounded-[10px] shadow-xs">
            <img
              src={currentLang.flagPath}
              alt={currentLang.label}
              className="w-full h-full object-cover block"
            />
          </span>
          <span className="hidden sm:inline">{currentLang.label}</span>
          <ChevronDown size={13} className="opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-36  rounded-[10px]">
        {languages.map(({ code, label, flagPath }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => switchTo(code)}
            className={`flex items-center gap-2 cursor-pointer rounded-[15px] mb-1  focus:bg-gray-200 hover:bg-gray-200 transition-colors ${
              i18n.language === code ? "bg-accent font-semibold" : ""
            }`}
          >
            <span className="flex items-center justify-center w-[36px] h-[25px] overflow-hidden rounded-[10px] shadow-xs">
              <img
                src={flagPath}
                alt={label}
                className="w-full h-full object-cover block"
              />
            </span>
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
