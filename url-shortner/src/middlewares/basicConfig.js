import bodyParser from "body-parser";
import cors from "cors";

const configureMiddlewares = (app) => {
  app.use(
    cors({
      origin: ["*"],
      methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    })
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.options("*", cors());
};

export default configureMiddlewares;
