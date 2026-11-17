import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/response.utils";
import { getAuthUser } from "@/utils/auth.util";
import * as orderService from "@/services/order.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const { orderNumber } = await params;
    const order = await orderService.getOrderDetail(orderNumber, user.id);

    return successResponse(order, "Order details fetched successfully");
  } catch (error) {
    console.error("Error fetching order details:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to fetch order",
      404
    );
  }
}
