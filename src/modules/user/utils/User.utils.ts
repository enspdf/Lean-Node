import User, { UserRoles } from '../../../entities/User'

/**
 * User utility required to centralize the logic to query an user
 * based on the id and the admin permissions, because if the user is
 * admin is allowed to CRUD only recruiters
 *
 * @param id
 * @param isAdminRequest
 * @returns
 */
export const findUser = async (id: number, isAdminRequest: boolean): Promise<User | undefined> => {
  return isAdminRequest
    ? await User.findOne({ id, role: UserRoles.RECRUITER })
    : await User.findOne({ id })
}
