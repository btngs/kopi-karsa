import { NextResponse } from "next/server";

function customJsonReplacer(_key: string, value: unknown) {
    if (typeof value === "bigint") return Number(value);

    if (value && typeof value === "object" && "toFixed" in value) {
        return Number((value as { toFixed: () => string }).toFixed());
    }

    return value;
}

export function successResponse<T>(data: T, message = "Success", status = 200) {
    const body = {
        success: true,
        message,
        data,
    };

    return new Response(JSON.stringify(body, customJsonReplacer), {
        status, 
        headers: { "Content-Type": "application/json" },
    });
} 

export function errorResponse(message = "Internal Server Error", status = 500, errors: Record<string, unknown> | null = null) {
    const body = {
        success: false,
        message,
        ...(errors && { errors }),
    };

    return new Response(JSON.stringify(body, customJsonReplacer), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}