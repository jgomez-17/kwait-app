"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

interface MenuSectionProps {
  category: {
    id: string;
    name: string;
    color: string;
    products: { id: number; name: string; price: number; image: string }[];
  };
  onBack: () => void;
}

export default function MenuSection({ category, onBack }: MenuSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.1 }}
    >
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-sm bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full transition"
        >
          ← Volver
        </button>
        <h2
          className={`text-2xl font-semibold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}
        >
          {category.name}
        </h2>
        <div className="w-12" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {category.products.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </motion.div>
  );
}
