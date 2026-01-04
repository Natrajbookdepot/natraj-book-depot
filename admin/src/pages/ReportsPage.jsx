import { useLanguage } from "../context/LanguageContext";

export default function ReportsPage() {
  const { t } = useLanguage();
  return <h1 className="text-2xl font-bold">{t("pages.reports.title")} (Coming Soon!)</h1>;
}
