import { NextFunction, Request, Response } from 'express'

import { CustomError } from '../errors/CustomError'

export const ErrorHandler = (
  error: any,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (error instanceof CustomError) {
    return response.status(error.statusCode()).json({ message: error.message })
  }

  return response.status(400).json({ message: 'Something went wrong' })
}
