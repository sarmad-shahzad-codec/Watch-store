"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPkr } from "@/lib/formatCurrency";
import shopData from "@/components/Shop/shopData";
import { Product } from "@/types/product";
import {
  fetchProductsFromSupabase,
  updateProductPriceInSupabase,
  createProductInSupabase,
  updateProductInSupabase,
  deleteProductFromSupabase,
} from "@/utils/supabase/products";
import { refreshCachedProducts } from "@/hooks/useProducts";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  Save,
  Check,
  RefreshCw,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  DollarSign,
  Package,
  Truck,
  Tag,
  Info,
  TrendingUp,
  Percent,
  Layers,
  HelpCircle,
} from "lucide-react";

const BRAND_PRESETS = [
  "Tissot",
  "Rolex",
  "Hublot Diamond",
  "TAG Heuer",
  "Patek Philippe",
  "Cartier",
  "Audemars Piguet",
  "Omega",
  "Gloria Times",
];

const CATEGORY_PRESETS = [
  "Men's Automatic Watches",
  "Chronograph Sport",
  "Diamond Bezel Luxury",
  "Diver Luxury Watches",
  "Classic Dress Watches",
  "Prestige Haute Horlogerie",
  "Women's Luxury",
  "Automatic Skeleton",
];

const IMAGE_PRESETS = [
  { label: "Rolex Submariner", url: "/images/gloria/rolex-submariner-hero.jpg" },
  { label: "Rolex Jubilee", url: "/images/gloria/rolex-jubilee-hero.jpg" },
  { label: "Tissot PRX Blue", url: "/images/gloria/tissot-hero.jpg" },
  { label: "TAG Heuer Carrera", url: "/images/gloria/tag-hero.jpg" },
  { label: "Hublot Diamond", url: "/images/gloria/hublot-hero.jpg" },
  { label: "Patek Philippe Nautilus", url: "/images/gloria/patek-hero.jpg" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // In-line price adjustments: productId -> { price, discountedPrice, saving, saved }
  const [priceDrafts, setPriceDrafts] = useState<
    Record<number, { price: number; discountedPrice: number; saving?: boolean; saved?: boolean }>
  >({});

  // =========================================================
  // ADD PRODUCT MODAL STATE (Shopify Style with Cloudinary & Costs)
  // =========================================================
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBrand, setNewBrand] = useState("Rolex");
  const [customBrand, setCustomBrand] = useState("");
  const [newCategory, setNewCategory] = useState("Men's Automatic Watches");
  const [customCategory, setCustomCategory] = useState("");
  const [newSellingPrice, setNewSellingPrice] = useState<number | "">("");
  const [newComparePrice, setNewComparePrice] = useState<number | "">("");
  const [newCostPrice, setNewCostPrice] = useState<number | "">("");
  const [newPackingCost, setNewPackingCost] = useState<number | "">(150);
  const [newDeliveryCost, setNewDeliveryCost] = useState<number | "">(250);
  const [newImgUrl, setNewImgUrl] = useState("");
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCaseDiameter, setNewCaseDiameter] = useState("41 mm");
  const [newMovement, setNewMovement] = useState("Automatic Mechanical Movement");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // =========================================================
  // EDIT PRODUCT MODAL STATE
  // =========================================================
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editSellingPrice, setEditSellingPrice] = useState<number | "">("");
  const [editComparePrice, setEditComparePrice] = useState<number | "">("");
  const [editCostPrice, setEditCostPrice] = useState<number | "">("");
  const [editPackingCost, setEditPackingCost] = useState<number | "">(150);
  const [editDeliveryCost, setEditDeliveryCost] = useState<number | "">(250);
  const [editImgUrl, setEditImgUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Category management (Add / Delete with localStorage persistence)
  const [categoriesList, setCategoriesList] = useState<string[]>(CATEGORY_PRESETS);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [editCategoryInput, setEditCategoryInput] = useState("");
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [manageCategoryInput, setManageCategoryInput] = useState("");

  // Status Notification Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load categories from localStorage on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("gt_admin_categories_v2");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategoriesList(parsed);
          }
        }
      } catch (e) {
        console.error("Failed to load categories from localStorage:", e);
      }
    }
  }, []);

  // Save categories to state & localStorage
  const saveCategories = (cats: string[]) => {
    setCategoriesList(cats);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("gt_admin_categories_v2", JSON.stringify(cats));
      } catch (e) {
        console.error("Failed to save categories to localStorage:", e);
      }
    }
  };

  // Add a new category
  const handleAddCategory = (name: string, selectIn?: "add" | "edit"): boolean => {
    const trimmed = name.trim();
    if (!trimmed) {
      showToast("Please enter a category name.", "error");
      return false;
    }
    const exists = categoriesList.some(
      (c) => c.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      showToast(`Category "${trimmed}" already exists.`, "error");
      if (selectIn === "add") setNewCategory(trimmed);
      if (selectIn === "edit") setEditCategory(trimmed);
      return false;
    }
    const updated = [...categoriesList, trimmed];
    saveCategories(updated);
    if (selectIn === "add") setNewCategory(trimmed);
    if (selectIn === "edit") setEditCategory(trimmed);
    showToast(`✓ Category "${trimmed}" added!`, "success");
    return true;
  };

  // Delete an existing category
  const handleDeleteCategory = (catToDelete: string) => {
    if (categoriesList.length <= 1) {
      showToast("Cannot delete the last category. At least 1 must remain.", "error");
      return;
    }
    const updated = categoriesList.filter((c) => c !== catToDelete);
    saveCategories(updated);
    if (newCategory === catToDelete) {
      setNewCategory(updated[0] || "");
    }
    if (editCategory === catToDelete) {
      setEditCategory(updated[0] || "");
    }
    if (categoryFilter === catToDelete) {
      setCategoryFilter("all");
    }
    showToast(`Category "${catToDelete}" removed.`, "success");
  };

  // Reset categories to default presets
  const handleResetCategories = () => {
    const confirmed = typeof window !== "undefined" && window.confirm("Reset all categories back to default list?");
    if (confirmed) {
      const merged = Array.from(
        new Set([...CATEGORY_PRESETS, ...products.map((p) => p.category).filter(Boolean)])
      );
      saveCategories(merged);
      showToast("Categories reset to default list.", "success");
    }
  };

  // Load products from Supabase
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const dbProducts = await fetchProductsFromSupabase();
      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts);
        refreshCachedProducts(dbProducts);
        const drafts: Record<number, { price: number; discountedPrice: number }> = {};
        dbProducts.forEach((p) => {
          drafts[p.id] = { price: p.price, discountedPrice: p.discountedPrice };
        });
        setPriceDrafts(drafts);

        // Include any categories existing on products
        setCategoriesList((prev) => {
          const set = new Set(prev);
          dbProducts.forEach((p) => {
            if (p.category && p.category.trim()) set.add(p.category.trim());
          });
          const merged = Array.from(set);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("gt_admin_categories_v2", JSON.stringify(merged));
            } catch {}
          }
          return merged;
        });
      } else {
        setProducts(shopData);
        refreshCachedProducts(shopData);
        const drafts: Record<number, { price: number; discountedPrice: number }> = {};
        shopData.forEach((p) => {
          drafts[p.id] = { price: p.price, discountedPrice: p.discountedPrice };
        });
        setPriceDrafts(drafts);
      }
    } catch (e) {
      console.error("Failed to load products:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Unique categories in the current list + products
  const availableCategories = useMemo(() => {
    const set = new Set<string>(categoriesList);
    products.forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return Array.from(set);
  }, [categoriesList, products]);

  // Filtered list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(search.toLowerCase()));
      const matchesBrand =
        brandFilter === "all" ||
        p.brand.toLowerCase() === brandFilter.toLowerCase();
      const matchesCategory =
        categoryFilter === "all" ||
        (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());
      return matchesSearch && matchesBrand && matchesCategory;
    });
  }, [products, search, brandFilter, categoryFilter]);

  // Handle in-line price changes
  const handlePriceDraftChange = (
    productId: number,
    field: "price" | "discountedPrice",
    value: number
  ) => {
    setPriceDrafts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
        saved: false,
      },
    }));
  };

  // Save single product price to Supabase
  const handleSavePrice = async (product: Product) => {
    const draft = priceDrafts[product.id];
    if (!draft) return;

    setPriceDrafts((prev) => ({
      ...prev,
      [product.id]: { ...prev[product.id], saving: true },
    }));

    const res = await updateProductPriceInSupabase(
      product.id,
      draft.price,
      draft.discountedPrice
    );

    if (res.success) {
      const updated = products.map((p) =>
        p.id === product.id
          ? { ...p, price: draft.price, discountedPrice: draft.discountedPrice }
          : p
      );
      setProducts(updated);
      refreshCachedProducts(updated);
      setPriceDrafts((prev) => ({
        ...prev,
        [product.id]: { ...prev[product.id], saving: false, saved: true },
      }));
      showToast(`✓ Price updated for "${product.title}" in Supabase!`);
    } else {
      setPriceDrafts((prev) => ({
        ...prev,
        [product.id]: { ...prev[product.id], saving: false },
      }));
      showToast(res.error || "Failed to update price in Supabase", "error");
    }
  };

  // =========================================================
  // HANDLE ADD PRODUCT SUBMIT (Shopify Style)
  // =========================================================
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newSellingPrice === "" || newComparePrice === "") {
      setAddError("Please fill in Product Name, Selling Price, and Compare-With Price.");
      return;
    }

    setAddLoading(true);
    setAddError("");

    const finalBrand = newBrand === "custom" ? customBrand.trim() || "Gloria Times" : newBrand;
    let finalCategory = newCategory.trim();
    if (!finalCategory && newCategoryInput.trim()) {
      finalCategory = newCategoryInput.trim();
    }
    if (!finalCategory) {
      finalCategory = categoriesList[0] || "Men's Automatic Watches";
    }
    // Ensure finalCategory is saved in categoriesList
    if (!categoriesList.some((c) => c.toLowerCase() === finalCategory.toLowerCase())) {
      saveCategories([...categoriesList, finalCategory]);
    }
    const primaryImg = newImgUrl.trim() || "/images/gloria/tissot-hero.jpg";
    const galleryImg = newGalleryUrl.trim() || primaryImg;

    const newProdPayload = {
      title: newTitle.trim(),
      brand: finalBrand,
      category: finalCategory,
      price: Number(newComparePrice),
      discountedPrice: Number(newSellingPrice),
      costPrice: Number(newCostPrice) || 0,
      packingCost: Number(newPackingCost) || 0,
      deliveryCost: Number(newDeliveryCost) || 0,
      description:
        newDescription.trim() ||
        `${finalBrand} ${finalCategory} timepiece with high-grade stainless steel construction, scratch-resistant sapphire crystal, and 24-hour replacement guarantee.`,
      careNotes: "Store in protective watch box. Wipe gently with microfibre cloth.",
      reviews: 12,
      specs: [
        { label: "Brand", value: finalBrand },
        { label: "Category", value: finalCategory },
        { label: "Case diameter", value: newCaseDiameter || "41 mm" },
        { label: "Movement", value: newMovement || "Automatic Mechanical" },
        { label: "Crystal", value: "Sapphire crystal" },
        { label: "Case material", value: "Stainless steel" },
      ],
      imgs: {
        thumbnails: [primaryImg, galleryImg],
        previews: [primaryImg, galleryImg],
      },
    };

    const res = await createProductInSupabase(newProdPayload);

    if (res.success && res.product) {
      const updated = [res.product!, ...products];
      setProducts(updated);
      refreshCachedProducts(updated);
      setPriceDrafts((prev) => ({
        ...prev,
        [res.product!.id]: {
          price: res.product!.price,
          discountedPrice: res.product!.discountedPrice,
        },
      }));
      showToast(`✓ "${newTitle}" added to Supabase & Live Store!`);
      setIsAddModalOpen(false);

      // Reset form fields
      setNewTitle("");
      setNewSellingPrice("");
      setNewComparePrice("");
      setNewCostPrice("");
      setNewPackingCost(150);
      setNewDeliveryCost(250);
      setNewImgUrl("");
      setNewGalleryUrl("");
      setNewDescription("");
      setNewCategoryInput("");
      setCustomCategory("");
      setCustomBrand("");
    } else {
      setAddError(res.error || "Failed to create product in Supabase.");
    }
    setAddLoading(false);
  };

  // Open Edit Modal
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setEditTitle(p.title);
    setEditBrand(p.brand);
    setEditCategory(p.category || "Luxury Watches");
    setEditSellingPrice(p.discountedPrice);
    setEditComparePrice(p.price);
    setEditCostPrice(p.costPrice || 0);
    setEditPackingCost(p.packingCost ?? 150);
    setEditDeliveryCost(p.deliveryCost ?? 250);
    setEditImgUrl(p.imgs?.thumbnails?.[0] || "");
    setEditDescription(p.description);
  };

  // Handle Edit Submit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setEditLoading(true);
    const primaryImg = editImgUrl.trim() || editingProduct.imgs?.thumbnails?.[0] || "/images/rolex.webp";
    const updates: Partial<Product> = {
      title: editTitle.trim(),
      brand: editBrand.trim(),
      category: editCategory.trim(),
      price: Number(editComparePrice),
      discountedPrice: Number(editSellingPrice),
      costPrice: Number(editCostPrice),
      packingCost: Number(editPackingCost),
      deliveryCost: Number(editDeliveryCost),
      description: editDescription.trim(),
      imgs: {
        thumbnails: [primaryImg, primaryImg],
        previews: [primaryImg, primaryImg],
      },
    };

    const res = await updateProductInSupabase(editingProduct.id, updates);
    if (res.success) {
      const updated = products.map((p) =>
        p.id === editingProduct.id ? { ...p, ...updates } : p
      );
      setProducts(updated);
      refreshCachedProducts(updated);
      setPriceDrafts((prev) => ({
        ...prev,
        [editingProduct.id]: {
          price: Number(editComparePrice),
          discountedPrice: Number(editSellingPrice),
        },
      }));
      showToast(`✓ "${editTitle}" updated in Supabase!`);
      setEditingProduct(null);
    } else {
      showToast(res.error || "Failed to update product", "error");
    }
    setEditLoading(false);
  };

  // Handle Delete Product
  const handleDeleteProduct = async (p: Product) => {
    if (!window.confirm(`Are you sure you want to remove "${p.title}" from the store catalog?`)) {
      return;
    }

    const res = await deleteProductFromSupabase(p.id);
    if (res.success) {
      const updated = products.filter((item) => item.id !== p.id);
      setProducts(updated);
      refreshCachedProducts(updated);
      showToast(`Product "${p.title}" deleted from Supabase.`);
    } else {
      showToast(res.error || "Failed to delete product", "error");
    }
  };

  // Live calculations for Add Product Modal
  const addCalculations = useMemo(() => {
    const selling = typeof newSellingPrice === "number" ? newSellingPrice : 0;
    const compare = typeof newComparePrice === "number" ? newComparePrice : 0;
    const cost = typeof newCostPrice === "number" ? newCostPrice : 0;
    const packing = typeof newPackingCost === "number" ? newPackingCost : 0;
    const delivery = typeof newDeliveryCost === "number" ? newDeliveryCost : 0;

    const totalCost = cost + packing + delivery;
    const netProfit = selling > 0 ? selling - totalCost : 0;
    const marginPct = selling > 0 ? Math.round((netProfit / selling) * 100) : 0;
    const discountPct = compare > selling && compare > 0 ? Math.round(((compare - selling) / compare) * 100) : 0;

    return { totalCost, netProfit, marginPct, discountPct, selling, compare, cost, packing, delivery };
  }, [newSellingPrice, newComparePrice, newCostPrice, newPackingCost, newDeliveryCost]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all duration-300 ${
            toastMessage.type === "success"
              ? "bg-[#111] text-white border-black/20"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Bar — Shopify Style */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E8DFD4] pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#1F1209]">Products Catalog</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Supabase Live
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#6B5344]">
            Add watches with Cloudinary image URLs, categories, descriptions, selling prices, compare-at rates, packing & courier fees.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadProducts}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#DDD5CC] bg-white text-xs font-semibold text-[#4A3728] hover:bg-[#FAF8F5] transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>

          {/* Manage Categories Button */}
          <button
            type="button"
            onClick={() => setIsManageCategoriesOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#DDD5CC] bg-white text-xs font-semibold text-[#4A3728] hover:bg-[#FAF8F5] transition shadow-sm"
            title="Manage and configure product categories"
          >
            <Layers className="w-3.5 h-3.5 text-[#008060]" />
            <span>Categories ({categoriesList.length})</span>
          </button>

          {/* Primary Action: Add Product */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#008060] text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-[#006e52] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add product</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="rounded-xl border border-[#EDE4D8] bg-white p-3.5 sm:p-4 shadow-sm flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search by title, brand or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-[#DDD5CC] focus:outline-none focus:ring-2 focus:ring-[#008060]/30 focus:border-[#008060]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B5344] font-medium whitespace-nowrap">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs sm:text-sm rounded-lg border border-[#DDD5CC] bg-white text-[#2B1A0F] focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B5344] font-medium whitespace-nowrap">Brand:</span>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs sm:text-sm rounded-lg border border-[#DDD5CC] bg-white text-[#2B1A0F] focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
            >
              <option value="all">All Brands</option>
              {BRAND_PRESETS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-gray-500 whitespace-nowrap">
            Showing <strong className="text-gray-900">{filteredProducts.length}</strong> watches
          </span>
        </div>
      </div>

      {/* Products Table with Complete Economics */}
      <div className="overflow-hidden rounded-xl border border-[#E8DFD4] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#EDE4D8] bg-[#FAF8F5] text-[11px] uppercase tracking-[0.08em] text-[#6B5344]">
                <th className="px-4 py-3 font-semibold">Watch / Image</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Brand</th>
                <th className="px-4 py-3 font-semibold w-36">Compare-At</th>
                <th className="px-4 py-3 font-semibold w-40">Selling Price</th>
                <th className="px-4 py-3 font-semibold">Est. Costs</th>
                <th className="px-4 py-3 font-semibold">Net Profit</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-sm text-gray-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-gray-400" />
                    Connecting to Supabase and fetching luxury watches...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-sm text-gray-500">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const draft = priceDrafts[p.id] || { price: p.price, discountedPrice: p.discountedPrice };
                  const isModified =
                    draft.price !== p.price || draft.discountedPrice !== p.discountedPrice;
                  const discountPct =
                    draft.price > 0 && draft.price > draft.discountedPrice
                      ? Math.round(((draft.price - draft.discountedPrice) / draft.price) * 100)
                      : 0;

                  const cost = p.costPrice || 0;
                  const packing = p.packingCost ?? 150;
                  const delivery = p.deliveryCost ?? 250;
                  const totalCost = cost + packing + delivery;
                  const netProfit = draft.discountedPrice - totalCost;
                  const marginPct = draft.discountedPrice > 0 ? Math.round((netProfit / draft.discountedPrice) * 100) : 0;

                  return (
                    <tr key={p.id} className="hover:bg-[#FCFBF9] transition-colors group">
                      {/* Thumbnail & Title */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                            {p.imgs?.thumbnails?.[0] ? (
                              <Image
                                src={p.imgs.thumbnails[0]}
                                alt={p.title}
                                width={44}
                                height={44}
                                unoptimized={p.imgs.thumbnails[0].includes("cloudinary")}
                                className="object-contain"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="max-w-[240px]">
                            <span className="font-semibold text-gray-900 block leading-snug line-clamp-1">
                              {p.title}
                            </span>
                            <span className="text-[11px] text-gray-500">ID: #{p.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAF3E8] text-[#8B6914] border border-[#EADBBE]">
                          <Tag className="w-3 h-3" />
                          <span className="line-clamp-1 max-w-[140px]">{p.category || "Luxury Watches"}</span>
                        </span>
                      </td>

                      {/* Brand */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                          {p.brand}
                        </span>
                      </td>

                      {/* Compare-At / List Price (Inline editable) */}
                      <td className="px-4 py-3.5">
                        <div className="relative flex items-center">
                          <span className="text-xs text-gray-400 absolute left-2">Rs.</span>
                          <input
                            type="number"
                            min={0}
                            step={50}
                            value={draft.price}
                            onChange={(e) =>
                              handlePriceDraftChange(p.id, "price", Number(e.target.value))
                            }
                            className="w-full pl-8 pr-2 py-1.5 text-xs font-medium rounded-md border border-[#DDD5CC] bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#008060]"
                          />
                        </div>
                        {discountPct > 0 && (
                          <span className="text-[10px] text-[#E23737] font-bold block mt-0.5">
                            -{discountPct}% OFF on site
                          </span>
                        )}
                      </td>

                      {/* Selling Price (Customer Price) */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="relative flex-1 flex items-center">
                            <span className="text-xs text-[#008060] font-bold absolute left-2">Rs.</span>
                            <input
                              type="number"
                              min={0}
                              step={50}
                              value={draft.discountedPrice}
                              onChange={(e) =>
                                handlePriceDraftChange(p.id, "discountedPrice", Number(e.target.value))
                              }
                              className="w-full pl-8 pr-2 py-1.5 text-xs sm:text-sm font-bold text-[#1F1209] rounded-md border border-[#008060]/40 bg-emerald-50/20 focus:outline-none focus:ring-1 focus:ring-[#008060]"
                            />
                          </div>

                          {/* Quick Save Price */}
                          <button
                            type="button"
                            onClick={() => handleSavePrice(p)}
                            disabled={draft.saving}
                            title="Save price to Supabase"
                            className={`p-1.5 rounded-md border transition-all ${
                              isModified
                                ? "bg-[#008060] border-[#008060] text-white shadow-sm hover:bg-[#006e52] animate-bounce"
                                : draft.saved
                                ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                                : "bg-white border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {draft.saving ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : draft.saved ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Save className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Costs Breakdown */}
                      <td className="px-4 py-3.5 text-xs text-gray-600">
                        <div className="space-y-0.5">
                          <div>Buy: <strong className="text-gray-900">{formatPkr(cost)}</strong></div>
                          <div className="text-[11px] text-gray-500">
                            Box: {formatPkr(packing)} | Courier: {formatPkr(delivery)}
                          </div>
                        </div>
                      </td>

                      {/* Net Profit */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-bold ${
                              netProfit > 0 ? "text-emerald-700" : "text-red-600"
                            }`}
                          >
                            {netProfit > 0 ? `+${formatPkr(netProfit)}` : formatPkr(netProfit)}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-700 font-semibold">
                            {marginPct}%
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            title="Edit full product details"
                            className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-black transition"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            href={`/shop-details/${p.id}`}
                            target="_blank"
                            title="View product in live store"
                            className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-black transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p)}
                            title="Delete product"
                            className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SHOPIFY-STYLE ADD PRODUCT MODAL (With Cloudinary & Costs) */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#FAF8F5]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#008060] text-white flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Add New Watch</h2>
                  <p className="text-xs text-gray-600">
                    Creates watch in Supabase with Cloudinary image, category, costs & description.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddProduct} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
              {addError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {addError}
                </div>
              )}

              {/* 1. Name & Brand */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-800">
                  1. Watch Name & Brand <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tissot PRX 1853 Automatic Blue Dial"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008060]/30 focus:border-[#008060]"
                    />
                  </div>

                  <div>
                    <select
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
                    >
                      {BRAND_PRESETS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                      <option value="custom">+ Custom Brand</option>
                    </select>
                  </div>
                </div>

                {newBrand === "custom" && (
                  <input
                    type="text"
                    placeholder="Enter custom brand name..."
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-gray-300"
                  />
                )}
              </div>

              {/* 2. Category Section with Add & Delete Controls */}
              <div className="space-y-3 p-4 rounded-xl bg-[#FAF8F5] border border-gray-200">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#008060]" />
                    <span>2. Category (Shows on Website) <span className="text-red-500">*</span></span>
                  </label>
                  <span className="text-[11px] font-semibold text-[#008060] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {categoriesList.length} Categories Available
                  </span>
                </div>

                {/* Primary Category Dropdown */}
                <div>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Inline Add Category */}
                <div className="pt-2 border-t border-gray-200">
                  <span className="block text-[11px] font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5 text-[#008060]" />
                    <span>Create & Add New Category:</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type category name (e.g. Leather Strap Classics, Skeleton Watches)..."
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newCategoryInput.trim()) {
                            handleAddCategory(newCategoryInput, "add");
                            setNewCategoryInput("");
                          }
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newCategoryInput.trim()) {
                          handleAddCategory(newCategoryInput, "add");
                          setNewCategoryInput("");
                        }
                      }}
                      disabled={!newCategoryInput.trim()}
                      className="px-3.5 py-1.5 rounded-lg bg-[#008060] text-white text-xs font-bold hover:bg-[#006e52] disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 flex items-center gap-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Category</span>
                    </button>
                  </div>
                </div>

                {/* Active Categories Pills with ✕ Delete Option */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-gray-700 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-gray-500" />
                      <span>Active Categories (Click tag to select, click ✕ to delete):</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-white rounded-lg border border-gray-200">
                    {categoriesList.map((cat) => {
                      const isSelected = newCategory === cat;
                      return (
                        <div
                          key={cat}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                            isSelected
                              ? "bg-[#008060] text-white shadow-sm ring-2 ring-[#008060]/30"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setNewCategory(cat)}
                            className="hover:underline text-left cursor-pointer"
                            title={`Select "${cat}"`}
                          >
                            {cat}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (typeof window !== "undefined" && window.confirm(`Are you sure you want to delete category "${cat}"?`)) {
                                handleDeleteCategory(cat);
                              }
                            }}
                            title={`Delete category "${cat}"`}
                            className={`p-0.5 rounded hover:bg-black/15 transition cursor-pointer ${
                              isSelected ? "text-white/80 hover:text-white" : "text-gray-400 hover:text-red-600"
                            }`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. Cloudinary Picture Upload / URL */}
              <div className="space-y-3 p-4 rounded-xl bg-[#FAF8F5] border border-gray-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#008060]" />
                    3. Product Picture (Cloudinary URL)
                  </span>
                  <span className="text-[11px] font-normal text-[#6B5344]">Paste your Cloudinary image link</span>
                </label>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Live High-Res Image Preview */}
                  <div className="w-24 h-24 rounded-xl bg-white border border-gray-300 overflow-hidden shrink-0 flex items-center justify-center relative shadow-inner">
                    {newImgUrl.trim() ? (
                      <Image
                        src={newImgUrl.trim()}
                        alt="Preview"
                        width={96}
                        height={96}
                        unoptimized
                        className="object-contain w-full h-full p-1"
                        onError={(e) => {
                          // Fallback to placeholder if url is broken
                          (e.target as any).src = "/images/rolex.webp";
                        }}
                      />
                    ) : (
                      <div className="text-center p-2">
                        <ImageIcon className="w-6 h-6 mx-auto text-gray-300 mb-1" />
                        <span className="text-[9px] text-gray-400 block">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* URL Inputs */}
                  <div className="flex-1 w-full space-y-2">
                    <div>
                      <input
                        type="url"
                        placeholder="Paste Cloudinary URL (e.g. https://res.cloudinary.com/.../watch.jpg)"
                        value={newImgUrl}
                        onChange={(e) => setNewImgUrl(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
                      />
                      <span className="text-[10px] text-gray-500 block mt-1">
                        Primary picture shown on storefront catalog and product cards.
                      </span>
                    </div>

                    <div>
                      <input
                        type="url"
                        placeholder="Secondary gallery / dial picture URL (optional)"
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
                      />
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-gray-500 font-medium">Or choose existing preset:</span>
                      {IMAGE_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setNewImgUrl(preset.url)}
                          className={`text-[10px] px-2 py-0.5 rounded border transition ${
                            newImgUrl === preset.url
                              ? "bg-black text-white border-black"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Pricing & Full Economics (Selling Price, Compare-At, Cost, Packing, Delivery) */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-gray-200/80 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#008060]" />
                    4. Pricing & Cost Breakdown (Pakistani Rupees PKR)
                  </span>
                  <span className="text-[11px] font-normal text-gray-500">Shopify-grade margin calculator</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Selling Price */}
                  <div>
                    <label className="block text-xs font-bold text-[#008060] mb-1">
                      Selling Price (Sale) *
                    </label>
                    <div className="relative flex items-center">
                      <span className="text-xs text-[#008060] font-bold absolute left-3">Rs.</span>
                      <input
                        type="number"
                        required
                        min={0}
                        step={50}
                        placeholder="e.g. 3499"
                        value={newSellingPrice}
                        onChange={(e) =>
                          setNewSellingPrice(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        className="w-full pl-9 pr-3 py-2 text-sm font-bold text-[#1F1209] rounded-lg border border-[#008060]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 block mt-1">
                      Price customer actually pays
                    </span>
                  </div>

                  {/* Compare-With Price */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Compare-With Price *
                    </label>
                    <div className="relative flex items-center">
                      <span className="text-xs text-gray-400 absolute left-3">Rs.</span>
                      <input
                        type="number"
                        required
                        min={0}
                        step={50}
                        placeholder="e.g. 4850"
                        value={newComparePrice}
                        onChange={(e) =>
                          setNewComparePrice(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 block mt-1">
                      Original market rate (strikethrough)
                    </span>
                  </div>

                  {/* Cost Price */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Actual Cost (Buy / COGS)
                    </label>
                    <div className="relative flex items-center">
                      <span className="text-xs text-gray-400 absolute left-3">Rs.</span>
                      <input
                        type="number"
                        min={0}
                        step={50}
                        placeholder="e.g. 1600"
                        value={newCostPrice}
                        onChange={(e) =>
                          setNewCostPrice(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 block mt-1">
                      Your supplier purchase cost
                    </span>
                  </div>
                </div>

                {/* Packing Cost & Delivery Cost */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-amber-700" />
                      Packing Cost (Box, Cushion, Warranty Card)
                    </label>
                    <div className="relative flex items-center">
                      <span className="text-xs text-gray-400 absolute left-3">Rs.</span>
                      <input
                        type="number"
                        min={0}
                        step={10}
                        placeholder="150"
                        value={newPackingCost}
                        onChange={(e) =>
                          setNewPackingCost(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-blue-700" />
                      Delivery Cost (Trax Courier Allowance)
                    </label>
                    <div className="relative flex items-center">
                      <span className="text-xs text-gray-400 absolute left-3">Rs.</span>
                      <input
                        type="number"
                        min={0}
                        step={10}
                        placeholder="250"
                        value={newDeliveryCost}
                        onChange={(e) =>
                          setNewDeliveryCost(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-300 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Profit & Margin Summary Card */}
                <div className="p-3.5 rounded-lg bg-white border border-[#E8DFD4] shadow-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Unit Cost</span>
                      <strong className="text-xs sm:text-sm text-gray-800">
                        {formatPkr(addCalculations.totalCost)}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Customer Saves</span>
                      <strong className="text-xs sm:text-sm text-[#E23737]">
                        {addCalculations.discountPct > 0 ? `-${addCalculations.discountPct}%` : "Regular"}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Estimated Profit</span>
                      <strong
                        className={`text-xs sm:text-sm ${
                          addCalculations.netProfit > 0 ? "text-emerald-700" : "text-red-600"
                        }`}
                      >
                        {addCalculations.netProfit > 0
                          ? `+${formatPkr(addCalculations.netProfit)}`
                          : formatPkr(addCalculations.netProfit)}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Net Profit Margin</span>
                      <strong
                        className={`text-xs sm:text-sm ${
                          addCalculations.marginPct > 0 ? "text-emerald-700" : "text-gray-700"
                        }`}
                      >
                        {addCalculations.marginPct}%
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Product Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-800">
                    5. Description (Shows on Product Page & Cart)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setNewDescription(
                        `${newTitle || "Luxury timepiece"} crafted with precision engineering and timeless aesthetic. Features a solid stainless steel case, anti-reflective sapphire crystal, and high-precision mechanical movement. Delivered in a premium presentation box with 24-hour replacement guarantee and 1-year movement warranty.`
                      );
                    }}
                    className="text-[11px] text-[#008060] hover:underline font-medium"
                  >
                    + Use luxury template
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder="Detailed description of craftsmanship, dial texture, movement, water resistance, and warranty..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008060]/30 focus:border-[#008060]"
                />
              </div>

              {/* 6. Quick Specs (Case Diameter & Movement) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Case Diameter
                  </label>
                  <input
                    type="text"
                    value={newCaseDiameter}
                    onChange={(e) => setNewCaseDiameter(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Movement Type
                  </label>
                  <input
                    type="text"
                    value={newMovement}
                    onChange={(e) => setNewMovement(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#008060] text-white text-xs sm:text-sm font-bold hover:bg-[#006e52] shadow-sm transition disabled:opacity-50"
                >
                  {addLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Watch to Supabase</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT PRODUCT MODAL (Full Economics & Cloudinary) */}
      {/* ========================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#FAF8F5]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Edit Watch #{editingProduct.id}</h2>
                  <p className="text-xs text-gray-600">Update Cloudinary image, category, costs and description.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-black/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Brand
                  </label>
                  <select
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 bg-white"
                  >
                    {BRAND_PRESETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] font-semibold text-[#008060]">
                      {categoriesList.length} Categories
                    </span>
                  </div>

                  {/* Dropdown */}
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  {/* Inline quick add in Edit modal */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="Add new category..."
                      value={editCategoryInput}
                      onChange={(e) => setEditCategoryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (editCategoryInput.trim()) {
                            handleAddCategory(editCategoryInput, "edit");
                            setEditCategoryInput("");
                          }
                        }
                      }}
                      className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (editCategoryInput.trim()) {
                          handleAddCategory(editCategoryInput, "edit");
                          setEditCategoryInput("");
                        }
                      }}
                      disabled={!editCategoryInput.trim()}
                      className="px-2.5 py-1 text-xs font-bold bg-[#008060] text-white rounded-lg hover:bg-[#006e52] disabled:opacity-40 transition shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Cloudinary URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Image URL (Cloudinary or Local)
                </label>
                <input
                  type="text"
                  value={editImgUrl}
                  onChange={(e) => setEditImgUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-gray-300"
                />
              </div>

              {/* Pricing & Costs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-[#FAF8F5] border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-[#008060] mb-1">
                    Selling Price (Rs.)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={editSellingPrice}
                    onChange={(e) =>
                      setEditSellingPrice(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full px-3 py-1.5 text-xs sm:text-sm font-bold text-[#008060] rounded-lg border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Compare-At Price (Rs.)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={editComparePrice}
                    onChange={(e) =>
                      setEditComparePrice(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Cost Price (Buy)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={editCostPrice}
                    onChange={(e) =>
                      setEditCostPrice(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Packing Cost
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={editPackingCost}
                    onChange={(e) =>
                      setEditPackingCost(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Delivery Cost
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={editDeliveryCost}
                    onChange={(e) =>
                      setEditDeliveryCost(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-gray-300"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-black text-white text-xs sm:text-sm font-bold hover:bg-gray-800 transition"
                >
                  {editLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MANAGE CATEGORIES MODAL                               */}
      {/* ========================================================= */}
      {isManageCategoriesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#008060]/10 flex items-center justify-center text-[#008060]">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1F1209]">Manage Store Categories</h3>
                  <p className="text-xs text-[#6B5344]">
                    Add, edit, or delete categories shown on the website and product forms.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsManageCategoriesOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Add New Category Form */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#008060]" />
                  <span>Create New Category</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter category name (e.g. Vintage Leather, Chrono Sport)..."
                    value={manageCategoryInput}
                    onChange={(e) => setManageCategoryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (manageCategoryInput.trim()) {
                          handleAddCategory(manageCategoryInput);
                          setManageCategoryInput("");
                        }
                      }
                    }}
                    className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (manageCategoryInput.trim()) {
                        handleAddCategory(manageCategoryInput);
                        setManageCategoryInput("");
                      }
                    }}
                    disabled={!manageCategoryInput.trim()}
                    className="px-4 py-2 rounded-lg bg-[#008060] text-white text-xs sm:text-sm font-bold hover:bg-[#006e52] disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                  </button>
                </div>
              </div>

              {/* Categories List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-600 px-1">
                  <span>Available Categories ({categoriesList.length})</span>
                  <span>Products in Catalog</span>
                </div>

                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-white max-h-72 overflow-y-auto">
                  {categoriesList.map((cat, idx) => {
                    const productCount = products.filter(
                      (p) => p.category && p.category.toLowerCase() === cat.toLowerCase()
                    ).length;

                    return (
                      <div
                        key={cat}
                        className="px-4 py-2.5 flex items-center justify-between hover:bg-[#FAF8F5] transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-gray-400 w-4">
                            {idx + 1}.
                          </span>
                          <span className="text-sm font-medium text-gray-800">
                            {cat}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                            {productCount} {productCount === 1 ? "watch" : "watches"}
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              if (
                                typeof window !== "undefined" &&
                                window.confirm(
                                  productCount > 0
                                    ? `Category "${cat}" currently has ${productCount} watch(es). Are you sure you want to remove it from category options?`
                                    : `Delete category "${cat}"?`
                                )
                              ) {
                                handleDeleteCategory(cat);
                              }
                            }}
                            title={`Delete category "${cat}"`}
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetCategories}
                className="text-xs text-gray-500 hover:text-red-600 underline transition cursor-pointer"
              >
                Reset to Default Categories
              </button>
              <button
                type="button"
                onClick={() => setIsManageCategoriesOpen(false)}
                className="px-4 py-2 rounded-lg bg-black text-white text-xs sm:text-sm font-bold hover:bg-gray-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
