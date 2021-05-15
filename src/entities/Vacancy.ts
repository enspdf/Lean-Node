import { Column, Entity as TOEntity, ManyToOne } from 'typeorm'
import Entity from './Entity'
import Technology from './Technology'

@TOEntity('vacancy')
export default class Vacancy extends Entity {
  constructor(vacancy: Partial<Vacancy>) {
    super()

    Object.assign(this, vacancy)
  }

  @Column()
  experience: number

  @ManyToOne(() => Technology, (technology) => technology.vacancy)
  technology: Technology
}
