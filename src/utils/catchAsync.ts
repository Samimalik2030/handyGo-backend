
import { Request, Response, NextFunction } from 'express';


const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      fn(req,res,next).catch(next);
    };
  };
  
  export default catchAsync;

