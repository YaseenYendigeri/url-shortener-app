import { logger } from "#src/utils/logger";

export default () => {
  process.on("SIGINT", async () => {
    logger.info("Received SIGINT. Gracefully shutting down...");
    //await disconnectDb();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    logger.info("Received SIGTERM. Gracefully shutting down...");
    //await disconnectDb();
    process.exit(0);
  });

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection:", reason);
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception:", error);
    process.exit(1); // Exit with failure
  });
};
