import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET: obtener pedido por ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(params.id) },
      include: {
        items: { include: { product: true } },
        deliveryInfo: true,
      },
    });

    if (!order)
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error al obtener pedido:", error);
    return NextResponse.json({ error: "Error al obtener pedido" }, { status: 500 });
  }
}

// ✅ PATCH: actualizar estado o detalles del pedido
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, comment } = body;

    const updated = await prisma.order.update({
      where: { id: Number(params.id) },
      data: {
        ...(status && { status }),
        ...(comment && { comment }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    return NextResponse.json({ error: "Error al actualizar pedido" }, { status: 500 });
  }
}

// ✅ DELETE: eliminar pedido
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.order.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: "Pedido eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    return NextResponse.json({ error: "Error al eliminar pedido" }, { status: 500 });
  }
}
