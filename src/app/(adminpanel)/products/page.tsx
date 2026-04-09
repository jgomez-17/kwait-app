"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { EditIcon, Food1, RoundedPlus } from "@/app/components/icons";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [search, setSearch] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // ✅ Fetch desde la API (reemplaza products.json)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("❌ Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ["Todas", ...new Set(products.map((p) => p.category))];
  
  const formatPrice = (value: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);

  const filteredProducts = products.filter(
    (p) =>
      (selectedCategory === "Todas" || p.category === selectedCategory) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Check scroll position
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full space-y-6"
    >
      {/* Header */}
      <div className="flex border-b border-slate-200 py-4 items-center sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-xl text-center font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Products
          </h3>
        </div>
        <div className="flex gap-2">
          <Link 
            href={"/menu "} prefetch={false}
            className="bg-amber-400 text-sm font-semibold flex items-center gap-2 px-2 h-10 transition rounded-xl hover:bg-amber-300">
          <Food1 />
          Show menu
          </Link>
          <Link
            href="/products/addProduct"
            className="sm:relative h-10 sm:rounded-xl sm:right-0 sm:bottom-0 right-4 bottom-4 flex items-center gap-2 text-center bg-emerald-600 hover:from-emerald-600 hover:to-teal-600 fixed p-5 sm:p-3 text-white rounded-full z-30 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-101 transition-all font-semibold text-sm"
          >
            <RoundedPlus />
            <span className="hidden sm:block">Add Product</span>
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid items-center grid-cols-1 md:grid-cols-2 sm:flex-row gap-4">
        {/* Carrusel de categorías */}
        <div className="relative w-full">
          {/* Botón izquierdo */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
          )}

          {/* Contenedor de categorías */}
          <div 
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-10"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === cat
                    ? "bg-gray-400 text-black "
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Botón derecho */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-lg transition-all"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          )}
        </div>

        <div className="relative w-full">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-zinc-600 focus:border-gray-300 outline-none transition text-slate-800 placeholder-slate-300"
          />
        </div>
      </div>

      {/* Lista de productos */}
      <AnimatePresence mode="wait">
        {filteredProducts.length > 0 ? (
          <motion.div
            key="products-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.01 }}
                whileHover={{ scale: 1.01 }}
                className="group border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-75 overflow-hidden flex flex-col"
              >
                {/* Imagen */}
                <div className="relative w-full h-48 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                      Sin imagen
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-75"></div>

                  {/* Badge de categoría */}
                  <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl text-xs font-bold text-slate-700 shadow-lg">
                    {product.category}
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-lg font-bold capitalize text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                    {product.description}
                  </p>

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        Precio
                      </span>
                      <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <Link href={`/products/${product.id}/edit`} prefetch={false}
                    className="flex items-center justify-center gap-2 w-full text-center px-4 py-2 bg-gray-200 font-semibold rounded-xl transition-all border-2 border-transparent hover:border-gray-200 hover:bg-white "
                    >
                      <EditIcon />
                      Editar
                    </Link>

                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="no-products"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-emerald-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              No hay productos
            </h3>
            <p className="text-slate-600">
              No se encontraron productos con los filtros seleccionados
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  );
}