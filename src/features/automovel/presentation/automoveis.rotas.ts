import { Router } from 'express'
import { AutomovelController } from './automovel.controller'
import { validarSchema } from '../../../shared/middleware/validacao_joi'
import { middlewareAutenticacao } from '../../../shared/middleware/autenticacao'
import { assyncHandler } from '../../../shared/middleware/assync_handler'
import { paramsIdSchema } from '../../../shared/validators/params.validators'
import {
  criarAutomovelSchema,
  atualizarAutomovelSchema,
  listarAutomoveisSchema,
} from './validators/automovel.validators'

export function criarRotasAutomovel(controlador: AutomovelController): Router {
  const router = Router()

  router.use(middlewareAutenticacao)

  router.post(
    '/automoveis',
    validarSchema(criarAutomovelSchema),
    assyncHandler((req, res) => controlador.criarAuto(req, res))
  )

  router.put(
    '/automoveis/:id',
    validarSchema(paramsIdSchema, 'params'),
    validarSchema(atualizarAutomovelSchema),
    assyncHandler((req, res) => controlador.atualizarAuto(req, res))
  )

  router.delete(
    '/automoveis/:id',
    validarSchema(paramsIdSchema, 'params'),
    assyncHandler((req, res) => controlador.excluirAuto(req, res))
  )

  router.get(
    '/automoveis/:id',
    validarSchema(paramsIdSchema, 'params'),
    assyncHandler((req, res) => controlador.obterAuto(req, res))
  )

  router.get(
    '/automoveis',
    validarSchema(listarAutomoveisSchema, 'query'),
    assyncHandler((req, res) => controlador.listarAutos(req, res))
  )

  return router
}
