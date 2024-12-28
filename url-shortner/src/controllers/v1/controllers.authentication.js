import passport from "#src/config/passport";
import { db } from "#src/models/index";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "#src/utils/response";
import { StatusCodes } from "http-status-codes";
import { JWT_SECRET, NODE_ENV } from "#src/config/env";

const Session = db.Session;
const User = db.User;

export const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleCallback = (req, res, next) => {
  passport.authenticate("google", async (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return errorResponse(
        res,
        "Authentication failed.",
        null,
        StatusCodes.UNAUTHORIZED
      );
    }

    if (!user) {
      console.error("User not found or info:", info);
      return errorResponse(
        res,
        "Authentication failed.",
        null,
        StatusCodes.UNAUTHORIZED
      );
    }

    try {
      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: "1d",
      });

      console.log("Generated token:", token);

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
      });

      const session = await Session.create({
        user_id: user.id,
        isActive: true,
      });

      console.log("Session created in DB:", session);

      return successResponse(
        res,
        "Authentication successful.",
        { token, session },
        StatusCodes.OK
      );
    } catch (error) {
      console.error("Error during Google callback:", error);
      return errorResponse(
        res,
        "Authentication error.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  })(req, res, next);
};

export const logout = async (req, res) => {
  try {
    const token =
      req?.cookies?.auth_token ?? req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      return errorResponse(
        res,
        "No token provided. Logout failed.",
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    await Session.update(
      { isActive: false },
      { where: { user_id: decoded.id, isActive: true } }
    );

    res.clearCookie("auth_token");

    return successResponse(
      res,
      "Successfully logged out.",
      null,
      StatusCodes.OK
    );
  } catch (error) {
    console.error("Error during logout:", error);
    return errorResponse(
      res,
      "An error occurred during the logout process.",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
