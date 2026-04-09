import { NextResponse } from "next/server";

export async function POST() {
  // Crear una respuesta
  const response = NextResponse.json({
    message: "Sesión cerrada correctamente",
  });

  // Sobrescribir la cookie "token" con valor vacío y expiración inmediata
  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    maxAge: 0,
  });

  return response;
}
