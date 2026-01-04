import { useEffect, useState } from "react";
import axios from "axios";
import { PlusIcon, TrashIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "../context/LanguageContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CategoriesPage() {
  const { t } = useLanguage();
  // Component logic here
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    color: "",
    subcategories: []
  });
  const [newSubcategory, setNewSubcategory] = useState({ name: "", exampleProducts: [] });
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem("jwt");

  // Random gradient colors for new categories
const randomGradients = [
  // Light Pastel Pink-Orange (like Kids Zone)
  { from: "#FEE2E2", to: "#FCD34D" },
  
  // Light Teal-Green (like Craft & Office)
  { from: "#CCFBF1", to: "#BEF264" },
  
  // Light Yellow-Peach (like Books)
  { from: "#FEF3C7", to: "#FDBA74" },
  
  // Light Purple-Blue (like Tech Accessories)
  { from: "#E9D5FF", to: "#C7D2FE" },
  
  // Light Pink-Yellow (like School)
  { from: "#FCE7F3", to: "#FDE68A" },
  
  // Light Mint-Blue (like Educational Aids)
  { from: "#D1FAE5", to: "#BFDBFE" },
  
  // Light Coral-Peach
  { from: "#FED7D7", to: "#FBBF24" },
  
  // Light Sky Blue-Purple
  { from: "#DBEAFE", to: "#DDD6FE" },
  
  // Light Aqua-Mint
  { from: "#CCF2F4", to: "#D1F2EB" },
  
  // Light Amber-Orange
  { from: "#FEF9C3", to: "#FED7AA" },
  
  // Light Lavender-Pink
  { from: "#EDE9FE", to: "#F3E8FF" },
  
  // Light Rose-Gold
  { from: "#FCE8F0", to: "#FCD34D" },
  
  // Light Green-Lime
  { from: "#ECFDF5", to: "#D4F4D4" },
  
  // Light Blue-Cyan
  { from: "#E0F2FE", to: "#B9F5D0" },
  
  // Light Peach-Purple
  { from: "#FEF3E7", to: "#E9D5FF" }
];


  // Generate random gradient for new category
  const getRandomGradient = () => {
    const random = randomGradients[Math.floor(Math.random() * randomGradients.length)];
    return `linear-gradient(135deg, ${random.from} 0%, ${random.to} 50%, ${random.from} 100%)`;
  };

  // Toast system
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // Fetch all categories
  async function fetchCategories() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch categories failed:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("jwt");
        window.location.href = "/admin/login";
        return;
      }
      showMessage("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-generate slug from name
  const generateSlug = (name) => {
    return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  };

  // Image upload handler (same as AddEditProductModal)
  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await axios.post("/api/uploads/image", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        }
      });
      if (res.data.url) {
        setNewCategory(prev => ({ ...prev, image: res.data.url }));
        showMessage("✅ Image uploaded successfully!");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      showMessage("Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  // Handle image change for editing category
  async function handleEditImageChange(e) {
    const file = e.target.files[0];
    if (!file || !editingCategory) return;
    
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await axios.post("/api/uploads/image", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        }
      });
      if (res.data.url) {
        setEditingCategory(prev => ({ ...prev, image: res.data.url }));
        showMessage("✅ Image updated successfully!");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      showMessage("Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  // Create new category
  async function handleCreateCategory(e) {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) {
      showMessage("Name and slug required", "error");
      return;
    }
    try {
      const categoryToSave = {
        ...newCategory,
        color: newCategory.color || getRandomGradient()
      };
      const res = await axios.post(`${API_BASE_URL}/api/categories`, categoryToSave, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(prev => [res.data, ...prev]);
      setNewCategory({ 
        name: "", 
        slug: "", 
        description: "", 
        image: "", 
        color: "", 
        subcategories: [] 
      });
      showMessage("✅ Category created successfully!");
    } catch (err) {
      console.error("Create failed:", err);
      showMessage(err.response?.data?.error || "Failed to create category", "error");
    }
  }

  // Update category
  async function handleUpdateCategory() {
    if (!editingCategory) return;
    try {
      const res = await axios.put(`${API_BASE_URL}/api/categories/${editingCategory._id}`, editingCategory, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(prev => prev.map(c => c._id === editingCategory._id ? res.data : c));
      setEditingCategory(null);
      showMessage("✅ Category updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      showMessage(err.response?.data?.error || "Failed to update category", "error");
    }
  }

  // Delete category
  async function handleDeleteCategory(id) {
    if (!window.confirm("Delete this category? All subcategories will be removed.")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(prev => prev.filter(c => c._id !== id));
      showMessage("🗑️ Category deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      showMessage(err.response?.data?.error || "Failed to delete category", "error");
    }
  }

  // Add subcategory to editing category
  function handleAddSubcategory() {
    if (!newSubcategory.name.trim() || !editingCategory) return;
    
    const currentSubs = Array.isArray(editingCategory.subcategories) ? [...editingCategory.subcategories] : [];
    const newSubs = [...currentSubs, { 
      name: newSubcategory.name.trim(), 
      exampleProducts: newSubcategory.exampleProducts || [] 
    }];
    
    setEditingCategory({
      ...editingCategory,
      subcategories: newSubs
    });
    setNewSubcategory({ name: "", exampleProducts: [] });
  }

  // Delete subcategory
  function handleDeleteSubcategory(index) {
    if (!editingCategory || index < 0) return;
    
    const currentSubs = Array.isArray(editingCategory.subcategories) ? [...editingCategory.subcategories] : [];
    if (index >= currentSubs.length) return;
    
    currentSubs.splice(index, 1);
    setEditingCategory({ 
      ...editingCategory, 
      subcategories: currentSubs 
    });
  }

  // Filtered categories
  const filteredCategories = categories.filter(cat =>
    cat?.name?.toLowerCase().includes(search.toLowerCase()) ||
    cat?.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Centered Toast */}
      {message && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="max-w-sm w-full mx-auto animate-in slide-in-from-top-2 duration-300 pointer-events-auto">
            <div
              className={`rounded-2xl px-6 py-4 shadow-2xl backdrop-blur-sm border max-w-sm w-full transform transition-all duration-200 hover:scale-[1.02] ${
                message.type === "success"
                  ? "bg-green-500/95 text-white border-green-400 shadow-green-500/25"
                  : "bg-red-500/95 text-white border-red-400 shadow-red-500/25"
              }`}
            >
              <div className="flex items-center gap-3">
                {message.type === "success" ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="font-semibold text-lg">{message.text}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {t("pages.categories.title")}
          </h1>
          <p className="text-slate-500 mt-1">
            {t("pages.categories.subtitle")} ({filteredCategories.length})
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder={t("pages.categories.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create New Category Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sticky top-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <PlusIcon className="w-6 h-6 text-green-500" />
              {t("pages.categories.addCategory")}
            </h2>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{t("pages.categories.categoryName")}</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => {
                    setNewCategory({ 
                      ...newCategory, 
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    });
                  }}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder={t("pages.categories.example") || "e.g. Books"}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{t("pages.categories.slugAuto")}</label>
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
                  required
                  placeholder={t("pages.categories.slugExample") || "e.g. books"}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{t("pages.categories.categoryDescription")}</label>
                <input
                  type="text"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t("pages.categories.optionalDescription")}
                />
              </div>
              
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{t("pages.categories.categoryImage")}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
                {newCategory.image && (
                  <div className="mt-2">
                    <img 
                      src={newCategory.image} 
                      alt="Preview" 
                      className="w-24 h-24 object-cover rounded-xl border shadow-md mt-2"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{t("pages.categories.previewColor")}</label>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl shadow-lg border-2 border-white ring-1 ring-slate-200 flex-shrink-0"
                    style={{ 
                      background: newCategory.color || getRandomGradient(),
                      backgroundColor: newCategory.color || undefined
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setNewCategory(prev => ({ ...prev, color: getRandomGradient() }))}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg transition-all"
                  >
                    {t("pages.categories.randomGradient")}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <PlusIcon className="w-5 h-5" />
                {uploading ? t("common.loading") : t("pages.categories.addCategory")}
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-12 text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500">{t("common.loading")}</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-12 text-center text-slate-400">
              <EyeIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">{t("pages.categories.nocategories")}</h3>
              <p className="mt-2">Create your first category using the form opposite!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredCategories.map((category) => (
                <div key={category._id} className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  {/* Category Header */}
                  <div className="px-8 py-6 border-b border-slate-100" style={{ 
                    background: category.color || getRandomGradient()
                  }}>
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0 relative">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-20 h-20 rounded-2xl object-cover shadow-xl border-4 border-white ring-2 ring-white/50"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl border-4 border-white ring-2 ring-white/50 absolute inset-0"
                            style={{ 
                              background: category.color || getRandomGradient(),
                              display: category.image ? 'none' : 'flex',
                              color: "white"
                            }}
                          >
                            {category.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-2xl font-bold text-white drop-shadow-lg truncate">{category.name}</h3>
                          <p className="text-white/90 text-sm drop-shadow-md truncate">{category.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 group-hover:scale-105 backdrop-blur-sm"
                          title={t("pages.categories.editCategory")}
                          aria-label="Edit"
                        >
                          <PencilIcon className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="p-2 hover:bg-red-500/20 rounded-xl text-white hover:text-white hover:scale-105 transition-all duration-200 backdrop-blur-sm"
                          title={t("pages.categories.deleteCategory")}
                          aria-label="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {category.description && (
                      <p className="text-white/95 mt-3 line-clamp-2 drop-shadow-md">{category.description}</p>
                    )}
                  </div>

                  {/* Subcategories */}
                  {Array.isArray(category.subcategories) && category.subcategories.length > 0 && (
                    <div className="px-8 py-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
                        {t("pages.categories.subcategories")} ({category.subcategories.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {category.subcategories.map((sub, index) => (
                          <div key={index} className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                            <div className="font-semibold text-slate-900 text-sm mb-1 truncate">{sub.name}</div>
                            {Array.isArray(sub.exampleProducts) && sub.exampleProducts.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {sub.exampleProducts.slice(0, 3).map((prod, i) => (
                                  <span key={i} className="text-xs bg-white/80 px-2 py-1 rounded border text-slate-700 truncate max-w-[100px]">
                                    {prod}
                                  </span>
                                ))}
                                {sub.exampleProducts.length > 3 && (
                                  <span className="text-xs text-slate-500">+{sub.exampleProducts.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-8 border-b border-slate-200">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                <PencilIcon className="w-8 h-8 text-blue-500" />
                {t("pages.categories.editCategory")}
              </h2>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{t("pages.categories.categoryName")}</label>
                  <input
                    type="text"
                    value={editingCategory.name || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Slug</label>
                  <input
                    type="text"
                    value={editingCategory.slug || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{t("pages.categories.categoryDescription")}</label>
                  <textarea
                    value={editingCategory.description || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                </div>
                
                {/* Edit Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{t("pages.categories.updateImage")}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
                  {editingCategory.image && (
                    <div className="mt-2">
                      <img 
                        src={editingCategory.image} 
                        alt="Preview" 
                        className="w-24 h-24 object-cover rounded-xl border shadow-md mt-2"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{t("pages.categories.previewColor")}</label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl shadow-lg border-2 border-white ring-1 ring-slate-200 flex-shrink-0"
                      style={{ 
                        background: editingCategory.color || getRandomGradient(),
                        backgroundColor: editingCategory.color || undefined
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setEditingCategory(prev => ({ ...prev, color: getRandomGradient() }))}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg transition-all"
                    >
                      {t("pages.categories.randomGradient")}
                    </button>
                  </div>
                </div>
              </div>

              {/* Subcategories Management */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">{t("pages.categories.subcategories")} ({Array.isArray(editingCategory.subcategories) ? editingCategory.subcategories.length : 0})</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSubcategory.name}
                      onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                      placeholder="e.g. School Books"
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 w-48"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubcategory}
                      disabled={!newSubcategory.name.trim()}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 disabled:cursor-not-allowed"
                    >
                      <PlusIcon className="w-4 h-4" />
                      {t("common.add")}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {Array.isArray(editingCategory.subcategories) ? editingCategory.subcategories.map((sub, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl group hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all duration-200">
                      <span className="font-medium text-slate-900 flex-1 min-w-0 truncate pr-2">{sub.name}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubcategory(index)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                        title="Remove subcategory"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-500 text-center py-8">No subcategories</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
                <button
                  onClick={handleUpdateCategory}
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <PencilIcon className="w-5 h-5" />
                  {t("common.save")}
                </button>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="px-8 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200 hover:shadow-md"
                >
                  {t("common.cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
