import { FastifyInstance } from "fastify";
import { registerUser } from "../controllers/createUser";
import { loginUser } from "../controllers/authUser";

export async function authRoutes (app: FastifyInstance) {
  app.post('/register', registerUser);
  app.post('/login', loginUser)
};