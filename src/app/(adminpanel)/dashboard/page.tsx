"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Estado =
  | "pendiente"
  | "en preparación"
  | "en camino"
  | "entregado"
  | "cancelado";

interface Pedido {
  id: number;
  cliente: string;
  productos: { name: string; quantity: number }[]; // 🟢 Ahora es un array
  tipo: "sitio" | "domicilio";
  total: string;
  descripcion: string;
  estado: Estado;
}

// 🟢 Nuevo tipo para respuestas del backend
interface PedidoApi {
  id: number;
  subtotal: number;
  comment?: string | null;
  deliveryType: "sitio" | "domicilio" | "delivery" | "onsite";
  status:
    | "PENDING"
    | "IN_PROGRESS"
    | "ON_THE_WAY"
    | "DELIVERED"
    | "CANCELLED";
  deliveryInfo?: {
    name?: string | null;
  } | null;
  items?: {
    qty?: number; // 🔥 Corrección: es qty, no quantity
    product?: {
      name?: string | null;
    };
  }[];
}

export default function DashboardPedidos() {
  const [filtro, setFiltro] = useState<Estado | "todos">("todos");
  const [orders, setOrders] = useState<Pedido[]>([]);

  // 🟢 Fetch de datos desde backend
  useEffect(() => {
    async function fetchPedidos() {
      const res = await fetch("/api/orders");
      const data = (await res.json()) as PedidoApi[];

      const pedidosAdaptados: Pedido[] = data.map((order) => ({
        id: order.id,
        cliente: order.deliveryInfo?.name || "Cliente desconocido",
        productos:
          order.items?.map((item) => ({
            name: item.product?.name || "Producto sin nombre",
            quantity: item.qty || 1,
          })) || [],
        tipo: order.deliveryType === "delivery" ? "domicilio" : "sitio",
        total: `${order.subtotal.toLocaleString("es-CO")}`,
        descripcion: order.comment || "Sin descripción",
        estado:
          order.status === "PENDING"
            ? "pendiente"
            : order.status === "IN_PROGRESS"
            ? "en preparación"
            : order.status === "ON_THE_WAY"
            ? "en camino"
            : order.status === "DELIVERED"
            ? "entregado"
            : "cancelado",
      }));

      setOrders(pedidosAdaptados);
    }

    fetchPedidos();
  }, []);

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

  const stats = {
    total: orders.length,
    pendientes: orders.filter((o) => o.estado === "pendiente").length,
    enPreparacion: orders.filter((o) => o.estado === "en preparación").length,
    entregados: orders.filter((o) => o.estado === "entregado").length,
  };

  return (
    <section className="w-full space-y-6">
      {/* Header mejorado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-center font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Gestión de pedidos
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
          <svg
            className="w-5 h-5 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <span className="text-sm font-semibold text-emerald-700">
            {pedidosFiltrados.length}{" "}
            {pedidosFiltrados.length === 1 ? "pedido" : "pedidos"}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total" value={stats.total} color="blue" />
        <StatCard label="Pendientes" value={stats.pendientes} color="yellow" />
        <StatCard
          label="En proceso"
          value={stats.enPreparacion}
          color="orange"
        />
        <StatCard label="Entregados" value={stats.entregados} color="green" />
      </div>

      {/* Filtros mejorados */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
          <h3 className="text-sm font-semibold text-slate-700">
            Filtrar por estado
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {estados.map((estado) => (
            <motion.button
              key={estado}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFiltro(estado)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filtro === estado
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Cards de pedidos mejoradas */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        {pedidosFiltrados.map((pedido) => (
<div
  key={pedido.id}
  className="group border border-slate-200 rounded-xl shadow-sm hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300 overflow-hidden bg-white"
>
  {/* Header */}
  <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Pedido #{pedido.id}
          </span>
          <TipoBadge tipo={pedido.tipo} />
        </div>
        <p className="text-sm font-medium text-slate-700 mt-0.5 truncate">
          {pedido.cliente}
        </p>
      </div>
      <EstadoBadge estado={pedido.estado} />
    </div>
  </div>

  {/* Body */}
  <div className="px-4 py-3 space-y-3">
    {/* Productos */}
    <div>
      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        Productos ({pedido.productos.length})
      </div>
      <div className="space-y-1 max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {pedido.productos.map((producto, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-sm bg-slate-50 rounded-md px-3 py-1.5"
          >
            <span className="font-medium text-slate-700 truncate flex-1">
              {producto.name}
            </span>
            <span className="text-xs font-bold text-slate-500 bg-white border border-slate-100 px-2 py-0.5 rounded-md">
              x{producto.quantity}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Comentario */}
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
      <div className="flex items-start gap-2">
        <svg
          className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide mb-0.5">
            Comentario
          </p>
          <p className="text-sm text-amber-900 leading-snug line-clamp-2">
            {pedido.descripcion && pedido.descripcion !== "Sin descripción"
              ? pedido.descripcion
              : "Sin comentarios adicionales"}
          </p>
        </div>
      </div>
    </div>

    {/* Total */}
    <div className="pt-2 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-medium">
          Total del pedido
        </span>
        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          {pedido.total}
        </span>
      </div>
    </div>
  </div>

  {/* Footer */}
  <div className="px-4 pb-4 flex gap-2">
    <button
      onClick={() => editarPedido(pedido.id)}
      className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
      <span>Editar</span>
    </button>

    <MenuOpciones
      onSelect={(estado) => cambiarEstado(pedido.id, estado as Estado)}
    />
  </div>
</div>

        ))}
      </motion.div>

      {/* Empty state */}
      {pedidosFiltrados.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">
            No hay pedidos
          </h3>
          <p className="text-slate-500">
            No se encontraron pedidos con el filtro seleccionado
          </p>
        </motion.div>
      )}
    </section>
  );
}

const StatCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "blue" | "yellow" | "orange" | "green";
}) => {
  const colors = {
    blue: "from-blue-500 to-cyan-600",
    yellow: "from-yellow-500 to-orange-500",
    orange: "from-orange-500 to-red-500",
    green: "from-emerald-500 to-teal-600",
  };

  const icons = {
    blue: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    yellow: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    orange: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    green: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`p-2.5 rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-lg`}
        >
          {icons[color]}
        </div>
        <span className="text-3xl font-bold text-slate-800">{value}</span>
      </div>
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
};

