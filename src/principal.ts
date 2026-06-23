import { criarApp } from './app'

const app = criarApp()
const PORTA = process.env.PORTA ?? 3000

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`)
})
