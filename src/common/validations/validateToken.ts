import { initializeApp } from 'firebase-admin/app';
import { NextFunction, Request, Response } from 'express';



export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  next();
}
