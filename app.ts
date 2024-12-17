import fastify from "fastify";
import { authRoutes } from "./src/routes/authRoutes";
export const app = fastify()

app.register(authRoutes);