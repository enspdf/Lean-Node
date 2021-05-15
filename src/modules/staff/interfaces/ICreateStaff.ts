export interface ICreateStaff {
  name: string
  email: string
  socialSecurityNumber: number
  technologies?: ITechnologyExperience[]
}

export interface ITechnologyExperience {
  technologyId: number
  experience: number
}
