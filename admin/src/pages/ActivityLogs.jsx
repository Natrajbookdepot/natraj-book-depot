import { useLanguage } from "../context/LanguageContext";

export default function ActivityLogs() {
  const { t } = useLanguage();
  return <h1 className="text-2xl font-bold">{t("pages.activityLogs.title")} (Coming Soon!)</h1>;
}
