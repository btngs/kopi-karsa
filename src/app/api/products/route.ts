import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/response.utils";
import * as productService from "@/services/product.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category") ?? undefined;
    const originName = searchParams.get("origin") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 12;

    const result = await productService.getProductCatalog({
      categorySlug,
      originName,
      search,
      page,
      limit,
    });

    return successResponse(result, "Products fetched successfully");
  } catch (error) {
    console.error("Error fetching products:", error);
    return errorResponse("Failed to fetch products", 500, {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
