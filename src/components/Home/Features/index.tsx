import React from "react";
import { Truck, ShieldCheck, RefreshCw, Banknote } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Nationwide Delivery",
    desc: "Free courier delivery all across Pakistan",
  },
  {
    icon: Banknote,
    title: "Cash on Delivery",
    desc: "Pay safely with cash when parcel arrives",
  },
  {
    icon: ShieldCheck,
    title: "100% Quality Guaranteed",
    desc: "Premium craftsmanship & inspection before dispatch",
  },
  {
    icon: RefreshCw,
    title: "24-Hour Replacement",
    desc: "Strict replacement warranty (no returns) via WhatsApp",
  },
];

const Features = () => {
  return (
    <section className="border-y border-[#EBE6DF] bg-[#FAF8F5] py-7 sm:py-9">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 sm:gap-4 p-2 sm:p-0"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#E8DFD4] shadow-sm flex items-center justify-center shrink-0 text-[#8B5A2B]">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-[#2B1A0F] leading-tight mb-1">
                    {f.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 leading-snug">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
