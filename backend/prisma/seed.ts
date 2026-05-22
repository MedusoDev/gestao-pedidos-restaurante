import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'superadmin@email.com';
  const password = await hash('superadmin123', 8);

  const superAdmin = await prisma.usuario.upsert({
    where: { email },
    update: {},
    create: {
      nome: 'Super Admin',
      email,
      senhaHash: password,
      perfil: 'SUPER_ADMIN',
    },
  });

  console.log('Super admin created/verified:', superAdmin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });