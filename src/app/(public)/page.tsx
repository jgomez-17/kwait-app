"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Store, Truck } from "lucide-react";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-slate-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-300/10 rounded-full blur-3xl" />
      </div>

      {/* Header con login */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="text-emerald-600 font-bold text-xl"
          >
            Kwait
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/login" 
              className="px-6 py-2.5 rounded-xl border-2 border-emerald-200 hover:border-emerald-400 bg-white/60 backdrop-blur-sm font-semibold text-emerald-700 hover:bg-white transition-all hover:shadow-lg hover:shadow-emerald-500/20"
            > 
              Iniciar sesión
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-30 md:py-24">
        <div className="max-w-6xl mx-auto w-full">
          
          {/* Hero Section */}
          <div className="text-center mb-20 h-screen">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 20,
                duration: 0.3 
              }}
              className="inline-block mb-8 relative"
            >
              <div className="relative rounded-full">
                <Image
                  src="/logo-kwait.jpg"
                  width={250}
                  height={180}
                  alt="Logo Kwait"
                  className="rounded-full mask-radial-at-center mask-radial-from-50% mask-radial-to-70%"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-emerald-400 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Comida para
              </span>
              <br />
              <span className="bg-gradient-to-r from-teal-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                el alma
              </span>
            </motion.h1>
          </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.2 }}
              className="text-slate-600 text-lg text-center md:text-xl max-w-2xl mx-auto mb-12"
            >
              Descubre sabores auténticos preparados con amor. Elige tu experiencia perfecta.
            </motion.p>

          {/* Cards de opciones */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Domicilio */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Link href="/menu">
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-75 overflow-hidden border-2 border-transparent hover:border-emerald-200">
                  {/* Gradiente de fondo */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Ícono decorativo de fondo */}
                  <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Truck className="w-40 h-40" />
                  </div>

                  <div className="relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-full mb-6">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-emerald-700 text-xs font-semibold uppercase tracking-wide">
                        Delivery
                      </span>
                    </div>

                    {/* Ícono principal */}
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Truck className="w-8 h-8 text-white" />
                    </div>

                    {/* Contenido */}
                    <h3 className="text-3xl font-bold text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors">
                      Domicilio
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      Recibe tu pedido directamente en la puerta de tu casa. Rápido, seguro y delicioso.
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold group-hover:gap-4 transition-all">
                      <span>Ordenar ahora</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* En sitio */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Link href="/menu">
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-teal-200">
                  {/* Gradiente de fondo */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Ícono decorativo de fondo */}
                  <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Store className="w-40 h-40" />
                  </div>

                  <div className="relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-100 rounded-full mb-6">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                      <span className="text-teal-700 text-xs font-semibold uppercase tracking-wide">
                        Dine-in
                      </span>
                    </div>

                    {/* Ícono principal */}
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Store className="w-8 h-8 text-white" />
                    </div>

                    {/* Contenido */}
                    <h3 className="text-3xl font-bold text-slate-800 mb-3 group-hover:text-teal-600 transition-colors">
                      En sitio
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      Disfruta de una experiencia única en nuestro local. Ambiente acogedor y servicio excepcional.
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-teal-600 font-semibold group-hover:gap-4 transition-all">
                      <span>Ver menú</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
          
        </div>
      </div>

      {/* Footer decorativo */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
    </main>
  );
}