import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"; // para encriptar contraseñas

export async function POST(req: Request) {
  try {
    const { username, password, role } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "El nombre de usuario y la contraseña son obligatorios" },
        { status: 400 }
      );
    }

    // Verificar si ya existe un usuario con ese username
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json(
        { error: "El nombre de usuario ya está en uso" },
        { status: 400 }
      );
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: role || "user",
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    return NextResponse.json(
      { error: "Error al registrar usuario" },
      { status: 500 }
    );
  }
}
