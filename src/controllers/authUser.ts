import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

// Esquema de validação para login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Controller para login
export const loginUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    // Validação do corpo da requisição
    const { email, password } = loginSchema.parse(req.body);

    // Verificar se o usuário existe no banco
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return reply.code(401).send({ error: 'E-mail ou senha incorretos' });
    }

    // Comparar a senha fornecida com a senha criptografada
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return reply.code(401).send({ error: 'E-mail ou senha incorretos' });
    }

    // Gerar o token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' } // Token válido por 1 hora
    );

    // Retornar o token ao cliente
    return reply.code(200).send({
      message: 'Login realizado com sucesso',
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.code(400).send({ error: 'Dados inválidos', issues: error.errors });
    }

    console.error(error);
    return reply.code(500).send({ error: 'Erro interno do servidor' });
  }
};
