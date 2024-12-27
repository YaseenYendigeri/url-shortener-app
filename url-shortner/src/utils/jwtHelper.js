import { JWT_SECRET } from "#src/config/env";
import jwt from "jsonwebtoken";

export const createToken = (payload, expiresIn = "10d") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
