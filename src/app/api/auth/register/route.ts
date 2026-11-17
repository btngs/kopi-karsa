import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/response.utils";
import * as authService from "@/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return errorResponse("Name, email, and password are required", 400);
    }

    const result = await authService.register({ name, email, password, phone });
    const response = successResponse(result, "Registration successful", 201);
    response.headers.set(
      "Set-Cookie",
      `kopi_session=${result.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`
    );

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Registration failed",
      400
    );
  }
}
