import { PerfilUsuario } from '@prisma/client';


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        perfil: PerfilUsuario;
        estabelecimentoId?: string | null;
      };
    }
  }
}