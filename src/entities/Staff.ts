import { Exclude } from 'class-transformer'
import { Column, Entity as TOEntity, OneToMany } from 'typeorm'
import Entity from './Entity'

import StaffTechnologies from './StaffTechnologies'

export enum RecruitingStatus {
  PENDING = 0,
  HIRED = 1,
  DECLINED = 2,
  HOLD = 3
}

export enum RecruitingProcess {
  COMPLETED = 0,
  ACTIVE = 1
}

@TOEntity('staff')
export default class Staff extends Entity {
  constructor(staff: Partial<Staff>) {
    super()

    Object.assign(this, staff)
  }

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  socialSecurityNumber: number

  @Column({ default: RecruitingStatus.PENDING })
  recruitingStatus: number

  @Column({ default: RecruitingProcess.ACTIVE })
  recruitingProcess: number

  @Column({ default: true, nullable: true })
  status: Boolean

  @Exclude()
  @Column({ default: null, nullable: true, type: Date })
  approvalDate: Date

  @Exclude()
  @Column({ default: null, nullable: true, type: Date })
  declineDate: Date

  @Exclude()
  @Column({ default: null, nullable: true, type: Date })
  holdDate: Date

  @OneToMany(() => StaffTechnologies, (staffTechnology) => staffTechnology.staff)
  staffTechnologies: StaffTechnologies[]
}
