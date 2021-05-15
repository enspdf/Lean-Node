import { Expose } from 'class-transformer'
import { Column, Entity as TOEntity, ManyToOne } from 'typeorm'
import Entity from './Entity'

import Staff from './Staff'
import Technology from './Technology'

@TOEntity('staffTechnologies')
export default class StaffTechnologies extends Entity {
  constructor(staffTechnology: Partial<StaffTechnologies>) {
    super()

    Object.assign(this, staffTechnology)
  }

  @Column()
  months: number

  @Expose()
  @ManyToOne(() => Technology, (technology) => technology.staffTechnologies, {
    primary: true
  })
  technology: Technology

  @Expose()
  @ManyToOne(() => Staff, (staff) => staff.staffTechnologies, {
    primary: true,
    onDelete: 'CASCADE'
  })
  staff: Staff
}
