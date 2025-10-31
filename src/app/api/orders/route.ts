import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client"; // ✅ IMPORTANTE

interface OrderItemInput {
  product: { id: number };
  qty: number;
}

interface DeliveryInfoInput {
  name: string;
  address: string;
  phone: string;
}

interface OrderRequestBody {
  items: OrderItemInput[];
  subtotal: number;
  comment?: string;
  deliveryType: "onsite" | "delivery";
  deliveryInfo?: DeliveryInfoInput | null;
  status?: OrderStatus; // usa el tipo de Prisma directamente
}

// ✅ POST: crear nuevo pedido
export async function POST(req: Request) {
  try {
    const body: OrderRequestBody = await req.json();
    const { items, subtotal, comment, deliveryType, deliveryInfo, status } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No se enviaron productos" }, { status: 400 });
    }

    if (deliveryType === "delivery" && !deliveryInfo) {
      return NextResponse.json(
        { error: "Falta la información de entrega para pedidos a domicilio" },
        { status: 400 }
      );
    }

    const newOrder = await prisma.order.create({
      data: {
        subtotal,
        comment,
        deliveryType,
        status: status || OrderStatus.PENDING, // ✅ ahora TypeScript lo entiende
        deliveryInfo: deliveryInfo
          ? {
              create: {
                name: deliveryInfo.name,
                address: deliveryInfo.address,
                phone: deliveryInfo.phone,
              },
            }
          : undefined,
        items: {
          create: items.map((item) => ({
            product: { connect: { id: item.product.id } },
            qty: item.qty,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        deliveryInfo: true,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
        deliveryInfo: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("❌ Error al obtener pedidos:", error);
    return NextResponse.json(
      { error: "Error al obtener pedidos" },
      { status: 500 }
    );
  }
}
