import type { Metadata } from "next";

import { CartContents } from "@/components/cart/CartContents";

export const metadata: Metadata = {
  title: "Carrito",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <CartContents />
    </div>
  );
}
