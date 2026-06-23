import { Router } from 'express'
import { UtilizacaoController } from './utilizacao.controller'
import { validarCamposObrigatorios } from '../../../shared/middleware/validacao'
import { middlewareAutenticacao } from '../../../shared/middleware/autenticacao'
import { assyncHandler } from '../../../shared/middleware/assync_handler'

export function criarRotasUtilizacao(controlador: UtilizacaoController): Router {
  const router = Router()

  router.use(middlewareAutenticacao)

  router.post(
    '/utilizacoes',
    validarCamposObrigatorios('automovelId', 'motoristaId', 'motivo'),
    assyncHandler((req, res) => controlador.iniciarUtil(req, res))
  )

  router.put('/utilizacoes/:id/finalizar', assyncHandler((req, res) => controlador.finalizarUtil(req, res)))

  router.get('/utilizacoes', assyncHandler((req, res) => controlador.listarUtils(req, res)))

  return router
}
