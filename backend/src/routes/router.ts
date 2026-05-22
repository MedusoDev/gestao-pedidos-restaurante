import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { MesaController } from '../controllers/MesaController'
import { EstabelecimentoController } from '../controllers/EstabelecimentoController'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { isAdmin } from '../middlewares/isAdmin'

const router = Router()
const userController = new UserController()
const mesaController = new MesaController()
const estabelecimentoController = new EstabelecimentoController()

router.post('/login', userController.login)

router.get('/estabelecimentos', isAuthenticated, isAdmin, estabelecimentoController.index)
router.post('/estabelecimentos', isAuthenticated, isAdmin, estabelecimentoController.create)
router.delete('/estabelecimentos/:id', isAuthenticated, isAdmin, estabelecimentoController.delete)

router.get('/me', isAuthenticated, userController.me)
router.post('/usuarios', isAuthenticated, isAdmin, userController.create)
router.get('/usuarios', isAuthenticated, isAdmin, userController.index)
router.delete('/usuarios/:id', isAuthenticated, isAdmin, userController.delete)
router.get('/mesas', isAuthenticated, isAdmin, mesaController.index)
router.post('/mesas', isAuthenticated, isAdmin, mesaController.create)

export default router