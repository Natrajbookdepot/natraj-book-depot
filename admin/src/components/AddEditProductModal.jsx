import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddEditProductModal({
  open,
  onClose,
  onSave,
  categories,
  initialData
}) {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    categorySlug: "",
    subcategoryName: "",
    brand: "",
    price: "",
    images: [],
    inStock: true,
    stockCount: "",
    featured: false,
    bestSeller: false,
    summary: "",
    specifications: []
  });
  const [subcategories, setSubcategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({
      title: "",
      slug: "",
      description: "",
      categorySlug: "",
      subcategoryName: "",
      brand: "",
      price: "",
      images: [],
      inStock: true,
      stockCount: "",
      featured: false,
      bestSeller: false,
      summary: "",
      specifications: []
    });
  }, [initialData, open]);

  useEffect(() => {
    if (form.categorySlug && categories.length > 0) {
      const category = categories.find(cat => cat.slug === form.categorySlug);
      setSubcategories(category?.subcategories || []);
      setForm(prev => ({ ...prev, subcategoryName: "" }));
    }
  }, [form.categorySlug, categories]);

  function handleInput(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (name === "title") {
      setForm(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, "-")
      }));
    }
  }

  // Multi-image upload, max 5 images, fixed with Authorization header
  async function handleImageChange(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (form.images.length + files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setUploading(true);
    try {
      const uploadedUrls = [];
      const token = localStorage.getItem("jwt"); // get JWT token stored on login!
      for (let file of files) {
        const fd = new FormData();
        fd.append("image", file);
        const res = await axios.post("/api/uploads/image", fd, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          }
        });
        if (res.data.url) uploadedUrls.push(res.data.url);
      }
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleRemoveImage(url) {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== url)
    }));
  }

  // Specifications helpers
  function addSpec() {
    setForm(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }]
    }));
  }

  function removeSpec(index) {
    setForm(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  }

  function handleSpecChange(index, field, value) {
    const newSpecs = [...form.specifications];
    newSpecs[index][field] = value;
    setForm(prev => ({ ...prev, specifications: newSpecs }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    onSave(form);
  }

  return open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-2 border-b">
          <h2 className="text-xl font-bold">
            {initialData ? "Edit Product" : "Add Product"}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-gray-700">Basic Info</label>
            <input name="title" value={form.title} onChange={handleInput}
              className="border rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Product Title" required />
            <input name="slug" value={form.slug} onChange={handleInput}
              className="border rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" placeholder="Slug" required />
            <textarea name="summary" value={form.summary} onChange={handleInput}
              className="border rounded px-2 py-1.5 h-20" placeholder="Short Summary (near price)" />
            <textarea name="description" value={form.description} onChange={handleInput}
              className="border rounded px-2 py-1.5 h-32" placeholder="Long Description (bullet points allowed)" required />
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-gray-700">Details & Pricing</label>
            <div className="grid grid-cols-2 gap-2">
              <select name="categorySlug" value={form.categorySlug}
                onChange={handleInput} className="border rounded px-2 py-1.5" required>
                <option value="">Category</option>
                {categories.map(cat => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
              <select name="subcategoryName" value={form.subcategoryName}
                onChange={handleInput} className="border rounded px-2 py-1.5" required>
                <option value="">Subcategory</option>
                {subcategories.map(sub => (
                  <option key={sub.name} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>
            <input name="brand" value={form.brand} onChange={handleInput}
              className="border rounded px-2 py-1.5" placeholder="Brand" required />
            <div className="grid grid-cols-2 gap-2">
              <input name="price" type="number" value={form.price} onChange={handleInput}
                className="border rounded px-2 py-1.5" placeholder="Price (₹)" required />
              <input name="stockCount" type="number" value={form.stockCount} onChange={handleInput}
                className="border rounded px-2 py-1.5" placeholder="Stock" required />
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer border px-3 py-1 rounded-lg hover:bg-gray-50">
                <input name="inStock" type="checkbox" checked={form.inStock} onChange={handleInput} />
                <span className="text-sm">In Stock</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer border px-3 py-1 rounded-lg hover:bg-gray-50">
                <input name="featured" type="checkbox" checked={form.featured} onChange={handleInput} />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer border px-3 py-1 rounded-lg hover:bg-gray-50">
                <input name="bestSeller" type="checkbox" checked={form.bestSeller} onChange={handleInput} />
                <span className="text-sm">Best Seller</span>
              </label>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">Specifications</label>
            <button type="button" onClick={addSpec} className="text-blue-600 text-xs font-bold hover:underline">+ Add Spec</button>
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-1">
            {form.specifications.map((spec, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input value={spec.key} onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                  className="border rounded px-2 py-1 text-sm flex-1" placeholder="Key (e.g. Size)" />
                <input value={spec.value} onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                  className="border rounded px-2 py-1 text-sm flex-1" placeholder="Value (e.g. A4)" />
                <button type="button" onClick={() => removeSpec(idx)} className="text-red-500 px-2 font-bold">&times;</button>
              </div>
            ))}
            {form.specifications.length === 0 && <p className="text-xs text-gray-400 italic">No specifications added</p>}
          </div>
        </div>

        <div className="border-t pt-4">
          <label className="text-sm font-semibold text-gray-700 block mb-2">Images (Max 5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            disabled={uploading}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="flex gap-2 mt-3 flex-wrap">
            {form.images.map(url => (
              <div key={url} className="relative group">
                <img src={url} alt="preview" className="h-14 w-14 object-cover rounded-lg border shadow-sm" />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveImage(url)}
                >&times;</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-2 border-t pt-4 sticky bottom-0 bg-white">
          <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition" disabled={uploading}>
            {uploading ? "Uploading..." : "Save Product"}
          </button>
          <button type="button" className="px-6 py-2.5 rounded-xl border border-gray-300 font-semibold hover:bg-gray-50 transition" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  ) : null;
}
