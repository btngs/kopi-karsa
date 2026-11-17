import * as originRepository from "@/repositories/origin.repository";

export async function getAllOrigins() {
  return await originRepository.findAllOrigins();
}
