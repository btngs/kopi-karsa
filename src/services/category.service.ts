import * as categoryRepository from '../repositories/category.repository';

export async function getAllCategories() {
    const categories = await categoryRepository.findAllCategories();
    return categories;
}