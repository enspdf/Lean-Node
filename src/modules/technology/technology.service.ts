import Technology from '../../entities/Technology'

import { NotFoundError } from '../common/errors/CustomError'
import { ICreateTechnology } from './interfaces/ICreateTechnology'
import { IUpdateTechnology } from './interfaces/IUpdateTechnology'

export default class TechnologyService {
  static load = async (): Promise<Technology[] | null> => {
    return await Technology.find()
  }

  static loadById = async (id: number): Promise<Technology | null> => {
    const technology = await Technology.findOne({ id })

    if (!technology) {
      throw new NotFoundError(`Technology with id ${id} could not be found`)
    }

    return technology
  }

  static create = async (createTechnology: ICreateTechnology): Promise<Technology | null> => {
    const { name, description } = createTechnology

    const technology: Technology = new Technology({ name, description })
    await technology.save()

    return technology
  }

  static update = async (updateTechnology: IUpdateTechnology): Promise<Technology | null> => {
    const { id, name, description } = updateTechnology
    let technology = await TechnologyService.loadById(id)

    technology = new Technology({ ...technology, name, description })
    technology.save()

    return technology
  }

  static remove = async (id: number): Promise<Boolean> => {
    await TechnologyService.loadById(id)
    await Technology.delete(id)

    return true
  }
}
