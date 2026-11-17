import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/response.utils";
import { getAuthUser } from "@/utils/auth.util";
import * as orderService from "@/services/order.service";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const orders = await orderService.getUserOrders(user.id);
    return successResponse(orders, "Orders fetched successfully");
  } catch (error) {
    console.error("Error fetching orders:", error);
    return errorResponse("Failed to fetch orders", 500, {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const { shippingAddress, shippingCost = 0, paymentMethod, notes, items } = body;

    if (!shippingAddress || !paymentMethod || !items || !Array.isArray(items)) {
      return errorResponse(
        "shippingAddress, paymentMethod, and items array are required",
        400
      );
    }

    const parsedItems = items.map((i: { product_variant_id: string | number; quantity: number }) => ({
      product_variant_id: BigInt(i.product_variant_id),
      quantity: Number(i.quantity),
    }));

    const order = await orderService.createOrder({
      userId: user.id,
      shippingAddress,
      shippingCost: Number(shippingCost),
      paymentMethod,
      notes,
      items: parsedItems,
    });

    return successResponse(order, "Order created successfully", 201);
  } catch (error) {
    console.error("Error creating order:", error);
    return errorResponse("Failed to create order", 400, {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
