import { Router } from 'express'

import technologyRouter from '../modules/technology/router'
import staffRouter from '../modules/staff/router'
import userRouter from '../modules/user/router'
import authenticationRouter from '../modules/authentication/router'
import vacancyRouter from '../modules/vacancy/router'

const routes = Router()

routes.use('/technology', technologyRouter)
routes.use('/staff', staffRouter)
routes.use('/user', userRouter)
routes.use('/authentication', authenticationRouter)
routes.use('/vacancy', vacancyRouter)

export default routes
