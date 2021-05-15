import { NextFunction, Request, Response } from 'express'

export const AsyncHandler =
  (fn: Function) => (request: Request, response: Response, next: NextFunction) => {
    Promise.resolve(fn(request, response, next)).catch(next)
  }
