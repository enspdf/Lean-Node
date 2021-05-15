import Staff from '../../../entities/Staff'

export enum StaffMailType {
  NEW_STAFF = 0,
  HIRED = 1,
  DECLINED = 2
}

/**
 * Utiltiy used to handle the email notifications based on the staff status
 * and application status changes
 *
 * @param staff
 * @param type
 * @returns
 */
export const buildMailContent = (staff: Staff, type: StaffMailType) => {
  let content: string = ''

  switch (type) {
    case StaffMailType.NEW_STAFF:
      content = `
            We want to inform you that a new Staff has been started the recruiting process.

            Name: ${staff.name}
            E-Mail: ${staff.email}
            Social Security Number: ${staff.socialSecurityNumber}
        `
      break
    case StaffMailType.HIRED:
      content = `
        Dear ${staff.name}

        I would like to take the opportunity to thank you for your application.
        I want to inform you that you have been hired for the position.

        Welcome to our team.
      `
      break
    case StaffMailType.DECLINED:
      content = `
        Dear ${staff.name},

        I would like to take the opportunity to thank you for your application.
        I regret to inform you that at this moment the application couldn't be continued.

        Try again next time.
      `

      break
  }

  return content
}
