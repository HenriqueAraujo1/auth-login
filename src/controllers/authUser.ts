import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

// Esquema de validação para login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),  // tu parou na hora de testar a aplicação com token
});

// Controller para login
export async function loginUser(request: FastifyRequest, reply: FastifyReply) {
  const loginBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const { email, password } = loginBodySchema.parse(request.body);

  // Verificar se o usuário existe
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return reply.status(404).send({ message: "Usuário não encontrado" });
  }

  // Verificar a senha
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return reply.status(401).send({ message: "Credenciais inválidas" });
  }

  // Gerar o token JWT
  const token = request.server.jwt.sign(
    { id: user.id, email: user.email },
    { expiresIn: "1h" } // O token expira em 1 hora
  );

  return reply.status(200).send({ token });
}
