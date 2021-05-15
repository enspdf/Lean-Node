import { BeforeInsert, Column, Entity as TOEntity } from 'typeorm'
import bcrypt from 'bcrypt'
import Entity from './Entity'
import { Exclude } from 'class-transformer'

export enum UserRoles {
  SUPERUSER = 'SUPERUSER',
  ADMIN = 'ADMIN',
  RECRUITER = 'RECRUITER'
}

export const allowedUserdRoles = [UserRoles.RECRUITER.toString(), UserRoles.ADMIN.toString()]

@TOEntity('user')
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super()

    Object.assign(this, user)
  }

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Exclude()
  @Column()
  password: string

  @Exclude()
  @Column({ default: UserRoles.RECRUITER })
  role: string

  @Exclude()
  @Column({ default: false })
  isSuperUser: boolean

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10)
  }

  async comparePassword(inputPassword: string, userPassword: string): Promise<Boolean> {
    return await bcrypt.compare(inputPassword, userPassword)
  }
}
