"use client"

import { useState, useEffect } from "react";
import React from "react";
import { useCart } from "./CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { data } from "framer-motion/client";

export const Cart: React.FC = () => {
  const {
    items,
    totalItems,
    subtotal,
    toggleOpen,
    isOpen,
    updateQty,
    removeItem,
    comment,
    setComment,
    deliveryType,
    setDeliveryType,
    deliveryInfo,
    setDeliveryInfo,
    clear,
  } = useCart();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChangeDeliveryInfo = (k: "name" | "address" | "phone") => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryInfo({ ...deliveryInfo, [k]: e.target.value });
  };

const handleCheckout = async () => {
  const payload = {
    // si tienes un userId o algo similar, agrégalo aquí
    items: items.map((it) => ({
      product: { id: it.product.id }, // 👈 estructura que Prisma espera
      qty: it.qty,
    })),
    subtotal,
    comment,
    deliveryType,
    deliveryInfo: deliveryType === "delivery" ? deliveryInfo : null,
  };

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Error al crear el pedido");

    const data = await res.json();
    console.log("✅ Pedido creado:", data);

    alert("✅ Pedido creado con éxito");
    clear();
    toggleOpen(false);
  } catch (error) {
    console.error("❌ Error al crear pedido:", error);
    alert("Hubo un problema al enviar el pedido.");
  }
};



  return (
    <>
      {/* Cart icon fixed */}
      <div className="fixed right-6 bottom-6 z-50">
        <button
          aria-label="Abrir carrito"
          onClick={() => toggleOpen(true)}
          className="relative bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-2xl hover:shadow-emerald-500/50 px-5 py-3.5 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 3h2l.4 2M7 13h10l3-8H6.4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="20" r="1" fill="currentColor" />
            <circle cx="18" cy="20" r="1" fill="currentColor" />
          </svg>
          <div className="hidden sm:block font-semibold">Carrito</div>
          {totalItems > 0 && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-pink-500 to-red-500 text-white rounded-full w-7 h-7 text-xs flex items-center justify-center shadow-lg font-bold animate-pulse">
              {totalItems}
            </div>
          )}
        </button>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => toggleOpen(false)}
              className="fixed inset-0 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[440px] bg-gradient-to-b from-white to-slate-50 z-50 shadow-2xl overflow-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-5 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Tu pedido</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">Total</div>
                      <div className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        ${subtotal.toFixed(0)}
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleOpen(false)} 
                      className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors group"
                    >
                      <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                {items.length === 0 ? (
                  <div className="text-center py-32">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 text-lg">Tu carrito está vacío</p>
                    <p className="text-slate-400 text-sm mt-2">Agrega productos para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Items */}
                    <div className="space-y-3">
                      {items.map((it) => (
                        <div key={it.product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-slate-100">
                          <div className="flex items-start gap-4 p-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center text-lg font-bold text-emerald-600 flex-shrink-0">
                              {it.product.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-slate-800 text-base leading-tight">{it.product.name}</h4>
                                  <p className="text-sm text-slate-500 mt-0.5">${it.product.price.toFixed(0)} c/u</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-base font-bold text-slate-800">${(it.product.price * it.qty).toFixed(0)}</div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1">
                                  <button
                                    onClick={() => updateQty(it.product.id, it.qty - 1)}
                                    className="w-8 h-8 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 flex items-center justify-center transition-colors text-slate-700 hover:text-emerald-600 font-semibold"
                                  >
                                    −
                                  </button>
                                  <div className="w-10 text-center font-semibold text-slate-800">{it.qty}</div>
                                  <button
                                    onClick={() => updateQty(it.product.id, it.qty + 1)}
                                    className="w-8 h-8 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 flex items-center justify-center transition-colors text-slate-700 hover:text-emerald-600 font-semibold"
                                  >
                                    +
                                  </button>
                                </div>
                                <button 
                                  onClick={() => removeItem(it.product.id)} 
                                  className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Quitar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Comment */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                      <label className=" text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Comentario general
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="P.ej. Sin cebolla en la hamburguesa..."
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none h-24 text-sm"
                      />
                    </div>

                    {/* Delivery type */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                      <label className=" text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Tipo de entrega
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className={`relative cursor-pointer transition-all ${deliveryType === "onsite" ? "" : ""}`}>
                          <input
                            type="radio"
                            name="type"
                            checked={deliveryType === "onsite"}
                            onChange={() => setDeliveryType("onsite")}
                            className="peer sr-only"
                          />
                          <div className="p-4 border-2 rounded-xl peer-checked:border-emerald-500 peer-checked:bg-emerald-50 border-slate-200 hover:border-slate-300 transition-all text-center">
                            <svg className="w-6 h-6 mx-auto mb-2 text-slate-600 peer-checked:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <div className="font-semibold text-sm">En sitio</div>
                          </div>
                        </label>
                        <label className={`relative cursor-pointer transition-all ${deliveryType === "delivery" ? "" : ""}`}>
                          <input
                            type="radio"
                            name="type"
                            checked={deliveryType === "delivery"}
                            onChange={() => setDeliveryType("delivery")}
                            className="peer sr-only"
                          />
                          <div className="p-4 border-2 rounded-xl peer-checked:border-emerald-500 peer-checked:bg-emerald-50 border-slate-200 hover:border-slate-300 transition-all text-center">
                            <svg className="w-6 h-6 mx-auto mb-2 text-slate-600 peer-checked:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                            </svg>
                            <div className="font-semibold text-sm">Domicilio</div>
                          </div>
                        </label>
                      </div>

                      {deliveryType === "delivery" && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 space-y-3"
                        >
                          <input
                            placeholder="Nombre completo"
                            value={deliveryInfo.name || ""}
                            onChange={handleChangeDeliveryInfo("name")}
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                          />
                          <input
                            placeholder="Dirección de entrega"
                            value={deliveryInfo.address || ""}
                            onChange={handleChangeDeliveryInfo("address")}
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                          />
                          <input
                            placeholder="Teléfono de contacto"
                            value={deliveryInfo.phone || ""}
                            onChange={handleChangeDeliveryInfo("phone")}
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer sticky */}
              {items.length > 0 && (
                <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Subtotal</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        ${subtotal.toFixed(0)}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => clear()} 
                      className="px-5 py-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-semibold text-slate-700 transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Vaciar
                    </button>
                    <button 
                      onClick={handleCheckout} 
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg hover:shadow-xl hover:shadow-emerald-500/50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirmar pedido
                    </button>
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};