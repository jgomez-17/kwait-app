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
        <h2 className="text-xl font-semibold mb-8 border-b text-center sm:text-left border-gray-200 pb-2">
          Agregar Producto
        </h2>

<div className="relative h-64 md:w-1/2 overflow-hidden bg-gray-200 rounded-xl ">
            {product.image ? (
              <img
                src={product.image}
                alt="Preview"
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-20 h-20 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-slate-400 font-medium">Sin imagen</p>
                </div>
              </div>
            )}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl text-xs font-bold text-slate-700 shadow-lg">
              Vista previa
            </div>
          </div>

        {/* Imagen (URL) */}
        <div className="my-8 md:max-w-1/2 flex flex-col gap-2">
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
            URL de la imagen
          </label>
          <input
            type="text"
            value={product.image}
            onChange={(e) => setProduct({ ...product, image: e.target.value })}
            placeholder="Ejemplo: https://mi-servidor.com/imagen.jpg"
            className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-zinc-600 focus:ring-4 focus:ring-gray-200 outline-none transition-all text-slate-800 font-medium placeholder-slate-300"
          />
        </div>

        {/* Nombre */}
        <div className="mb-6 md:max-w-1/2 flex flex-col gap-2">
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Nombre</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            placeholder="Ejemplo: Hamburguesa clásica"
            className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-zinc-600 focus:ring-4 focus:ring-gray-200 outline-none transition-all text-slate-800 font-medium placeholder-slate-300"
          />
        </div>

        {/* Descripción */}
        <div className="mb-6 md:max-w-1/2 flex flex-col gap-2">
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
            Descripción
          </label>
          <textarea
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            placeholder="Describe brevemente el producto..."
            rows={3}
            className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-zinc-600 focus:ring-4 focus:ring-gray-200 outline-none transition-all text-slate-800 font-medium placeholder-slate-300 resize-none"
          />
        </div>

        {/* Precio */}
        <div className="mb-6 flex flex-col gap-2 md:max-w-1/2">
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
            Precio (COP)
          </label>
          <input
            type="text"
            value={product.price === 0 ? "" : formattedPrice}
            onChange={handlePriceChange}
            placeholder="$ 0"
            className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-zinc-600 focus:ring-4 focus:ring-gray-200 outline-none transition-all text-slate-800 font-medium placeholder-slate-300"
          />
        </div>

        {/* Categoría */}
        <div className="mb-8 md:max-w-1/2 flex flex-col gap-2">
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
            Categoría
          </label>
          <select
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
            className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-zinc-600 focus:ring-4 focus:ring-gray-200 outline-none transition-all text-slate-800 font-medium placeholder-slate-300"
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
