// pages/index.tsx
import React from "react";
import { CartProvider } from "@/app/(public)/menu/CartContext";
import { Menu } from "@/app/(public)/menu/Menu";
import { Cart } from "@/app/(public)/menu/Cart";


const HomePage: React.FC = () => {

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
