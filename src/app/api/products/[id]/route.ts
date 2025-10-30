import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: { id: string };
}

/**
 * 🔹 GET /api/products/[id]
 * Obtiene un producto por su ID
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(params.id) },
    });

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("❌ Error al obtener producto:", error);
    return NextResponse.json(
      { error: "Error al obtener producto" },
      { status: 500 }
    );
  }
}

/**
 * 🔹 PATCH /api/products/[id]
 * Actualiza los datos de un producto existente
 */
export async function PATCH(req: Request, { params }: Params) {
  try {
    const body: Partial<{
      name: string;
      description: string;
      price: number;
      category: string;
      image: string;
      available: boolean;
    }> = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id: Number(params.id) },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.price !== undefined && { price: Number(body.price) }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.available !== undefined && { available: body.available }),
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error al actualizar producto:", error.message);
      return NextResponse.json(
        { error: "Error al actualizar producto", details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Error desconocido" }, { status: 500 });
  }
}

/**
 * 🔹 DELETE /api/products/[id]
 * Elimina un producto existente
 */
export async function DELETE(_req: Request, { params }: Params) {
  try {
    await prisma.product.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error al eliminar producto:", error.message);
      return NextResponse.json(
        { error: "Error al eliminar producto", details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Error desconocido" }, { status: 500 });
  }
}
