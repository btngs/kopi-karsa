import * as reviewRepository from "@/repositories/review.repository";

export async function getProductReviews(productId: bigint) {
  return await reviewRepository.findReviewsByProductId(productId);
}

export async function submitProductReview(
  userId: bigint,
  data: {
    orderItemId: bigint;
    rating: number;
    title?: string;
    comment?: string;
  }
) {
  if (data.rating < 1 || data.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const orderItem = await reviewRepository.findEligibleOrderItem(
    userId,
    data.orderItemId
  );

  if (!orderItem) {
    throw new Error(
      "Only delivered items purchased by you can be reviewed"
    );
  }

  if (orderItem.product_reviews) {
    throw new Error("This item has already been reviewed");
  }

  return await reviewRepository.createReview({
    userId,
    productId: orderItem.product_variants.product_id,
    orderItemId: orderItem.id,
    rating: data.rating,
    title: data.title,
    comment: data.comment,
  });
}
