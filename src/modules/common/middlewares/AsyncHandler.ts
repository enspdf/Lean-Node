import { NextFunction, Request, Response } from 'express'

/**
 *  Function used to handle the asynchronous errors thrown in async methods.
 *
 * @param fn
 * @returns
 */
export const AsyncHandler =
  (fn: Function) => (request: Request, response: Response, next: NextFunction) => {
    Promise.resolve(fn(request, response, next)).catch(next)
  }
