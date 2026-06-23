import { Router } from 'express'
import { MotoristaController } from './motorista.controller'
import { validarSchema } from '../../../shared/middleware/validacao_joi'
import { middlewareAutenticacao } from '../../../shared/middleware/autenticacao'
import { assyncHandler } from '../../../shared/middleware/assync_handler'
import { paramsIdSchema } from '../../../shared/validators/params.validators'
import {
  criarMotoristaSchema,
  atualizarMotoristaSchema,
  listarMotoristasSchema,
} from './validators/motorista.validators'

export function criarRotasMotorista(controlador: MotoristaController): Router {
  const router = Router()

  router.use(middlewareAutenticacao)

  router.post(
    '/motoristas',
    validarSchema(criarMotoristaSchema),
    assyncHandler((req, res) => controlador.criarMotor(req, res))
  )

  router.put(
    '/motoristas/:id',
    validarSchema(paramsIdSchema, 'params'),
    validarSchema(atualizarMotoristaSchema),
    assyncHandler((req, res) => controlador.atualizarMotor(req, res))
  )

  router.delete(
    '/motoristas/:id',
    validarSchema(paramsIdSchema, 'params'),
    assyncHandler((req, res) => controlador.excluirMotor(req, res))
  )

  router.get(
    '/motoristas/:id',
    validarSchema(paramsIdSchema, 'params'),
    assyncHandler((req, res) => controlador.obterMotor(req, res))
  )

  router.get(
    '/motoristas',
    validarSchema(listarMotoristasSchema, 'query'),
    assyncHandler((req, res) => controlador.listarMotores(req, res))
  )

  return router
}
