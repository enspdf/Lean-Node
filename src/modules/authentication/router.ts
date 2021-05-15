import { Router } from 'express'

import { AsyncHandler } from '../common/middlewares/AsyncHandler'
import { checkJwt } from '../common/middlewares/CheckJwt'

import { register, login, forgotPassword } from './authentication.controller'

const router = Router()

router.post('/register', AsyncHandler(register))
router.post('/login', AsyncHandler(login))
router.post('/forgot-password', [checkJwt], AsyncHandler(forgotPassword))

export default router
