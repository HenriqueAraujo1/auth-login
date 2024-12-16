import { app } from './app'

app.listen({
  port: 4002,
}).then(() => {
  console.log('Servidor rodando na porta 4002')
})