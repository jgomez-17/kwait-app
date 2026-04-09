"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-red-200 px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-12 flex flex-col items-center text-center">
        {/* Icono */}
        <div className="bg-red-100 p-5 rounded-full mb-6 animate-pulse">
          <ShieldAlert className="w-12 h-12 text-red-600" />
        </div>

        {/* Mensaje principal */}
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">
          Acceso Denegado
        </h1>

        {/* Mensaje secundario */}
        <p className="text-gray-600 mb-8">
          No tienes permisos para acceder a esta página. Por favor inicia sesión con una cuenta autorizada.
        </p>

        {/* Botón */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
