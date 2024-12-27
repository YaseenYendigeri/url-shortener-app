import express from "express";
import {
  googleLogin,
  googleCallback,
  logout,
} from "#src/controllers/v1/controllers.authentication";

const router = express.Router();

router.get("/google", googleLogin);
router.get("/google/redirect", googleCallback);
router.post("/logout", logout);

export default router;
