import User, { UserRoles } from '../../../entities/User'

export const findUser = async (id: number, isAdminRequest: boolean): Promise<User | undefined> => {
  return isAdminRequest
    ? await User.findOne({ id, role: UserRoles.RECRUITER })
    : await User.findOne({ id })
}
