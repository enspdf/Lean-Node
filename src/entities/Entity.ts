import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { classToPlain, Exclude } from 'class-transformer'

export default abstract class Entity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Exclude()
  @CreateDateColumn()
  createdAt: Date

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date

  toJSON() {
    return classToPlain(this)
  }
}
