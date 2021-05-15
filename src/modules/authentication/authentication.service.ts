import faker from 'faker'
import bcrypt from 'bcrypt'

import User, { allowedUserdRoles, UserRoles } from '../../entities/User'
import { createJwtToken } from '../../utils/jwtUtils'
import { BadRequestError, NotFoundError, UnauthorizedError } from '../common/errors/CustomError'
import { IAuthenticationResponse } from './interfaces/IAuthenticationResponse'
import { ILogin } from './interfaces/ILogin'
import { IRegister } from './interfaces/IRegister'
import { sendEmail } from '../../utils/sendEmail'

export default class AuthenticationService {
  /**
   * Method used to take the user registration information, check the roles and bases on that
   * create a new user, create a token and return it.
   *
   * @param userInformation
   * @returns
   */
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

  /**
   * Method used to take the user login and password information, tries to math the password
   * and if success cretes a new token and return it in the response.
   *
   * @param credentials
   * @returns
   */
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

  /**
   * Method used to update the password to the user if forgot the old one.
   *
   * @param email
   */
  static forgotPassword = async (email: string): Promise<void> => {
    const user = await User.findOne({ where: { email } })

    if (!user) {
      throw new NotFoundError('We could not found an user with provided credentials')
    }

    // After check and found the user generates a new password of 15 chars wihh faker.
    const newPassword = faker.internet.password(15, false)

    // Hash the password generated previously to save-it again hashed in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword

    await user.save()

    // Once the email has been successfully updated, the system sends an email to the user
    // with the new password used to login in the account
    await sendEmail({
      email: user.email,
      subject: 'New Password Request',
      content: `The new password for your account was changed to ${newPassword}`
    })
  }
}
