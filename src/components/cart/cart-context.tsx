"use client";

// Client-side cart state backed by the Shopify Storefront Cart API.
// The cart id is persisted in localStorage; all mutations go straight to
// Shopify from the browser (no custom backend), which is what makes the
// static-export deploy on Amplify possible.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addToCart as apiAddToCart,
  createCart as apiCreateCart,
  getCart as apiGetCart,
  removeFromCart as apiRemoveFromCart,
  updateCart as apiUpdateCart,
} from "@/lib/shopify";
import type { Cart } from "@/lib/shopify/types";

const CART_ID_KEY = "proglass_cart_id";

type CartContextValue = {
  cart: Cart | null;
  /** Optimistic total quantity, kept in sync with the server cart. */
  totalQuantity: number;
  isOpen: boolean;
  isUpdating: boolean;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, merchandiseId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hydrate an existing cart on first load.
  useEffect(() => {
    const id = window.localStorage.getItem(CART_ID_KEY);
    if (!id) return;
    apiGetCart(id)
      .then((existing) => {
        if (existing) setCart(existing);
        else window.localStorage.removeItem(CART_ID_KEY);
      })
      .catch(() => window.localStorage.removeItem(CART_ID_KEY));
  }, []);

  const persist = useCallback((next: Cart) => {
    setCart(next);
    window.localStorage.setItem(CART_ID_KEY, next.id);
  }, []);

  // Wrap a mutation with shared loading/error handling.
  const run = useCallback(async (fn: () => Promise<Cart>) => {
    setIsUpdating(true);
    setError(null);
    try {
      const next = await fn();
      persist(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el carrito");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [persist]);

  const addItem = useCallback(
    async (merchandiseId: string, quantity = 1) => {
      await run(async () => {
        const id = window.localStorage.getItem(CART_ID_KEY);
        if (id && cart) {
          return apiAddToCart(id, [{ merchandiseId, quantity }]);
        }
        return apiCreateCart([{ merchandiseId, quantity }]);
      });
      setIsOpen(true);
    },
    [cart, run],
  );

  const updateItem = useCallback(
    async (lineId: string, merchandiseId: string, quantity: number) => {
      const id = cart?.id;
      if (!id) return;
      if (quantity <= 0) {
        await run(() => apiRemoveFromCart(id, [lineId]));
        return;
      }
      await run(() => apiUpdateCart(id, [{ id: lineId, merchandiseId, quantity }]));
    },
    [cart?.id, run],
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      const id = cart?.id;
      if (!id) return;
      await run(() => apiRemoveFromCart(id, [lineId]));
    },
    [cart?.id, run],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      totalQuantity: cart?.totalQuantity ?? 0,
      isOpen,
      isUpdating,
      error,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((v) => !v),
      addItem,
      updateItem,
      removeItem,
    }),
    [cart, isOpen, isUpdating, error, addItem, updateItem, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
