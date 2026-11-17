import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/response.utils";
import { getAuthUser } from "@/utils/auth.util";
import * as orderService from "@/services/order.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const { orderNumber } = await params;
    const cancelled = await orderService.cancelOrder(orderNumber, user.id);

    return successResponse(cancelled, "Order cancelled successfully");
  } catch (error) {
    console.error("Error cancelling order:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to cancel order",
      400
    );
  }
}
