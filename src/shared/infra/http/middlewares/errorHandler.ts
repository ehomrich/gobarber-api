import { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';

interface IErrorResponse {
  status: string;
  message: string;
}

export default function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  _: NextFunction,
): Response<IErrorResponse> {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error.',
  });
}
