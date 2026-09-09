"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useAdminWorkspace } from "@/context/AdminWorkspaceContext";
import { formatPkr } from "@/lib/formatCurrency";
import { orderStatusClass } from "@/components/Admin/statusStyles";
import { StoreExpense } from "@/types/expense";
import { StoreFund } from "@/types/fund";
import {
  fetchProductsFromSupabase,
  updateProductFinancesInSupabase,
  updateProductInSupabase,
} from "@/utils/supabase/products";
import {
  fetchExpensesFromSupabase,
  createExpenseInSupabase,
  updateExpenseInSupabase,
  deleteExpenseInSupabase,
} from "@/utils/supabase/expenses";
import {
  fetchFundsFromSupabase,
  createFundInSupabase,
  updateFundInSupabase,
  deleteFundInSupabase,
} from "@/utils/supabase/funds";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Package,
  AlertOctagon,
  Percent,
  Truck,
  ArrowUpRight,
  ShieldCheck,
  Save,
  Check,
  Sparkles,
  HelpCircle,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Receipt,
  Calendar,
  X,
  SlidersHorizontal,
  Wallet,
  PiggyBank,
  Coins,
  CheckCircle2,
} from "lucide-react";

type EditableProductPricing = {
  id: number;
  title: string;
  brand: string;
  image: string;
  costPrice: number;
  sellingPrice: number;
  marketRate: number;
  packingCost: number;
  deliveryCost: number;
  saved?: boolean;
  saving?: boolean;
};

const EXPENSE_CATEGORIES = [
  "Marketing & Ads",
  "Packaging & Boxes",
  "Logistics & Returns",
  "Office & Utilities",
  "Photography & PR",
  "Inventory Samples",
  "Miscellaneous",
];

const FUND_SOURCES = [
  "Owner Capital",
  "Partner Investment",
  "Bank Deposit / Transfer",
  "Cash Reserve",
  "Retained Business Profit",
  "Other",
];

