import { Response } from 'express';

export const handleSendRequest = (
  res: Response,
  message: string,
  httpStatus: number,
  data?: any,
) => {
  if (data !== undefined) {
    res.status(httpStatus).json({
      message,
      data,
    });
  } else {
    res.status(httpStatus).json({
      message,
    });
  }
};

export const HttpStatusCode = {
  OK: 200,
  INSERT_OK: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  AUTHENTICATION_ERROE: 501,
  IS_NOT_PROVIDED: 401,
  TOKEN_IS_EXPIRED: 405,
};
