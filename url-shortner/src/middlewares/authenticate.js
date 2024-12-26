import jwt from "jsonwebtoken";
import { JWT_SECRET } from "#src/config/env";
import db from "#src/models/index";
const User = db.User;
const Session = db.Session;

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
    const session = await Session.findOne({
      where: { id: decoded.id, isActive: true },
    });

    if (!user || !session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
