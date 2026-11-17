import * as orderRepository from "@/repositories/order.repository";

export async function createOrder(data: orderRepository.CreateOrderInput) {
  if (!data.items || data.items.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  return await orderRepository.createOrderTransaction(data);
}

export async function getUserOrders(userId: bigint) {
  return await orderRepository.findOrdersByUserId(userId);
}

export async function getOrderDetail(orderNumber: string, userId: bigint) {
  const order = await orderRepository.findOrderByNumber(orderNumber, userId);
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
}

export async function cancelOrder(orderNumber: string, userId: bigint) {
  return await orderRepository.cancelOrderTransaction(orderNumber, userId);
}
