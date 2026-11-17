import { NextRequest } from "next/server";
import * as authService from "@/services/auth.service";

export async function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else {
    token = request.cookies.get("kopi_session")?.value;
  }

  if (!token) {
    return null;
  }

  return await authService.validateToken(token);
}
