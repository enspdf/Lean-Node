import { NextFunction, Request, Response } from 'express'

import { CustomError } from '../errors/CustomError'

/**
 *  Middleware used to handle/control/manage the custom errors thrown
 * in the services/controllers with a customized cases
 *
 * @param error
 * @param _request
 * @param response
 * @param _next
 * @returns
 */
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
