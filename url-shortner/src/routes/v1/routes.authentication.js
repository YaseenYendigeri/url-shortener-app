import * as authController from "#src/controllers/v1/controllers.authentication";

import {
  loginValidator,
  registerValidator,
} from "#src/middlewares/validators/validators.authenticate";

import { authenticate } from "#src/middlewares/authenticate";
import { validate } from "#src/middlewares/validator";
import express from "express";

const router = express.Router();

router.post("/register", registerValidator, validate, authController.register);
router.post("/login", loginValidator, validate, authController.login);
router.post("/logout", authenticate, authController.logout);

export default router;
