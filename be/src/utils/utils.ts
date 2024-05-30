import { Response } from 'express';

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
