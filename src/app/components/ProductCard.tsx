"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ProductCardProps {
  product: { id: number; name: string; price: number; image: string };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col items-center text-center p-4"
    >
        <Image
        src={product.image}
        alt={product.name}
        width={96}   // equivale a w-24 (24 * 4 = 96px)
        height={96}  // equivale a h-24
        className="w-24 h-24 object-contain mb-3 rounded-lg"
        />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-500 text-sm mb-2">${product.price.toLocaleString()}</p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition">
        Agregar
      </button>
    </motion.div>
  );
}
