import { FastifyInstance } from "fastify";
import { registerUser } from "../controllers/authController";

export async function authRoutes (app: FastifyInstance) {
  app.post('/register', registerUser);
};