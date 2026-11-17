import prisma from "@/lib/prisma";

export async function findUserByEmail(email: string) {
  return await prisma.users.findUnique({
    where: { email },
  });
}

export async function findUserById(id: bigint) {
  return await prisma.users.findUnique({
    where: { id },
  });
}

export async function findUserByToken(remember_token: string) {
  return await prisma.users.findFirst({
    where: { remember_token },
  });
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  return await prisma.users.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone ?? null,
      role: "customer",
    },
  });
}

export async function updateUserToken(id: bigint, remember_token: string | null) {
  return await prisma.users.update({
    where: { id },
    data: { remember_token },
  });
}
