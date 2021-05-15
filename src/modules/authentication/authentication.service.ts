import faker from 'faker'
import bcrypt from 'bcrypt'

import User, { allowedUserdRoles, UserRoles } from '../../entities/User'
import { createJwtToken } from '../../utils/jwtUtils'
import { BadRequestError, NotFoundError, UnauthorizedError } from '../common/errors/CustomError'
import { IAuthenticationResponse } from './interfaces/IAuthenticationResponse'
import { ILogin } from './interfaces/ILogin'
import { IRegister } from './interfaces/IRegister'

export default class AuthenticationService {
  static register = async (userInformation: IRegister): Promise<IAuthenticationResponse> => {
    const { role } = userInformation

    if (!role) {
      userInformation.role = UserRoles.RECRUITER
    }

    if (!allowedUserdRoles.includes(userInformation.role!)) {
      throw new BadRequestError(`The role ${role} is not a valid role`)
    }

    const user: User = new User({ ...userInformation })
    await user.save()

    const token = createJwtToken(user)

    return {
      user,
      token
    }
  }

  static login = async (credentials: ILogin): Promise<IAuthenticationResponse> => {
    const user = await User.findOne({ where: { email: credentials.email } })

    if (!user) {
      throw new UnauthorizedError('The provided credentials are invalid')
    }

    const passwordMatch = await user.comparePassword(credentials.password, user.password)

    if (!passwordMatch) {
      throw new UnauthorizedError('The provided credentials are invalid')
    }

    const token = createJwtToken(user)

    return {
      user,
      token
    }
  }

  static forgotPassword = async (email: string): Promise<void> => {
    const user = await User.findOne({ where: { email } })

    if (!user) {
      throw new NotFoundError('We could not found an user with provided credentials')
    }

    const newPassword = faker.internet.password(15, false)
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword

    await user.save()
  }
}
