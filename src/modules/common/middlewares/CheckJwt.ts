import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

/**
 * JWT Utility to validate if a requested route requires to contain a
 * valid/non expired JWT token provided in the headers per user.
 *
 * The returned jet contains a payload with userId, email and role
 *
 * @param request
 * @param response
 * @param next
 * @returns
 */
export const checkJwt = (request: Request, response: Response, next: NextFunction) => {
  const jwtSecret: string = process.env.JWT_SECRET!
  const token: string = <string>request.headers['x-token']
  let payload

  try {
    payload = <any>jwt.verify(token, jwtSecret)

    response.locals.jwtPayload = payload
  } catch (error) {
    response.status(401).json({ error: 'You are not allowed to access to this route' })

    return
  }

  const { userId, email, role } = payload
  const newToken = jwt.sign({ userId, email, role }, jwtSecret, { expiresIn: '1h' })

  response.setHeader('token', newToken)

  next()
}
