import jwt from "jsonwebtoken";
import { User } from "../config/dbConfig";
import { JWT_SECRET } from "#src/config/env";

export const authenticate = async (req, res, next) => {
  const token =
    req.cookies.auth_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Authentication token is required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
