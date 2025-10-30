"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["Hamburguesas", "Pizzas", "Bebidas", "Postres", "Entradas", "Combos"];

export default function EditProductClient() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const id = params?.id;

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setCategoryMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // === FETCH PRODUCT ===
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Error al cargar producto");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
        alert("Error al cargar producto");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, pathname]);

  // === HANDLE SAVE ===
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Error al guardar cambios");
      alert("✅ Producto actualizado correctamente");
      router.push("/products");
    } catch (error) {
      console.error(error, product);
      console.log(product);
      alert("❌ Error al guardar cambios");
    } finally {
      setIsSaving(false);
    }
  };

  // === HANDLE DELETE ===
  const handleDelete = async () => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar producto");
      alert("🗑️ Producto eliminado correctamente");
      router.push("/products");
    } catch (error) {
      console.error(error);
      alert("❌ Error al eliminar producto");
    } finally {
      setIsDeleting(false);
    }
  };

  // === HANDLE INPUT CHANGE ===
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-slate-600 font-semibold">Cargando producto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header con botón de retroceso */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 font-semibold shadow-sm hover:shadow-md transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </motion.button>
          
          <div className="flex-1">
            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-emerald-600 bg-clip-text text-transparent">
              Editar Producto
            </h2>
            <p className="text-slate-600 text-sm mt-1">Actualiza la información del producto</p>
          </div>
        </motion.div>

        {/* Formulario principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl border-2 border-slate-100 overflow-hidden"
        >
          {/* Preview de imagen */}
          <div className="relative h-64 bg-gradient-to-br from-emerald-100 to-teal-100 overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt="Preview"
                className="w-full h-full object-cover"
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

          {/* Campos del formulario */}
          <div className="p-8 space-y-6">
            {/* Nombre del producto */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                Nombre del producto
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ej: Hamburguesa Clásica"
                value={product.name}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-slate-800 font-medium placeholder-slate-400"
              />
            </div>

            {/* Precio y Categoría en grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Precio */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Precio
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                  <input
                    type="number"
                    name="price"
                    placeholder="15000"
                    value={product.price}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-slate-800 font-medium placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Categoría con menú dropdown */}
              <div className="space-y-2" ref={categoryMenuRef}>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Categoría
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-slate-800 font-medium text-left flex items-center justify-between"
                  >
                    <span className={product.category ? "text-slate-800" : "text-slate-400"}>
                      {product.category || "Seleccionar categoría"}
                    </span>
                    <svg
                      className={`w-5 h-5 text-slate-500 transition-transform ${categoryMenuOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Menú desplegable */}
                  <AnimatePresence>
                    {categoryMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 w-full bg-white border-2 border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
                      >
                        <div className="py-2">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setProduct((prev) => ({ ...prev, category: cat }));
                                setCategoryMenuOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left font-medium transition-all ${
                                product.category === cat
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                Descripción
              </label>
              <textarea
                name="description"
                placeholder="Describe los ingredientes y características del producto..."
                value={product.description || ""}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-slate-800 font-medium placeholder-slate-400 resize-none"
              />
            </div>

            {/* URL de imagen */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                URL de imagen
              </label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  type="text"
                  name="image"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={product.image || ""}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-slate-800 font-medium placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="px-8 pb-8 flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar cambios
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDelete}
              disabled={isDeleting}
              className="sm:w-auto px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Eliminando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}