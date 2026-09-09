"use client";

import { useEffect, useState } from "react";
import { useAdminWorkspace } from "@/context/AdminWorkspaceContext";

export default function AdminProductSaleInput({
  productId,
  catalogSalePkr,
}: {
  productId: number;
  catalogSalePkr: number;
}) {
  const { productSaleOverrides, setProductSalePrice } = useAdminWorkspace();
  const effective = productSaleOverrides[productId] ?? catalogSalePkr;
  const [draft, setDraft] = useState(String(effective));

  useEffect(() => {
    setDraft(String(productSaleOverrides[productId] ?? catalogSalePkr));
  }, [productId, catalogSalePkr, productSaleOverrides]);

  return (
    <div className="flex flex-col items-end gap-0.5">
      <input
        type="number"
        min={0}
        step={1000}
        aria-label={`Sale price PKR for product ${productId}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          const v = parseInt(draft, 10);
          if (Number.isNaN(v) || v < 0) {
            setDraft(String(effective));
            return;
          }
          const rounded = Math.round(v);
          if (rounded === catalogSalePkr) setProductSalePrice(productId, null);
          else setProductSalePrice(productId, rounded);
        }}
        className="w-28 rounded-md border border-[#DDD5CC] px-2 py-1.5 text-right tabular-nums text-[#2B1A0F] focus:outline-none focus:ring-2 focus:ring-[#4A2F19]/25"
      />
      {productSaleOverrides[productId] !== undefined &&
      productSaleOverrides[productId] !== catalogSalePkr ? (
        <span className="text-[10px] text-[#8B6914]">Override</span>
      ) : null}
    </div>
  );
}
