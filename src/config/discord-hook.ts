import axios from "axios";
import logger from "./logger";

export const sendDiscordNotification = async (
  webhookUrl: string,
  message: string
): Promise<void> => {
  try {
    await axios.post(webhookUrl, {
      content: message,
    });
   logger.info("✅ Discord notification sent successfully");
  } catch (error) {
    logger.error("❌ Error sending Discord notification", error);
  }
};
