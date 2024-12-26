import { logger } from "#src/utils/logger";
import morgan from "morgan";

const getMorganMiddleware = () => {
  const morganFormat = ":method :url :status :response-time ms";

  const stream = {
    write: (message) => {
      const logObject = {
        method: message.split(" ")[0],
        url: message.split(" ")[1],
        status: message.split(" ")[2],
        responseTime: message.split(" ")[3],
      };
      logger.info(JSON.stringify(logObject));
    },
  };

  return morgan(morganFormat, { stream });
};

export default getMorganMiddleware;
