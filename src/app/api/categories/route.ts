import { NextResponse } from 'next/server';
import { successResponse, errorResponse } from '../../../utils/response.utils';
import * as categoryService from '../../../services/category.service';

export async function GET() {
    try {
        const categories = await categoryService.getAllCategories();
        return successResponse(categories, "Categories fetched successfully");
    } catch (error) {
        console.error("Error fetching categories:", error);
        return errorResponse("Failed to fetch categories", 500, { error: error instanceof Error ? error.message : "Unknown error" });
    }
}