import { Request, Response } from 'express'

import TechnologyService from './technology.service'

import { ICreateTechnology } from './interfaces/ICreateTechnology'
import { IUpdateTechnology } from './interfaces/IUpdateTechnology'

const load = async (_request: Request, response: Response): Promise<Response> => {
  try {
    const technologies = await TechnologyService.load()
    return response.status(200).json(technologies)
  } catch (error) {
    return response.status(500).json(error)
  }
}

const loadById = async (request: Request, response: Response): Promise<Response> => {
  const id: number = (request.params.id || 0) as number

  try {
    const technology = await TechnologyService.loadById(id)

    return response.status(200).json(technology)
  } catch (error) {
    return response.status(500).json(error)
  }
}

const create = async (request: Request, response: Response): Promise<Response> => {
  const { name, description } = request.body

  try {
    const createTechnology: ICreateTechnology = { name, description }
    const technology = await TechnologyService.create(createTechnology)

    return response.status(201).json(technology)
  } catch (error) {
    return response.status(500).json(error)
  }
}

const update = async (request: Request, response: Response): Promise<Response> => {
  const id: number = (request.params.id || 0) as number
  const { name, description } = request.body

  try {
    const updateTechnology: IUpdateTechnology = { id, name, description }
    const technology = await TechnologyService.update(updateTechnology)

    return response.status(200).json(technology)
  } catch (error) {
    return response.status(500).json(error)
  }
}

const remove = async (request: Request, response: Response): Promise<Response> => {
  const id: number = (request.params.id || 0) as number

  try {
    await TechnologyService.remove(id)

    return response.status(204).send()
  } catch (error) {
    return response.status(500).json(error)
  }
}

export { load, loadById, create, update, remove }
