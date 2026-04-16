import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const router = Router();
const userController = new UserController();

// --- ROTAS PÚBLICAS ---
router.post('/usuarios', userController.create); // Cadastro de usuários
router.post('/login', userController.login);      // Login (Gera o Token)

// --- ROTAS PROTEGIDAS (Exigem Token) ---
// O middleware 'isAuthenticated' injeta o ID do usuário no 'req.user_id'
router.get('/me', isAuthenticated, userController.me);

export default router;