"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { IconEdit } from "@tabler/icons-react";
import { RoundedPlus } from "@/app/components/icons";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const initialProducts: Product[] = [
  { id: 1, name: "Hamburguesa clásica", price: 15000, category: "Hamburguesas", image: "/burger.jpg", description: "Carne jugosa, queso, lechuga y tomate" },
  { id: 2, name: "Pizza pepperoni", price: 20000, category: "Pizzas", image: "/pizzas.jpg", description: "Pepperoni, queso mozzarella y salsa de tomate" },
  { id: 3, name: "Coca Cola", price: 5000, category: "Bebidas", image: "/bebidas.png", description: "Refresco clásico de cola" },
];

const categories = ["Todas", "Hamburguesas", "Pizzas", "Bebidas"];

export default function ProductsPage() {
  const [products] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [search, setSearch] = useState("");

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(value);

  const filteredProducts = products.filter(
    (p) =>
      (selectedCategory === "Todas" || p.category === selectedCategory) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto sm:p-2 text-sm"
    >
      {/* Header */}
      <div className="flex flex-col border-b border-gray-200 py-4 sm:flex-row justify-between sm:items-center mb-4 gap-4">
        <h3 className="text-xl text-center font-semibold">Productos</h3>
        <Link
          href="/products/addProduct"
          className="sm:relative sm:rounded-xl sm:right-0 sm:bottom-0 right-4 bottom-4 flex items-center gap-2 text-center bg-emerald-400 fixed p-4 sm:p-2.5 text-white rounded-full z-30 shadow hover:scale-105 transition font-semibold"
        >
          <RoundedPlus />
          <span className="hidden sm:block">
          Agregar Producto
          </span>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full font-medium transition ${
                selectedCategory === cat
                  ? "bg-gray-300 text-black  shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 bg-white p-2.5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition text-gray-800"
        />
      </div>

      {/* Lista de productos */}
      {filteredProducts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              width={500} // puedes ajustar según el tamaño real que uses
              height={500}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-md"
            />
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h2>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">{product.description}</p>

                <div className="mt-auto">
                  <p className="text-green-600 font-semibold text-base mb-1">{formatPrice(product.price)}</p>
                  <p className="text-gray-500 text-xs mb-3">{product.category}</p>

                  <Link
                    href={`/products/${product.id}/edit`}
                    className="flex gap-2 items-center font-semibold justify-center text-center bg-transparent text-zinc-500 border-2 border-zinc-500 px-3 py-2 rounded-xl hover:bg-zinc-500 hover:text-white transition text-sm"
                  >
                    <IconEdit></IconEdit>
                    Editar producto
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-20">No hay productos para mostrar</p>
      )}
    </motion.div>
  );
}
