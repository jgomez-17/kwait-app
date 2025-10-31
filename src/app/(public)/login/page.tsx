"use client";

import { useState } from "react";
import { User, Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ username, password });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-slate-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-300/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 bg-white/80 backdrop-blur-xl p-10 rounded-3xl md:shadow-2xl w-full max-w-md border border-white/20"
      >

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-black bg-clip-text text-transparent mb-2">
            Bienvenido de vuelta
          </h1>
          <p className="text-slate-500 text-sm">Accede al panel administrativo</p>
        </motion.div>

        <div className="space-y-5">
          {/* Campo Usuario */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Usuario
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-200 z-10" size={22} />
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full tracking-wider pl-12 pr-4 py-3.5 border-2 border-transparent rounded-3xl outline-none transition-all bg-gray-100 backdrop-blur-sm placeholder:text-sm placeholder:text-gray-300 placeholder:font-medium"
                required
              />
            </div>
          </motion.div>

          {/* Campo Contraseña */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Contraseña
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-200 z-10" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-transparent rounded-3xl outline-none transition-all bg-gray-100 backdrop-blur-sm placeholder:text-gray-200"
                required
              />
            </div>
          </motion.div>

          {/* Botón de submit */}
          <button

            onClick={handleSubmit}
            type="button"
            className="group w-full bg-black text-white font-bold py-4 rounded-3xl transition-all shadow-lg flex items-center justify-center group"
          >
            <span className="group-hover:-translate-x-1 transition">Iniciar sesión</span>
            <ArrowRight className="w-5 absolute opacity-0 group-hover:translate-0 group-hover:relative h-5 group-hover:translate-x-1 group-hover:opacity-100 transition-transform" />
          </button>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-8 pt-6 border-t border-slate-200"
        >
          <p className="text-slate-500 text-xs text-center">
            © {new Date().getFullYear()} Kwait App — Panel administrativo
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}