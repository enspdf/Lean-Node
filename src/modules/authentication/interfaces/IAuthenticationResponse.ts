import User from '../../../entities/User'

export interface IAuthenticationResponse {
  user: User | null
  token: string | null
}
