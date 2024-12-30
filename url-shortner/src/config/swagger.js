import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { SERVER_URL } from "#src/config/env";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "URL SHORTENER API",
      version: "1.0.0",
      description: "Documentation for Google OAuth and URL Shortener APIs",
    },
    servers: [
      {
        url: SERVER_URL,
      },
    ],
  },
  apis: ["./src/swagger/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export default (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  console.log("Swagger docs available at /api-docs");
};
