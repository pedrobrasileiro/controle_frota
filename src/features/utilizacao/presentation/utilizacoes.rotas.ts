import { Router } from 'express'
import { UtilizacaoController } from './utilizacao.controller'
import { validarSchema } from '../../../shared/middleware/validacao_joi'
import { middlewareAutenticacao } from '../../../shared/middleware/autenticacao'
import { assyncHandler } from '../../../shared/middleware/assync_handler'
import { paramsIdSchema } from '../../../shared/validators/params.validators'
import {
  iniciarUtilizacaoSchema,
  finalizarUtilizacaoSchema,
  listarUtilizacoesSchema,
} from './validators/utilizacao.validators'

export function criarRotasUtilizacao(controlador: UtilizacaoController): Router {
  const router = Router()

  router.use(middlewareAutenticacao)

  router.post(
    '/utilizacoes',
    validarSchema(iniciarUtilizacaoSchema),
    assyncHandler((req, res) => controlador.iniciarUtil(req, res))
  )

  router.put(
    '/utilizacoes/:id/finalizar',
    validarSchema(paramsIdSchema, 'params'),
    validarSchema(finalizarUtilizacaoSchema),
    assyncHandler((req, res) => controlador.finalizarUtil(req, res))
  )

  router.get(
    '/utilizacoes',
    validarSchema(listarUtilizacoesSchema, 'query'),
    assyncHandler((req, res) => controlador.listarUtils(req, res))
  )

  return router
}
