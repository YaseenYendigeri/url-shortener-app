import express from "express";
import {
  getOverallAnalytics,
  getTopicAnalytics,
  getUrlAnalytics,
} from "#src/controllers/v1/controllers.analytic";
import { authenticate } from "#src/middlewares/authenticate";

const router = express.Router();

router.get("/overall", authenticate, getOverallAnalytics);
router.get("/:alias", authenticate, getUrlAnalytics);
router.get("/topic/:topic", authenticate, getTopicAnalytics);

export default router;
