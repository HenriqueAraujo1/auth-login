import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

// Esquema de validação para registro de usuário
const registerUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    // Validação do corpo da requisição
    const { name, email, password } = registerUserSchema.parse(req.body);

    // Verificar se o e-mail já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.code(409).send({ error: 'E-mail já está em uso' });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 6);

    // Criar o usuário no banco de dados
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return reply.code(201).send({
      message: 'Usuário registrado com sucesso',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.code(400).send({ error: 'Dados inválidos', issues: error.errors });
    }

    console.error(error);
    return reply.code(500).send({ error: 'Erro interno do servidor' });
  }
};
