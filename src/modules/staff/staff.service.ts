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
  /**
   * Method used to return an array of staffs including the technologies associates with experience
   *
   * @returns
   */
  static load = async (): Promise<Staff[] | null> => {
    const staffs = await Staff.find({
      relations: ['staffTechnologies', 'staffTechnologies.technology']
    })

    return staffs
  }

  /**
   * Method used to return an specific staff including the technologies associates and experience
   *
   * @param id
   * @returns
   */
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

  /**
   *  Method used to get the createStaff properties from the controller an create a new user.
   *
   * @param createStaff
   * @returns
   */
  static create = async (createStaff: ICreateStaff): Promise<Staff> => {
    const { name, email, socialSecurityNumber, technologies } = createStaff

    // 1. Creates the staff user with the sent information
    const staff: Staff = new Staff({ name, email, socialSecurityNumber })
    await staff.save()

    // 2. if the staff has technologies associatedds in the aplpication we need to cread and associate each one.
    if (technologies) {
      technologies.forEach(async ({ technologyId, experience }) => {
        // 3. Before create the association between staff and technology we need to be sure that the technlogy
        // requested is available in the system, otherwise that technology must be skipped.
        const technology: Technology | undefined = await Technology.findOne({
          id: technologyId
        })

        if (technology) {
          // 4. Once the technology is found then proceed to create the relationship between staff and technologies.
          const staffTechnologies = new StaffTechnologies({
            staff,
            technology,
            months: experience
          })

          await staffTechnologies.save()
        }
      })
    }

    // 5. Sent an email to the administration notifying that a new staff apply
    await sendEmail({
      subject: 'New Staff',
      content: buildMailContent(staff, StaffMailType.NEW_STAFF)
    })

    return staff
  }

  /**
   * Method used to update an specific staff.
   * Only updates the staff information, not the technologies or experience asociated to each one
   *
   * @param updateStaff
   * @returns
   */
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

  /**
   *  Method used to change the hiring application status
   *
   * @param id
   * @param hiringStatus
   * @returns
   */
  static changeStatus = async (id: number, hiringStatus: number): Promise<Boolean> => {
    // 1. we need to be sure that the if of the staff to change exists in the system before proceed with the update process.
    const staff = await Staff.findOne({ id })

    if (!staff) {
      throw new NotFoundError(`Staff with id ${id} could not be found`)
    }

    const staffRepository = getRepository(Staff)

    // 2.1 If the recruiting sttus is HIRED then the staff flags updates to be identified as hired.
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

      // 2.1.1 Once the staff information is updated, the system sends an email with the application
      // status updates with a basic welcome email
      await sendEmail({
        email: staff.email,
        subject: 'Application Status',
        content: buildMailContent(staff, StaffMailType.HIRED)
      })
    }
    // 2.2 If the recruiting sttus is DECLINED then the staff flags updates to be identified as declined and the process could'n be continued.
    else if (RecruitingStatus.DECLINED === hiringStatus) {
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

      // 2.2.1 Once the staff information is updated, the system sends an email with the application
      // status with the try again information including that the process cann't continue
      await sendEmail({
        email: staff.email,
        subject: 'Application Status',
        content: buildMailContent(staff, StaffMailType.DECLINED)
      })
    }

    return true
  }

  /**
   * Method used to identify and then proceed with a user deletion
   *
   * @param id
   * @returns
   */
  static remove = async (id: number): Promise<Boolean> => {
    const staff = await Staff.findOne({ id })

    if (!staff) {
      throw new NotFoundError(`Staff with id ${id} could not be found`)
    }

    await Staff.delete(id)

    return true
  }
}
