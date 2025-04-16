import { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } from "./config";
import nodemailer from "nodemailer";
import logger from "./logger";

export const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: +EMAIL_PORT,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});


export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const info = await transporter.sendMail({
      from: EMAIL_USER,
      to,
      subject,
      text
    });
    logger.info(`Email sent: ${info.response}`);
  } catch (error) {
    logger.error("Error sending email: ", error);
  }
};

