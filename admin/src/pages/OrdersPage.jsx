import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "../context/LanguageContext";

export default function OrdersPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 mr-2 rounded-full hover:bg-slate-200 transition-colors"
          title={t("common.back") || "Back"}
        >
          <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold">{t("pages.orders.title")}</h1>
      </div>
      <table className="w-full bg-white rounded-xl shadow">
        <thead>
          <tr className="bg-slate-100">
            <th className="px-4 py-2 text-left">{t("pages.orders.orderId")}</th>
            <th className="px-4 py-2 text-left">{t("pages.orders.customer")}</th>
            <th className="px-4 py-2 text-left">{t("pages.orders.amount")}</th>
            <th className="px-4 py-2 text-left">{t("pages.orders.status")}</th>
            <th className="px-4 py-2 text-left">{t("pages.orders.date")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2">ORD1234</td>
            <td className="px-4 py-2">Aman Verma</td>
            <td className="px-4 py-2">₹520</td>
            <td className="px-4 py-2 text-green-700">{t("pages.orders.delivered")}</td>
            <td className="px-4 py-2">2025-11-01</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
