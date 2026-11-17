import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/response.utils";
import * as productService from "@/services/product.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await productService.getProductDetail(slug);

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return successResponse(product, "Product detail fetched successfully");
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return errorResponse("Failed to fetch product detail", 500, {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
