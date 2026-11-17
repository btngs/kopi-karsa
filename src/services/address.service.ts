import * as addressRepository from "@/repositories/address.repository";

export async function getUserAddresses(userId: bigint) {
  return await addressRepository.findAddressesByUserId(userId);
}

export async function addUserAddress(
  userId: bigint,
  data: addressRepository.AddressInput
) {
  return await addressRepository.createAddress(userId, data);
}

export async function editUserAddress(
  id: bigint,
  userId: bigint,
  data: Partial<addressRepository.AddressInput>
) {
  const existing = await addressRepository.findAddressById(id, userId);
  if (!existing) {
    throw new Error("Address not found");
  }

  return await addressRepository.updateAddress(id, userId, data);
}

export async function removeUserAddress(id: bigint, userId: bigint) {
  const existing = await addressRepository.findAddressById(id, userId);
  if (!existing) {
    throw new Error("Address not found");
  }

  await addressRepository.deleteAddress(id, userId);
  return true;
}
