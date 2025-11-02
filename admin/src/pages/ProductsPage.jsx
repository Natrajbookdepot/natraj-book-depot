import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AddEditProductModal from "../components/AddEditProductModal";

export default function ProductsPage() {
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
        headers: { Authorization: `Bearer ${token}` }
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
          headers: { Authorization: `Bearer ${token}` }
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
  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  // Save/Add or Update product
  async function handleSave(product) {
    try {
      const token = localStorage.getItem("jwt");
      if (editProduct && editProduct._id) {
        await axios.put(`/api/products/${editProduct._id}`, product, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("/api/products", product, {
          headers: { Authorization: `Bearer ${token}` }
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
        headers: { Authorization: `Bearer ${token}` }
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
          "Authorization": `Bearer ${token}`,
        }
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
    <div className="w-full max-w-6xl mx-auto px-1 sm:px-4 lg:px-8">
      <h1 className="text-2xl font-bold mb-4 mt-4">Products</h1>
      <div className="flex flex-wrap mb-4 gap-2 items-center">
        <input
          className="border rounded px-2 py-1 w-full sm:w-auto"
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-3 py-1 rounded"
          onClick={() => { setEditProduct(null); setModalOpen(true); }}
        >
          Add New
        </button>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={uploadExcel}
        >
          Bulk Excel Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          style={{ display: "none" }}
          onChange={handleBulkExcel}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow text-xs sm:text-sm md:text-base">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-2 py-2 text-left min-w-[100px]">Name</th>
              <th className="px-2 py-2 text-left min-w-[75px]">Category</th>
              <th className="px-2 py-2 text-left min-w-[50px]">Stock</th>
              <th className="px-2 py-2 text-left min-w-[65px]">Price</th>
              <th className="px-2 py-2 min-w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(prod => (
              <tr key={prod._id}>
                <td className="px-2 py-2 break-words">{prod.title}</td>
                <td className="px-2 py-2 break-words">{prod.categorySlug}</td>
                <td className="px-2 py-2">{prod.stockCount}</td>
                <td className="px-2 py-2">₹{prod.price}</td>
                <td className="px-2 py-2 space-x-2">
                  <button
                    className="bg-blue-500 text-white rounded px-2 py-1"
                    onClick={() => { setEditProduct(prod); setModalOpen(true); }}
                  >Edit</button>
                  <button
                    className="bg-red-500 text-white rounded px-2 py-1"
                    onClick={() => handleDelete(prod._id)}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
