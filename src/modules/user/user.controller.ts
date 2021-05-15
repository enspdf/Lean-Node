import { Request, Response } from 'express'
import { UserRoles } from '../../entities/User'

import { IUpdateUser } from './interfaces/IUpdateUser'
import UserService from './user.service'

const loadById = async (request: Request, response: Response): Promise<Response> => {
  const id: number = (request.params.id || 0) as number

  try {
    const user = await UserService.loadById(id, isAdminRequest(response))

    return response.status(200).json(user)
  } catch (error) {
    return response.status(500).json(error)
  }
}

const update = async (request: Request, response: Response): Promise<Response> => {
  const id: number = (request.params.id || 0) as number
  const { name, email } = request.body

  try {
    const updateUser: IUpdateUser = { id, name, email }
    const user = await UserService.update(updateUser, isAdminRequest(response))

    return response.status(200).json(user)
  } catch (error) {
    return response.status(500).json(error)
  }
}

const remove = async (request: Request, response: Response): Promise<Response> => {
  const id: number = (request.params.id || 0) as number

  try {
    await UserService.remove(id, isAdminRequest(response))

    return response.status(204).send()
  } catch (error) {
    return response.status(500).json(error)
  }
}

export { loadById, update, remove }

const isAdminRequest = (response: Response): boolean =>
  response.locals.jwtPayload.role === UserRoles.ADMIN
