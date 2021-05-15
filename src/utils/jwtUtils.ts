import jwt from 'jsonwebtoken'

import User from '../entities/User'

export const createJwtToken = (user: User) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: '1h'
    }
  )
}
