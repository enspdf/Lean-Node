import { Column, Entity as TOEntity, OneToMany } from 'typeorm'
import Entity from './Entity'
import StaffTechnologies from './StaffTechnologies'
import Vacancy from './Vacancy'

@TOEntity('technologies')
export default class Technology extends Entity {
  constructor(technology: Partial<Technology>) {
    super()

    Object.assign(this, technology)
  }

  @Column({ unique: true })
  name: string

  @Column()
  description: string

  @OneToMany(() => StaffTechnologies, (staffTechnology) => staffTechnology.technology)
  staffTechnologies: StaffTechnologies[]

  @OneToMany(() => Vacancy, (vacancy) => vacancy.technology)
  vacancy: Vacancy
}
