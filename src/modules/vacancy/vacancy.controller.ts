import { Request, Response } from 'express'

import VacancyService from './vacancy.service'

const load = async (request: Request, response: Response): Promise<Response> => {
  try {
    const vacancies = await VacancyService.load()
    return response.status(200).json(vacancies)
  } catch (error) {
    return response.status(500).json(error)
  }
}

const loadById = async (request: Request, response: Response): Promise<Response> => {
  const id: number = (request.params.id || 0) as number

  try {
    const vacancy = await VacancyService.loadById(id)

    return response.status(200).json(vacancy)
  } catch (error) {
    return response.status(500).json(error)
  }
}

const create = async (request: Request, response: Response): Promise<Response> => {
  const { technologyId, experience } = request.body

  try {
    const vacancy = await VacancyService.create(technologyId, experience)

    return response.status(201).json(vacancy)
  } catch (error) {
    return response.status(500).json(error)
  }
}

const update = async (request: Request, response: Response): Promise<Response> => {
  const id: number = (request.params.id || 0) as number
  const { experience } = request.body

  try {
    const vacancy = await VacancyService.update(id, experience)

    return response.status(200).json(vacancy)
  } catch (error) {
    return response.status(500).json(error)
  }
}

const remove = async (request: Request, response: Response): Promise<Response> => {
  const id: number = (request.params.id || 0) as number

  try {
    await VacancyService.remove(id)

    return response.status(204).send()
  } catch (error) {
    return response.status(500).json(error)
  }
}

export { load, loadById, create, update, remove }
