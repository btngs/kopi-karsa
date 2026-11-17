import prisma from "@/lib/prisma";

export async function findAllOrigins() {
  return await prisma.origins.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function findOriginById(id: bigint) {
  return await prisma.origins.findUnique({
    where: { id },
  });
}
