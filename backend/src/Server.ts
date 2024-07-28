import init from "./App";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import http from "http";
import https from "https";
import fs from "fs";

init().then((app) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Web Dev 2022 REST API",
        version: "1.0.0",
        description: "REST server including authentication using JWT",
      },
      servers: [{ url: "http://localhost:" + process.env.PORT }],
    },
    apis: ["./src/routes/*.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
  if (process.env.NODE_ENV !== "production") {
    console.log("DEVELOPMENT" + process.env.PORT);
    http.createServer(app).listen(process.env.PORT);
  } else {
    console.log("PRODUCTION");
    const options2 = {
      key: fs.readFileSync("../../backend-client-key.pem"),
      cert: fs.readFileSync("../../backend-client-cert.pem"),
    };
    https.createServer(options2, app).listen(process.env.HTTPS_PORT);
  }
});
