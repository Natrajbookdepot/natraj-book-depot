import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "../components/LanguageToggle";
import { FiBell, FiLock, FiSave } from "react-icons/fi";

export default function SettingsPage() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
  });
  const [saveMessage, setSaveMessage] = useState("");

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    localStorage.setItem("adminSettings", JSON.stringify(settings));
    setSaveMessage(t("pages.settings.saved"));
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {t("pages.settings.title")}
        </h1>
        <p className="text-gray-500">{t("pages.settings.selectLanguage")}</p>
      </div>

      {/* Success Message */}
      {saveMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg flex items-center gap-3 animate-pulse">
          <span className="text-xl">✓</span>
          <span className="font-medium">{saveMessage}</span>
        </div>
      )}

      {/* Language Settings */}
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
          <span className="text-2xl">🌐</span>
          <h2 className="text-2xl font-bold text-gray-800">
            {t("pages.settings.language")}
          </h2>
        </div>
        <LanguageToggle />
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
          <FiBell className="text-2xl text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">
            {t("pages.settings.notifications")}
          </h2>
        </div>

        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <label className="text-lg font-semibold text-gray-700 block mb-1">
                {t("pages.settings.emailNotifications")}
              </label>
              <p className="text-sm text-gray-500">
                {t("pages.settings.emailNotificationsDesc")}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle("emailNotifications")}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <label className="text-lg font-semibold text-gray-700 block mb-1">
                {t("pages.settings.smsNotifications")}
              </label>
              <p className="text-sm text-gray-500">
                {t("pages.settings.smsNotificationsDesc")}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={() => handleToggle("smsNotifications")}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
          <FiLock className="text-2xl text-red-500" />
          <h2 className="text-2xl font-bold text-gray-800">
            {t("pages.settings.security")}
          </h2>
        </div>

        <div className="space-y-6">
          {/* Two Factor Auth */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <label className="text-lg font-semibold text-gray-700 block mb-1">
                {t("pages.settings.twoFactorAuth")}
              </label>
              <p className="text-sm text-gray-500">
                {t("pages.settings.twoFactorAuthDesc")}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={() => handleToggle("twoFactorAuth")}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>

          {/* Change Password Button */}
          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition-colors duration-300">
            {t("pages.settings.changePassword")}
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <FiSave className="text-xl" />
          {t("pages.settings.save")}
        </button>
      </div>
    </div>
  );
}
