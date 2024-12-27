import { errorHandler } from "#src/middlewares/errorHandler";
import authRoutesV1 from "#src/routes/v1/routes.authentication";
import urlRoutesV1 from "#src/routes/v1/routes.url";
import analyticRoutesV1 from "#src/routes/v1/routes.analytic";
import { successResponse } from "#src/utils/response";
import { Router } from "express";
import StatusCodes from "http-status-codes";
import { redirectShortUrl } from "#src/controllers/v1/controllers.url";

const router = Router();

router.use("/api/v1/analytic", analyticRoutesV1);
router.use("/api/v1/auth", authRoutesV1);
router.use("/api/v1/url", urlRoutesV1);
router.use("/", (request, response) => {
  successResponse(response, "Welcome to app", {}, StatusCodes.OK);
});
router.use("/:alias", redirectShortUrl);
router.use("*", errorHandler);

export default router;
