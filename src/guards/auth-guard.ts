// middlewares/authGuard.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/connectDb';
import { User } from '../entity/user';
import { SECRET_KEY } from '../config/config';


export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded: any = jwt.verify(token, SECRET_KEY as string);
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: decoded.id });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token: user not found.' });
    }

    req.user = user; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
