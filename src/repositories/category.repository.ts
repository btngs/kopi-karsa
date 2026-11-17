import prisma from "@/lib/prisma";

export async function findAllCategories() {
    return await prisma.product_categories.findMany({
        orderBy: {
            name: "asc"
        }
    });
}

export async function findCategorySlug(slug: string) {
    return await prisma.product_categories.findUnique({
        where: {
            slug
        }
    });
}