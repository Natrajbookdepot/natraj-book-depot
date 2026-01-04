import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 hover:border-blue-300 transition-all duration-300">
      <div className="flex flex-col">
        <label className="text-sm font-bold text-gray-700 mb-2">
          {t("pages.settings.language")}
        </label>
        <p className="text-xs text-gray-500">
          {language === "en" ? "Switch to हिंदी" : "Switch to English"}
        </p>
      </div>
      
      <button
        onClick={toggleLanguage}
        className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-300 ${
          language === "en"
            ? "bg-blue-500 shadow-md"
            : "bg-orange-500 shadow-md"
        }`}
      >
        <span
          className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
            language === "en" ? "translate-x-1" : "translate-x-10"
          } flex items-center justify-center font-bold text-xs`}
        >
          {language === "en" ? (
            <span className="text-blue-500">EN</span>
          ) : (
            <span className="text-orange-500">HI</span>
          )}
        </span>
      </button>
    </div>
  );
}
