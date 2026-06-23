import { Router } from 'express'
import { AuthController } from './auth.controller'
import { validarSchema } from '../../../shared/middleware/validacao_joi'
import { assyncHandler } from '../../../shared/middleware/assync_handler'
import { loginSchema } from './validators/auth.validators'

export function criarRotasAuth(controlador: AuthController): Router {
  const router = Router()

  router.post(
    '/auth',
    validarSchema(loginSchema),
    assyncHandler((req, res) => controlador.login(req, res))
  )

  return router
}
