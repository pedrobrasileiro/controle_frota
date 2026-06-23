import { Router } from 'express'
import { AuthController } from './auth.controller'
import { validarCamposObrigatorios } from '../../../shared/middleware/validacao'
import { assyncHandler } from '../../../shared/middleware/assync_handler'

export function criarRotasAuth(controlador: AuthController): Router {
  const router = Router()

  router.post(
    '/auth',
    validarCamposObrigatorios('usuario', 'senha'),
    assyncHandler((req, res) => controlador.login(req, res))
  )

  return router
}
