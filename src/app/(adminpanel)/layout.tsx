"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { X, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { ReportsIcon, BagSolid, UsersSolid, DashboardIcon, LogoutIcon, Loading4 } from "@/app/components/icons";
import NotificationsMenu from "../components/NotificationButton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true); // 🔹 nuevo


useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) throw new Error("No autorizado");

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
      router.push("/unauthorized"); // 🔹 redirige si no autorizado
    } finally {
      setLoading(false); // 🔹 ya terminó de intentar
    }
  };

  fetchUser();
}, []);

useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
}, [sidebarOpen]);

const handleLogout = async () => {
  try {
    const res = await fetch("/api/logout", { method: "POST" });

    if (res.ok) {
      // Redirigir después de cerrar sesión correctamente
      window.location.href = "/login";
    } else {
      console.error("Error al cerrar sesión");
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

if (loading) {
    // 🔹 No renderiza nada del dashboard hasta confirmar token
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loading4 />
      </div>
    );
}

if (!user) return null; // seguridad extra, aunque router.replace ya redirige
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className={`w-full bg-white h-18 flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 z-50 transition-all duration-75 shadow ${
          sidebarCollapsed ? "md:pl-24" : "md:pl-70"
        }`}
      >
        <button
          className="md:hidden text-zinc-400 hover:text-emerald-400 transition-colors p-2 hover:bg-zinc-800 rounded-xl"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        
        <div className="flex-1 flex justify-center md:justify-start items-center gap-3">
          <div className="hidden md:block w-2 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full shadow-lg shadow-emerald-500/50" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Admin Panel
          </h2>
        </div>
          {user ? (
          <div className="text-sm py-1 px-3 gap-8 flex items-center">
            <div className="capitalize text-blue-600 rounded-xl px-3 py-1 font-medium">
              <p><strong className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Welcome {user.username}</strong> </p>
            </div>
            {/* <div className="bg-emerald-500/5 text-xs text-emerald-500 font-semibold tracking-wide px-2 py-1 rounded-xl">
              <p className="">{user.role}</p>
            </div> */}
          </div>
          ) : (
            <p className="text-gray-400">Cargando usuario...<Loading4 /> </p>
          )}
        
        <div className="hidden md:block items-center gap-3">
          <NotificationsMenu />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Desktop */}
        <aside
          className={`hidden md:flex bg-white shadow flex-col transition-all duration-75 fixed h-[calc(100vh)] z-50 ${
            sidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          {/* Logo y toggle */}
          <div className="relative flex items-center p-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur opacity-40" />
                <Image
                  src="/logo-kwait.jpg"
                  alt="Logo Kwait"
                  width={44}
                  height={44}
                  className="relative rounded-xl object-cover shadow-xl"
                />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-bold ">Kwait</span>
                  <span className="text-xs text-zinc-400">Admin Panel</span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white  text-zinc-500 hover:text-emerald-400  transition-all rounded-full p-1.5 shadow-lg z-50"
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
              label="Products"
              href="/products"
              collapsed={sidebarCollapsed}
              active={pathname.startsWith("/products")}
            />
            <NavItem
              icon={<ReportsIcon />}
              label="Reports"
              href="/reports"
              collapsed={sidebarCollapsed}
              active={pathname.startsWith("/reports")}
            />
            <NavItem
              icon={<UsersSolid />}
              label="Clients"
              href="/clientes"
              collapsed={sidebarCollapsed}
              active={pathname.startsWith("/clientes")}
            />
            <NavItem
              icon={<UsersSolid />}
              label="Register"
              href="/register"
              collapsed={sidebarCollapsed}
              active={pathname.startsWith("/register")}
            />
          </nav>

          {/* Logout */}
          <div className="p-3">
            <button
              onClick={() => handleLogout()}
              className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium border border-red-700/5 bg-red-600/5 text-red-600 hover:bg-red-600/15 transition-all duration-75 ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
            >
              <LogoutIcon />
              {!sidebarCollapsed && <span>Log out</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 px-4 md:px-8 py-6 transition-all duration-75 bg-white mt-18 ${
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
              className="fixed inset-y-0 left-0 z-50 w-72 bg-zinc-900 shadow-2xl md:hidden border-r border-zinc-800"
            >
              {/* Header móvil */}
              <div className="flex items-center justify-between h-18 px-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg blur opacity-40" />
                    <Image
                      src="/logo-kwait.jpg"
                      alt="Logo"
                      width={40}
                      height={40}
                      className="relative rounded-lg shadow-lg"
                    />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white">Kwait</h1>
                    <p className="text-xs text-zinc-400">Admin Panel</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-zinc-400 hover:text-emerald-400 p-2 hover:bg-zinc-800 rounded-lg transition-colors"
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
                  label="Products"
                  href="/products"
                  active={pathname.startsWith("/products")}
                />
                <NavItem
                  icon={<ReportsIcon />}
                  label="Reports"
                  href="/reports"
                  active={pathname.startsWith("/reports")}
                />
                <NavItem
                  icon={<UsersSolid />}
                  label="Clients"
                  href="/clientes"
                  active={pathname.startsWith("/clientes")}
                />
                <NavItem
                  icon={<UsersSolid />}
                  label="Register"
                  href="/register"
                  active={pathname.startsWith("/register")}
                />
              </nav>

              {/* Logout móvil */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 bg-zinc-900">
                <button
                  onClick={() => router.push("/")}
                  className="w-full flex items-center justify-center gap-2 border border-transparent hover:border-red-900 hover:bg-red-600/5 text-red-900 px-4 py-3 rounded-xl font-semibold transition-all duration-300 group"
                >
                  <LogoutIcon /> 
                  <span>Log out</span>
                </button>
              </div>
            </motion.aside>

            <motion.div
              key="mobile-overlay"
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
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
        : "text-zinc-400 hover:bg-zinc-800/5 hover:text-emerald-400"
    } ${collapsed ? "justify-center" : ""}`}
  >
    {/* Active indicator */}
    {active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg shadow-white/50" />
    )}
    
    <span className={`flex-shrink-0 ${collapsed ? "" : "ml-0"}`}>
      {icon}
    </span>
    
    {!collapsed && (
      <span className="text-sm font-semibold">
        {label}
      </span>
    )}
    
    {collapsed && (
      <div className="absolute left-full ml-2 px-3 py-1.5 bg-zinc-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl border border-zinc-700">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-zinc-800" />
      </div>
    )}
  </Link>
);