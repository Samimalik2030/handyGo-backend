import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config";

export const generateToken = async (userId: number,email:string,role:string) => {
  const payload = { userId, email, role };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

export const verifyToken = (token: string) => {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return null;
    }
  };
  
