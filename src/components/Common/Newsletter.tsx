import React from "react";

const Newsletter = () => {
  return (
    <section className="overflow-hidden">
      <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="relative z-[1] overflow-hidden rounded-xl border border-[#F2C27B]/25 bg-gradient-to-br from-[#1a1009] via-[#4A2F19] to-[#1a1009] shadow-[0_8px_30px_rgba(26,16,9,0.12)]">
          {/* Warm accent glow — same vocabulary as the header sale strip */}
          <div
            className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(242,194,123,0.14),transparent_55%)]"
            aria-hidden
          />

          <div className="relative flex flex-col gap-8 px-4 py-11 sm:px-7.5 xl:flex-row xl:items-center xl:justify-between xl:pl-12.5 xl:pr-14">
            <div className="w-full max-w-[491px]">
              <h2 className="mb-3 max-w-[399px] text-lg font-bold text-[#FDF4E3] sm:text-xl xl:text-heading-4">
                Don&apos;t Miss Out Latest Trends & Offers
              </h2>
              <p className="text-sm leading-relaxed text-[#FDF4E3]/90 sm:text-base">
                Register to receive news about the latest offers & discount
                codes
              </p>
            </div>

            <div className="w-full max-w-[477px]">
              <form>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-[#E8DFD4] bg-white py-3 px-5 text-[#1F1209] outline-none placeholder:text-[#8B7355] focus:border-[#C9A227]/60 focus:ring-2 focus:ring-[#F2C27B]/30"
                  />
                  <button
                    type="submit"
                    className="inline-flex shrink-0 justify-center rounded-lg bg-[#3D2715] px-7 py-3 font-semibold text-white shadow-sm transition duration-200 ease-out hover:bg-[#2a1810] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C27B]/80"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
