"use client";

import Link from "next/link";
import React from "react";
import type { User } from "@supabase/supabase-js";

type CheckoutSessionBannerProps = {
  user: User | null;
  authLoaded: boolean;
};

const CheckoutSessionBanner = ({
  user,
  authLoaded,
}: CheckoutSessionBannerProps) => {
  return (
    <div className="bg-white shadow-1 rounded-[10px]">
      <div className="py-5 px-5.5">
        {!authLoaded ? (
          <p className="text-custom-sm text-dark-4">Checking session…</p>
        ) : user ? (
          <p className="text-custom-sm text-dark">
            Signed in as{" "}
            <span className="font-medium text-dark">{user.email}</span>. You can
            use a saved address below or add a new one.
          </p>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-custom-sm text-dark">
              Guest checkout — no account required. Or{" "}
              <Link
                href="/signin"
                className="font-medium text-blue hover:text-blue-dark"
              >
                sign in
              </Link>{" "}
              to use saved addresses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSessionBanner;
