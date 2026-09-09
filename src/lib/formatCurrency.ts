/** Display helpers — Pakistani store format matching 2sstore.pk (e.g. Rs.2,999.00) */

export function formatPkr(amount: number): string {
  if (amount == null || isNaN(amount)) return "Rs.0.00";
  try {
    return `Rs.${Number(amount).toLocaleString("en-PK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  } catch {
    return `Rs.${Number(amount).toFixed(2)}`;
  }
}

