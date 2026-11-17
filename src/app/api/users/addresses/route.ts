import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/response.utils";
import { getAuthUser } from "@/utils/auth.util";
import * as addressService from "@/services/address.service";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const addresses = await addressService.getUserAddresses(user.id);
    return successResponse(addresses, "Addresses fetched successfully");
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return errorResponse("Failed to fetch addresses", 500, {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const {
      label,
      recipient_name,
      recipient_phone,
      address,
      city,
      province,
      postal_code,
      is_default,
    } = body;

    if (
      !label ||
      !recipient_name ||
      !recipient_phone ||
      !address ||
      !city ||
      !province ||
      !postal_code
    ) {
      return errorResponse("All address fields are required", 400);
    }

    const newAddress = await addressService.addUserAddress(user.id, {
      label,
      recipient_name,
      recipient_phone,
      address,
      city,
      province,
      postal_code,
      is_default,
    });

    return successResponse(newAddress, "Address created successfully", 201);
  } catch (error) {
    console.error("Error creating address:", error);
    return errorResponse("Failed to create address", 400, {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
