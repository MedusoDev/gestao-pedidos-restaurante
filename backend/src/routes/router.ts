import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { MesaController } from '../controllers/MesaController'
import { EstabelecimentoController } from '../controllers/EstabelecimentoController'
import { PublicController } from '../controllers/PublicController'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { isAdmin } from '../middlewares/isAdmin'
import { isPedidoOperator } from '../middlewares/isPedidoOperator'
import { CategoriaController } from '../controllers/CategoriaController';
import { ItemCardapioController } from '../controllers/ItemCardapioController';
import { PedidoController } from '../controllers/PedidoController';
import upload from '../middlewares/upload';

const categoriaController = new CategoriaController();
const itemController = new ItemCardapioController();
const pedidoController = new PedidoController();
const publicController = new PublicController();

const router = Router()
const userController = new UserController()
const mesaController = new MesaController()
const estabelecimentoController = new EstabelecimentoController()

// ============ ROTAS PÚBLICAS (sem autenticação) ============

// Cardápio público
router.get('/public/cardapio/:estabelecimentoId', (req, res) => publicController.obterCardapio(req, res));

// QR Code
router.get('/public/qrcode/:estabelecimentoId', (req, res) => publicController.obterQRCode(req, res));
router.get('/public/qrcode/:estabelecimentoId/download', (req, res) => publicController.downloadQRCode(req, res));

// ============ ROTAS AUTENTICADAS ============

router.post('/login', userController.login)

router.get('/estabelecimentos', isAuthenticated, isAdmin, estabelecimentoController.index)
router.post('/estabelecimentos', isAuthenticated, isAdmin, estabelecimentoController.create)
router.delete('/estabelecimentos/:id', isAuthenticated, isAdmin, estabelecimentoController.delete)

router.get('/me', isAuthenticated, userController.me)
router.post('/usuarios', isAuthenticated, isAdmin, userController.create)
router.get('/usuarios', isAuthenticated, isAdmin, userController.index)
router.delete('/usuarios/:id', isAuthenticated, isAdmin, userController.delete)
router.get('/mesas', isAuthenticated, mesaController.index)
router.post('/mesas', isAuthenticated, isAdmin, mesaController.create)
router.patch('/mesas/:id', isAuthenticated, mesaController.update)

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

// Pedidos
router.post('/pedidos', isAuthenticated, isPedidoOperator, (req, res) => pedidoController.criar(req, res));
router.get('/pedidos', isAuthenticated, isPedidoOperator, (req, res) => pedidoController.listar(req, res));
router.get('/pedidos/:id', isAuthenticated, isPedidoOperator, (req, res) => pedidoController.obterPorId(req, res));
router.patch('/pedidos/:id/status', isAuthenticated, isPedidoOperator, (req, res) => pedidoController.atualizarStatus(req, res));
router.patch('/pedidos/:id/delivery/status', isAuthenticated, isPedidoOperator, (req, res) => pedidoController.atualizarStatusEntrega(req, res));
router.patch('/pedidos/:id/cancelar', isAuthenticated, isPedidoOperator, (req, res) => pedidoController.cancelarPedido(req, res));
router.delete('/pedidos/:id', isAuthenticated, isAdmin, (req, res) => pedidoController.deletarPedido(req, res));

export default router