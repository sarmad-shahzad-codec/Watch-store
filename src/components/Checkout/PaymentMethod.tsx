import React from "react";
import Image from "next/image";

export type PaymentMethodKey = "cash";

const PaymentMethod = () => {
  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Payment Method</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 rounded-md border-[0.5px] border-transparent bg-gray-2 py-3.5 px-5 min-w-[240px]">
            <div className="pr-2.5">
              <Image
                src="/images/checkout/cash.svg"
                alt="cash"
                width={21}
                height={21}
              />
            </div>
            <div className="border-l border-gray-4 pl-2.5">
              <p>Cash on delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
