import { Router } from 'express'
import { AsyncHandler } from '../common/middlewares/AsyncHandler'
import { checkJwt } from '../common/middlewares/CheckJwt'
import { checkRole } from '../common/middlewares/CheckRole'

import { load, loadById, create, update, changeStatus, remove } from './staff.controller'

const router = Router()

router.use(checkJwt)

router.get('/', checkRole(['SUPERUSER', 'ADMIN', 'RECRUITER']), AsyncHandler(load))
router.get('/:id([0-9]+)', checkRole(['SUPERUSER', 'ADMIN', 'RECRUITER']), AsyncHandler(loadById))
router.post('/', checkRole(['SUPERUSER', 'ADMIN', 'RECRUITER']), AsyncHandler(create))
router.patch('/:id([0-9]+)', checkRole(['SUPERUSER', 'ADMIN']), AsyncHandler(update))
router.patch('/:id([0-9])+/status', checkRole(['SUPERUSER', 'ADMIN']), AsyncHandler(changeStatus))
router.delete('/:id([0-9]+)', checkRole(['SUPERUSER', 'ADMIN']), AsyncHandler(remove))

export default router
