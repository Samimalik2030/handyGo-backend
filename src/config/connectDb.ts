import { DataSource } from "typeorm";
import logger from "./logger";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./config";

import { User } from "../entity/user";
import { Workshop } from "../entity/workshop";
import { Booking } from "../entity/booking";
import { Otp } from "../entity/otp";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  logging: true,
  entities: [User, Workshop, Booking,Otp],
});

const connectDb = async (): Promise<DataSource> => {
  logger.info("Connecting to the database...");
  try {
    const dataSource = await AppDataSource.initialize();
    logger.info(" Database connected successfully");
    return dataSource;
  } catch (error) {
    logger.error("Database connection error:", error);
    throw new Error("Database connection failed");
  }
};

export default connectDb;
