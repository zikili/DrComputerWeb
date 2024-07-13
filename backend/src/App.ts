import express, { Express } from "express";
import cors from "cors";
const app = express();
import postCommentRoute from "./routes/post_comment_route";
import postRoute from "./routes/post_route";
import authRoute from "./routes/auth_route";
import fileRoute from "./routes/file_route";
import env from "dotenv";
env.config();

import mongoose from "mongoose";
import bodyParser from "body-parser";

const init = () => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("connected to database"));
    mongoose.connect(process.env.DATABASE_URL).then(() => {
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      app.use(cors());

      app.use("/auth", authRoute);
      app.use("/post/comments",postCommentRoute)
      app.use("/post", postRoute);
      app.use("/file", fileRoute);
      app.use("/public", express.static("public"));
      resolve(app);
    });
  });
  return promise;
};

export default init;
