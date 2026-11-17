import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/response.utils";
import { getAuthUser } from "@/utils/auth.util";
import * as authService from "@/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (user) {
      await authService.logout(user.id);
    }

    const response = successResponse(null, "Logout successful");
    response.headers.set(
      "Set-Cookie",
      "kopi_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
    );

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse("Logout failed", 500);
  }
}
