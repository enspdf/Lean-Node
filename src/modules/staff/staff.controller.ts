import { Request, Response } from 'express'

import StaffService from './staff.service'

import { ICreateStaff } from './interfaces/ICreateStaff'
import { IUpdateStaff } from './interfaces/IUpdateStaff'

const load = async (_request: Request, response: Response): Promise<Response> => {
  const staffs = await StaffService.load()
  return response.status(200).json(staffs)
}

const loadById = async (request: Request, response: Response): Promise<Response> => {
  const id: number = (request.params.id || 0) as number

  const staff = await StaffService.loadById(id)

  return response.status(200).json(staff)
}

const create = async (request: Request, response: Response): Promise<Response> => {
  const createStaff = request.body as ICreateStaff

  const staff = await StaffService.create(createStaff)

  return response.status(201).json(staff)
}

const update = async (request: Request, response: Response): Promise<Response> => {
  const id: number = (request.params.id || 0) as number
  const { name, email, socialSecurityNumber } = request.body

  const updatedStaff: IUpdateStaff = { id, name, email, socialSecurityNumber }

  const staff = await StaffService.update(updatedStaff)

  return response.status(200).json(staff)
}

const changeStatus = async (request: Request, response: Response): Promise<Response> => {
  const id: number = (request.params.id || 0) as number
  const { status } = request.body

  await StaffService.changeStatus(id, status)

  return response.status(204).send()
}

const remove = async (request: Request, response: Response): Promise<Response> => {
  const id: number = (request.params.id || 0) as number

  await StaffService.remove(id)

  return response.status(204).send()
}

export { load, loadById, create, update, changeStatus, remove }
