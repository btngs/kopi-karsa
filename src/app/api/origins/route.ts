import { successResponse, errorResponse } from "@/utils/response.utils";
import * as originService from "@/services/origin.service";

export async function GET() {
  try {
    const origins = await originService.getAllOrigins();
    return successResponse(origins, "Origins fetched successfully");
  } catch (error) {
    console.error("Error fetching origins:", error);
    return errorResponse("Failed to fetch origins", 500, {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
