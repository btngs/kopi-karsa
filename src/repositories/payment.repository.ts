import prisma from "@/lib/prisma";
import { payments_status, Prisma } from "../../generated/prisma/client";

export async function findPaymentByTransactionId(transactionId: string) {
  return await prisma.payments.findFirst({
    where: { transaction_id: transactionId },
    include: { orders: true },
  });
}

export async function findPaymentByOrderId(orderId: bigint) {
  return await prisma.payments.findFirst({
    where: { order_id: orderId },
    orderBy: { id: "desc" },
  });
}

export async function updatePaymentChargeDetails(
  id: bigint,
  data: {
    payment_code?: string;
    checkout_url?: string;
    payment_provider?: string;
  }
) {
  return await prisma.payments.update({
    where: { id },
    data,
  });
}

export async function settlePaymentTransaction(
  paymentId: bigint,
  orderId: bigint,
  status: payments_status,
  responseJson?: Prisma.InputJsonValue
) {
  return await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payments.update({
      where: { id: paymentId },
      data: {
        status,
        ...(status === "paid" ? { paid_at: new Date() } : {}),
        ...(responseJson ? { payment_response: responseJson } : {}),
      },
    });

    if (status === "paid") {
      await tx.orders.update({
        where: { id: orderId },
        data: { status: "processing" },
      });
    } else if (status === "failed" || status === "expired") {
      await tx.orders.update({
        where: { id: orderId },
        data: { status: "cancelled" },
      });
    }

    return updatedPayment;
  });
}
