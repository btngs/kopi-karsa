import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/response.utils";
import * as reviewService from "@/services/review.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const reviews = await reviewService.getProductReviews(BigInt(productId));

    return successResponse(reviews, "Product reviews fetched successfully");
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return errorResponse("Failed to fetch reviews", 500, {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
