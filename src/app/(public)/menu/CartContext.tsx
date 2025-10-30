"use client"

import React, { createContext, useContext, useEffect, useState } from "react";

export type Product = {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  img?: string;
};

export type CartItem = {
  product: Product;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  toggleOpen: (v?: boolean) => void;
  comment: string;
  setComment: (c: string) => void;
  deliveryType: "onsite" | "delivery";
  setDeliveryType: (t: "onsite" | "delivery") => void;
  deliveryInfo: { name?: string; address?: string; phone?: string };
  setDeliveryInfo: (d: { name?: string; address?: string; phone?: string }) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [deliveryType, setDeliveryType] = useState<"onsite" | "delivery">("onsite");
  const [deliveryInfo, setDeliveryInfo] = useState<{ name?: string; address?: string; phone?: string }>({});

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (product: Product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p.product.id === product.id);
      if (found) {
        return prev.map((p) => (p.product.id === product.id ? { ...p, qty: p.qty + qty } : p));
      }
      return [...prev, { product, qty }];
    });
    setIsOpen(false);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((p) => p.product.id !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) return removeItem(productId);
    setItems((prev) => prev.map((p) => (p.product.id === productId ? { ...p, qty } : p)));
  };

  const clear = () => {
    setItems([]);
    setComment("");
    setDeliveryInfo({});
    setDeliveryType("onsite");
  };

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.product.price, 0);

  const toggleOpen = (v?: boolean) => {
    setIsOpen((prev) => (typeof v === "boolean" ? v : !prev));
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clear,
        totalItems,
        subtotal,
        isOpen,
        toggleOpen,
        comment,
        setComment,
        deliveryType,
        setDeliveryType,
        deliveryInfo,
        setDeliveryInfo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
