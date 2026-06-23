import express from 'express'
import { comporRotas } from './composicao/composicao_rotas'
import { manipuladorErros } from './shared/middleware/manipulador_erros'

export function criarApp() {
  const app = express()
  app.use(express.json())
  app.use(comporRotas())
  app.use(manipuladorErros)
  return app
}
