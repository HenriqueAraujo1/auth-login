import fastify from "fastify";
import { authRoutes } from "./src/routes/authRoutes";
import fastifyJwt from "@fastify/jwt";
export const app = fastify()

app.register(fastifyJwt, {
  secret: '4234234234236547658464325498576239bvasdv w7 4 tt97v9y',
});

app.register(authRoutes)

// decodificando o token para rotas protegias
app.decorate("authenticate", async (request: any, reply: any) => { //
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send("erro ao autenticar o token", err);
  }
});