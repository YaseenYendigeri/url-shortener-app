import { errorHandler } from "#src/middlewares/errorHandler";
import authRoutesV1 from "#src/routes/v1/routes.authentication";
import { successResponse } from "#src/utils/response";
import { Router } from "express";
import StatusCodes from "http-status-codes";

const router = Router();

router.use("/api/v1/auth", authRoutesV1);
router.use("/", (request, response) => {
  successResponse(response, "Welcome to app", {}, StatusCodes.OK);
});

router.use("*", errorHandler);

export default router;
