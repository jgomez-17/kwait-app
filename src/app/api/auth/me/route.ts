import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
    if (!token)
      return NextResponse.json({ error: "Token no encontrado" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      username: string;
      role: string;
    };

    return NextResponse.json({
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    });
  } catch (error) {
    console.error("❌ Error al obtener usuario:", error);
    return NextResponse.json({ error: "Token inválido o expirado" }, { status: 403 });
  }
}
