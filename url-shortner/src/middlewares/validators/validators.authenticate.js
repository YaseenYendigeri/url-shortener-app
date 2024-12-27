import { body } from "express-validator";

export const registerValidator = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("username")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters long"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Invalid email format"),

  body("password").notEmpty().withMessage("Password is required"),
];
