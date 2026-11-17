import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/response.utils";
import * as authService from "@/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse("Email and password are required", 400);
    }

    const result = await authService.login(email, password);
    const response = successResponse(result, "Login successful");
    response.headers.set(
      "Set-Cookie",
      `kopi_session=${result.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Invalid credentials",
      401
    );
  }
}
