// pages/index.tsx
import React from "react";
import { CartProvider } from "@/app/(public)/menu/CartContext";
import { Menu } from "@/app/(public)/menu/Menu";
import { Cart } from "@/app/(public)/menu/Cart";
import type { Product } from "@/app/(public)/menu/CartContext";
import productsData from "@/data/products.json"; // importa tu JSON


const HomePage: React.FC = () => {

      const products: Product[] = productsData.map((p) => ({
    ...p,
    id: String(p.id),
    available: p.available ?? true, // por si falta el campo en alguno
  }));

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

        <main className="py-2">
          <Menu />
        </main>
        <Cart />
      </div>
    </CartProvider>
  );
};

export default HomePage;
