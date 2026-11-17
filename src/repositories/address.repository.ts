import prisma from "@/lib/prisma";

export interface AddressInput {
  label: string;
  recipient_name: string;
  recipient_phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  is_default?: boolean;
}

export async function findAddressesByUserId(userId: bigint) {
  return await prisma.user_addresses.findMany({
    where: { user_id: userId },
    orderBy: [{ is_default: "desc" }, { id: "desc" }],
  });
}

export async function findAddressById(id: bigint, userId: bigint) {
  return await prisma.user_addresses.findFirst({
    where: { id, user_id: userId },
  });
}

export async function createAddress(userId: bigint, data: AddressInput) {
  if (data.is_default) {
    await prisma.user_addresses.updateMany({
      where: { user_id: userId, is_default: true },
      data: { is_default: false },
    });
  }

  return await prisma.user_addresses.create({
    data: {
      user_id: userId,
      label: data.label,
      recipient_name: data.recipient_name,
      recipient_phone: data.recipient_phone,
      address: data.address,
      city: data.city,
      province: data.province,
      postal_code: data.postal_code,
      is_default: data.is_default ?? false,
    },
  });
}

export async function updateAddress(
  id: bigint,
  userId: bigint,
  data: Partial<AddressInput>
) {
  if (data.is_default) {
    await prisma.user_addresses.updateMany({
      where: { user_id: userId, is_default: true },
      data: { is_default: false },
    });
  }

  return await prisma.user_addresses.update({
    where: { id },
    data: {
      ...(data.label ? { label: data.label } : {}),
      ...(data.recipient_name ? { recipient_name: data.recipient_name } : {}),
      ...(data.recipient_phone ? { recipient_phone: data.recipient_phone } : {}),
      ...(data.address ? { address: data.address } : {}),
      ...(data.city ? { city: data.city } : {}),
      ...(data.province ? { province: data.province } : {}),
      ...(data.postal_code ? { postal_code: data.postal_code } : {}),
      ...(data.is_default !== undefined ? { is_default: data.is_default } : {}),
    },
  });
}

export async function deleteAddress(id: bigint, userId: bigint) {
  return await prisma.user_addresses.deleteMany({
    where: { id, user_id: userId },
  });
}
