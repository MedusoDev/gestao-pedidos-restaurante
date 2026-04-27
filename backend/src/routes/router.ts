import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { isAdmin } from '../middlewares/isAdmin'

const router = Router()
const userController = new UserController()

router.post('/login', userController.login)

router.get('/me', isAuthenticated, userController.me)
router.post('/usuarios', isAuthenticated, isAdmin, userController.create)

export default router