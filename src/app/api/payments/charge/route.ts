import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/response.utils";
import { getAuthUser } from "@/utils/auth.util";
import * as paymentService from "@/services/payment.service";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const { orderNumber } = body;

    if (!orderNumber) {
      return errorResponse("orderNumber is required", 400);
    }

    const chargeResult = await paymentService.createPaymentCharge(
      orderNumber,
      user.id
    );

    return successResponse(chargeResult, "Payment charge initiated successfully");
  } catch (error) {
    console.error("Error creating payment charge:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to initiate payment charge",
      400
    );
  }
}
