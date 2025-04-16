import express from "express";
import { uploadImage } from "../config/imagekit";
import { authGuard } from "../guards/auth-guard";
import catchAsync from "../utils/catchAsync";
import upload from "../config/multer";
const imageRouter = express.Router();
imageRouter.post(
  "/upload",
  catchAsync(authGuard),
  upload.single("file"),
  catchAsync(async (req, res, next) => {
    const file = req.file as Express.Multer.File;
    console.log(file, "file");
    const uploadedFile = await uploadImage(file);
    res.status(200).json(uploadedFile);
  })
);
export default imageRouter;
