import { getRepository } from 'typeorm'
import Staff, { RecruitingProcess, RecruitingStatus } from '../../entities/Staff'
import StaffTechnologies from '../../entities/StaffTechnologies'
import Technology from '../../entities/Technology'
import { sendEmail } from '../../utils/sendEmail'
import { NotFoundError } from '../common/errors/CustomError'
import { ICreateStaff } from './interfaces/ICreateStaff'
import { IUpdateStaff } from './interfaces/IUpdateStaff'
import { buildMailContent, StaffMailType } from './utils/mailUtils'

export default class StaffService {
  static load = async (): Promise<Staff[] | null> => {
    const staffs = await Staff.find({
      relations: ['staffTechnologies', 'staffTechnologies.technology']
    })

    return staffs
  }

  static loadById = async (id: number): Promise<Staff | null> => {
    const staff = await Staff.findOne(
      { id },
      { relations: ['staffTechnologies', 'staffTechnologies.technology'] }
    )

    if (!staff) {
      throw new NotFoundError(`Staff with id ${id} could not be found`)
    }

    return staff
  }

  static create = async (createStaff: ICreateStaff): Promise<Staff> => {
    const { name, email, socialSecurityNumber, technologies } = createStaff

    const staff: Staff = new Staff({ name, email, socialSecurityNumber })
    await staff.save()

    if (technologies) {
      technologies.forEach(async ({ technologyId, experience }) => {
        const technology: Technology | undefined = await Technology.findOne({
          id: technologyId
        })

        if (technology) {
          const staffTechnologies = new StaffTechnologies({
            staff,
            technology,
            months: experience
          })

          await staffTechnologies.save()
        }
      })
    }

    await sendEmail({
      subject: 'New Staff',
      content: buildMailContent(staff, StaffMailType.NEW_STAFF)
    })

    return staff
  }

  static update = async (updateStaff: IUpdateStaff): Promise<Staff | null> => {
    const { id, socialSecurityNumber, name, email } = updateStaff

    let staff = await Staff.findOne({ id })

    if (!staff) {
      throw new NotFoundError(`Staff with id ${id} could not be found`)
    }

    staff = new Staff({ ...staff, socialSecurityNumber, name, email })

    staff.save()

    return staff
  }

  static changeStatus = async (id: number, hiringStatus: number): Promise<Boolean> => {
    const staff = await Staff.findOne({ id })

    if (!staff) {
      throw new NotFoundError(`Staff with id ${id} could not be found`)
    }

    const staffRepository = getRepository(Staff)

    if (RecruitingStatus.HIRED === hiringStatus) {
      await staffRepository
        .createQueryBuilder()
        .update()
        .set({
          recruitingProcess: RecruitingProcess.COMPLETED,
          recruitingStatus: RecruitingStatus.HIRED,
          status: true,
          approvalDate: new Date()
        })
        .where('id = :id', { id })
        .execute()

      await sendEmail({
        email: staff.email,
        subject: 'Application Status',
        content: buildMailContent(staff, StaffMailType.HIRED)
      })
    } else if (RecruitingStatus.DECLINED === hiringStatus) {
      await staffRepository
        .createQueryBuilder()
        .update()
        .set({
          recruitingProcess: RecruitingProcess.COMPLETED,
          recruitingStatus: RecruitingStatus.DECLINED,
          status: false,
          declineDate: new Date()
        })
        .where('id = :id', { id })
        .execute()

      await sendEmail({
        email: staff.email,
        subject: 'Application Status',
        content: buildMailContent(staff, StaffMailType.DECLINED)
      })
    }

    return true
  }

  static remove = async (id: number): Promise<Boolean> => {
    const staff = await Staff.findOne({ id })

    if (!staff) {
      throw new NotFoundError(`Staff with id ${id} could not be found`)
    }

    await Staff.delete(id)

    return true
  }
}
