import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AddEditProductModal from "../components/AddEditProductModal";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "../context/LanguageContext";

export default function ProductsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef();

  // Fetch products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.get("/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch products failed:", err);
      alert("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch categories
  useEffect(() => {
    async function getCategories() {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get("/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
      } catch (err) {
        console.error("Fetch categories failed:", err);
        alert("Failed to load categories");
      }
    }
    getCategories();
  }, []);

  // Filter products by search
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  // Save/Add or Update product
  async function handleSave(product) {
    try {
      const token = localStorage.getItem("jwt");
      if (editProduct && editProduct._id) {
        await axios.put(`/api/products/${editProduct._id}`, product, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/products", product, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Product save failed:", err);
      alert("Save failed");
    }
  }

  // Delete product
  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Product delete failed:", err);
      alert("Delete failed");
    }
  }

  // Excel Upload handler (stub)
  async function handleBulkExcel(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const token = localStorage.getItem("jwt");
      const fd = new FormData();
      fd.append("excel", file);
      // Replace with your real backend bulk endpoint:
      await axios.post("/api/products/bulk-upload", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Bulk upload processing...");
      fetchProducts();
    } catch (err) {
      console.error("Bulk upload failed:", err);
      alert("Bulk Excel upload failed");
    }
  }

  // Excel Upload Button click
  function uploadExcel() {
    fileInputRef.current?.click();
  }

  return (
    <div className="w-full mx-auto px-1 sm:px-4 lg:px-8 border">
      <div className="flex items-center gap-2 mt-4 mb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 mr-2 rounded-full hover:bg-slate-200 transition-colors"
          title={t("common.back") || "Back"}
        >
          <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold">{t("pages.products.title")}</h1>
      </div>
      <div className="flex flex-wrap mb-4 gap-2 items-center">
        <input
          className="border rounded px-2 py-1 w-full sm:w-auto"
          type="search"
          placeholder={t("pages.products.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-3 py-1 rounded"
          onClick={() => {
            setEditProduct(null);
            setModalOpen(true);
          }}
        >
          {t("pages.products.addProduct")}
        </button>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={uploadExcel}
        >
          {t("pages.products.bulkUpload")}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          style={{ display: "none" }}
          onChange={handleBulkExcel}
        />
      </div>
      {/* Table for desktop/tablet */}
      <div className="overflow-x-auto w-full hidden sm:block">
        <table className="w-full bg-white rounded-xl shadow-lg border border-slate-200 text-xs sm:text-sm md:text-base transition-all mb-8">
          <thead>
            <tr className="bg-slate-100 text-gray-700">
              <th className="px-3 py-3 text-left min-w-[140px] font-semibold">
                {t("pages.products.productName")}
              </th>
              <th className="px-3 py-3 text-left min-w-[110px] font-semibold">
                {t("pages.products.productCategory")}
              </th>
              <th className="px-3 py-3 text-center min-w-[80px] font-semibold">
                {t("pages.products.productStock")}
              </th>
              <th className="px-3 py-3 text-center min-w-[100px] font-semibold">
                {t("pages.products.productPrice")}
              </th>
              <th className="px-3 py-3 text-center min-w-[120px] font-semibold">
                {t("common.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((prod) => (
              <tr
                key={prod._id}
                className="hover:bg-blue-50 transition-all border-t border-slate-100"
              >
                <td className="px-3 py-3 break-words font-medium text-gray-900">
                  {prod.title}
                </td>
                <td className="px-3 py-3 break-words text-gray-500">
                  {prod.categorySlug}
                </td>
                <td className="px-3 py-3 text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded text-sm font-semibold
                ${
                  prod.stockCount === 0
                    ? "bg-red-100 text-red-600"
                    : prod.stockCount < 10
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
                  >
                    {prod.stockCount}
                  </span>
                </td>
                <td className="px-3 py-3 text-center font-semibold text-blue-700">
                  ₹{prod.price}
                </td>
                <td className="px-3 py-3 text-center space-x-4">
                  <button
                    className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-md px-2 py-1 transition-all shadow-md"
                    title={t("common.edit")}
                    onClick={() => {
                      setEditProduct(prod);
                      setModalOpen(true);
                    }}
                  >
                    {/* Edit svg... */}
                    <span className="hidden md:inline">{t("common.edit")}</span>
                  </button>
                  <button
                    className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-md px-2 py-1 transition-all shadow-md"
                    title={t("common.delete")}
                    onClick={() => handleDelete(prod._id)}
                  >
                    {/* Delete svg... */}
                    <span className="hidden md:inline">{t("common.delete")}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile only */}
      <div className="sm:hidden space-y-4">
        {filteredProducts.map((prod) => (
          <div
            key={prod._id}
            className="bg-white rounded-xl shadow p-4 border border-slate-200 flex flex-col"
          >
            <div className="font-bold text-gray-900 mb-1">{prod.title}</div>
            <div className="text-gray-500 mb-1">
              <span className="font-semibold">{t("pages.products.mobileCategory")}: </span>
              {prod.categorySlug}
            </div>
            <div className="mb-1">
              <span className="font-semibold text-gray-500">{t("pages.products.mobileStock")}: </span>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs 
          ${
            prod.stockCount === 0
              ? "bg-red-100 text-red-600"
              : prod.stockCount < 10
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
              >
                {prod.stockCount}
              </span>
            </div>
            <div className="font-bold text-blue-700 mb-3">₹{prod.price}</div>
            <div className="flex gap-2 mt-auto">
              <button
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md px-2 py-1 font-semibold shadow"
                onClick={() => {
                  setEditProduct(prod);
                  setModalOpen(true);
                }}
              >
                {t("common.edit")}
              </button>
              <button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-md px-2 py-1 font-semibold shadow"
                onClick={() => handleDelete(prod._id)}
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddEditProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        categories={categories}
        initialData={editProduct}
      />
    </div>
  );
}
