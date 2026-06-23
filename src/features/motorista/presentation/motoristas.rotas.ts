import { Router } from 'express'
import { MotoristaController } from './motorista.controller'
import { validarCamposObrigatorios } from '../../../shared/middleware/validacao'
import { middlewareAutenticacao } from '../../../shared/middleware/autenticacao'
import { assyncHandler } from '../../../shared/middleware/assync_handler'

export function criarRotasMotorista(controlador: MotoristaController): Router {
  const router = Router()

  router.use(middlewareAutenticacao)

  router.post(
    '/motoristas',
    validarCamposObrigatorios('nome'),
    assyncHandler((req, res) => controlador.criarMotor(req, res))
  )

  router.put('/motoristas/:id', assyncHandler((req, res) => controlador.atualizarMotor(req, res)))

  router.delete('/motoristas/:id', assyncHandler((req, res) => controlador.excluirMotor(req, res)))

  router.get('/motoristas/:id', assyncHandler((req, res) => controlador.obterMotor(req, res)))

  router.get('/motoristas', assyncHandler((req, res) => controlador.listarMotores(req, res)))

  return router
}
