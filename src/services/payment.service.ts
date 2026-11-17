import * as paymentRepository from "@/repositories/payment.repository";
import * as orderRepository from "@/repositories/order.repository";
import { payments_status, Prisma } from "../../generated/prisma/client";

export async function createPaymentCharge(orderNumber: string, userId: bigint) {
  const order = await orderRepository.findOrderByNumber(orderNumber, userId);
  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "pending") {
    throw new Error(`Order cannot be charged in '${order.status}' status`);
  }

  const payment = await paymentRepository.findPaymentByOrderId(order.id);
  if (!payment) {
    throw new Error("Payment record not found for this order");
  }

  const dummyCode =
    payment.payment_method === "qris"
      ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=KK-QRIS-${order.order_number}`
      : `88019${Date.now().toString().slice(-8)}`;

  const checkoutUrl = `https://checkout.kopikarsa.test/pay/${order.order_number}`;

  const updated = await paymentRepository.updatePaymentChargeDetails(payment.id, {
    payment_code: dummyCode,
    checkout_url: checkoutUrl,
    payment_provider: "Sandbox Gateway",
  });

  return {
    order_number: order.order_number,
    total_amount: order.total_amount,
    payment_method: payment.payment_method,
    payment_code: updated.payment_code,
    checkout_url: updated.checkout_url,
    status: updated.status,
  };
}

export async function handleWebhookNotification(payload: {
  transaction_id: string;
  status: string;
  gateway_response?: Prisma.InputJsonValue;
}) {
  const payment = await paymentRepository.findPaymentByTransactionId(
    payload.transaction_id
  );

  if (!payment) {
    throw new Error(`Payment with transaction ID ${payload.transaction_id} not found`);
  }

  let mappedStatus: payments_status = "pending";
  const incoming = payload.status.toLowerCase();

  if (["paid", "settlement", "success", "capture"].includes(incoming)) {
    mappedStatus = "paid";
  } else if (["failed", "deny"].includes(incoming)) {
    mappedStatus = "failed";
  } else if (["expired", "expire"].includes(incoming)) {
    mappedStatus = "expired";
  } else if (["refunded", "refund"].includes(incoming)) {
    mappedStatus = "refunded";
  }

  return await paymentRepository.settlePaymentTransaction(
    payment.id,
    payment.order_id,
    mappedStatus,
    payload.gateway_response ?? payload
  );
}
