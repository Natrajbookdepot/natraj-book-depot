import { useLanguage } from "../context/LanguageContext";

export default function NotificationsPage() {
  const { t } = useLanguage();
  return <h1 className="text-2xl font-bold">{t("pages.notifications.title")} (Coming Soon!)</h1>;
}
