import prisma from "@/lib/prisma";

export async function findReviewsByProductId(productId: bigint) {
  return await prisma.product_reviews.findMany({
    where: {
      product_id: productId,
      is_visible: true,
    },
    orderBy: { created_at: "desc" },
    include: {
      users: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function findEligibleOrderItem(userId: bigint, orderItemId: bigint) {
  return await prisma.order_items.findFirst({
    where: {
      id: orderItemId,
      orders: {
        user_id: userId,
        status: "delivered",
      },
    },
    include: {
      product_variants: true,
      product_reviews: true,
    },
  });
}

export async function createReview(data: {
  userId: bigint;
  productId: bigint;
  orderItemId: bigint;
  rating: number;
  title?: string;
  comment?: string;
}) {
  return await prisma.product_reviews.create({
    data: {
      user_id: data.userId,
      product_id: data.productId,
      order_item_id: data.orderItemId,
      rating: data.rating,
      title: data.title ?? null,
      comment: data.comment ?? null,
      is_visible: true,
    },
  });
}
