"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { BackIcon } from "@/app/components/icons";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "Hamburguesas",
    image: "",
  });

  const categories = [
    "Hamburguesas",
    "Pizzas",
    "Bebidas",
    "Perros Calientes",
    "Arepas",
    "Sandwiches",
    "Tacos",
    "Postres",
    "Combos",
    "Extras",
  ];

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setProduct({ ...product, price: Number(rawValue) });
  };

  const handleSave = async () => {
    if (!product.name || !product.price) {
      alert("Por favor, completa los campos obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          available: true,
        }),
      });

      if (!res.ok) throw new Error("Error al crear el producto");

      const data = await res.json();
      console.log("✅ Producto creado:", data);
      router.push("/products");
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Ocurrió un error al guardar el producto.");
    } finally {
      setLoading(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="sm:p-2"
    >
      <button
        onClick={() => router.push("/products")}
        className="flex items-center text-md font-medium gap-2 text-gray-700 mb-8 hover:text-emerald-600 transition"
      >
        <BackIcon />
        <span>Volver</span>
      </button>

      <div className="rounded-2xl">
        <h2 className="text-xl font-semibold mb-8 border-b border-gray-200 pb-2">
          Agregar Producto
        </h2>

        {/* Imagen (URL) */}
        <div className="mb-8 md:max-w-1/2">
          <label className="block font-medium mb-2 text-gray-700">
            URL de la imagen
          </label>
          <input
            type="text"
            value={product.image}
            onChange={(e) => setProduct({ ...product, image: e.target.value })}
            placeholder="Ejemplo: https://mi-servidor.com/imagen.jpg"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
          />
          {product.image && (
            <motion.img
              src={product.image}
              alt="Preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-64 object-cover rounded-lg shadow-md mt-3"
            />
          )}
        </div>

        {/* Nombre */}
        <div className="mb-6 md:max-w-1/2">
          <label className="block font-medium mb-2 text-gray-700">Nombre</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            placeholder="Ejemplo: Hamburguesa clásica"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
          />
        </div>

        {/* Descripción */}
        <div className="mb-6 md:max-w-1/2">
          <label className="block font-medium mb-2 text-gray-700">
            Descripción
          </label>
          <textarea
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            placeholder="Describe brevemente el producto..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition resize-none"
          />
        </div>

        {/* Precio */}
        <div className="mb-6 md:max-w-1/2">
          <label className="block font-medium mb-2 text-gray-700">
            Precio (COP)
          </label>
          <input
            type="text"
            value={product.price === 0 ? "" : formattedPrice}
            onChange={handlePriceChange}
            placeholder="$0"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
          />
        </div>

        {/* Categoría */}
        <div className="mb-8 md:max-w-1/2">
          <label className="block font-medium mb-2 text-gray-700">
            Categoría
          </label>
          <select
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Botón Guardar */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          onClick={handleSave}
          className={`w-full md:max-w-1/2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-emerald-500 hover:to-emerald-400 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Guardando..." : "Guardar"}
        </motion.button>
      </div>
    </motion.div>
  );
}
