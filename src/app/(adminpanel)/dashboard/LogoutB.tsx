"use client";

export function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500  text-white px-3 py-2 rounded hover:bg-red-900"
    >
      Cerrar sesión
    </button>
  );
}
