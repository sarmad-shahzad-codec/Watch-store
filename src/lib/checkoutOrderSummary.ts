/** Shape returned by POST /api/checkout and GET /api/orders/[orderNumber] for the confirmation UI. */

export type CheckoutOrderSummary = {
  orderNumber: string;
  items: Array<{
    productId: number;
    title: string;
    unitPricePkr: number;
    quantity: number;
    lineTotalPkr: number;
  }>;
  subtotalPkr: number;
  shippingFeePkr: number;
  totalPkr: number;
  paymentMethod: string;
  notes: string | null;
  shipping: {
    fullName: string;
    phone: string | null;
    line1: string;
    line2: string | null;
    city: string;
    region: string | null;
    country: string;
    postalCode: string | null;
  };
  createdAt?: string;
};

export const CHECKOUT_ORDER_SUMMARY_KEY = "gloria_checkout_order_summary";
