import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/response.utils";
import { getAuthUser } from "@/utils/auth.util";
import * as addressService from "@/services/address.service";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await addressService.editUserAddress(
      BigInt(id),
      user.id,
      body
    );

    return successResponse(updated, "Address updated successfully");
  } catch (error) {
    console.error("Error updating address:", error);
    return errorResponse("Failed to update address", 400, {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;
    await addressService.removeUserAddress(BigInt(id), user.id);

    return successResponse(null, "Address deleted successfully");
  } catch (error) {
    console.error("Error deleting address:", error);
    return errorResponse("Failed to delete address", 400, {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
