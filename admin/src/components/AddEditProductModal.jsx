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
    bestSeller: false
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
      bestSeller: false
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
        className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold mb-2">
          {initialData ? "Edit Product" : "Add Product"}
        </h2>
        <input name="title" value={form.title} onChange={handleInput}
          className="border rounded px-2 py-1" placeholder="Product Title" required />
        <input name="slug" value={form.slug} onChange={handleInput}
          className="border rounded px-2 py-1" placeholder="Slug" required />
        <textarea name="description" value={form.description} onChange={handleInput}
          className="border rounded px-2 py-1" placeholder="Description" required />
        <select name="categorySlug" value={form.categorySlug}
          onChange={handleInput} className="border rounded px-2 py-1" required>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
        <select name="subcategoryName" value={form.subcategoryName}
          onChange={handleInput} className="border rounded px-2 py-1" required>
          <option value="">Select Subcategory</option>
          {subcategories.map(sub => (
            <option key={sub.name} value={sub.name}>{sub.name}</option>
          ))}
        </select>
        <input name="brand" value={form.brand} onChange={handleInput}
          className="border rounded px-2 py-1" placeholder="Brand" required />
        <input name="price" type="number" value={form.price} onChange={handleInput}
          className="border rounded px-2 py-1" placeholder="Price" required />
        <input name="stockCount" type="number" value={form.stockCount} onChange={handleInput}
          className="border rounded px-2 py-1" placeholder="Stock Count" required />
        <label className="flex items-center gap-2">
          <input name="inStock" type="checkbox" checked={form.inStock} onChange={handleInput} />
          In Stock
        </label>
        <label className="flex items-center gap-2">
          <input name="featured" type="checkbox" checked={form.featured} onChange={handleInput} />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input name="bestSeller" type="checkbox" checked={form.bestSeller} onChange={handleInput} />
          Best Seller
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          disabled={uploading}
        />
        <div className="flex gap-2 flex-wrap">
          {form.images.map(url => (
            <div key={url} className="relative group">
              <img src={url} alt="preview" className="h-12 w-12 object-cover rounded border" />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white rounded w-5 h-5 flex items-center justify-center group-hover:block"
                style={{ fontSize: 12, padding: 0 }}
                title="Remove image"
                onClick={() => handleRemoveImage(url)}
              >&times;</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={uploading}>
            {uploading ? "Uploading..." : "Save"}
          </button>
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  ) : null;
}
