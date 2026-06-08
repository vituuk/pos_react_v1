import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "kh"],
    defaultNS: "translation",
    ns: ["translation"],
    backend: {
      loadPath: "/i18n/{{lng}}.json",
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18n_lang",
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

// Automatically apply the language and lang-kh class to document element on load and changes
const updateDocumentLang = (lng: string) => {
  document.documentElement.lang = lng;
  if (lng === "kh") {
    document.documentElement.classList.add("lang-kh");
  } else {
    document.documentElement.classList.remove("lang-kh");
  }
};

// Listen for language change events
i18n.on("languageChanged", (lng) => {
  updateDocumentLang(lng);
});

// Run initially once initialized
i18n.on("initialized", () => {
  updateDocumentLang(i18n.language || "en");
});

// Fallback in case initialization is already done
if (i18n.isInitialized) {
  updateDocumentLang(i18n.language || "en");
}

export default i18n;
