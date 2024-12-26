import { PORT } from "#src/config/env";
import setupProcessHandlers from "#src/config/processHandlers";
import configureMiddlewares from "#src/middlewares/basicConfig";
import getMorganMiddleware from "#src/middlewares/requestLogger";
import router from "#src/routes/index";
import { logger } from "#src/utils/logger";
import express from "express";

const createServer = async () => {
  const app = express();

  configureMiddlewares(app);
  app.use(getMorganMiddleware());

  app.use(router);

  setupProcessHandlers();

  return app;
};

const startServer = async () => {
  try {
    const app = await createServer();
    app.listen(PORT, () => {
      logger.info(`Server started successfully at PORT: ${PORT}`);
    });
    logger.info("Server is running...");
    return app;
  } catch (error) {
    logger.error("Error starting server:", error);
    process.exit(1);
  }
};

const appPromise = createServer();
export default appPromise;

if (process.env.NODE_ENV !== "test") {
  startServer();
}
