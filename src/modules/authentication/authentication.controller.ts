import { Request, Response } from 'express'

import AuthenticationService from './authentication.service'
import { ILogin } from './interfaces/ILogin'
import { IRegister } from './interfaces/IRegister'

const register = async (request: Request, response: Response): Promise<Response> => {
  const { name, email, password, role } = request.body

  try {
    const userInformation: IRegister = { name, email, password, role }
    const user = await AuthenticationService.register(userInformation)

    return response.status(201).json(user)
  } catch (error) {
    return response.status(500).json(error)
  }
}

const login = async (request: Request, response: Response): Promise<Response> => {
  const { email, password } = request.body

  try {
    const credentials: ILogin = { email, password }
    const user = await AuthenticationService.login(credentials)

    return response.status(200).json(user)
  } catch (error) {
    return response.status(500).json(error)
  }
}

const forgotPassword = async (request: Request, response: Response): Promise<Response | void> => {
  const { email } = request.body

  try {
    await AuthenticationService.forgotPassword(email)

    return response.status(200).json({
      message: `An email has been sent to ${email} with password details`
    })
  } catch (error) {
    return response.status(500).json(error)
  }
}

export { register, login, forgotPassword }
