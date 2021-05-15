import { Router } from 'express'
import { AsyncHandler } from '../common/middlewares/AsyncHandler'
import { checkJwt } from '../common/middlewares/CheckJwt'
import { checkRole } from '../common/middlewares/CheckRole'

import { loadById, update, remove } from './user.controller'

const router = Router()

router.use([checkJwt, checkRole(['SUPERUSER', 'ADMIN'])])

router.get('/:id([0-9]+)', AsyncHandler(loadById))
router.patch('/:id([0-9]+)', AsyncHandler(update))
router.delete('/:id([0-9]+)', AsyncHandler(remove))

export default router
