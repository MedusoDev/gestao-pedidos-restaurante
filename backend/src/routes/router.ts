import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { MesaController } from '../controllers/MesaController'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { isAdmin } from '../middlewares/isAdmin'

const router = Router()
const userController = new UserController()
const mesaController = new MesaController()

router.post('/login', userController.login)

router.get('/me', isAuthenticated, userController.me)
router.post('/usuarios', isAuthenticated, isAdmin, userController.create)
router.get('/mesas', isAuthenticated, isAdmin, mesaController.index)
router.post('/mesas', isAuthenticated, isAdmin, mesaController.create)

export default router