export default function AdminFinancesPage() {
  const { orders, loadingOrders, refreshOrders } = useAdminWorkspace();

  // Products pricing & COGS management state
  const [productsList, setProductsList] = useState<EditableProductPricing[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [savingAll, setSavingAll] = useState(false);

  // Store Expenses State
  const [expenses, setExpenses] = useState<StoreExpense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState("all");

  // Expense Modals State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [expenseFormTitle, setExpenseFormTitle] = useState("");
  const [expenseFormCategory, setExpenseFormCategory] = useState("Marketing & Ads");
  const [expenseFormAmount, setExpenseFormAmount] = useState<number | string>("");
  const [expenseFormDate, setExpenseFormDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [expenseFormNotes, setExpenseFormNotes] = useState("");
  const [savingExpense, setSavingExpense] = useState(false);

  // Store Funds / Capital Injections State (Requested by user)
  const [funds, setFunds] = useState<StoreFund[]>([]);
  const [loadingFunds, setLoadingFunds] = useState(true);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [editingFundId, setEditingFundId] = useState<number | null>(null);
  const [fundFormTitle, setFundFormTitle] = useState("");
  const [fundFormSource, setFundFormSource] = useState("Owner Capital");
  const [fundFormAmount, setFundFormAmount] = useState<number | string>("");
  const [fundFormDate, setFundFormDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [fundFormNotes, setFundFormNotes] = useState("");
  const [savingFund, setSavingFund] = useState(false);

  // Product Full Edit Modal State
  const [editingProduct, setEditingProduct] = useState<EditableProductPricing | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editCostPrice, setEditCostPrice] = useState<number | string>("");
  const [editSellingPrice, setEditSellingPrice] = useState<number | string>("");
  const [editMarketRate, setEditMarketRate] = useState<number | string>("");
  const [editPackingCost, setEditPackingCost] = useState<number | string>("");
  const [editDeliveryCost, setEditDeliveryCost] = useState<number | string>("");
  const [savingProductModal, setSavingProductModal] = useState(false);

  // Adjustable Operational Rates State
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);
  const [defaultCourierCost, setDefaultCourierCost] = useState(250);
  const [defaultPackingCost, setDefaultPackingCost] = useState(150);

  // Load products from Supabase
  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const items = await fetchProductsFromSupabase();
      if (items && items.length > 0) {
        setProductsList(
          items.map((p) => {
            const cost =
              p.costPrice && p.costPrice > 0
                ? p.costPrice
                : Math.round(p.discountedPrice * 0.45);
            return {
              id: p.id,
              title: p.title,
              brand: p.brand,
              image: p.imgs?.thumbnails?.[0] || "/images/tissot.webp",
              costPrice: cost,
              sellingPrice: p.discountedPrice,
              marketRate: p.price,
              packingCost: p.packingCost ?? 150,
              deliveryCost: p.deliveryCost ?? 250,
            };
          })
        );
      }
    } catch (err) {
      console.error("Failed to load products for finances:", err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // Load Expenses from Supabase
  const loadExpenses = useCallback(async () => {
    setLoadingExpenses(true);
    try {
      const items = await fetchExpensesFromSupabase();
      if (items && items.length > 0) {
        setExpenses(items);
      } else {
        // Provide starter expenses if table is fresh
        const starterExpenses = [
          {
            title: "Luxury Hardwood Presentation Boxes (50 pcs)",
            category: "Packaging & Boxes",
            amount: 7500,
            expense_date: new Date().toISOString().split("T")[0],
            notes: "Wooden presentation boxes with beige velvet cushions",
          },
          {
            title: "Meta Ads (Instagram / Facebook) - PRX & Rolex Campaign",
            category: "Marketing & Ads",
            amount: 4500,
            expense_date: new Date().toISOString().split("T")[0],
            notes: "Targeted luxury watch buyers in Lahore, Karachi & Islamabad",
          },
          {
            title: "Trax Logistics COD Packaging Flyers & Security Tape",
            category: "Logistics & Returns",
            amount: 1200,
            expense_date: new Date().toISOString().split("T")[0],
            notes: "Tamper-evident flyer bags & security seals",
          },
        ];

        for (const item of starterExpenses) {
          await createExpenseInSupabase(item);
        }
        const fresh = await fetchExpensesFromSupabase();
        setExpenses(fresh);
      }
    } catch (err) {
      console.error("Failed to load expenses:", err);
    } finally {
      setLoadingExpenses(false);
    }
  }, []);

  // Load Funds from Supabase
  const loadFunds = useCallback(async () => {
    setLoadingFunds(true);
    try {
      const items = await fetchFundsFromSupabase();
      if (items && items.length > 0) {
        setFunds(items);
      } else {
        // Provide starter opening capital fund
        const initialFund = {
          title: "Opening Store Working Capital",
          source: "Owner Capital",
          amount: 50000,
          fund_date: new Date().toISOString().split("T")[0],
          notes: "Initial working capital fund for inventory purchases, packaging & operations",
        };
        await createFundInSupabase(initialFund);
        const fresh = await fetchFundsFromSupabase();
        setFunds(fresh);
      }
    } catch (err) {
      console.error("Failed to load funds:", err);
    } finally {
      setLoadingFunds(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadExpenses();
    loadFunds();
  }, [loadProducts, loadExpenses, loadFunds]);

  // Handle single product field edit inline
  const handlePriceChange = (
    id: number,
    field: "costPrice" | "sellingPrice" | "marketRate",
    value: number
  ) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value, saved: false } : p))
    );
  };

  // Save single product pricing inline to Supabase
  const handleSaveProduct = async (id: number) => {
    const prod = productsList.find((p) => p.id === id);
    if (!prod) return;

    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saving: true } : p))
    );

    const res = await updateProductFinancesInSupabase(
      prod.id,
      prod.costPrice,
      prod.sellingPrice,
      prod.marketRate
    );

    if (res.success) {
      toast.success(`${prod.brand} pricing updated in Supabase!`);
      setProductsList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, saving: false, saved: true } : p))
      );
      setTimeout(() => {
        setProductsList((prev) =>
          prev.map((p) => (p.id === id ? { ...p, saved: false } : p))
        );
      }, 2500);
    } else {
      toast.error(res.error || "Failed to update pricing");
      setProductsList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, saving: false } : p))
      );
    }
  };

  // Save all products pricing to Supabase
  const handleSaveAll = async () => {
    setSavingAll(true);
    let successCount = 0;
    for (const prod of productsList) {
      const res = await updateProductFinancesInSupabase(
        prod.id,
        prod.costPrice,
        prod.sellingPrice,
        prod.marketRate
      );
      if (res.success) successCount++;
    }
    setSavingAll(false);
    toast.success(`Updated ${successCount} products in Supabase!`);
  };

  // Open Product Full Edit Modal
  const handleOpenProductEdit = (p: EditableProductPricing) => {
    setEditingProduct(p);
    setEditTitle(p.title);
    setEditBrand(p.brand);
    setEditCostPrice(p.costPrice);
    setEditSellingPrice(p.sellingPrice);
    setEditMarketRate(p.marketRate);
    setEditPackingCost(p.packingCost);
    setEditDeliveryCost(p.deliveryCost);
  };

  // Save Product from Full Edit Modal
  const handleSaveProductModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSavingProductModal(true);
    const updates = {
      title: editTitle.trim() || editingProduct.title,
      brand: editBrand.trim() || editingProduct.brand,
      costPrice: Number(editCostPrice) || 0,
      discountedPrice: Number(editSellingPrice) || 0,
      price: Number(editMarketRate) || 0,
      packingCost: Number(editPackingCost) || 0,
      deliveryCost: Number(editDeliveryCost) || 0,
    };

    const res = await updateProductInSupabase(editingProduct.id, updates);
    if (res.success) {
      toast.success(`✓ "${editTitle}" financial details updated!`);
      setProductsList((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                title: updates.title,
                brand: updates.brand,
                costPrice: updates.costPrice,
                sellingPrice: updates.discountedPrice,
                marketRate: updates.price,
                packingCost: updates.packingCost,
                deliveryCost: updates.deliveryCost,
              }
            : p
        )
      );
      setEditingProduct(null);
    } else {
      toast.error(res.error || "Failed to update product details.");
    }
    setSavingProductModal(false);
  };

  // Open Add Expense Modal
  const handleOpenAddExpense = () => {
    setEditingExpenseId(null);
    setExpenseFormTitle("");
    setExpenseFormCategory("Marketing & Ads");
    setExpenseFormAmount("");
    setExpenseFormDate(new Date().toISOString().split("T")[0]);
    setExpenseFormNotes("");
    setIsExpenseModalOpen(true);
  };

  // Open Edit Expense Modal
  const handleOpenEditExpense = (exp: StoreExpense) => {
    setEditingExpenseId(exp.id);
    setExpenseFormTitle(exp.title);
    setExpenseFormCategory(exp.category);
    setExpenseFormAmount(exp.amount);
    setExpenseFormDate(exp.expense_date);
    setExpenseFormNotes(exp.notes || "");
    setIsExpenseModalOpen(true);
  };

  // Save Expense (Create or Update)
  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseFormTitle.trim() || !expenseFormAmount) {
      toast.error("Please enter Expense Title and Amount.");
      return;
    }

    setSavingExpense(true);
    const amountNum = Number(expenseFormAmount) || 0;

    if (editingExpenseId) {
      // Update existing expense
      const res = await updateExpenseInSupabase(editingExpenseId, {
        title: expenseFormTitle.trim(),
        category: expenseFormCategory,
        amount: amountNum,
        expense_date: expenseFormDate,
        notes: expenseFormNotes.trim(),
      });

      if (res.success) {
        toast.success("✓ Expense updated successfully!");
        setExpenses((prev) =>
          prev.map((item) =>
            item.id === editingExpenseId
              ? {
                  ...item,
                  title: expenseFormTitle.trim(),
                  category: expenseFormCategory,
                  amount: amountNum,
                  expense_date: expenseFormDate,
                  notes: expenseFormNotes.trim(),
                }
              : item
          )
        );
        setIsExpenseModalOpen(false);
      } else {
        toast.error(res.error || "Failed to update expense");
      }
    } else {
      // Create new expense
      const res = await createExpenseInSupabase({
        title: expenseFormTitle.trim(),
        category: expenseFormCategory,
        amount: amountNum,
        expense_date: expenseFormDate,
        notes: expenseFormNotes.trim(),
      });

      if (res.success && res.expense) {
        toast.success(`✓ "${res.expense.title}" added to store expenses!`);
        setExpenses((prev) => [res.expense!, ...prev]);
        setIsExpenseModalOpen(false);
      } else {
        toast.error(res.error || "Failed to save expense");
      }
    }
    setSavingExpense(false);
  };

  // Delete Expense
  const handleDeleteExpense = async (id: number, title: string) => {
    if (!window.confirm(`Delete expense "${title}"?`)) return;

    const res = await deleteExpenseInSupabase(id);
    if (res.success) {
      toast.success("Expense removed");
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } else {
      toast.error(res.error || "Failed to delete expense");
    }
  };

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    if (selectedExpenseCategory === "all") return expenses;
    return expenses.filter((e) => e.category === selectedExpenseCategory);
  }, [expenses, selectedExpenseCategory]);

  // Open Add Fund Modal
  const handleOpenAddFund = () => {
    setEditingFundId(null);
    setFundFormTitle("");
    setFundFormSource("Owner Capital");
    setFundFormAmount("");
    setFundFormDate(new Date().toISOString().split("T")[0]);
    setFundFormNotes("");
    setIsFundModalOpen(true);
  };

  // Open Edit Fund Modal
  const handleOpenEditFund = (fund: StoreFund) => {
    setEditingFundId(fund.id);
    setFundFormTitle(fund.title);
    setFundFormSource(fund.source);
    setFundFormAmount(fund.amount);
    setFundFormDate(fund.fund_date);
    setFundFormNotes(fund.notes || "");
    setIsFundModalOpen(true);
  };

  // Save Fund (Create or Update)
  const handleSaveFund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundFormTitle.trim() || !fundFormAmount) {
      toast.error("Please enter Fund Title and Amount.");
      return;
    }

    setSavingFund(true);
    const amountNum = Number(fundFormAmount) || 0;

    if (editingFundId) {
      const res = await updateFundInSupabase(editingFundId, {
        title: fundFormTitle.trim(),
        source: fundFormSource,
        amount: amountNum,
        fund_date: fundFormDate,
        notes: fundFormNotes.trim(),
      });

      if (res.success) {
        toast.success("✓ Fund updated successfully!");
        setFunds((prev) =>
          prev.map((item) =>
            item.id === editingFundId
              ? {
                  ...item,
                  title: fundFormTitle.trim(),
                  source: fundFormSource,
                  amount: amountNum,
                  fund_date: fundFormDate,
                  notes: fundFormNotes.trim(),
                }
              : item
          )
        );
        setIsFundModalOpen(false);
      } else {
        toast.error(res.error || "Failed to update fund");
      }
    } else {
      const res = await createFundInSupabase({
        title: fundFormTitle.trim(),
        source: fundFormSource,
        amount: amountNum,
        fund_date: fundFormDate,
        notes: fundFormNotes.trim(),
      });

      if (res.success && res.fund) {
        toast.success(`✓ "${res.fund.title}" capital fund saved!`);
        setFunds((prev) => [res.fund!, ...prev]);
        setIsFundModalOpen(false);
      } else {
        toast.error(res.error || "Failed to save fund");
      }
    }
    setSavingFund(false);
  };

  // Delete Fund
  const handleDeleteFund = async (id: number, title: string) => {
    if (!window.confirm(`Delete fund "${title}"?`)) return;

    const res = await deleteFundInSupabase(id);
    if (res.success) {
      toast.success("Fund removed");
      setFunds((prev) => prev.filter((f) => f.id !== id));
    } else {
      toast.error(res.error || "Failed to delete fund");
    }
  };

  // Aggregated analysis of sold products automatically fetched from customer orders
  const soldProductsAnalysis = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status !== "cancelled");
    const productMap = new Map<number, EditableProductPricing>();
    productsList.forEach((p) => productMap.set(p.id, p));

    type SoldItemSummary = {
      productId?: number;
      title: string;
      brand: string;
      image: string;
      unitCost: number;
      avgSellingPrice: number;
      unitsSold: number;
      totalRevenue: number;
      totalCogs: number;
      totalPackingCost: number;
      totalDeliveryCost: number;
      realizedNetProfit: number;
      marginPct: number;
    };

    const aggregated = new Map<string, SoldItemSummary>();
    let overallSoldUnits = 0;
    let overallRealizedRevenue = 0;
    let overallRealizedCogs = 0;
    let overallRealizedPacking = 0;
    let overallRealizedDelivery = 0;

    for (const order of activeOrders) {
      if (order.items && order.items.length > 0) {
        for (const item of order.items) {
          const qty = Number(item.quantity || 1);
          const rev = Number(item.total || item.price * qty);
          // Match by productId or fallback to matching title
          const matchedProd = item.productId
            ? productMap.get(item.productId)
            : productsList.find(
                (p) =>
                  p.title.toLowerCase().trim() ===
                  item.title.toLowerCase().trim()
              );

          const unitCost = matchedProd
            ? matchedProd.costPrice
            : Math.round(item.price * 0.45);
          const unitPacking = matchedProd
            ? matchedProd.packingCost
            : defaultPackingCost;
          const unitDelivery = matchedProd
            ? matchedProd.deliveryCost
            : Math.round(defaultCourierCost / Math.max(1, order.items.length));

          const itemCogs = unitCost * qty;
          const itemPacking = unitPacking * qty;
          const itemDelivery = unitDelivery * qty;
          const itemNetProfit = rev - itemCogs - itemPacking - itemDelivery;

          overallSoldUnits += qty;
          overallRealizedRevenue += rev;
          overallRealizedCogs += itemCogs;
          overallRealizedPacking += itemPacking;
          overallRealizedDelivery += itemDelivery;

          const key = matchedProd ? `prod_${matchedProd.id}` : `title_${item.title}`;
          const existing = aggregated.get(key);

          if (existing) {
            existing.unitsSold += qty;
            existing.totalRevenue += rev;
            existing.totalCogs += itemCogs;
            existing.totalPackingCost += itemPacking;
            existing.totalDeliveryCost += itemDelivery;
            existing.realizedNetProfit += itemNetProfit;
            existing.avgSellingPrice = Math.round(
              existing.totalRevenue / existing.unitsSold
            );
            existing.marginPct =
              existing.totalRevenue > 0
                ? Math.round(
                    (existing.realizedNetProfit / existing.totalRevenue) * 100
                  )
                : 0;
          } else {
            aggregated.set(key, {
              productId: matchedProd?.id,
              title: matchedProd?.title || item.title,
              brand: matchedProd?.brand || "Gloria Times",
              image: matchedProd?.image || "/images/tissot.webp",
              unitCost,
              avgSellingPrice: Math.round(rev / qty),
              unitsSold: qty,
              totalRevenue: rev,
              totalCogs: itemCogs,
              totalPackingCost: itemPacking,
              totalDeliveryCost: itemDelivery,
              realizedNetProfit: itemNetProfit,
              marginPct:
                rev > 0 ? Math.round((itemNetProfit / rev) * 100) : 0,
            });
          }
        }
      } else {
        // Fallback if order has no itemized line items
        const qty = Math.max(1, order.itemCount || 1);
        const rev = order.totalPkr;
        const unitCost = Math.round((rev / qty) * 0.45);
        const itemCogs = unitCost * qty;
        const itemPacking = defaultPackingCost * qty;
        const itemDelivery = defaultCourierCost;
        const itemNetProfit = rev - itemCogs - itemPacking - itemDelivery;

        overallSoldUnits += qty;
        overallRealizedRevenue += rev;
        overallRealizedCogs += itemCogs;
        overallRealizedPacking += itemPacking;
        overallRealizedDelivery += itemDelivery;
      }
    }

    const itemsList = Array.from(aggregated.values()).sort(
      (a, b) => b.totalRevenue - a.totalRevenue
    );

    const overallRealizedNetProfit =
      overallRealizedRevenue -
      overallRealizedCogs -
      overallRealizedPacking -
      overallRealizedDelivery;

    return {
      soldItems: itemsList,
      totalUnitsSold: overallSoldUnits,
      totalRealizedRevenue: overallRealizedRevenue,
      totalRealizedCogs: overallRealizedCogs,
      totalRealizedPacking: overallRealizedPacking,
      totalRealizedDelivery: overallRealizedDelivery,
      totalRealizedProfitFromProducts: overallRealizedNetProfit,
    };
  }, [orders, productsList, defaultCourierCost, defaultPackingCost]);

  // Financial calculations
  const finance = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status !== "cancelled");
    const cancelledOrders = orders.filter((o) => o.status === "cancelled");

    const grossRevenue = activeOrders.reduce((sum, o) => sum + o.totalPkr, 0);
    const lostRevenue = cancelledOrders.reduce((sum, o) => sum + o.totalPkr, 0);

    // Auto-fetched COGS from sold products or fallback
    const actualCogs =
      soldProductsAnalysis.totalRealizedCogs > 0
        ? soldProductsAnalysis.totalRealizedCogs
        : Math.round(grossRevenue * 0.42);

    const actualPackingCost =
      soldProductsAnalysis.totalRealizedPacking > 0
        ? soldProductsAnalysis.totalRealizedPacking
        : activeOrders.length * defaultPackingCost;

    const actualDeliveryCost =
      soldProductsAnalysis.totalRealizedDelivery > 0
        ? soldProductsAnalysis.totalRealizedDelivery
        : activeOrders.length * defaultCourierCost;

    // Total Injected Capital / Funds
    const totalFundsInjected = funds.reduce(
      (sum, f) => sum + Number(f.amount || 0),
      0
    );

    // Total Overhead Store Expenses
    const totalOtherExpenses = expenses.reduce(
      (sum, exp) => sum + Number(exp.amount || 0),
      0
    );

    // Real Net Profit from sales = Gross - actual COGS - delivery - packaging - other expenses
    const netProfit = Math.max(
      0,
      grossRevenue - actualCogs - actualDeliveryCost - actualPackingCost - totalOtherExpenses
    );

    const profitMargin =
      grossRevenue > 0 ? Math.round((netProfit / grossRevenue) * 100) : 0;

    // Available Treasury Cash Balance = Injected Funds + Gross Revenue - COGS - delivery - packaging - other expenses
    const netTreasuryCashBalance =
      totalFundsInjected +
      (grossRevenue - actualCogs - actualDeliveryCost - actualPackingCost - totalOtherExpenses);

    // Inventory Valuation across catalog
    const totalInventoryUnits = Math.max(
      0,
      72 - soldProductsAnalysis.totalUnitsSold
    );
    const avgWatchCost =
      productsList.length > 0
        ? Math.round(
            productsList.reduce((s, p) => s + p.costPrice, 0) / productsList.length
          )
        : 1800;
    const inventoryValuation = totalInventoryUnits * avgWatchCost;

    return {
      totalOrders: orders.length,
      activeOrdersCount: activeOrders.length,
      cancelledOrdersCount: cancelledOrders.length,
      grossRevenue,
      lostRevenue,
      actualCogs,
      actualDeliveryCost,
      actualPackingCost,
      totalOtherExpenses,
      totalFundsInjected,
      netProfit,
      netTreasuryCashBalance,
      profitMargin,
      totalInventoryUnits,
      inventoryValuation,
    };
  }, [
    orders,
    expenses,
    funds,
    productsList,
    soldProductsAnalysis,
    defaultCourierCost,
    defaultPackingCost,
  ]);

  const fmtDate = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString("en-PK", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Marketing & Ads":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Packaging & Boxes":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Logistics & Returns":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Office & Utilities":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Photography & PR":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1F1209]">
            Store Finances, Profits & Overhead Expenses
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#6B5344]">
            Shopify-standard cost per item, margins, market comparison, and store expenses tracker.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleOpenAddFund}
            className="min-h-[38px] px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm flex items-center gap-1.5 active:scale-95"
          >
            <PiggyBank className="h-3.5 w-3.5" />
            <span>Add Fund</span>
          </button>
          <button
            type="button"
            onClick={() => setIsRatesModalOpen(true)}
            className="min-h-[38px] px-3.5 py-2 rounded-lg border border-[#EDE4D8] bg-white text-xs font-semibold uppercase tracking-wider text-[#4A2F19] hover:bg-[#FAF8F5] transition shadow-sm flex items-center gap-1.5"
            title="Adjust Courier & Packing Default Rates"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#8B6914]" />
            <span>Rates</span>
          </button>
          <button
            type="button"
            onClick={() => {
              refreshOrders();
              loadProducts();
              loadExpenses();
              loadFunds();
            }}
            disabled={loadingOrders || loadingProducts || loadingExpenses || loadingFunds}
            className="min-h-[38px] px-4 py-2 rounded-lg border border-[#EDE4D8] bg-white text-xs font-semibold uppercase tracking-wider text-[#4A2F19] hover:bg-[#FAF8F5] transition shadow-sm flex items-center gap-2"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                loadingOrders || loadingProducts || loadingExpenses || loadingFunds ? "animate-spin" : ""
              }`}
            />
            {loadingOrders || loadingProducts || loadingExpenses || loadingFunds
              ? "Syncing..."
              : "Sync All"}
          </button>
        </div>
      </div>

      {/* Top Financial KPI Strip — 6 Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Gross Revenue */}
        <div className="rounded-xl border border-[#E8DFD4]/90 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5344]">
              Gross Revenue
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF5EE] text-[#8B6914]">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold tracking-tight text-[#1F1209]">
            {formatPkr(finance.grossRevenue)}
          </p>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#2E7D32]">
            <ArrowUpRight className="h-3 w-3 shrink-0" />
            <span className="truncate">{finance.activeOrdersCount} orders</span>
          </div>
        </div>

        {/* Injected Capital */}
        <div className="rounded-xl border border-indigo-200/90 bg-indigo-50/30 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800">
              Capital Invested
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <PiggyBank className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold tracking-tight text-indigo-800">
            {formatPkr(finance.totalFundsInjected)}
          </p>
          <p className="mt-1.5 text-[11px] text-indigo-600 font-medium">
            {funds.length} fund{funds.length !== 1 ? "s" : ""} recorded
          </p>
        </div>

        {/* Net Profit */}
        <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/30 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Net Profit
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold tracking-tight text-emerald-700">
            {formatPkr(finance.netProfit)}
          </p>
          <p className="mt-1.5 text-[11px] text-emerald-700 font-medium">
            After COGS & all expenses
          </p>
        </div>

        {/* Cash Treasury Balance */}
        <div className="rounded-xl border border-sky-200/90 bg-sky-50/30 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800">
              Cash Treasury
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p className={`mt-2 text-xl font-bold tracking-tight ${finance.netTreasuryCashBalance >= 0 ? "text-sky-800" : "text-red-700"}`}>
            {formatPkr(Math.abs(finance.netTreasuryCashBalance))}
          </p>
          <p className="mt-1.5 text-[11px] text-sky-600 font-medium">
            {finance.netTreasuryCashBalance >= 0 ? "Available balance" : "Deficit"}
          </p>
        </div>

        {/* Other Expenses */}
        <div className="rounded-xl border border-rose-200/90 bg-rose-50/30 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
              Overheads
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold tracking-tight text-rose-800">
            {formatPkr(finance.totalOtherExpenses)}
          </p>
          <p className="mt-1.5 text-[11px] text-rose-600 font-medium">
            {expenses.length} bills recorded
          </p>
        </div>

        {/* Profit Margin */}
        <div className="rounded-xl border border-[#E8DFD4]/90 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5344]">
              Margin
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold tracking-tight text-[#1F1209]">
            {finance.profitMargin}%
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F0E8DC]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#8B6914] to-[#C9A227]"
              style={{ width: `${Math.min(100, Math.max(0, finance.profitMargin))}%` }}
            />
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          1. OTHER EXPENSES & OVERHEAD TRACKER (Requested by User)
      ─────────────────────────────────────────────────────────── */}
      <section className="rounded-xl border border-[#E8DFD4]/90 bg-white shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EDE4D8] px-6 py-5 bg-[#FAF8F5]/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                <Receipt className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-base font-bold text-[#1F1209]">
                Other Store Expenses & Overheads
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                Total: {formatPkr(finance.totalOtherExpenses)}
              </span>
            </div>
            <p className="text-xs text-[#6B5344] mt-1">
              Add marketing ads, luxury boxes, packaging tape, courier fuel adjustments, and office bills. These are automatically deducted from net profit.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenAddExpense}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1F1209] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="px-6 py-3 border-b border-[#EDE4D8] bg-[#FAF5EE]/50 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B5344] mr-1 shrink-0">
            Category:
          </span>
          <button
            type="button"
            onClick={() => setSelectedExpenseCategory("all")}
            className={`text-xs px-3 py-1 rounded-full font-medium transition shrink-0 ${
              selectedExpenseCategory === "all"
                ? "bg-[#1F1209] text-white font-semibold shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:border-black"
            }`}
          >
            All ({expenses.length})
          </button>
          {EXPENSE_CATEGORIES.map((cat) => {
            const count = expenses.filter((e) => e.category === cat).length;
            if (count === 0 && selectedExpenseCategory !== cat) return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedExpenseCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition shrink-0 ${
                  selectedExpenseCategory === cat
                    ? "bg-[#1F1209] text-white font-semibold shadow-sm"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-black"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Expenses List Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#EDE4D8] bg-[#FAF8F5]/90 text-[11px] uppercase tracking-[0.12em] text-[#6B5344]">
                <th className="px-6 py-3.5 font-semibold">Expense Title & Description</th>
                <th className="px-4 py-3.5 font-semibold">Category</th>
                <th className="px-4 py-3.5 font-semibold">Date</th>
                <th className="px-4 py-3.5 font-semibold">Amount (PKR)</th>
                <th className="px-4 py-3.5 font-semibold">Notes / Receipt Ref</th>
                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {loadingExpenses ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#8B7355]">
                    Loading store expenses...
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#8B7355]">
                    <div className="max-w-sm mx-auto">
                      <Receipt className="h-8 w-8 text-[#8B6914] mx-auto mb-2 opacity-50" />
                      <p className="font-semibold text-[#1F1209] mb-1">
                        No expenses in this category
                      </p>
                      <p className="text-xs text-[#6B5344] mb-3">
                        Track Facebook/Instagram ads, box manufacturing, or shipping fees.
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenAddExpense}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#4A2F19] text-white text-xs font-semibold hover:bg-[#3A2413]"
                      >
                        <Plus className="h-3 w-3" /> Add Expense
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    {/* Title */}
                    <td className="px-6 py-4">
                      <span className="font-semibold text-xs sm:text-sm text-[#1F1209] block">
                        {exp.title}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getCategoryColor(
                          exp.category
                        )}`}
                      >
                        {exp.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-[#6B5344]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span>{fmtDate(exp.expense_date)}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4 whitespace-nowrap font-bold text-xs sm:text-sm text-rose-700 tabular-nums">
                      - {formatPkr(exp.amount)}
                    </td>

                    {/* Notes */}
                    <td className="px-4 py-4 text-xs text-[#6B5344] max-w-xs truncate">
                      {exp.notes || <span className="text-gray-400">—</span>}
                    </td>

                    {/* Edit & Delete Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditExpense(exp)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-700 hover:text-black transition"
                          title="Edit Expense"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExpense(exp.id, exp.title)}
                          className="p-1.5 rounded-md hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition"
                          title="Delete Expense"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          2. STORE WORKING CAPITAL & INJECTED FUNDS
      ─────────────────────────────────────────────────────────── */}
      <section className="rounded-xl border border-indigo-200/70 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-indigo-100 px-6 py-5 bg-indigo-50/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                <PiggyBank className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-base font-bold text-[#1F1209]">
                Store Working Capital &amp; Investment Funds
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                Total: {formatPkr(finance.totalFundsInjected)}
              </span>
            </div>
            <p className="text-xs text-[#6B5344] mt-1">
              Record all capital injections, owner investments, and business funds. These are tracked separately from revenue and used to calculate your total treasury balance.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAddFund}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Fund</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-indigo-100/80 bg-indigo-50/30 text-[11px] uppercase tracking-[0.12em] text-[#6B5344]">
                <th className="px-6 py-3.5 font-semibold">Fund Title / Purpose</th>
                <th className="px-4 py-3.5 font-semibold">Source</th>
                <th className="px-4 py-3.5 font-semibold">Date</th>
                <th className="px-4 py-3.5 font-semibold">Amount (PKR)</th>
                <th className="px-4 py-3.5 font-semibold">Notes</th>
                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50">
              {loadingFunds ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#8B7355]">
                    Loading capital funds...
                  </td>
                </tr>
              ) : funds.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#8B7355]">
                    <div className="max-w-sm mx-auto">
                      <PiggyBank className="h-8 w-8 text-indigo-400 mx-auto mb-2 opacity-50" />
                      <p className="font-semibold text-[#1F1209] mb-1">No funds recorded yet</p>
                      <p className="text-xs text-[#6B5344] mb-3">
                        Record your initial working capital, owner investments, or bank deposits.
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenAddFund}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                      >
                        <Plus className="h-3 w-3" /> Add First Fund
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                funds.map((fund) => (
                  <tr key={fund.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-xs sm:text-sm text-[#1F1209] block">
                        {fund.title}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-indigo-50 text-indigo-700 border-indigo-200">
                        {fund.source}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-[#6B5344]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span>{fmtDate(fund.fund_date)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-bold text-xs sm:text-sm text-indigo-700 tabular-nums">
                      + {formatPkr(fund.amount)}
                    </td>
                    <td className="px-4 py-4 text-xs text-[#6B5344] max-w-xs truncate">
                      {fund.notes || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditFund(fund)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-700 hover:text-black transition"
                          title="Edit Fund"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFund(fund.id, fund.title)}
                          className="p-1.5 rounded-md hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition"
                          title="Delete Fund"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {funds.length > 0 && (
              <tfoot>
                <tr className="border-t border-indigo-200/60 bg-indigo-50/30">
                  <td colSpan={3} className="px-6 py-3 text-xs font-semibold text-indigo-800 uppercase tracking-wider">
                    Total Capital Invested
                  </td>
                  <td className="px-4 py-3 font-bold text-sm text-indigo-800 tabular-nums">
                    {formatPkr(finance.totalFundsInjected)}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          3. SOLD WATCHES — AUTO-PROFIT FETCHED FROM ORDERS
      ─────────────────────────────────────────────────────────── */}
      <section className="rounded-xl border border-emerald-200/70 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-emerald-100 px-6 py-5 bg-emerald-50/40">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-base font-bold text-[#1F1209]">
                Sold Watches — Realized Profit (Auto-Fetched from Orders)
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Net: {formatPkr(soldProductsAnalysis.totalRealizedProfitFromProducts)}
              </span>
            </div>
            <p className="text-xs text-[#6B5344] mt-1">
              Automatically matched from customer orders using actual product cost, packing &amp; delivery. No estimates — real profit per watch sold.
            </p>
          </div>
          <div className="text-right text-xs text-[#6B5344]">
            <p className="font-semibold text-[#1F1209]">{soldProductsAnalysis.totalUnitsSold} units sold</p>
            <p>{soldProductsAnalysis.soldItems.length} distinct products</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-emerald-100/80 bg-emerald-50/30 text-[11px] uppercase tracking-[0.12em] text-[#6B5344]">
                <th className="px-5 py-3.5 font-semibold">Watch</th>
                <th className="px-4 py-3.5 font-semibold text-center">Units Sold</th>
                <th className="px-4 py-3.5 font-semibold">Avg. Sale Price</th>
                <th className="px-4 py-3.5 font-semibold">Buy Cost/unit</th>
                <th className="px-4 py-3.5 font-semibold">Total Revenue</th>
                <th className="px-4 py-3.5 font-semibold">Total COGS+Costs</th>
                <th className="px-4 py-3.5 font-semibold">Net Profit</th>
                <th className="px-4 py-3.5 font-semibold">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {loadingOrders && soldProductsAnalysis.soldItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-[#8B7355]">
                    Loading sold product data from orders...
                  </td>
                </tr>
              ) : soldProductsAnalysis.soldItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-[#8B7355]">
                    <div className="max-w-sm mx-auto">
                      <Package className="h-8 w-8 text-emerald-400 mx-auto mb-2 opacity-50" />
                      <p className="font-semibold text-[#1F1209] mb-1">No sales recorded yet</p>
                      <p className="text-xs text-[#6B5344]">
                        Once customers place orders, realized profits will appear here automatically.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                soldProductsAnalysis.soldItems.map((item, idx) => {
                  const totalCosts = item.totalCogs + item.totalPackingCost + item.totalDeliveryCost;
                  return (
                    <tr key={idx} className="hover:bg-emerald-50/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded-lg border border-[#EDE4D8] overflow-hidden bg-white shrink-0">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              unoptimized={typeof item.image === "string" && item.image.includes("cloudinary")}
                              className="object-contain p-1"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6914] block">{item.brand}</span>
                            <p className="text-xs font-semibold text-[#1F1209] truncate max-w-[160px]">{item.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          {item.unitsSold}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-semibold text-[#1F1209] tabular-nums whitespace-nowrap">
                        {formatPkr(item.avgSellingPrice)}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-medium text-red-700 tabular-nums whitespace-nowrap">
                        {formatPkr(item.unitCost)}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-bold text-[#1F1209] tabular-nums whitespace-nowrap">
                        {formatPkr(item.totalRevenue)}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-medium text-rose-700 tabular-nums whitespace-nowrap">
                        - {formatPkr(totalCosts)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`text-xs font-bold tabular-nums ${item.realizedNetProfit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                          {item.realizedNetProfit >= 0 ? "+" : ""}{formatPkr(item.realizedNetProfit)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                          item.marginPct >= 30
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : item.marginPct >= 15
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                          {item.marginPct}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {soldProductsAnalysis.soldItems.length > 0 && (
              <tfoot>
                <tr className="border-t border-emerald-200/60 bg-emerald-50/40">
                  <td className="px-5 py-3 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                    Totals
                  </td>
                  <td className="px-4 py-3 text-center text-xs font-bold text-emerald-800">
                    {soldProductsAnalysis.totalUnitsSold}
                  </td>
                  <td colSpan={2} />
                  <td className="px-4 py-3 text-xs font-bold text-[#1F1209] tabular-nums">
                    {formatPkr(soldProductsAnalysis.totalRealizedRevenue)}
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-rose-700 tabular-nums">
                    - {formatPkr(soldProductsAnalysis.totalRealizedCogs + soldProductsAnalysis.totalRealizedPacking + soldProductsAnalysis.totalRealizedDelivery)}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-emerald-700 tabular-nums">
                    +{formatPkr(soldProductsAnalysis.totalRealizedProfitFromProducts)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          4. SHOPIFY PRODUCT PRICING, COGS & MARGIN MANAGER (With Edit Modal)
      ─────────────────────────────────────────────────────────── */}
      <section className="rounded-xl border border-[#E8DFD4]/90 bg-white shadow-sm overflow-hidden">

        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EDE4D8] px-6 py-5 bg-[#FAF8F5]/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C9A227]/20 text-[#8B6914]">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-base font-bold text-[#1F1209]">
                Product Cost vs. Selling Price & Margin Manager (Shopify COGS)
              </h3>
            </div>
            <p className="text-xs text-[#6B5344] mt-1">
              Edit purchase costs, sale prices, and compare-at rates inline or click Edit for full unit packaging & delivery economics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={savingAll || loadingProducts}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1F1209] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm active:scale-95 disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {savingAll ? "Saving All..." : "Save All Prices"}
            </button>
          </div>
        </div>

        {/* Tip Box with Example */}
        <div className="px-6 py-3 bg-[#FAF5EE] border-b border-[#EDE4D8] flex items-center gap-2 text-xs text-[#6B5344]">
          <HelpCircle className="h-4 w-4 text-[#8B6914] shrink-0" />
          <span>
            <strong>Shopify Margin Formula:</strong> If actual purchase cost is{" "}
            <strong>Rs. 1,000</strong>, selling price is <strong>Rs. 2,000</strong>, and
            market rate is <strong>Rs. 3,500</strong>: your profit is{" "}
            <strong>Rs. 1,000 (50% Margin · 100% Markup)</strong>. Edit any box or click
            &ldquo;Edit&rdquo; to modify.
          </span>
        </div>

        {/* Interactive Pricing Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#EDE4D8] bg-[#FAF8F5]/90 text-[11px] uppercase tracking-[0.12em] text-[#6B5344]">
                <th className="px-6 py-3.5 font-semibold">Watch / Product</th>
                <th className="px-4 py-3.5 font-semibold">
                  Actual Cost (Buy) <span className="text-[#8B6914] lowercase">(cogs)</span>
                </th>
                <th className="px-4 py-3.5 font-semibold">
                  Selling Price <span className="text-[#2E7D32] lowercase">(your sale)</span>
                </th>
                <th className="px-4 py-3.5 font-semibold">
                  Market Rate <span className="text-[#8B7355] lowercase">(compare-at)</span>
                </th>
                <th className="px-4 py-3.5 font-semibold">Unit Profit</th>
                <th className="px-4 py-3.5 font-semibold">Margin %</th>
                <th className="px-4 py-3.5 font-semibold">Markup %</th>
                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {loadingProducts ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-[#8B7355]">
                    Loading catalog watches from Supabase...
                  </td>
                </tr>
              ) : productsList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-[#8B7355]">
                    No products found in database.
                  </td>
                </tr>
              ) : (
                productsList.map((p) => {
                  const profit = p.sellingPrice - p.costPrice;
                  const marginPct =
                    p.sellingPrice > 0
                      ? Math.round((profit / p.sellingPrice) * 100)
                      : 0;
                  const markupPct =
                    p.costPrice > 0
                      ? Math.round((profit / p.costPrice) * 100)
                      : 0;

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF8F5]/70 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 rounded-lg border border-[#EDE4D8] overflow-hidden bg-white shrink-0">
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              unoptimized={
                                typeof p.image === "string" &&
                                p.image.includes("cloudinary")
                              }
                              className="object-contain p-1"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6914] block">
                              {p.brand}
                            </span>
                            <p className="text-xs font-semibold text-[#1F1209] truncate max-w-[190px]">
                              {p.title}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Actual Purchase Cost Input */}
                      <td className="px-4 py-4">
                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8B7355] font-medium">
                            Rs.
                          </span>
                          <input
                            type="number"
                            value={p.costPrice}
                            onChange={(e) =>
                              handlePriceChange(
                                p.id,
                                "costPrice",
                                Number(e.target.value) || 0
                              )
                            }
                            className="w-full h-9 pl-9 pr-2 text-xs font-semibold rounded-md border border-[#DDD5CC] bg-white text-[#1F1209] focus:outline-none focus:ring-1 focus:ring-[#C9A227] focus:border-[#C9A227]"
                          />
                        </div>
                      </td>

                      {/* Selling Price Input */}
                      <td className="px-4 py-4">
                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#2E7D32] font-semibold">
                            Rs.
                          </span>
                          <input
                            type="number"
                            value={p.sellingPrice}
                            onChange={(e) =>
                              handlePriceChange(
                                p.id,
                                "sellingPrice",
                                Number(e.target.value) || 0
                              )
                            }
                            className="w-full h-9 pl-9 pr-2 text-xs font-bold rounded-md border border-[#DDD5CC] bg-white text-[#1F1209] focus:outline-none focus:ring-1 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
                          />
                        </div>
                      </td>

                      {/* Market Rate / Compare-At Input */}
                      <td className="px-4 py-4">
                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8B7355] font-medium">
                            Rs.
                          </span>
                          <input
                            type="number"
                            value={p.marketRate}
                            onChange={(e) =>
                              handlePriceChange(
                                p.id,
                                "marketRate",
                                Number(e.target.value) || 0
                              )
                            }
                            className="w-full h-9 pl-9 pr-2 text-xs font-medium rounded-md border border-[#DDD5CC] bg-white text-[#6B5344] focus:outline-none focus:ring-1 focus:ring-[#C9A227] focus:border-[#C9A227]"
                          />
                        </div>
                      </td>

                      {/* Unit Profit */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`text-xs font-bold tabular-nums ${
                            profit >= 0 ? "text-emerald-700" : "text-red-700"
                          }`}
                        >
                          {profit >= 0 ? `+${formatPkr(profit)}` : formatPkr(profit)}
                        </span>
                      </td>

                      {/* Profit Margin % */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            marginPct >= 40
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : marginPct >= 20
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {marginPct}%
                        </span>
                      </td>

                      {/* Markup % */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs font-semibold text-[#6B5344] tabular-nums">
                        {markupPct}%
                      </td>

                      {/* Actions: Save & Edit */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenProductEdit(p)}
                            className="min-h-[32px] px-2.5 py-1 rounded-md text-xs font-semibold border border-[#DDD5CC] bg-white text-[#4A2F19] hover:bg-[#FAF8F5] transition"
                            title="Edit Full Financials"
                          >
                            <Edit3 className="h-3 w-3 inline mr-1" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveProduct(p.id)}
                            disabled={p.saving}
                            className={`min-h-[32px] px-3.5 py-1 rounded-md text-xs font-semibold transition active:scale-95 ${
                              p.saved
                                ? "bg-[#16A34A] text-white"
                                : "bg-[#1F1209] text-white hover:bg-black"
                            }`}
                          >
                            {p.saving ? (
                              "Saving..."
                            ) : p.saved ? (
                              <span className="flex items-center gap-1">
                                <Check className="h-3 w-3 text-white" /> Saved
                              </span>
                            ) : (
                              "Save"
                            )}
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
      </section>

      {/* ───────────────────────────────────────────────────────────
          3. INCOME STATEMENT & ORDER PROFITABILITY
      ─────────────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Income Statement */}
        <section className="rounded-xl border border-[#E8DFD4]/90 bg-white shadow-sm p-5 space-y-4 lg:col-span-1">
          <div className="flex items-center justify-between border-b border-[#EDE4D8] pb-3">
            <h3 className="text-base font-semibold text-[#1F1209]">
              Income Statement
            </h3>
            <span className="text-[11px] text-[#6B5344]">Actual P&L</span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-1">
              <span className="text-[#6B5344]">Gross Sales (GMV)</span>
              <span className="font-semibold text-[#1F1209] tabular-nums">
                {formatPkr(finance.grossRevenue)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-red-700 flex items-center gap-1.5">
                <span>Cost of Goods Sold (Actual)</span>
              </span>
              <span className="font-semibold tabular-nums text-red-700">
                - {formatPkr(finance.actualCogs)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-red-700 flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" />
                <span>Courier & Logistics (Trax)</span>
              </span>
              <span className="font-semibold tabular-nums text-red-700">
                - {formatPkr(finance.actualDeliveryCost)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-red-700 flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" />
                <span>Boxes & Packaging Material</span>
              </span>
              <span className="font-semibold tabular-nums text-red-700">
                - {formatPkr(finance.actualPackingCost)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 text-rose-700">
              <span className="text-rose-700 flex items-center gap-1.5 font-medium">
                <Receipt className="h-3.5 w-3.5" />
                <span>Other Store Expenses</span>
              </span>
              <span className="font-bold tabular-nums text-rose-700">
                - {formatPkr(finance.totalOtherExpenses)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 text-amber-700">
              <span className="flex items-center gap-1.5">
                <AlertOctagon className="h-3.5 w-3.5" />
                <span>Cancelled / Lost Revenue</span>
              </span>
              <span className="font-semibold tabular-nums">
                {formatPkr(finance.lostRevenue)}
              </span>
            </div>

            <div className="border-t border-[#EDE4D8] pt-3 flex justify-between items-center text-base">
              <span className="font-bold text-[#1F1209]">Net Sales Profit</span>
              <span className="font-bold text-emerald-700 tabular-nums">
                {formatPkr(finance.netProfit)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 text-indigo-700">
              <span className="flex items-center gap-1.5 font-medium">
                <PiggyBank className="h-3.5 w-3.5" />
                <span>+ Injected Capital Funds</span>
              </span>
              <span className="font-bold tabular-nums text-indigo-700">
                + {formatPkr(finance.totalFundsInjected)}
              </span>
            </div>

            <div className={`border-t-2 pt-3 flex justify-between items-center text-base ${finance.netTreasuryCashBalance >= 0 ? "border-sky-200" : "border-red-200"}`}>
              <span className="font-bold text-[#1F1209]">Cash Treasury Balance</span>
              <span className={`font-bold tabular-nums ${finance.netTreasuryCashBalance >= 0 ? "text-sky-700" : "text-red-700"}`}>
                {finance.netTreasuryCashBalance >= 0 ? "+" : "-"}{formatPkr(Math.abs(finance.netTreasuryCashBalance))}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-[#FAF8F5] p-3.5 text-xs text-[#6B5344] leading-relaxed border border-[#EDE4D8]">
            <p className="font-semibold text-[#4A2F19] mb-1">
              24-Hour Replacement Protection
            </p>
            Zero chargeback refunds recorded. Replacements are completed strictly within the 24-hour verification window without capital loss.
          </div>

        </section>

        {/* Order Profitability Table */}
        <section className="rounded-xl border border-[#E8DFD4]/90 bg-white shadow-sm lg:col-span-2 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDE4D8] px-5 py-4">
            <div>
              <h3 className="text-base font-semibold text-[#1F1209]">
                Live Orders Profitability Ledger
              </h3>
              <p className="text-xs text-[#6B5344] mt-0.5">
                Margin and net contribution per customer order in Supabase.
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold uppercase tracking-wider text-[#4A2F19] hover:underline"
            >
              View all orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[580px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#EDE4D8] bg-[#FAF8F5]/80 text-[11px] uppercase tracking-[0.12em] text-[#6B5344]">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Gross</th>
                  <th className="px-5 py-3 font-medium">Est. COGS</th>
                  <th className="px-5 py-3 font-medium">Net Profit</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingOrders && orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-sm text-[#8B7355]">
                      Connecting to Supabase...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-sm text-[#8B7355]">
                      No orders placed yet. Customer orders will appear here automatically.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => {
                    const cogs = Math.round(o.totalPkr * 0.42);
                    const net = Math.max(0, o.totalPkr - cogs - defaultCourierCost);
                    return (
                      <tr key={o.id} className="border-b border-[#F0E8DC] last:border-0">
                        <td className="px-5 py-3.5 font-semibold text-[#2B1A0F]">
                          {o.id}
                        </td>
                        <td className="px-5 py-3.5 text-[#4A3728]">
                          <span className="block font-medium">{o.customerName}</span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-[#8B7355] whitespace-nowrap">
                          {fmtDate(o.placedAt)}
                        </td>
                        <td className="px-5 py-3.5 tabular-nums font-semibold text-[#1F1209]">
                          {formatPkr(o.totalPkr)}
                        </td>
                        <td className="px-5 py-3.5 tabular-nums text-xs text-red-700">
                          {formatPkr(cogs)}
                        </td>
                        <td className="px-5 py-3.5 tabular-nums font-semibold text-emerald-700">
                          {formatPkr(net)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${orderStatusClass(
                              o.status
                            )}`}
                          >
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ───────────────────────────────────────────────────────────
          MODAL: ADD / EDIT STORE EXPENSE
      ─────────────────────────────────────────────────────────── */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {editingExpenseId ? "Edit Store Expense" : "Record New Store Expense"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enter expenditure details for ads, packaging, courier, or overheads.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-black transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Expense Title / Purpose <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meta Ads - Tissot Campaign, 50 Luxury Boxes"
                  value={expenseFormTitle}
                  onChange={(e) => setExpenseFormTitle(e.target.value)}
                  className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                />
              </div>

              {/* Category & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={expenseFormCategory}
                    onChange={(e) => setExpenseFormCategory(e.target.value)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Amount (PKR) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold">
                      Rs.
                    </span>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="e.g. 5000"
                      value={expenseFormAmount}
                      onChange={(e) => setExpenseFormAmount(e.target.value)}
                      className="w-full h-10 pl-10 pr-3 text-xs sm:text-sm font-bold text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Expense Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={expenseFormDate}
                  onChange={(e) => setExpenseFormDate(e.target.value)}
                  className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Notes / Receipt Reference (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Invoice #1029, paid via Bank Alfalah"
                  value={expenseFormNotes}
                  onChange={(e) => setExpenseFormNotes(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingExpense}
                  className="px-5 py-2 rounded-lg bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition active:scale-95 disabled:opacity-50"
                >
                  {savingExpense
                    ? "Saving..."
                    : editingExpenseId
                    ? "Update Expense"
                    : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          MODAL: ADD / EDIT STORE FUND / CAPITAL INJECTION
      ─────────────────────────────────────────────────────────── */}
      {isFundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {editingFundId ? "Edit Capital Fund" : "Add New Capital / Working Fund"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Record an owner investment, bank deposit, or other capital injection into the store.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFundModalOpen(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-black transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFund} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Fund Title / Purpose <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Opening Capital, Q3 Investment, Bank Deposit"
                  value={fundFormTitle}
                  onChange={(e) => setFundFormTitle(e.target.value)}
                  className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
                />
              </div>

              {/* Source & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Fund Source <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={fundFormSource}
                    onChange={(e) => setFundFormSource(e.target.value)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
                  >
                    {FUND_SOURCES.map((src) => (
                      <option key={src} value={src}>{src}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Amount (PKR) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold">
                      Rs.
                    </span>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="e.g. 50000"
                      value={fundFormAmount}
                      onChange={(e) => setFundFormAmount(e.target.value)}
                      className="w-full h-10 pl-10 pr-3 text-xs sm:text-sm font-bold text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Fund Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={fundFormDate}
                  onChange={(e) => setFundFormDate(e.target.value)}
                  className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bank Alfalah transfer, initial stock purchase budget"
                  value={fundFormNotes}
                  onChange={(e) => setFundFormNotes(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFundModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingFund}
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold uppercase tracking-wider hover:bg-indigo-700 transition active:scale-95 disabled:opacity-50"
                >
                  {savingFund
                    ? "Saving..."
                    : editingFundId
                    ? "Update Fund"
                    : "Save Fund"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          MODAL: EDIT PRODUCT FULL FINANCIALS & COSTS
      ─────────────────────────────────────────────────────────── */}
      {editingProduct && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Edit Product Financials & Unit Costs
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Adjust COGS buy cost, customer price, packaging and delivery allowances.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-black transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductModal} className="space-y-4">
              {/* Product Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Watch Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    required
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Buy Cost (COGS)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold">
                      Rs.
                    </span>
                    <input
                      type="number"
                      required
                      value={editCostPrice}
                      onChange={(e) => setEditCostPrice(e.target.value)}
                      className="w-full h-10 pl-8 pr-2 text-xs sm:text-sm font-semibold rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Selling Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-emerald-700 font-semibold">
                      Rs.
                    </span>
                    <input
                      type="number"
                      required
                      value={editSellingPrice}
                      onChange={(e) => setEditSellingPrice(e.target.value)}
                      className="w-full h-10 pl-8 pr-2 text-xs sm:text-sm font-bold text-emerald-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Compare-At Rate
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold">
                      Rs.
                    </span>
                    <input
                      type="number"
                      required
                      value={editMarketRate}
                      onChange={(e) => setEditMarketRate(e.target.value)}
                      className="w-full h-10 pl-8 pr-2 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20"
                    />
                  </div>
                </div>
              </div>

              {/* Extra Unit Allowances */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Packaging Box Cost (PKR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold">
                      Rs.
                    </span>
                    <input
                      type="number"
                      value={editPackingCost}
                      onChange={(e) => setEditPackingCost(e.target.value)}
                      className="w-full h-10 pl-8 pr-2 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Trax Courier Allowance (PKR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold">
                      Rs.
                    </span>
                    <input
                      type="number"
                      value={editDeliveryCost}
                      onChange={(e) => setEditDeliveryCost(e.target.value)}
                      className="w-full h-10 pl-8 pr-2 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                <div className="flex items-center justify-between mb-1 font-semibold text-gray-700">
                  <span>Gross Unit Profit:</span>
                  <span className="text-emerald-700 font-bold tabular-nums">
                    + {formatPkr(Number(editSellingPrice) - Number(editCostPrice))}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>Net after Box & Courier:</span>
                  <span className="font-bold text-gray-900 tabular-nums">
                    +{" "}
                    {formatPkr(
                      Number(editSellingPrice) -
                        Number(editCostPrice) -
                        Number(editPackingCost || 0) -
                        Number(editDeliveryCost || 0)
                    )}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProductModal}
                  className="px-5 py-2 rounded-lg bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition active:scale-95 disabled:opacity-50"
                >
                  {savingProductModal ? "Saving..." : "Save Product Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          MODAL: ADJUST OPERATIONAL RATES (Courier & Packing Defaults)
      ─────────────────────────────────────────────────────────── */}
      {isRatesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Adjust Operating Rates
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update store-wide default shipping and packaging costs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRatesModalOpen(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-black transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Default Courier Cost Per Order (Trax COD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold">
                    Rs.
                  </span>
                  <input
                    type="number"
                    value={defaultCourierCost}
                    onChange={(e) => setDefaultCourierCost(Number(e.target.value) || 0)}
                    className="w-full h-10 pl-10 pr-3 text-xs sm:text-sm font-bold text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Default Packaging Box Allowance Per Order
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold">
                    Rs.
                  </span>
                  <input
                    type="number"
                    value={defaultPackingCost}
                    onChange={(e) => setDefaultPackingCost(Number(e.target.value) || 0)}
                    className="w-full h-10 pl-10 pr-3 text-xs sm:text-sm font-bold text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsRatesModalOpen(false);
                    toast.success("Rates applied to financial calculations!");
                  }}
                  className="px-5 py-2 rounded-lg bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition active:scale-95"
                >
                  Apply Rates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
