import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AddEditProductModal from "../components/AddEditProductModal";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CloudArrowUpIcon, DocumentArrowDownIcon, TableCellsIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "../context/LanguageContext";
import * as XLSX from "xlsx";

export default function ProductsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [userRole, setUserRole] = useState("");
  const fileInputRef = useRef();

  // Get user role for permissions
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (e) {
        console.error("Failed to parse token payload", e);
      }
    }
  }, []);

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
      setSelectedIds(prev => prev.filter(currId => currId !== id));
    } catch (err) {
      console.error("Product delete failed:", err);
      alert("Delete failed");
    }
  }

  // Bulk Delete Products
  async function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} products? This action cannot be undone.`)) return;

    try {
      const token = localStorage.getItem("jwt");
      await axios.delete('/api/products/bulk/delete', {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids: selectedIds }
      });
      alert("Products deleted successfully");
      setSelectedIds([]);
      fetchProducts();
    } catch (err) {
      console.error("Bulk delete failed:", err);
      alert(err.response?.data?.error || "Bulk delete failed");
    }
  }

  // Toggle selection for individual product
  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Toggle "Select All"
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p._id));
    }
  };

  // 1. Download Template from Backend
  async function downloadTemplate() {
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.get("/api/products/bulk/template", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'product_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Template download failed:", err);
      alert("Failed to download template");
    }
  }

  // 2. Export All Products from Backend
  async function exportProducts() {
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.get("/api/products/bulk/export", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export products failed:", err);
      alert("Failed to export products");
    }
  }

  // 3. Process Bulk Excel Upload
  async function handleBulkExcel(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        if (data.length === 0) {
          alert("Excel file is empty");
          return;
        }

        const token = localStorage.getItem("jwt");
        const res = await axios.post("/api/products/bulk/upload", { data }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { summary, errors } = res.data;
        let msg = `Bulk Upload Results:\n- Created: ${summary.created}\n- Updated: ${summary.updated}\n- Failed: ${summary.failed}`;
        if (errors && errors.length > 0) {
          msg += `\n\nFirst few errors:\n${errors.join('\n')}`;
        }
        alert(msg);
        fetchProducts();
      } catch (err) {
        console.error("Bulk upload processing failed:", err);
        alert("Bulk Excel upload failed during processing");
      }
    };
    reader.readAsBinaryString(file);
    // Clear the input so same file can be selected again
    e.target.value = "";
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
          className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700 transition shadow-sm font-semibold"
          onClick={() => {
            setEditProduct(null);
            setModalOpen(true);
          }}
        >
          <CloudArrowUpIcon className="w-5 h-5" />
          {t("pages.products.addProduct")}
        </button>
        
        <button
          className="bg-white border-2 border-slate-200 text-slate-700 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition shadow-sm font-semibold"
          onClick={downloadTemplate}
          title="Download Excel Template"
        >
          <TableCellsIcon className="w-5 h-5 text-blue-500" />
          Template
        </button>

        <button
          className="bg-white border-2 border-slate-200 text-slate-700 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition shadow-sm font-semibold"
          onClick={exportProducts}
          title="Export All Products"
        >
          <DocumentArrowDownIcon className="w-5 h-5 text-indigo-500" />
          Export
        </button>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition shadow-sm font-semibold"
          onClick={uploadExcel}
        >
          <CloudArrowUpIcon className="w-5 h-5" />
          {t("pages.products.bulkUpload")}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          style={{ display: "none" }}
          onChange={handleBulkExcel}
        />

        {userRole === 'super-admin' && selectedIds.length > 0 && (
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-red-700 transition shadow-sm font-semibold animate-in fade-in zoom-in duration-200"
            onClick={handleBulkDelete}
          >
            <TrashIcon className="w-5 h-5" />
            Delete ({selectedIds.length})
          </button>
        )}
      </div>
      {/* Table for desktop/tablet */}
      <div className="overflow-x-auto w-full hidden sm:block">
        <table className="w-full bg-white rounded-xl shadow-lg border border-slate-200 text-xs sm:text-sm md:text-base transition-all mb-8">
          <thead>
            <tr className="bg-slate-100 text-gray-700">
              <th className="px-3 py-3 text-left w-10">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                  onChange={toggleSelectAll}
                />
              </th>
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
                className={`hover:bg-blue-50 transition-all border-t border-slate-100 ${selectedIds.includes(prod._id) ? "bg-blue-50" : ""}`}
              >
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    checked={selectedIds.includes(prod._id)}
                    onChange={() => toggleSelect(prod._id)}
                  />
                </td>
                <td className="px-3 py-3 break-words font-medium text-gray-900 cursor-pointer" onClick={() => toggleSelect(prod._id)}>
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
            className={`bg-white rounded-xl shadow p-4 border border-slate-200 flex flex-col relative transition-colors ${selectedIds.includes(prod._id) ? "border-blue-400 bg-blue-50" : ""}`}
          >
            <div className="absolute top-4 right-4">
               <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5 cursor-pointer"
                checked={selectedIds.includes(prod._id)}
                onChange={() => toggleSelect(prod._id)}
              />
            </div>
            <div className="font-bold text-gray-900 mb-1 pr-8" onClick={() => toggleSelect(prod._id)}>{prod.title}</div>
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
