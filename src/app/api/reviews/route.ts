import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/response.utils";
import { getAuthUser } from "@/utils/auth.util";
import * as reviewService from "@/services/review.service";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const { orderItemId, rating, title, comment } = body;

    if (!orderItemId || !rating) {
      return errorResponse("orderItemId and rating are required", 400);
    }

    const review = await reviewService.submitProductReview(user.id, {
      orderItemId: BigInt(orderItemId),
      rating: Number(rating),
      title,
      comment,
    });

    return successResponse(review, "Review submitted successfully", 201);
  } catch (error) {
    console.error("Error submitting review:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to submit review",
      400
    );
  }
}
