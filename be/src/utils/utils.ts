import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const handleSendRequest = (
  res: Response,
  message: string,
  httpStatus: number,
  data: any,
) => {
  res.status(httpStatus).json({
    message,
    data,
  });
};

export const decodedToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
