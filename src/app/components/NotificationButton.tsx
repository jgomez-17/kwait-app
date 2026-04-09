"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Notifications2Solid } from "@/app/components/icons";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
}

const sampleNotifications: Notification[] = [
  { id: 1, title: "Nuevo pedido", message: "Tienes un nuevo pedido pendiente.", time: "Hace 5 min" },
  { id: 2, title: "Producto no disponible", message: "El producto no esta en stock.", time: "Hace 30 min" },
  { id: 3, title: "producto creado correctamente", message: "el producto pizza 3 carnes fue creado correctamente.", time: "Hace 1 h" },
];

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón de notificaciones */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Notificaciones"
        className={`relative text-zinc-400 hover:bg-zinc-800/5 px-3 py-2 rounded-lg hover:text-emerald-400 transition-all
          ${open ? "bg-zinc-800/5 text-emerald-400" : ""}`}
      >
        <Notifications2Solid />
        {/* Badge de notificaciones */}
        {sampleNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
            {sampleNotifications.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Fondo oscuro para móviles */}
            <motion.div
              className="fixed inset-0 bg-white backdrop-blur-sm z-40 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* PANEL EN PANTALLAS GRANDES */}
            <motion.div
              key="panel-desktop"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="hidden sm:block absolute right-0 mt-3 z-50 w-96 
                         bg-white shadow rounded-2xl
                         overflow-hidden"
            >
              {/* Flecha triangular apuntando al botón */}
              <div className="absolute -top-2 right-4 w-4 h-4 transform rotate-45" />
              
              {/* Encabezado */}
              <div className="px-5 py-4 shadow-xs border-zinc-800 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold">Notificaciones</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{sampleNotifications.length} nuevas</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-xs font-semibold transition-colors px-3 py-1.5 hover:bg-zinc-800/5 rounded-lg"
                >
                  Cerrar
                </button>
              </div>

              {/* Lista */}
              <div className="max-h-[70vh] overflow-y-auto">
                {sampleNotifications.length > 0 ? (
                  sampleNotifications.map((n, index) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-5 py-4 hover:bg-zinc-800/5 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold group-hover:text-emerald-400 transition-colors">
                            {n.title}
                          </p>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            {n.message}
                          </p>
                          <p className="text-[11px] text-zinc-500 mt-2">
                            {n.time}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="px-5 py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <p className="text-zinc-400 text-sm">No tienes notificaciones nuevas</p>
                  </div>
                )}
              </div>

              {/* Footer opcional */}
              {sampleNotifications.length > 0 && (
                <div className="px-5 py-3 border-t border-zinc-800/10">
                  <button className="w-full text-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors py-2 hover:bg-zinc-800/5 rounded-lg">
                    Ver todas las notificaciones
                  </button>
                </div>
              )}
            </motion.div>

            {/* PANEL EN PANTALLAS PEQUEÑAS */}
            <motion.div
              key="panel-mobile"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="sm:hidden fixed inset-x-0 bottom-0 top-20 z-50 
                         bg-zinc-900 shadow-2xl 
                         rounded-t-3xl border-t-2 border-zinc-800 overflow-hidden flex flex-col"
            >
              {/* Handle visual para deslizar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-zinc-700 rounded-full" />
              </div>

              {/* Encabezado móvil */}
              <div className="px-5 py-4 border-b border-zinc-800 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Notificaciones
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{sampleNotifications.length} nuevas</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors px-3 py-2 hover:bg-zinc-800 rounded-lg"
                >
                  Cerrar
                </button>
              </div>

              {/* Lista móvil */}
              <div className="flex-1 overflow-y-auto">
                {sampleNotifications.length > 0 ? (
                  sampleNotifications.map((n, index) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-5 py-4 border-b border-zinc-800 active:bg-zinc-800/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white">{n.title}</p>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{n.message}</p>
                          <p className="text-[11px] text-zinc-500 mt-2">{n.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="px-5 py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <p className="text-zinc-400 text-sm">No tienes notificaciones nuevas</p>
                  </div>
                )}
              </div>

              {/* Footer móvil */}
              {sampleNotifications.length > 0 && (
                <div className="px-5 py-4 border-t border-zinc-800 bg-zinc-900">
                  <button className="w-full text-center text-sm font-semibold text-emerald-400 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
                    Ver todas las notificaciones
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}