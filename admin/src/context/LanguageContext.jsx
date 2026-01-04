import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import initialTranslations from "../translations/translations.json";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("adminLanguage") || "en";
  });
  const [translations, setTranslations] = useState(() => {
    const saved = localStorage.getItem("adminTranslations");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Always use initialTranslations.en as the source of truth for English keys
        // and merge other languages (like 'hi') from storage.
        return {
          ...parsed,
          en: initialTranslations.en
        };
      } catch (e) {
        console.error("Failed to parse saved translations", e);
      }
    }
    return initialTranslations;
  });
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    localStorage.setItem("adminLanguage", language);
    localStorage.setItem("adminTranslations", JSON.stringify(translations));
    document.documentElement.lang = language;
  }, [language, translations]);

  // Helper to flatten object keys
  const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  // Helper to unflatten object
  const unflattenObject = (data) => {
    const result = {};
    for (const i in data) {
      const keys = i.split('.');
      keys.reduce((r, e, j) => {
        return r[e] || (r[e] = keys.length - 1 === j ? data[i] : {});
      }, result);
    }
    return result;
  };

  const translateText = async (targetLang) => {
    setIsTranslating(true);
    try {
      // Find what keys are missing if the language already exists in state
      const enFlat = flattenObject(translations.en);
      const targetFlat = translations[targetLang] ? flattenObject(translations[targetLang]) : {};
      
      const keysToTranslate = Object.keys(enFlat).filter(k => !targetFlat[k]);
      
      if (keysToTranslate.length === 0) return; // Nothing new to translate

      const valuesToTranslate = keysToTranslate.map(k => enFlat[k]);

      // Backend call - LibreTranslate (supports batch)
      const res = await axios.post("/api/translate", {
        text: valuesToTranslate, 
        target: targetLang
      }, {
        headers: { "Content-Type": "application/json" }
      });
      
      const data = res.data;
      
      // data.translated should be an array of strings if 'text' was array
      // Note: LibreTranslate response format for batch might vary based on version/wrapper.
      // Standard: { translatedText: [...] }
      const translatedValues = Array.isArray(data.translated) ? data.translated : [data.translated];

      const newFlat = { ...targetFlat };
      keysToTranslate.forEach((key, index) => {
        newFlat[key] = translatedValues[index] || enFlat[key]; 
      });

      const newTranslations = unflattenObject(newFlat);

      setTranslations(prev => ({
        ...prev,
        [targetLang]: newTranslations
      }));

    } catch (error) {
      console.error("Dynamic translation error:", error);
      // Fallback is implicitly handled since we won't switch if we check translation existence strictly,
      // But for UI experience, we might want to alert or just stick to EN.
    } finally {
      setIsTranslating(false);
    }
  };

  const setLanguage = async (lang) => {
    if (lang === language) return;

    const enFlat = flattenObject(translations.en);
    const targetFlat = translations[lang] ? flattenObject(translations[lang]) : {};
    const hasMissingKeys = Object.keys(enFlat).some(k => !targetFlat[k]);

    if (lang !== 'en' && hasMissingKeys) {
      await translateText(lang);
    }
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "hi" : "en";
    setLanguage(newLang);
  };

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language] || translations.en;
    for (let k of keys) {
      if (value === undefined || value === null) break;
      value = value[k];
    }
    // Fallback to English if translation is missing
    if (!value && language !== 'en') {
       let enValue = translations.en;
       for (let k of keys) {
         if (enValue === undefined) break;
         enValue = enValue[k];
       }
       return enValue || key;
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
