import express from "express";
import {
  shortenUrl,
  redirectShortUrl,
} from "#src/controllers/v1/controllers.url";
import { authenticate } from "#src/middlewares/authenticate";

const router = express.Router();

router.post("/shorten", authenticate, shortenUrl);

export default router;
