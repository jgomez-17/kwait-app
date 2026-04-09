"use client";

import { useState } from "react";
import { User, Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("VENDEDOR"); // valor por defecto
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones cliente
    if (!username.trim() || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!role) {
      setError("Selecciona un rol.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Mostrar mensaje de error que venga del backend o uno genérico
        setError(data.error || data.message || "Error al registrar el usuario.");
        setLoading(false);
        return;
      }

      // Registro exitoso
      alert("Usuario registrado correctamente");
      router.push("/login");
    } catch (err) {
      console.error("Error al registrar:", err);
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
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
            Crear cuenta
          </h1>
          <p className="text-slate-500 text-sm">
            Regístrate para acceder al panel administrativo
          </p>
        </motion.div>

        <form className="space-y-5" onSubmit={handleSubmit}>
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

          {/* Confirmar contraseña */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirmar contraseña
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-200 z-10" size={20} />
              <input
                type="password"
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-transparent rounded-3xl outline-none transition-all bg-gray-100 backdrop-blur-sm placeholder:text-gray-200"
                required
              />
            </div>
          </motion.div>

          {/* Select de Rol */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Rol
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-4 pr-4 py-3.5 border-2 border-transparent rounded-3xl outline-none transition-all bg-gray-100 backdrop-blur-sm"
                required
              >
                <option value="ADMIN">Admin</option>
                <option value="VENDEDOR">Vendedor</option>
                <option value="COCINERO">Cocinero</option>
                <option value="REPARTIDOR">Repartidor</option>
              </select>
            </div>
          </motion.div>

          {/* Mensaje de error */}
          {error && (
            <p className="text-red-500 text-sm font-medium text-center mt-2">
              {error}
            </p>
          )}

          {/* Botón de submit */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-black text-white font-bold py-4 rounded-3xl transition-all shadow-lg flex items-center justify-center"
          >
            <span className="group-hover:-translate-x-1 transition">
              {loading ? "Registrando..." : "Registrarse"}
            </span>
            <ArrowRight className="w-5 absolute opacity-0 group-hover:translate-0 group-hover:relative h-5 group-hover:translate-x-1 group-hover:opacity-100 transition-transform" />
          </button>
        </form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8 pt-6 border-t border-slate-200"
        >
          <p className="text-slate-500 text-xs text-center">
            © {new Date().getFullYear()} Kwait App — Registro de usuario
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
