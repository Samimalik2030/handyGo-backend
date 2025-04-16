import express from "express";
import catchAsync from "../utils/catchAsync";

import AppError from "../utils/appError";
import { generateToken } from "../utils/jwt";
import { sendEmail } from "../config/nodemailer";
import { sendDiscordNotification } from "../config/discord-hook";
import { DISCORD_HOOK_URL } from "../config/config";
import { checkOtpExists, generateOTP, verifyOTP } from "../utils/otp";
import { authGuard } from "../guards/auth-guard";
import upload from "../config/multer";
import { uploadImage } from "../config/imagekit";
import { FileDto } from "../types/fileDto";
import { getUserRepository } from "../entity/user";

const authRouter = express.Router();
const UserRepository = getUserRepository();

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////       Sign In       ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

authRouter.post(
  "/sign-in",
  catchAsync(async (req, res, next) => {
    console.log(req, "body");
    const { email, password } = req.body;

    const user = await UserRepository.findOne({ where: { email } });

    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }

    if (user.password !== password) {
      return next(new AppError("Invalid email or password", 401));
    }

    const token = await generateToken(user.id, user.email, user.role);

    res.status(200).json({
      token,
      user,
    });
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////       Sign Up       ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

authRouter.post(
  "/sign-up",
  catchAsync(async (req, res, next) => {
    const { email, password, name ,role} = req.body;

    const existingUser = await UserRepository.findOne({ where: { email } });

    if (existingUser) {
      return next(new AppError("Email already exists", 400));
    }

    const newUser = UserRepository.create({
      email,
      password,
      name,
      role
    });

    await UserRepository.save(newUser);

    const token = await generateToken(newUser.id, newUser.email, newUser.role);

    res.status(201).json({
      token,
      user: newUser,
    });
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////       Forgot Password      ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

authRouter.post(
  "/forgot-password",
  catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const user = await UserRepository.findOne({ where: { email } });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const otp = await generateOTP(user.email);
    const subject = "Password Reset Request";
    const text = `You requested a password reset.Use this OTP to reset your password: ${otp}`;
    await sendEmail(email, subject, text);
    await sendDiscordNotification(DISCORD_HOOK_URL, text);
    res.status(200).json({
      message: "OTP sent to your email. Please check your inbox.",
    });
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////       Verify Otp      /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

authRouter.post(
  "/verify-otp",
  catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;
    const user = await UserRepository.findOne({ where: { email } });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const otpIsValid = await checkOtpExists(user.email, otp);
    if (!otpIsValid) {
      return next(new AppError("Invalid OTP", 400));
    }
    res.status(200).json({
      message: "OTP verified successfully",
    });
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////     Reset Password      ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

authRouter.post(
  "/reset-password",
  catchAsync(async (req, res, next) => {
    const { email, password, otp } = req.body;
    const user = await UserRepository.findOne({ where: { email } });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const otpIsValid = await verifyOTP(user.email, otp);
    if (!otpIsValid) {
      return next(new AppError("Invalid OTP", 400));
    }
    user.password = password;
    await UserRepository.save(user);
    res.status(200).json({
      message: "Password reset successfully",
    });
  })
);





///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////       Update Profile    ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

authRouter.patch(
  "/update-profile",
  catchAsync(authGuard),
  catchAsync(async (req, res, next) => {
    const user = req.user;
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const { name, email, password, newPassword, profileImage } = req.body;

    if (newPassword) {
      if (!password) {
        return next(
          new AppError("Current password is required to update password", 400)
        );
      }

      if (user.password !== password) {
        return next(new AppError("Current password is incorrect", 401));
      }

      user.password = newPassword;
    }

    if (name?.trim()) user.name = name.trim();
    if (profileImage?.url || typeof profileImage === "string") {
      user.profileImage = profileImage;
    }

    await UserRepository.save(user);

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  })
);



export default authRouter;
