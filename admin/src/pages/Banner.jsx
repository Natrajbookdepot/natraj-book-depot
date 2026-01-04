import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { PlusIcon, TrashIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "../context/LanguageContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// Local translations removed in favor of global context

const BannerFormFields = ({ bannerData, updateBanner, isEditing, uploading, fileInputRef, handleMediaUpload, lang }) => {
  const { t } = useLanguage();
  
  return (
    <>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">{t("pages.banners.bannerType")}</label>
        <select
          value={bannerData.type || "image"}
          onChange={(e) => updateBanner("type", e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
        >
          <option value="image">{t("pages.banners.imageOption") || "Image Banner"}</option>
          <option value="video">{t("pages.banners.videoOption") || "Video Banner"}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">{t("pages.banners.formTitle")} <span className="text-red-500">{t("pages.banners.required") || "*"}</span></label>
        <input
          type="text"
          value={bannerData.title || ""}
          onChange={(e) => updateBanner("title", e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          placeholder={lang === 'hi' ? "उदा. स्कूल बिक्री" : "e.g. Back to School Sale"}
          maxLength={80}
        />
        <p className="text-xs text-slate-500 mt-1">{bannerData.title?.length || 0}/80</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">{t("pages.banners.subtitle")} <span className="text-red-500">{t("pages.banners.required") || "*"}</span></label>
        <input
          type="text"
          value={bannerData.subtitle || ""}
          onChange={(e) => updateBanner("subtitle", e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          placeholder={lang === 'hi' ? "स्कूल आवश्यक वस्तुओं पर 40% तक छूट" : "e.g. Up to 40% off school essentials"}
          maxLength={120}
        />
        <p className="text-xs text-slate-500 mt-1">{bannerData.subtitle?.length || 0}/120</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          {bannerData.type === "video" ? t("pages.banners.videoUpload") : t("pages.banners.imageUpload")} <span className="text-red-500">{t("pages.banners.required") || "*"}</span>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept={bannerData.type === "video" 
            ? "video/mp4,video/webm,video/ogg,video/quicktime" 
            : "image/jpeg,image/jpg,image/png,image/webp,image/gif"
          }
          onChange={(e) => handleMediaUpload(e, isEditing)}
          disabled={uploading}
          className="w-full px-4 py-3 border-2 border-dashed border-dashed-slate-300 rounded-2xl file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-emerald-500 file:to-teal-600 file:text-white hover:file:from-emerald-600 hover:file:to-teal-700 hover:border-emerald-300 transition-all cursor-pointer shadow-sm hover:shadow-md"
        />
        {uploading && (
          <div className="mt-3 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl animate-pulse">
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="w-6 h-6 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin"></div>
              <div>
                <p className="font-semibold">{t("pages.banners.uploading")} {fileInputRef.current?.files[0]?.name}</p>
                <p className="text-sm">{lang === 'hi' ? 'कृपया प्रतीक्षा करें...' : 'Please wait...'}</p>
              </div>
            </div>
          </div>
        )}
        {bannerData.mediaUrl && (
          <div className="mt-4 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl">
            <p className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
              {t("pages.banners.mediaReady") || "Media Ready"}
              <EyeIcon className="w-5 h-5" />
            </p>
            {bannerData.type === "video" ? (
              <video 
                src={bannerData.mediaUrl} 
                className="w-full max-h-48 object-cover rounded-xl shadow-lg" 
                controls 
                muted 
                playsInline
              />
            ) : (
              <img 
                src={bannerData.mediaUrl} 
                alt="Preview" 
                className="w-full max-h-48 object-cover rounded-xl shadow-lg" 
              />
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">{t("pages.banners.ctaButtonText")}</label>
        <input
          type="text"
          value={bannerData.ctaText || ""}
          onChange={(e) => updateBanner("ctaText", e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          placeholder={lang === 'hi' ? "अभी खरीदें" : "Shop Now"}
          maxLength={30}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">{t("pages.banners.ctaLink")}</label>
        <input
          type="text"
          value={bannerData.ctaLink || ""}
          onChange={(e) => updateBanner("ctaLink", e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          placeholder="/category/seasonal-items"
        />
        <p className="text-xs text-slate-500 mt-1">{t("pages.banners.useRelativePath")}</p>
      </div>

      <div className="p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl border-2 border-dashed border-blue-200">
        <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 cursor-pointer group">
          <input
            type="checkbox"
            checked={!!bannerData.showButton}
            onChange={(e) => updateBanner("showButton", e.target.checked)}
            className="w-6 h-6 text-blue-600 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all group-hover:scale-110"
          />
          <span className="flex items-center gap-2">
            {t("pages.banners.showButton")}
            {bannerData.showButton ? (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">{t("pages.banners.visible")}</span>
            ) : (
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{t("pages.banners.hidden")}</span>
            )}
          </span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">{t("pages.banners.displayOrder")}</label>
        <input
          type="number"
          min="1"
          max="100"
          value={bannerData.order || 1}
          onChange={(e) => updateBanner("order", parseInt(e.target.value) || 1)}
          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
        />
        <p className="text-xs text-slate-500 mt-1">{t("pages.banners.lowerNumbersFirst")}</p>
      </div>

      {/* TITLE STYLING */}
      <div className="border-t-2 border-slate-200 pt-6 mt-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>🎨</span> {t("pages.banners.titleStyling") || "Title Styling"}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">{t("pages.banners.color")}</label>
            <input
              type="color"
              value={bannerData.titleStyle?.color || '#ffffff'}
              onChange={(e) => updateBanner("titleStyle", { ...(bannerData.titleStyle || {}), color: e.target.value })}
              className="w-full h-10 cursor-pointer rounded-lg border border-slate-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">{t("pages.banners.fontSize")}</label>
            <input
              type="number"
              min="12"
              max="72"
              value={bannerData.titleStyle?.fontSize || 48}
              onChange={(e) => updateBanner("titleStyle", { ...(bannerData.titleStyle || {}), fontSize: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">{t("pages.banners.fontWeight")}</label>
            <select
              value={bannerData.titleStyle?.fontWeight || 'bold'}
              onChange={(e) => updateBanner("titleStyle", { ...(bannerData.titleStyle || {}), fontWeight: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="100">{t("pages.banners.thin") || "Thin"}</option>
              <option value="300">{t("pages.banners.light") || "Light"}</option>
              <option value="normal">{t("pages.banners.normal") || "Normal"}</option>
              <option value="600">{t("pages.banners.semiBold") || "Semi Bold"}</option>
              <option value="bold">{t("pages.banners.bold") || "Bold"}</option>
              <option value="800">{t("pages.banners.extraBold") || "Extra Bold"}</option>
              <option value="900">{t("pages.banners.black") || "Black"}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">{t("pages.banners.fontFamily")}</label>
            <select
              value={bannerData.titleStyle?.fontFamily || 'Arial'}
              onChange={(e) => updateBanner("titleStyle", { ...(bannerData.titleStyle || {}), fontFamily: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="Arial">Arial</option>
              <option value="'Arial Black'">Arial Black</option>
              <option value="'Trebuchet MS'">Trebuchet MS</option>
              <option value="Verdana">Verdana</option>
              <option value="Georgia">Georgia</option>
              <option value="'Times New Roman'">Times New Roman</option>
              <option value="Courier">Courier</option>
              <option value="'Courier New'">Courier New</option>
              <option value="'Comic Sans MS'">Comic Sans MS</option>
              <option value="Impact">Impact</option>
              <option value="Garamond">Garamond</option>
              <option value="Palatino">Palatino</option>
              <option value="'Book Antiqua'">Book Antiqua</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Lucida">Lucida</option>
              <option value="Calibri">Calibri</option>
              <option value="Cambria">Cambria</option>
              <option value="Consolas">Consolas</option>
              <option value="'Segoe UI'">Segoe UI</option>
              <option value="'Lucida Console'">Lucida Console</option>
            </select>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 font-semibold mb-2">{t("pages.banners.preview")}</p>
          <p style={{
            color: bannerData.titleStyle?.color || '#ffffff',
            fontSize: `${bannerData.titleStyle?.fontSize || 48}px`,
            fontWeight: bannerData.titleStyle?.fontWeight || 'bold',
            fontFamily: bannerData.titleStyle?.fontFamily || 'Arial',
            padding: '10px',
            backgroundColor: '#1a1a1a',
            borderRadius: '4px'
          }}>{bannerData.title || t("pages.banners.yourTitleHere")}</p>
        </div>
      </div>

      {/* SUBTITLE STYLING */}
      <div className="border-t-2 border-slate-200 pt-6 mt-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>🎨</span> {t("pages.banners.subtitleStyling") || "Subtitle Styling"}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">{t("pages.banners.color")}</label>
            <input
              type="color"
              value={bannerData.subtitleStyle?.color || '#ffffff'}
              onChange={(e) => updateBanner("subtitleStyle", { ...(bannerData.subtitleStyle || {}), color: e.target.value })}
              className="w-full h-10 cursor-pointer rounded-lg border border-slate-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">{t("pages.banners.fontSize")}</label>
            <input
              type="number"
              min="12"
              max="48"
              value={bannerData.subtitleStyle?.fontSize || 20}
              onChange={(e) => updateBanner("subtitleStyle", { ...(bannerData.subtitleStyle || {}), fontSize: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">{t("pages.banners.fontWeight")}</label>
            <select
              value={bannerData.subtitleStyle?.fontWeight || 'normal'}
              onChange={(e) => updateBanner("subtitleStyle", { ...(bannerData.subtitleStyle || {}), fontWeight: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="100">{t("pages.banners.thin")}</option>
              <option value="300">{t("pages.banners.light")}</option>
              <option value="normal">{t("pages.banners.normal")}</option>
              <option value="600">{t("pages.banners.semiBold")}</option>
              <option value="bold">{t("pages.banners.bold")}</option>
              <option value="800">{t("pages.banners.extraBold")}</option>
              <option value="900">{t("pages.banners.black")}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">{t("pages.banners.fontFamily")}</label>
            <select
              value={bannerData.subtitleStyle?.fontFamily || 'Arial'}
              onChange={(e) => updateBanner("subtitleStyle", { ...(bannerData.subtitleStyle || {}), fontFamily: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="Arial">Arial</option>
              <option value="'Arial Black'">Arial Black</option>
              <option value="'Trebuchet MS'">Trebuchet MS</option>
              <option value="Verdana">Verdana</option>
              <option value="Georgia">Georgia</option>
              <option value="'Times New Roman'">Times New Roman</option>
              <option value="Courier">Courier</option>
              <option value="'Courier New'">Courier New</option>
              <option value="'Comic Sans MS'">Comic Sans MS</option>
              <option value="Impact">Impact</option>
              <option value="Garamond">Garamond</option>
              <option value="Palatino">Palatino</option>
              <option value="'Book Antiqua'">Book Antiqua</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Lucida">Lucida</option>
              <option value="Calibri">Calibri</option>
              <option value="Cambria">Cambria</option>
              <option value="Consolas">Consolas</option>
              <option value="'Segoe UI'">Segoe UI</option>
              <option value="'Lucida Console'">Lucida Console</option>
            </select>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 font-semibold mb-2">{t("pages.banners.preview")}</p>
          <p style={{
            color: bannerData.subtitleStyle?.color || '#ffffff',
            fontSize: `${bannerData.subtitleStyle?.fontSize || 20}px`,
            fontWeight: bannerData.subtitleStyle?.fontWeight || 'normal',
            fontFamily: bannerData.subtitleStyle?.fontFamily || 'Arial',
            padding: '10px',
            backgroundColor: '#1a1a1a',
            borderRadius: '4px'
          }}>{bannerData.subtitle || t("pages.banners.yourSubtitleHere")}</p>
        </div>
      </div>

      {/* CTA BUTTON STYLING */}
      <div className="border-t-2 border-slate-200 pt-6 mt-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>🎨</span> {t("pages.banners.ctaButtonStyling") || "Button Styling"}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">{t("pages.banners.textColor")}</label>
            <input
              type="color"
              value={bannerData.ctaStyle?.color || '#000000'}
              onChange={(e) => updateBanner("ctaStyle", { ...(bannerData.ctaStyle || {}), color: e.target.value })}
              className="w-full h-10 cursor-pointer rounded-lg border border-slate-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">{t("pages.banners.backgroundColor")}</label>
            <input
              type="color"
              value={bannerData.ctaStyle?.backgroundColor || '#ffffff'}
              onChange={(e) => updateBanner("ctaStyle", { ...(bannerData.ctaStyle || {}), backgroundColor: e.target.value })}
              className="w-full h-10 cursor-pointer rounded-lg border border-slate-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">{t("pages.banners.fontSize")}</label>
            <input
              type="number"
              min="12"
              max="32"
              value={bannerData.ctaStyle?.fontSize || 16}
              onChange={(e) => updateBanner("ctaStyle", { ...(bannerData.ctaStyle || {}), fontSize: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">{t("pages.banners.fontWeight")}</label>
            <select
              value={bannerData.ctaStyle?.fontWeight || 'bold'}
              onChange={(e) => updateBanner("ctaStyle", { ...(bannerData.ctaStyle || {}), fontWeight: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="100">{t("pages.banners.thin")}</option>
              <option value="300">{t("pages.banners.light")}</option>
              <option value="normal">{t("pages.banners.normal")}</option>
              <option value="600">{t("pages.banners.semiBold")}</option>
              <option value="bold">{t("pages.banners.bold")}</option>
              <option value="800">{t("pages.banners.extraBold")}</option>
              <option value="900">{t("pages.banners.black")}</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-2">{t("pages.banners.fontFamily")}</label>
            <select
              value={bannerData.ctaStyle?.fontFamily || 'Arial'}
              onChange={(e) => updateBanner("ctaStyle", { ...(bannerData.ctaStyle || {}), fontFamily: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="Arial">Arial</option>
              <option value="'Arial Black'">Arial Black</option>
              <option value="'Trebuchet MS'">Trebuchet MS</option>
              <option value="Verdana">Verdana</option>
              <option value="Georgia">Georgia</option>
              <option value="'Times New Roman'">Times New Roman</option>
              <option value="Courier">Courier</option>
              <option value="'Courier New'">Courier New</option>
              <option value="'Comic Sans MS'">Comic Sans MS</option>
              <option value="Impact">Impact</option>
              <option value="Garamond">Garamond</option>
              <option value="Palatino">Palatino</option>
              <option value="'Book Antiqua'">Book Antiqua</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Lucida">Lucida</option>
              <option value="Calibri">Calibri</option>
              <option value="Cambria">Cambria</option>
              <option value="Consolas">Consolas</option>
              <option value="'Segoe UI'">Segoe UI</option>
              <option value="'Lucida Console'">Lucida Console</option>
            </select>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 font-semibold mb-2">{t("pages.banners.preview")}</p>
          <button style={{
            color: bannerData.ctaStyle?.color || '#000000',
            backgroundColor: bannerData.ctaStyle?.backgroundColor || '#ffffff',
            fontSize: `${bannerData.ctaStyle?.fontSize || 16}px`,
            fontWeight: bannerData.ctaStyle?.fontWeight || 'bold',
            fontFamily: bannerData.ctaStyle?.fontFamily || 'Arial',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer'
          }}>
            {bannerData.ctaText || t("pages.banners.buttonText")}
          </button>
        </div>
      </div>
    </>
  );
};


export default function HeroBannersPage() {
  const { language, t } = useLanguage();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  const [search, setSearch] = useState("");
  const [newBanner, setNewBanner] = useState({
    type: "image",
    title: "",
    titleStyle: { color: '#ffffff', fontSize: 48, fontWeight: 'bold', fontFamily: 'Arial' },
    subtitle: "",
    subtitleStyle: { color: '#ffffff', fontSize: 20, fontWeight: 'normal', fontFamily: 'Arial' },
    mediaUrl: "",
    ctaText: "Shop Now",
    ctaStyle: { color: '#000000', backgroundColor: '#ffffff', fontSize: 16, fontWeight: 'bold', fontFamily: 'Arial' },
    ctaLink: "/",
    showButton: true,
    order: 1
  });
  const [uploading, setUploading] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("jwt");

  // Toast system
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  // Fetch banners
  async function fetchBanners() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/herobanners`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBanners(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch failed:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem("jwt");
        window.location.href = "/admin/login";
        return;
      }
      showMessage("Failed to load banners", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBanners();
  }, [token]);

  // 🔥 ROBUST UPLOAD - Try multiple endpoints
  const handleMediaUpload = async (e, isEditing = false) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (fileInputRef.current) fileInputRef.current.value = "";
    
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file); // Backend expects "file" field
      
      console.log('📤 Uploading:', file.name, file.size, 'bytes');
      
      const res = await axios.post(`${API_BASE_URL}/api/herobanners/uploads/media`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
        timeout: 45000
      });
      
      const uploadedUrl = res.data.url || res.data.secure_url;
      if (uploadedUrl) {
        if (isEditing && editingBanner) {
          setEditingBanner(prev => ({ ...prev, mediaUrl: uploadedUrl }));
        } else {
          setNewBanner(prev => ({ ...prev, mediaUrl: uploadedUrl }));
        }
        showMessage(`✅ ${file.type.includes('image') ? 'Image' : 'Video'} uploaded successfully!`);
      } else {
        throw new Error("No URL in response");
      }
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.error || error.message || "Upload failed";
      showMessage(`❌ ${errorMsg}`, "error");
    } finally {
      setUploading(false);
    }
  };

  // Create banner
  async function handleCreateBanner(e) {
    e.preventDefault();
    const requiredFields = {
      title: newBanner.title?.trim(),
      subtitle: newBanner.subtitle?.trim(),
      mediaUrl: newBanner.mediaUrl
    };
    
    if (!Object.values(requiredFields).every(Boolean)) {
      showMessage("⚠️ Title, subtitle, and image are REQUIRED", "error");
      return;
    }
    
    try {
      const res = await axios.post(`${API_BASE_URL}/api/herobanners`, newBanner, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBanners(prev => [res.data, ...prev]);
      
      // Reset form completely
      setNewBanner({
        type: "image",
        title: "",
        titleStyle: { color: '#ffffff', fontSize: 48, fontWeight: 'bold', fontFamily: 'Arial' },
        subtitle: "",
        subtitleStyle: { color: '#ffffff', fontSize: 20, fontWeight: 'normal', fontFamily: 'Arial' },
        mediaUrl: "",
        ctaText: "Shop Now",
        ctaStyle: { color: '#000000', backgroundColor: '#ffffff', fontSize: 16, fontWeight: 'bold', fontFamily: 'Arial' },
        ctaLink: "/",
        showButton: true,
        order: banners.length + 2
      });
      
      showMessage("🎉 Banner created successfully!");
    } catch (err) {
      console.error("Create error:", err.response?.data);
      showMessage(err.response?.data?.error || "Failed to create banner", "error");
    }
  }

  // Update banner
  async function handleUpdateBanner() {
    if (!editingBanner?._id) return;
    try {
      const res = await axios.put(`${API_BASE_URL}/api/herobanners/${editingBanner._id}`, editingBanner, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBanners(prev => prev.map(b => b._id === editingBanner._id ? res.data : b));
      setEditingBanner(null);
      showMessage("✅ Banner updated successfully!");
    } catch (err) {
      showMessage(err.response?.data?.error || "Update failed", "error");
    }
  }

  // Delete banner
  async function handleDeleteBanner(id) {
    if (!confirm(`Delete "${banners.find(b => b._id === id)?.title}"?`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/herobanners/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBanners(prev => prev.filter(b => b._id !== id));
      showMessage("🗑️ Banner deleted!");
    } catch (err) {
      showMessage(err.response?.data?.error || "Delete failed", "error");
    }
  }

  // Drag & drop
  const handleDragStart = (e, index) => {
    setDraggingIndex(index);
  };
  
  const handleDragOver = (e) => e.preventDefault();
  
  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === dropIndex) return;

    const newBanners = [...banners];
    const [draggedBanner] = newBanners.splice(draggingIndex, 1);
    newBanners.splice(dropIndex, 0, draggedBanner);

    // Update orders
    const updatedBanners = newBanners.map((banner, idx) => ({
      ...banner,
      order: idx + 1
    }));

    try {
      // Batch update orders
      await Promise.all(
        updatedBanners.map(banner => 
          axios.put(`${API_BASE_URL}/api/herobanners/${banner._id}`, { order: banner.order }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );
      setBanners(updatedBanners);
      showMessage("🔄 Banner order updated!");
    } catch {
      showMessage("Failed to save order changes", "error");
      fetchBanners(); // Refresh
    } finally {
      setDraggingIndex(null);
    }
  };

  const updateNewBanner = (field, value) => {
    setNewBanner(prev => ({ ...prev, [field]: value }));
  };

  const updateEditingBanner = (field, value) => {
    setEditingBanner(prev => prev ? { ...prev, [field]: value } : null);
  };

  const filteredBanners = banners.filter(banner =>
    (banner.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (banner.subtitle || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Toast */}
        {message && (
          <div className="fixed top-6 right-6 z-50">
            <div className={`p-6 rounded-3xl shadow-2xl text-white max-w-md transform transition-all ${
              message.type === "success" 
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 border-4 border-emerald-400 scale-100" 
                : "bg-gradient-to-r from-red-500 to-rose-600 border-4 border-red-400 scale-100"
            }`}>
              <div className="flex items-center gap-4">
                {message.type === "success" ? (
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <PlusIcon className="w-8 h-8 text-white" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <TrashIcon className="w-8 h-8 text-white" />
                  </div>
                )}
                <span className="font-bold text-lg leading-tight">{message.text}</span>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src="../public/logo.png" 
                  alt="Logo" 
                  className="h-16 w-16 object-contain rounded-lg shadow-lg"
                />
                <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  {t("pages.banners.herobanners")}
                </h1>
              </div>
              <p className="text-xl text-slate-600 font-semibold ml-20">
                {t("pages.banners.manageSliders")} <span className="text-blue-600 font-bold">({filteredBanners.length})</span> {t("pages.banners.active")}
              </p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder={t("pages.banners.searchBanners")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full lg:w-96 pl-12 pr-6 py-4 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-xl bg-white/80 backdrop-blur-sm"
              />
              <svg className="w-6 h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* CREATE FORM */}
          <div className="xl:col-span-1">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8 sticky top-8 max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-4 text-slate-800 bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                {t("pages.banners.newBanner")}
              </h2>
              <form onSubmit={handleCreateBanner} className="space-y-6">
                <BannerFormFields 
                  bannerData={newBanner} 
                  updateBanner={updateNewBanner}
                  isEditing={false}
                  uploading={uploading}
                  fileInputRef={fileInputRef}
                  handleMediaUpload={handleMediaUpload}
                  lang={language}
                />
                <button
                  type="submit"
                  className="w-full min-h-[4rem] h-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-black text-lg sm:text-xl py-4 px-6 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:cursor-not-allowed sticky bottom-0 z-10"
                >
                  {uploading ? (
                    <>
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("pages.banners.uploading")}...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-8 h-8" />
                      {t("pages.banners.createNewBanner")}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* BANNERS GRID */}
          <div className="xl:col-span-3 space-y-6">
            {loading ? (
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-20 text-center col-span-full">
                <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-8"></div>
                <p className="text-2xl font-bold text-slate-600">{t("pages.banners.loadingBanners")}</p>
              </div>
            ) : filteredBanners.length === 0 ? (
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl border-4 border-dashed border-slate-300 p-20 text-center col-span-full">
                <EyeIcon className="w-32 h-32 mx-auto mb-8 text-slate-300" />
                <h3 className="text-4xl font-bold text-slate-600 mb-4">{t("pages.banners.noBannersYet")}</h3>
                <p className="text-xl text-slate-500 mb-8 max-w-md mx-auto">
                  {t("pages.banners.createFirst")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 gap-8">
                {filteredBanners.map((banner, index) => (
                  <div
                    key={banner._id}
                    className="group bg-white/95 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 overflow-hidden h-full flex flex-col"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    {/* Hero Preview */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-emerald-50 flex-shrink-0">
                      {banner.mediaUrl ? (
                        banner.type === "video" ? (
                          <video 
                            src={banner.mediaUrl} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                            muted 
                            loop 
                            playsInline
                          />
                        ) : (
                          <img 
                            src={banner.mediaUrl} 
                            alt={banner.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                            />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                          <EyeIcon className="w-16 h-16 text-slate-400" />
                        </div>
                      )}
                      
                      {/* Live Overlay Preview */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                        <h3 style={{
                          color: banner.titleStyle?.color || '#ffffff',
                          fontSize: `${Math.min(banner.titleStyle?.fontSize || 24, 24)}px`,
                          fontWeight: banner.titleStyle?.fontWeight || 'bold',
                          fontFamily: banner.titleStyle?.fontFamily || 'Arial'
                        }} className="drop-shadow-2xl mb-2 line-clamp-1">
                          {banner.title}
                        </h3>
                        <p style={{
                          color: banner.subtitleStyle?.color || '#ffffff',
                          fontSize: `${Math.min(banner.subtitleStyle?.fontSize || 14, 14)}px`,
                          fontWeight: banner.subtitleStyle?.fontWeight || 'normal',
                          fontFamily: banner.subtitleStyle?.fontFamily || 'Arial'
                        }} className="drop-shadow-xl mb-3 line-clamp-1 text-xs">
                          {banner.subtitle}
                        </p>
                        {banner.showButton && (
                          <button style={{
                            color: banner.ctaStyle?.color || '#000000',
                            backgroundColor: banner.ctaStyle?.backgroundColor || '#ffffff',
                            fontSize: `${Math.min(banner.ctaStyle?.fontSize || 12, 12)}px`,
                            fontWeight: banner.ctaStyle?.fontWeight || 'bold',
                            fontFamily: banner.ctaStyle?.fontFamily || 'Arial',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none'
                          }} className="group-hover:scale-105 transition-transform w-fit">
                            {banner.ctaText}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Banner Info */}
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-grow">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-xl mb-2 shadow-lg">
                            <span>#{banner.order}</span>
                          </div>
                          <h4 className="text-lg font-black text-slate-900 mb-1 line-clamp-1">{banner.title}</h4>
                          <p className="text-sm text-slate-600 line-clamp-1">{banner.subtitle}</p>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <button
                            onClick={() => setEditingBanner({ ...banner })}
                            className="p-2 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white rounded-2xl transition-all hover:shadow-lg hover:scale-105 shadow border border-slate-200"
                            title={t("pages.banners.editBanner")}
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBanner(banner._id)}
                            className="p-2 hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-600 hover:text-white rounded-2xl transition-all hover:shadow-lg hover:scale-105 shadow border border-slate-200"
                            title={t("pages.banners.deleteBanner")}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200 text-xs">
                        <div>
                          <span className="font-semibold text-slate-600 uppercase">{t("pages.banners.type")}</span>
                          <p className="text-slate-800 font-bold">{banner.type === "video" ? t("pages.banners.typeVideo") : t("pages.banners.typeImage")}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-600 uppercase">{t("pages.banners.button")}</span>
                          <p className="text-slate-800 font-bold">{banner.showButton ? t("pages.banners.statusVisible") : t("pages.banners.statusHidden")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* EDIT MODAL */}
        {editingBanner && (
          <>
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-2xl z-[9999]" 
              onClick={() => setEditingBanner(null)}
            />
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
              <div 
                className="bg-white/95 backdrop-blur-3xl rounded-3xl shadow-3xl max-w-2xl w-full max-h-[95vh] overflow-hidden border-4 border-white/50 flex flex-col" 
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8 border-b-4 border-blue-500/30 bg-gradient-to-r from-slate-50 via-blue-50 to-emerald-50/50 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-slate-900">
                      {t("pages.banners.editBanner")} #{editingBanner.order}
                    </h2>
                    <button 
                      onClick={() => setEditingBanner(null)}
                      className="p-2 hover:bg-slate-200/50 rounded-2xl transition-all"
                    >
                      <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-8 overflow-y-auto flex-grow">
                  <BannerFormFields 
                    bannerData={editingBanner} 
                    updateBanner={updateEditingBanner}
                    isEditing={true}
                    uploading={uploading}
                    fileInputRef={fileInputRef}
                    handleMediaUpload={handleMediaUpload}
                    lang={language}
                  />
                </div>

                <div className="p-8 border-t-4 border-emerald-500/30 bg-gradient-to-r from-slate-50 to-emerald-50/50 flex gap-4 flex-shrink-0">
                  <button
                    onClick={handleUpdateBanner}
                    disabled={uploading}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="w-5 h-5" />
                    {t("pages.banners.saveChanges")}
                  </button>
                  <button
                    onClick={() => setEditingBanner(null)}
                    className="h-12 px-8 border-2 border-slate-300 text-slate-700 font-black rounded-2xl hover:bg-slate-100 hover:border-slate-400 transition-all"
                  >
                    {t("common.cancel")}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