const TipoBadge = ({ tipo }: { tipo: "sitio" | "domicilio" }) => {
  return tipo === "domicilio" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-100 text-blue-700">
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
        />
      </svg>
      Domicilio
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-100 text-purple-700">
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
      En sitio
    </span>
  );
};

const EstadoBadge = ({ estado }: { estado: Estado }) => {
  const configs = {
    pendiente: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      dot: "bg-yellow-500",
    },
    "en preparación": {
      bg: "bg-orange-100",
      text: "text-orange-700",
      dot: "bg-orange-500",
    },
    "en camino": {
      bg: "bg-blue-100",
      text: "text-blue-700",
      dot: "bg-blue-500",
    },
    entregado: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    cancelado: {
      bg: "bg-slate-100",
      text: "text-slate-600",
      dot: "bg-slate-500",
    },
  } as const;

  const config = configs[estado];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${config.bg} ${config.text}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`}
      />
      {estado}
    </span>
  );
};

const MenuOpciones = ({
  onSelect,
}: {
  onSelect: (estado: Estado) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = 280; // altura aproximada del menú
      setOpenUpwards(spaceBelow < menuHeight);
    }
    setOpen(!open);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="px-4 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
        <span>Estado</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: openUpwards ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: openUpwards ? 10 : -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 ${
              openUpwards ? "bottom-full mb-2" : "top-full mt-2"
            } w-56 bg-white border border-slate-200 shadow-xl rounded-2xl z-50 overflow-hidden`}
          >
            <div className="p-2">
              <MenuItem
                label="Pendiente"
                color="yellow"
                onClick={() => {
                  onSelect("pendiente");
                  setOpen(false);
                }}
              />
              <MenuItem
                label="En preparación"
                color="orange"
                onClick={() => {
                  onSelect("en preparación");
                  setOpen(false);
                }}
              />
              <MenuItem
                label="En camino"
                color="blue"
                onClick={() => {
                  onSelect("en camino");
                  setOpen(false);
                }}
              />
              <MenuItem
                label="Entregado"
                color="green"
                onClick={() => {
                  onSelect("entregado");
                  setOpen(false);
                }}
              />
              <MenuItem
                label="Cancelado"
                color="red"
                onClick={() => {
                  onSelect("cancelado");
                  setOpen(false);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuItem = ({
  label,
  color,
  onClick,
}: {
  label: string;
  color: string;
  onClick: () => void;
}) => {
  const colorClasses = {
    yellow: "hover:bg-yellow-50 hover:text-yellow-700",
    orange: "hover:bg-orange-50 hover:text-orange-700",
    blue: "hover:bg-blue-50 hover:text-blue-700",
    green: "hover:bg-emerald-50 hover:text-emerald-700",
    red: "hover:bg-red-50 hover:text-red-700",
  }[color];

  const icons = {
    yellow: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    orange: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    blue: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
        />
      </svg>
    ),
    green: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    red: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  }[color];

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-medium text-sm transition-all ${colorClasses}`}
    >
      {icons}
      <span>{label}</span>
    </button>
  );
};