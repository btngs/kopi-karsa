import * as productRepository from "@/repositories/product.repository";

export async function getProductCatalog(params: productRepository.ProductFilterParams) {
  return await productRepository.findProducts(params);
}

export async function getProductDetail(slug: string) {
  const product = await productRepository.findProductBySlug(slug);
  if (!product) {
    return null;
  }

  const reviews = product.product_reviews ?? [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return {
    ...product,
    review_stats: {
      total_reviews: reviews.length,
      average_rating: Number(averageRating.toFixed(1)),
    },
  };
}
