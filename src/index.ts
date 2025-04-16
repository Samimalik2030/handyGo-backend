import express from "express";
import middleware from "./middleware";
import logger from "./config/logger";
import { PORT } from "./config/config";
import connectDb from "./config/connectDb";
import router from "./router/router";
import globalErrorHandler from "./utils/errorHandler";
import AppError from "./utils/appError";

const app = express();
connectDb();
middleware(app);
app.use("/api", router);
// app.use("/", (req, res) => {
//   res.send({
//     api: "handyGo",
//     status: "Online",
//   });
// });
app.use((req, res, next) => {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404);

  next(error);
});
app.use(globalErrorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running at http://localhost:${PORT}`);
});
