import * as nodemailer from 'nodemailer'

interface EmailParameters {
  email?: string
  subject: string
  content: string
}

/**
 * Utility method used to get an email, subject and content required to send
 * an email to the specified address.
 */
export const sendEmail = async ({
  email = 'admin@recruiters.com',
  subject,
  content
}: EmailParameters) => {
  const testAccount = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  })

  const mailInfo = await transporter.sendMail({
    from: 'Recruiting Team <recruiting-team@foo.com>',
    to: email,
    subject,
    text: content
  })

  console.info(`Mail successfully sent: ${mailInfo.messageId}`)
  console.info(`Email preview URL: ${nodemailer.getTestMessageUrl(mailInfo)}`)
}
