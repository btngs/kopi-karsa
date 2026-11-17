import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/response.utils";
import * as paymentService from "@/services/payment.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const transactionId = body.transaction_id || body.order_id;
    const status = body.transaction_status || body.status;

    if (!transactionId || !status) {
      return errorResponse("transaction_id and status are required in payload", 400);
    }

    const settled = await paymentService.handleWebhookNotification({
      transaction_id: transactionId,
      status,
      gateway_response: body,
    });

    return successResponse(settled, "Webhook processed successfully");
  } catch (error) {
    console.error("Payment webhook error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to process webhook",
      400
    );
  }
}
