import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'

import User from '../../../entities/User'

/**
 * Middleware utility that thakes an array of roles and based on user session
 * check if contains the provided options
 *
 * @param roles
 * @returns
 */
export const checkRole = (roles: Array<string>) => {
  return async (_request: Request, response: Response, next: NextFunction) => {
    const id = response.locals.jwtPayload.userId

    const userRepository = getRepository(User)
    let user: User | null = null

    try {
      user = await userRepository.findOneOrFail(id)
    } catch (error) {
      response.status(401).json({ error: 'You are not allowed to access to this route' })
    }

    if (user && roles.includes(user.role.toString())) {
      next()
    } else {
      response.status(401).json({ error: 'You are not allowed to access to this route' })
    }
  }
}
