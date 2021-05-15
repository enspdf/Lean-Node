import User from '../../entities/User'
import { NotFoundError, UnauthorizedError } from '../common/errors/CustomError'
import { IUpdateUser } from './interfaces/IUpdateUser'
import { findUser } from './utils/User.utils'

export default class UserService {
  static loadById = async (id: number, isAdminRequest: boolean): Promise<User | undefined> => {
    const user = await findUser(id, isAdminRequest)

    if (!user) {
      throw new NotFoundError(`User with id ${id} could not be found`)
    }

    return user
  }

  static update = async (
    updateUser: IUpdateUser,
    isAdminRequest: boolean
  ): Promise<User | undefined> => {
    const { id, ...userData } = updateUser
    let user = await findUser(id, isAdminRequest)

    if (!user) {
      throw new NotFoundError(`User with id ${id} could not found`)
    }

    if (user.isSuperUser) {
      throw new UnauthorizedError(`You are not allowed to edit this user`)
    }

    user = new User({ ...user, ...userData })

    user.save()

    return user
  }

  static remove = async (id: number, isAdminRequest: boolean): Promise<Boolean> => {
    const user = await findUser(id, isAdminRequest)

    if (!user) {
      throw new NotFoundError(`User with id ${id} could not be found`)
    }

    await User.delete(id)

    return true
  }
}
