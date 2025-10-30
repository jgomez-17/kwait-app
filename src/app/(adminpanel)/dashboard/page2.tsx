"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MoreVertical,
  Edit,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  MapPin,
} from "lucide-react";

type Estado =
  | "pendiente"
  | "en preparación"
  | "en camino"
  | "entregado"
  | "cancelado";

interface Pedido {
  id: number;
  cliente: string;
  producto: string;
  tipo: "sitio" | "domicilio";
  total: string;
  descripcion: string;
  estado: Estado;
}

export default function DashboardPedidos() {
  const [filtro, setFiltro] = useState<Estado | "todos">("todos");
  const [orders, setOrders] = useState<Pedido[]>([
    {
      id: 1,
      cliente: "Juan Pérez",
      producto: "Hamburguesa Clásica",
      tipo: "sitio",
      total: "$25.000",
      descripcion: "Sin cebolla, con extra queso.",
      estado: "pendiente",
    },
    {
      id: 2,
      cliente: "Ana Torres",
      producto: "Perro Especial",
      tipo: "domicilio",
      total: "$22.000",
      descripcion: "Con salsas aparte.",
      estado: "en preparación",
    },
    {
      id: 3,
      cliente: "Carlos Gómez",
      producto: "Combo Familiar",
      tipo: "sitio",
      total: "$65.000",
      descripcion: "Con papas medianas y gaseosa de litro.",
      estado: "entregado",
    },
    {
      id: 4,
      cliente: "Sofía López",
      producto: "Combo Doble",
      tipo: "sitio",
      total: "$48.000",
      descripcion: "Sin tomate.",
      estado: "pendiente",
    },
  ]);

  const cambiarEstado = (id: number, nuevoEstado: Estado) => {
    setOrders((prev) =>
      prev.map((pedido) =>
        pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido
      )
    );
  };

  const editarPedido = (id: number) => {
    alert(`Editar pedido #${id}`);
  };

  const pedidosFiltrados =
    filtro === "todos"
      ? orders
      : orders.filter((pedido) => pedido.estado === filtro);

  const estados = [
    "todos",
    "pendiente",
    "en preparación",
    "en camino",
    "entregado",
    "cancelado",
  ] as const;

  return (
    <section className="w-full">
      {/* Header y filtro */}
      <div className="py-4 border-b-1 border-gray-200 flex flex-row items-center justify-between gap-2">
        <h3 className="text-xl font-semibold">
          Gestión de pedidos
        </h3>
        <span className="text-sm text-gray-500">
          {pedidosFiltrados.length} pedidos encontrados
        </span>
      </div>

      {/* Botones de filtro */}
      <div className="flex flex-wrap items-center gap-2 my-4">
        {estados.map((estado) => (
          <motion.button
            key={estado}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFiltro(estado)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filtro === estado
                ? "bg-gray-300 text-black shadow-md"
                : "bg-white shadow text-gray-600 hover:bg-gray-200"
            }`}
          >
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Cards de pedidos */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {pedidosFiltrados.map((pedido) => (
          <motion.div
            key={pedido.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-150 p-4 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-800 text-base">
                  {pedido.producto}
                </h4>
                <p className="text-sm text-gray-500">
                  Pedido #{pedido.id} — {pedido.cliente}
                </p>
              </div>
              <EstadoBadge estado={pedido.estado} />
            </div>

            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" />
                <span className="capitalize">{pedido.tipo}</span>
              </p>
              <p className="flex items-center gap-2">
                <FileText size={14} className="text-gray-400" />
                <span>{pedido.descripcion}</span>
              </p>
              <p className="text-emerald-600 font-semibold mt-1">
                Total: {pedido.total}
              </p>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => editarPedido(pedido.id)}
                className="flex items-center gap-1 text-sm font-medium bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg transition"
              >
                <Edit size={14} /> Editar
              </button>

              <MenuOpciones
                onSelect={(estado) =>
                  cambiarEstado(pedido.id, estado as Estado)
                }
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* 🔹 Estado visual */
const EstadoBadge = ({ estado }: { estado: Estado }) => {
  const colores = {
    pendiente: "bg-yellow-100 text-yellow-700 border-yellow-300",
    "en preparación": "bg-orange-100 text-orange-700 border-orange-300",
    "en camino": "bg-blue-100 text-blue-700 border-blue-300",
    entregado: "bg-green-100 text-green-700 border-green-300",
    cancelado: "bg-gray-100 text-gray-600 border-gray-300",
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${colores[estado]}`}
    >
      {estado}
    </span>
  );
};

/* 🔹 Menú de opciones */
const MenuOpciones = ({ onSelect }: { onSelect: (estado: Estado) => void }) => {
  const [open, setOpen] = useState(false);
  const [showUp, setShowUp] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const espacioAbajo = window.innerHeight - rect.bottom;
      const espacioArriba = rect.top;
      setShowUp(espacioAbajo < 180 && espacioArriba > 180);
    }
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1"
      >
        <MoreVertical size={14} /> Opciones
      </button>

      {open && (
        <div
          className={`absolute right-0 w-44 bg-white border border-gray-200 shadow-lg rounded-lg z-20 ${
            showUp ? "bottom-full mb-2" : "mt-2"
          }`}
        >
          <ul className="text-sm text-gray-700">
            <MenuItem
              icon={<Clock size={14} />}
              label="En preparación"
              onClick={() => {
                onSelect("en preparación");
                setOpen(false);
              }}
            />
            <MenuItem
              icon={<Truck size={14} />}
              label="En camino"
              onClick={() => {
                onSelect("en camino");
                setOpen(false);
              }}
            />
            <MenuItem
              icon={<CheckCircle2 size={14} />}
              label="Entregado"
              onClick={() => {
                onSelect("entregado");
                setOpen(false);
              }}
            />
            <MenuItem
              icon={<XCircle size={14} />}
              label="Cancelado"
              onClick={() => {
                onSelect("cancelado");
                setOpen(false);
              }}
            />
          </ul>
        </div>
      )}
    </div>
  );
};

const MenuItem = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <li
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
  >
    {icon} {label}
  </li>
);
