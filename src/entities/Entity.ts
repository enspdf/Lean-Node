import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { classToPlain, Exclude } from 'class-transformer'

/**
 * Base Entity with the default fields required in all entities
 */
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
