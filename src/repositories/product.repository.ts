import prisma from "@/lib/prisma";

export interface ProductFilterParams {
  categorySlug?: string;
  originName?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function findProducts(params: ProductFilterParams) {
  const { categorySlug, originName, search, page = 1, limit = 12 } = params;
  const skip = (page - 1) * limit;

  const where = {
    is_active: true,
    ...(categorySlug
      ? {
          product_categories: {
            slug: categorySlug,
          },
        }
      : {}),
    ...(originName
      ? {
          origins: {
            name: originName,
          },
        }
      : {}),
    ...(search
      ? {
          name: {
            contains: search,
          },
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.products.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
      include: {
        product_categories: true,
        origins: true,
        product_variants: {
          where: { is_active: true },
          orderBy: { price: "asc" },
        },
        product_images: {
          orderBy: { sort_order: "asc" },
        },
      },
    }),
    prisma.products.count({ where }),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findProductBySlug(slug: string) {
  return await prisma.products.findUnique({
    where: { slug },
    include: {
      product_categories: true,
      origins: true,
      product_variants: {
        where: { is_active: true },
        orderBy: { weight_grams: "asc" },
      },
      product_images: {
        orderBy: { sort_order: "asc" },
      },
      product_reviews: {
        where: { is_visible: true },
        orderBy: { created_at: "desc" },
        include: {
          users: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}
