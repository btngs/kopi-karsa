import prisma from "@/lib/prisma";
import { payments_payment_method, Prisma } from "../../generated/prisma/client";

export interface CreateOrderItemInput {
  product_variant_id: bigint;
  quantity: number;
}

export interface CreateOrderInput {
  userId: bigint;
  shippingAddress: Prisma.InputJsonValue;
  shippingCost: number;
  paymentMethod: payments_payment_method;
  notes?: string;
  items: CreateOrderItemInput[];
}

export async function createOrderTransaction(data: CreateOrderInput) {
  return await prisma.$transaction(async (tx) => {
    let subtotal = 0;
    const itemsToCreate = [];

    for (const item of data.items) {
      const variant = await tx.product_variants.findUnique({
        where: { id: item.product_variant_id },
        include: { products: true },
      });

      if (!variant) {
        throw new Error(`Variant ${item.product_variant_id} not found`);
      }

      if (variant.stock < item.quantity) {
        throw new Error(
          `Stock insufficient for ${variant.products.name} (${variant.weight_grams}g). Remaining: ${variant.stock}`
        );
      }

      const unitPrice = Number(variant.price);
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      const stockBefore = variant.stock;
      const stockAfter = variant.stock - item.quantity;

      await tx.product_variants.update({
        where: { id: variant.id },
        data: { stock: stockAfter },
      });

      await tx.stock_movements.create({
        data: {
          product_variant_id: variant.id,
          movement_type: "out",
          quantity: -item.quantity,
          stock_before: stockBefore,
          stock_after: stockAfter,
          description: `Order placement deduction`,
        },
      });

      itemsToCreate.push({
        product_variant_id: variant.id,
        product_name: variant.products.name,
        sku: variant.sku,
        weight_grams: variant.weight_grams,
        unit_price: variant.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    const totalAmount = subtotal + data.shippingCost;
    const orderNumber = `KK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await tx.orders.create({
      data: {
        user_id: data.userId,
        order_number: orderNumber,
        status: "pending",
        subtotal,
        shipping_cost: data.shippingCost,
        total_amount: totalAmount,
        shipping_address: data.shippingAddress,
        notes: data.notes ?? null,
        order_items: {
          create: itemsToCreate,
        },
        payments: {
          create: {
            payment_method: data.paymentMethod,
            amount: totalAmount,
            status: "pending",
            transaction_id: `TRX-${orderNumber}`,
          },
        },
      },
      include: {
        order_items: true,
        payments: true,
      },
    });

    return order;
  });
}

export async function findOrdersByUserId(userId: bigint) {
  return await prisma.orders.findMany({
    where: { user_id: userId },
    orderBy: { ordered_at: "desc" },
    include: {
      order_items: true,
      payments: true,
      shipments: true,
    },
  });
}

export async function findOrderByNumber(orderNumber: string, userId?: bigint) {
  return await prisma.orders.findFirst({
    where: {
      order_number: orderNumber,
      ...(userId ? { user_id: userId } : {}),
    },
    include: {
      order_items: {
        include: {
          product_reviews: true,
        },
      },
      payments: true,
      shipments: true,
    },
  });
}

export async function cancelOrderTransaction(orderNumber: string, userId: bigint) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.orders.findFirst({
      where: { order_number: orderNumber, user_id: userId },
      include: { order_items: true },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "pending") {
      throw new Error(`Cannot cancel order with status '${order.status}'`);
    }

    for (const item of order.order_items) {
      const variant = await tx.product_variants.findUnique({
        where: { id: item.product_variant_id },
      });

      if (variant) {
        const stockBefore = variant.stock;
        const stockAfter = variant.stock + item.quantity;

        await tx.product_variants.update({
          where: { id: variant.id },
          data: { stock: stockAfter },
        });

        await tx.stock_movements.create({
          data: {
            product_variant_id: variant.id,
            movement_type: "in",
            quantity: item.quantity,
            stock_before: stockBefore,
            stock_after: stockAfter,
            description: `Restock from cancelled order ${order.order_number}`,
          },
        });
      }
    }

    const updated = await tx.orders.update({
      where: { id: order.id },
      data: { status: "cancelled" },
    });

    return updated;
  });
}
