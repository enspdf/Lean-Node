import Technology from '../../entities/Technology'
import Vacancy from '../../entities/Vacancy'
import { NotFoundError } from '../common/errors/CustomError'

export default class VacancyService {
  static load = async (): Promise<Vacancy[] | null> => {
    return await Vacancy.find({ relations: ['technology'] })
  }

  static loadById = async (id: number): Promise<Vacancy | null> => {
    const vacancy = await Vacancy.findOne({ id }, { relations: ['technology'] })

    if (!vacancy) {
      throw new NotFoundError(`Vacancy with id ${id} could not be found`)
    }

    return vacancy
  }

  static create = async (technologyId: number, experience: number): Promise<Vacancy | null> => {
    const technology = await Technology.findOne({ id: technologyId })

    if (!technology) {
      throw new NotFoundError(`Technology with id ${technologyId} could not be found`)
    }

    const vacancy = new Vacancy({ technology, experience })
    await vacancy.save()

    return vacancy
  }

  static update = async (id: number, experience: number): Promise<Vacancy | null> => {
    let vacancy = await Vacancy.findOne({ id }, { relations: ['technology'] })

    if (!vacancy) {
      throw new NotFoundError(`Vacancy with id ${id} could not be found`)
    }

    vacancy = new Vacancy({ ...vacancy, experience })

    vacancy.save()

    return vacancy
  }

  static remove = async (id: number): Promise<Boolean> => {
    const vacancy = await Vacancy.findOne({ id })

    if (!vacancy) {
      throw new NotFoundError(`Vacancy with id ${id} could not be found`)
    }

    await Vacancy.delete(id)

    return true
  }
}
