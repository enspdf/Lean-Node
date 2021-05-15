import jwt from 'jsonwebtoken'

import User from '../entities/User'

/**
 * Utility function used to create a new JWT token valid per 1h
 * based on the user entity attributes
 *
 * @param user
 * @returns
 */
export const createJwtToken = (user: User) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: '1h'
    }
  )
}
