import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { MesaController } from '../controllers/MesaController'
import { EstabelecimentoController } from '../controllers/EstabelecimentoController'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { isAdmin } from '../middlewares/isAdmin'
import { CategoriaController } from '../controllers/CategoriaController';
import { ItemCardapioController } from '../controllers/ItemCardapioController';
import upload from '../middlewares/upload';

const categoriaController = new CategoriaController();
const itemController = new ItemCardapioController();

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

// Categorias
router.post('/categorias', isAuthenticated, (req, res) => categoriaController.criar(req, res));
router.get('/categorias', isAuthenticated, (req, res) => categoriaController.listar(req, res));
router.put('/categorias/:id', isAuthenticated, (req, res) => categoriaController.editar(req, res));
router.delete('/categorias/:id', isAuthenticated, (req, res) => categoriaController.excluir(req, res));

// Itens do cardápio
router.post('/itens', isAuthenticated, upload.single('imagem'), (req, res) => itemController.criar(req, res));
router.get('/itens', isAuthenticated, (req, res) => itemController.listar(req, res));
router.put('/itens/:id', isAuthenticated, upload.single('imagem'), (req, res) => itemController.editar(req, res));
router.patch('/itens/:id/disponivel', isAuthenticated, (req, res) => itemController.toggleDisponivel(req, res));
router.delete('/itens/:id', isAuthenticated, (req, res) => itemController.excluir(req, res));

export default router