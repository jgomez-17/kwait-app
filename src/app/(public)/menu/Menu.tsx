"use client"

import React, { useState, useEffect } from "react";
import { Product, useCart } from "./CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";

export const Menu: React.FC = () => {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Agrupar productos por categoría
  const byCategory = products.reduce<Record<string, Product[]>>((acc, p) => {
    acc[p.category] = acc[p.category] || [];
    acc[p.category].push(p);
    return acc;
  }, {});

  const categories = Object.keys(byCategory);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.05 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.05 } },
  };

  const categoryIcons: Record<string, string> = {
    "Hamburguesas": "🍔",
    "Pizzas": "🍕",
    "Bebidas": "🥤",
    "Postres": "🍰",
    "Ensaladas": "🥗",
    "Desayunos": "🍳",
    "Comida Mexicana": "🌮",
    "Sushi": "🍱",
  };

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || "🍽️";
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600 mb-4"></div>
          <p className="text-slate-600 text-lg">Cargando menú...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center bg-red-50 border-2 border-red-200 rounded-3xl p-8 max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error al cargar el menú</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Vista de categorías */}
          {!selectedCategory && (
            <motion.div
              key="categories"
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
    
            >
              {/* Header */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.1 }}
                  className="inline-block mb-4"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/30 rotate-3">
                    <span className="text-4xl">🍽️</span>
                  </div>
                </motion.div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                  Nuestro Menú
                </h1>
                <p className="text-slate-600 text-lg">Explora nuestras deliciosas opciones</p>
              </div>

              {/* Grid de categorías */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((cat, index) => (
                  <motion.button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 overflow-hidden"
                  >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-75" />
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-500 group-hover:to-teal-600 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md">
                        <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                          {getCategoryIcon(cat)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-slate-800 group-hover:text-emerald-600 transition-colors">
                          {cat}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {byCategory[cat].length} {byCategory[cat].length === 1 ? 'producto' : 'productos'}
                        </p>
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Vista de productos */}
          {selectedCategory && (
            <motion.div
              key="products"
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header de categoría */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-8 shadow-lg sticky top-4 z-20">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 transition-all group"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold">Volver</span>
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{getCategoryIcon(selectedCategory)}</span>
                    <div className="text-left">
                      <h3 className="text-2xl font-bold text-slate-800">{selectedCategory}</h3>
                      <p className="text-sm text-slate-500">
                        {byCategory[selectedCategory].length} opciones disponibles
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid de productos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {byCategory[selectedCategory].map((p, index) => (
                  <motion.article
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 overflow-hidden"
                  >
                    {/* Imagen del producto */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
                      {p.img ? (
                        <img
                          src={p.img}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl opacity-30">
                            {getCategoryIcon(selectedCategory)}
                          </span>
                        </div>
                      )}
                      {/* Badge de categoría */}
                      <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-emerald-600 shadow-md">
                        {selectedCategory}
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-6">
                      <h4 className="font-bold text-xl text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                        {p.description || "Deliciosa opción preparada con los mejores ingredientes"}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div>
                          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Precio</div>
                          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            ${p.price.toFixed(0)}
                          </div>
                        </div>
                        <button
                          onClick={() => addItem(p)}
                          className="group/btn relative px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95"
                        >
                          <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-300" />
                          <span>Agregar</span>
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};