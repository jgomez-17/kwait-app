"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { X, Menu, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { ReportsIcon, BagSolid, UsersSolid, DashboardIcon } from "@/app/components/icons";
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

    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header
        className={`w-full bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 z-40 transition-all duration-300 ${
          sidebarCollapsed ? "md:pl-24" : "md:pl-70"
        }`}
      >
        <button
          className="md:hidden text-slate-600 hover:text-emerald-600 transition-colors p-2 hover:bg-emerald-50 rounded-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        
        <div className="flex-1 flex justify-center md:justify-start items-center gap-3">
          <div className="hidden md:block w-2 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
          <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Panel de administración
          </h2>


        </div>
        
        <div className="flex items-center gap-3">
          <NotificationsMenu />
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Sidebar Desktop */}
        <aside
          className={`hidden md:flex bg-white border-r border-slate-200 flex-col transition-all duration-300 fixed h-[calc(100vh-4rem)] z-30 ${
            sidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          {/* Logo y toggle */}
          <div className="relative flex items-center justify-center p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/logo-kwait.jpg"
                  alt="Logo Kwait"
                  width={44}
                  height={44}
                  className="rounded-xl object-cover shadow-md ring-2 ring-emerald-500/20"
                />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">Kwait</span>
                  <span className="text-xs text-slate-500">Admin Panel</span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white border-2 border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all rounded-full p-1.5 shadow-md z-50"
              aria-label="Contraer sidebar"
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
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

          {/* Logout button */}
          <div className="p-3 border-t border-slate-200">
            <button
              onClick={() => router.push("/")}
              className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold bg-red-50 hover:bg-red-500 text-red-600 hover:text-white transition-all duration-300 ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {!sidebarCollapsed && <span>Cerrar sesión</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 px-4 md:px-8 py-6 transition-all duration-300 ${
            sidebarCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Sidebar Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl md:hidden"
            >
              {/* Header móvil */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo-kwait.jpg"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-lg shadow-md"
                  />
                  <div>
                    <h1 className="text-lg font-bold text-slate-800">Kwait</h1>
                    <p className="text-xs text-slate-500">Admin Panel</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-slate-600 hover:text-emerald-600 p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation móvil */}
              <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
                <NavItem
                  icon={<DashboardIcon />}
                  label="Dashboard"
                  href="/dashboard"
                  active={pathname === "/dashboard"}
                />
                <NavItem
                  icon={<BagSolid />}
                  label="Productos"
                  href="/products"
                  active={pathname.startsWith("/products")}
                />
                <NavItem
                  icon={<ReportsIcon />}
                  label="Reportes"
                  href="/reports"
                  active={pathname.startsWith("/reports")}
                />
                <NavItem
                  icon={<UsersSolid />}
                  label="Clientes"
                  href="/clientes"
                  active={pathname.startsWith("/clientes")}
                />
              </nav>

              {/* Logout móvil */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white">
                <button
                  onClick={() => router.push("/")}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 group"
                >
                  <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </motion.aside>

            <motion.div
              key="mobile-overlay"
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
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

/* ===== NavItem Component ===== */
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
    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative overflow-hidden ${
      active
        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
        : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
    } ${collapsed ? "justify-center" : ""}`}
  >
    {/* Active indicator */}
    {active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
    )}
    
    <span className={`flex-shrink-0 ${collapsed ? "" : "ml-0"}`}>
      {icon}
    </span>
    
    {!collapsed && (
      <span className="text-sm font-semibold">
        {label}
      </span>
    )}
    
    {/* Tooltip for collapsed state */}
    {collapsed && (
      <div className="absolute left-full ml-2 px-3 py-1.5 bg-slate-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-lg">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
      </div>
    )}
  </Link>
);