import crypto from "crypto";
import bcrypt from "bcryptjs";
import * as userRepository from "@/repositories/user.repository";

export async function register(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  const existing = await userRepository.findUserByEmail(data.email);
  if (existing) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await userRepository.createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    phone: data.phone,
  });

  const token = crypto.randomUUID();
  await userRepository.updateUserToken(user.id, token);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  };
}

export async function login(email: string, password: string) {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = crypto.randomUUID();
  await userRepository.updateUserToken(user.id, token);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  };
}

export async function logout(userId: bigint) {
  await userRepository.updateUserToken(userId, null);
  return true;
}

export async function validateToken(token: string) {
  if (!token) return null;
  return await userRepository.findUserByToken(token);
}
