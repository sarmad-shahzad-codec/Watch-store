"use client";

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-[#1F1209]">Settings</h2>
        <p className="mt-1 text-sm text-[#6B5344]">
          Store configuration — bind fields to environment variables or an admin
          API when you go live.
        </p>
      </div>

      <form
        className="space-y-6 rounded-xl border border-[#E8DFD4]/90 bg-white p-6 shadow-sm"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label className="block text-sm font-medium text-[#2B1A0F]">
            Store name
          </label>
          <input
            readOnly
            className="mt-1.5 w-full rounded-md border border-[#DDD5CC] bg-[#FAF8F5] px-3 py-2.5 text-sm text-[#4A3728]"
            defaultValue="Gloria Times"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2B1A0F]">
            Default currency
          </label>
          <input
            readOnly
            className="mt-1.5 w-full rounded-md border border-[#DDD5CC] bg-[#FAF8F5] px-3 py-2.5 text-sm text-[#4A3728]"
            defaultValue="PKR — Pakistani Rupee"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2B1A0F]">
            Support email (display)
          </label>
          <input
            type="email"
            readOnly
            className="mt-1.5 w-full rounded-md border border-[#DDD5CC] bg-[#FAF8F5] px-3 py-2.5 text-sm text-[#4A3728]"
            defaultValue="support@gloriatimes.example"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2B1A0F]">
            Order notification webhook
          </label>
          <input
            readOnly
            placeholder="https://..."
            className="mt-1.5 w-full rounded-md border border-[#DDD5CC] bg-[#FAF8F5] px-3 py-2.5 text-sm text-[#8B7355]"
          />
          <p className="mt-1 text-xs text-[#8B7355]">
            Configure when you connect Slack, email, or ERP hooks.
          </p>
        </div>

        <button
          type="submit"
          className="rounded-md bg-[#4A2F19] px-5 py-2.5 text-sm font-medium text-white opacity-60 cursor-not-allowed"
          disabled
        >
          Save (demo — disabled)
        </button>
      </form>
    </div>
  );
}
