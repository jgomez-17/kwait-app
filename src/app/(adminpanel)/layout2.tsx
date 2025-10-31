"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import "../(adminpanel)/global.css";
import { IconLogout } from "@tabler/icons-react";
import { X } from "lucide-react";
import { ReportsIcon, BagSolid, UsersSolid, DashboardIcon } from "@/app/components/icons";

import {
  Menu,
  X as XIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import NotificationsMenu from "../components/NotificationButton";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (

      <div className={`min-h-screen flex flex-col bg-zinc-800 z-50`}>
        {/* Header */}
        <header
          className={`w-full bg-zinc-800 text-center h-18 flex items-center justify-between px-4 fixed top-0 right-0 z-50 transition-all ${
              sidebarCollapsed ? "" : ""
            }`}
        >
          <button
            className="md:hidden text-gray-600 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="flex transition w-full justify-center items-center gap-3">
            <h2 className="text-xl transition-all font-semibold text-white">
              Panel de administración
            </h2>
          </div>
          <NotificationsMenu />

        </header>

        <div className="flex flex-1">
          {/* Sidebar (desktop) */}
          <aside
            className={`hidden md:flex bg-zinc-800 md:flex-col pt-3 transition-all duration-75 fixed h-screen z-60 p-1 ${
              sidebarCollapsed ? "md:w-18" : "md:w-64"
            }`}
          >
            <div className="relative flex items-center justify-between px-2">
              <Image
                src="/logo-kwait.jpg"
                alt="Logo Kwait"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="absolute -right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-zinc-800 text-white hover:bg-zinc-700/50 transition rounded-full p-1 shadow-md z-50"
                aria-label="Contraer sidebar"
              >
                {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
            </div>

            <nav className=" gap-1 mt-8 flex flex-col overflow-y-auto">
              <NavItem
                icon={<DashboardIcon />}
                label="Dashboard"
                href="/dashboard"
                collapsed={sidebarCollapsed}
                active={pathname === "/dashboard"}
                
              />
              <NavItem
                icon={<BagSolid />}
                label="Productos"
                href="/products"
                collapsed={sidebarCollapsed}
                active={pathname.startsWith("/products")}
              />
              <NavItem
                icon={<ReportsIcon />}
                label="Reportes"
                href="/reports"
                collapsed={sidebarCollapsed}
                active={pathname.startsWith("/reports")}
              />
              <NavItem
                icon={<UsersSolid />}
                label="Clientes"
                href="/clientes"
                collapsed={sidebarCollapsed}
                active={pathname.startsWith("/clientes")}
              />

              </nav>
              <button
                onClick={() => router.push("/")}
                className="absolute bottom-0 sm:block flex items-center justify-center bg-red-800 text-white px-3 py-2 rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 group"
              >
              <IconLogout size={18} stroke={2.3} />
              </button>
          </aside>

          {/* Contenido principal */}
          <main
            className={`flex-1 overflow-y-auto mt-18 shadow-lg px-6 py-4 transition-all duration-75 bg-white z-20 ${
              sidebarCollapsed ? "md:ml-18" : "md:ml-64"
            }`}
          >
            {children}
          </main>
        </div>

        {/* Sidebar móvil */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.aside
                key="mobile-sidebar"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.1 }}
                className="fixed inset-y-0 left-0 z-40 w-60 bg-zinc-800 shadow-lg md:hidden"
              >
                <div className="flex items-center justify-between h-16 px-3">
                  <h1 className="text-lg font-semibold text-emerald-400">
                    Kwait App
                  </h1>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-600"
                  >
                    <XIcon size={20} />
                  </button>
                </div>

                <nav className="p-2 flex flex-col gap-2">
                  <NavItem icon={<DashboardIcon />} label="Dashboard" href="/dashboard" active={pathname === "/dashboard"} />
                  <NavItem icon={<BagSolid />} label="Productos" href="/products" active={pathname.startsWith("/products")} />
                  <NavItem icon={<ReportsIcon />} label="Pedidos" href="/reports" active={pathname.startsWith("/reports")} />
                  <NavItem icon={<UsersSolid />} label="Clientes" href="/dashboard/clientes" active={pathname.startsWith("/dashboard/clientes")} />
                </nav>
                <button
                  onClick={() => router.push("/")}
                  className="flex absolute w-11/12 items-center gap-2 bottom-0 right-1 left-2 justify-center bg-red-800 text-white px-3 p-2 rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 group"
                >
                <IconLogout size={18} stroke={2.3} className="group-hover:-translate-x-0.5 transition" />

                <span
                  className="text-sm opacity-0 absolute translate-x-4 group-hover:translate-0 group-hover:opacity-100 group-hover:relative transition-all duration-100 whitespace-nowrap"
                >
                Logout
                </span>
                </button>
              </motion.aside>

              <motion.div
                key="mobile-overlay"
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/40 z-30 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </>
          )}
        </AnimatePresence>
      </div>
  );
}

/* ===== SUBCOMPONENTE NavItem ===== */
const NavItem = ({
  icon,
  label,
  href,
  collapsed,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  collapsed?: boolean;
  active?: boolean;
}) => (
  <Link
    href={href}
    className={`flex items-center rounded-xl gap-2 px-3 py-2 transition font-medium
      ${
        active
          ? "bg-emerald-400/10 text-emerald-300 hover:text-emerald-500 shadow"
          : "text-gray-400 hover:bg-emerald-400/10 hover:text-emerald-200"
      }
      ${collapsed ? "flex-col justify-center text-center " : ""}
    `}
  >
    {icon}
    <span
      className={`${collapsed ? "text-[10px] block" : "text-sm block"} transition-all`}
    >
      {label}
    </span>
  </Link>
);
