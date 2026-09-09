import React from "react";
import Image from "next/image";
import { formatPkr } from "@/lib/formatCurrency";

export const SHIPPING_METHOD_FEES = {
  free: 0,
  fedex: 3130,
  dhl: 3560,
} as const;

export type ShippingMethodKey = keyof typeof SHIPPING_METHOD_FEES;

type ShippingMethodProps = {
  shippingMethod: ShippingMethodKey;
  onShippingChange: (key: ShippingMethodKey, feePkr: number) => void;
};

const ShippingMethod = ({
  shippingMethod,
  onShippingChange,
}: ShippingMethodProps) => {
  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Shipping Method</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-4">
          <label
            htmlFor="ship-free"
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                type="radio"
                name="shippingMethod"
                id="ship-free"
                checked={shippingMethod === "free"}
                onChange={() => onShippingChange("free", SHIPPING_METHOD_FEES.free)}
                className="sr-only"
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  shippingMethod === "free"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              />
            </div>
            Free Shipping
          </label>

          <label
            htmlFor="ship-fedex"
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                type="radio"
                name="shippingMethod"
                id="ship-fedex"
                checked={shippingMethod === "fedex"}
                onChange={() =>
                  onShippingChange("fedex", SHIPPING_METHOD_FEES.fedex)
                }
                className="sr-only"
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  shippingMethod === "fedex"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              />
            </div>

            <div className="rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none flex-1">
              <div className="flex items-center">
                <div className="pr-4">
                  <Image
                    src="/images/checkout/fedex.svg"
                    alt="fedex"
                    width={64}
                    height={18}
                  />
                </div>

                <div className="border-l border-gray-4 pl-4">
                  <p className="font-semibold text-dark">
                    {formatPkr(SHIPPING_METHOD_FEES.fedex)}
                  </p>
                  <p className="text-custom-xs">Standard Shipping</p>
                </div>
              </div>
            </div>
          </label>

          <label
            htmlFor="ship-dhl"
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                type="radio"
                name="shippingMethod"
                id="ship-dhl"
                checked={shippingMethod === "dhl"}
                onChange={() => onShippingChange("dhl", SHIPPING_METHOD_FEES.dhl)}
                className="sr-only"
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  shippingMethod === "dhl"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              />
            </div>

            <div className="rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none flex-1">
              <div className="flex items-center">
                <div className="pr-4">
                  <Image
                    src="/images/checkout/dhl.svg"
                    alt="dhl"
                    width={64}
                    height={20}
                  />
                </div>

                <div className="border-l border-gray-4 pl-4">
                  <p className="font-semibold text-dark">
                    {formatPkr(SHIPPING_METHOD_FEES.dhl)}
                  </p>
                  <p className="text-custom-xs">Standard Shipping</p>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;
